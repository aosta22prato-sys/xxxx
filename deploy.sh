#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="modaui.com"
PROJECT_DIR="/opt/modaui"
SSL_DIR="$PROJECT_DIR/ssl"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   MODAUI Production Deployment${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ This script must be run as root (use sudo)${NC}"
   exit 1
fi

# Function to print section headers
print_section() {
    echo -e "\n${BLUE}>>> $1${NC}"
}

# 1. Check Docker installation
print_section "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Docker Compose...${NC}"
    curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

echo -e "${GREEN}✅ Docker and Docker Compose ready${NC}"

# 2. Check domain
print_section "Verifying domain configuration..."
if ! ping -c 1 $DOMAIN &> /dev/null; then
    echo -e "${YELLOW}⚠️  Warning: Cannot reach $DOMAIN from this server${NC}"
    echo -e "${YELLOW}   Please ensure DNS records point to this server's IP${NC}"
else
    echo -e "${GREEN}✅ Domain $DOMAIN is reachable${NC}"
fi

# 3. Generate secure keys
print_section "Generating security credentials..."
SESSION_SECRET=$(openssl rand -hex 32)
JWT_SECRET=$(openssl rand -hex 32)

echo -e "${GREEN}✅ Generated SESSION_SECRET and JWT_SECRET${NC}"

# 4. Setup SSL certificates
print_section "Setting up SSL certificates..."

if [ ! -d "$SSL_DIR" ]; then
    mkdir -p "$SSL_DIR"
fi

if [ ! -f "$SSL_DIR/cert.pem" ] || [ ! -f "$SSL_DIR/key.pem" ]; then
    echo -e "${YELLOW}⚠️  SSL certificates not found${NC}"
    echo -e "Choose SSL setup method:"
    echo "  1) Let's Encrypt (recommended for production)"
    echo "  2) Self-signed certificate (for testing)"
    read -p "Enter choice (1 or 2): " SSL_CHOICE
    
    if [ "$SSL_CHOICE" = "1" ]; then
        print_section "Setting up Let's Encrypt..."
        apt-get update
        apt-get install -y certbot
        
        read -p "Enter your email for Let's Encrypt: " CERTBOT_EMAIL
        
        certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m $CERTBOT_EMAIL
        
        cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem "$SSL_DIR/cert.pem"
        cp /etc/letsencrypt/live/$DOMAIN/privkey.pem "$SSL_DIR/key.pem"
        
        echo -e "${GREEN}✅ Let's Encrypt certificate installed${NC}"
    else
        print_section "Generating self-signed certificate..."
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout "$SSL_DIR/key.pem" \
            -out "$SSL_DIR/cert.pem" \
            -subj "/CN=$DOMAIN"
        echo -e "${GREEN}✅ Self-signed certificate generated${NC}"
    fi
else
    echo -e "${GREEN}✅ SSL certificates found${NC}"
fi

# 5. Create .env file
print_section "Configuring environment variables..."
cat > $PROJECT_DIR/.env <<EOF
NODE_ENV=production
PORT=3000
APP_URL=https://$DOMAIN
GEMINI_API_KEY=${GEMINI_API_KEY:-YOUR_GEMINI_API_KEY}
SESSION_SECRET=$SESSION_SECRET
JWT_SECRET=$JWT_SECRET
DB_CLIENT=sqlite
SQLITE_DB_PATH=/app/data/modaui.db
EOF

echo -e "${GREEN}✅ Environment configuration created${NC}"
echo -e "${YELLOW}⚠️  IMPORTANT: Edit .env file and set GEMINI_API_KEY${NC}"

# 6. Create data directories
print_section "Creating data directories..."
mkdir -p $PROJECT_DIR/data
chmod 755 $PROJECT_DIR/data

echo -e "${GREEN}✅ Data directories ready${NC}"

# 7. Enable Docker service
print_section "Enabling Docker service..."
systemctl enable docker
systemctl start docker

echo -e "${GREEN}✅ Docker service enabled${NC}"

# 8. Build and start containers
print_section "Building and starting containers..."

cd $PROJECT_DIR

echo -e "${YELLOW}Building Docker images...${NC}"
docker-compose build

echo -e "${YELLOW}Starting services...${NC}"
docker-compose up -d

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 10

# 9. Verify deployment
print_section "Verifying deployment..."

if docker-compose ps | grep -q "modaui-app.*Up"; then
    echo -e "${GREEN}✅ Application container is running${NC}"
else
    echo -e "${RED}❌ Application container failed to start${NC}"
    docker-compose logs app
    exit 1
fi

if docker-compose ps | grep -q "modaui-nginx.*Up"; then
    echo -e "${GREEN}✅ Nginx container is running${NC}"
else
    echo -e "${RED}❌ Nginx container failed to start${NC}"
    docker-compose logs nginx
    exit 1
fi

# 10. Test health endpoint
print_section "Testing application health..."
if curl -f -k https://localhost/health &> /dev/null; then
    echo -e "${GREEN}✅ Application is healthy${NC}"
else
    echo -e "${YELLOW}⚠️  Health check failed, this is normal if certificate is invalid${NC}"
fi

# 11. Final instructions
print_section "Deployment Summary"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   ✨ Deployment Complete! ✨${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "\n${BLUE}📍 Access your application:${NC}"
echo -e "   https://$DOMAIN"

echo -e "\n${BLUE}📋 Useful commands:${NC}"
echo -e "   View logs:         docker-compose logs -f app"
echo -e "   View Nginx logs:   docker-compose logs -f nginx"
echo -e "   Restart services:  docker-compose restart"
echo -e "   Stop services:     docker-compose down"
echo -e "   Update app:        git pull && docker-compose up -d --build"

echo -e "\n${BLUE}🔑 Important files:${NC}"
echo -e "   Environment:       $PROJECT_DIR/.env"
echo -e "   SSL Certs:         $SSL_DIR/"
echo -e "   Docker Compose:    $PROJECT_DIR/docker-compose.yml"
echo -e "   Nginx Config:      $PROJECT_DIR/nginx.conf"

echo -e "\n${YELLOW}⚠️  NEXT STEPS:${NC}"
echo -e "   1. Edit $PROJECT_DIR/.env and set GEMINI_API_KEY"
echo -e "   2. Restart containers: docker-compose restart"
echo -e "   3. Check logs: docker-compose logs -f app"
echo -e "   4. Configure firewall if needed"
echo -e "   5. Setup automated certificate renewal (see DEPLOYMENT.md)"

echo -e "\n${BLUE}📚 For more details, see DEPLOYMENT.md${NC}\n"

exit 0
