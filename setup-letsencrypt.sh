#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Let's Encrypt SSL Setup for MODAUI${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Configuration
DOMAIN="modaui.com"
SSL_DIR="./ssl"
EMAIL="admin@modaui.com"  # 改为你的邮箱

# Check if running with sufficient privileges
if [[ $EUID -ne 0 ]]; then
   echo -e "${YELLOW}⚠️  This script should be run as root for system-wide certbot${NC}"
   echo -e "${YELLOW}Attempting to continue anyway...${NC}\n"
fi

# 1. Install Certbot
echo -e "${BLUE}>>> Installing Certbot...${NC}"
if ! command -v certbot &> /dev/null; then
    apt-get update
    apt-get install -y certbot
    echo -e "${GREEN}✅ Certbot installed${NC}"
else
    echo -e "${GREEN}✅ Certbot already installed${NC}"
fi

# 2. Stop running containers to free port 80
echo -e "\n${BLUE}>>> Stopping Docker containers (to free port 80)...${NC}"
if command -v docker-compose &> /dev/null; then
    docker-compose down || true
    sleep 2
fi

# 3. Generate Let's Encrypt certificate
echo -e "\n${BLUE}>>> Generating Let's Encrypt certificate...${NC}"
echo -e "${YELLOW}Note: This requires port 80 to be accessible${NC}\n"

certbot certonly \
    --standalone \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --non-interactive \
    --agree-tos \
    -m $EMAIL \
    --renew-with-new-domains

# 4. Copy certificates to project
echo -e "\n${BLUE}>>> Copying certificates to project...${NC}"
mkdir -p $SSL_DIR

CERT_PATH="/etc/letsencrypt/live/$DOMAIN"

if [ ! -f "$CERT_PATH/fullchain.pem" ]; then
    echo -e "${RED}❌ Certificate generation failed!${NC}"
    echo -e "Please check:"
    echo -e "  1. Domain $DOMAIN is accessible"
    echo -e "  2. Port 80 is open"
    echo -e "  3. DNS points to this server"
    exit 1
fi

sudo cp $CERT_PATH/fullchain.pem $SSL_DIR/cert.pem
sudo cp $CERT_PATH/privkey.pem $SSL_DIR/key.pem
sudo chown -R $(whoami):$(whoami) $SSL_DIR
chmod 644 $SSL_DIR/cert.pem
chmod 600 $SSL_DIR/key.pem

echo -e "${GREEN}✅ Certificates copied to $SSL_DIR${NC}"

# 5. Verify certificates
echo -e "\n${BLUE}>>> Verifying certificates...${NC}"
openssl x509 -in $SSL_DIR/cert.pem -text -noout | grep -A 2 "Issuer:"
echo -e "${GREEN}✅ Certificate verified${NC}"

# 6. Setup auto-renewal
echo -e "\n${BLUE}>>> Setting up auto-renewal...${NC}"
certbot renew --dry-run

# Add cron job for auto-renewal
CRON_JOB="0 3 * * * /usr/bin/certbot renew --quiet && docker-compose -f /opt/modaui/docker-compose.yml restart nginx"
if ! crontab -l 2>/dev/null | grep -q "certbot renew"; then
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo -e "${GREEN}✅ Auto-renewal cron job added${NC}"
fi

# 7. Restart services
echo -e "\n${BLUE}>>> Starting Docker containers...${NC}"
if command -v docker-compose &> /dev/null; then
    docker-compose up -d
    sleep 5
    docker-compose ps
fi

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}   ✅ Let's Encrypt Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\n${BLUE}Your site should now be accessible at:${NC}"
echo -e "   🔒 https://$DOMAIN"
echo -e "   🔒 https://www.$DOMAIN"
echo -e "\n${BLUE}Certificate details:${NC}"
echo -e "   📝 Path: $SSL_DIR/"
echo -e "   🔄 Auto-renewal: Enabled (daily at 3 AM)"
echo -e "   ⏰ Valid for: 90 days (auto-renewed before expiry)"
