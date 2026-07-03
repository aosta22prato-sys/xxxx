# MODAUI 生产部署指南

## 域名部署到 modaui.com

### 前置条件

- Docker 和 Docker Compose 已安装
- 域名 modaui.com 已指向服务器 IP
- SSL 证书已准备（Let's Encrypt 或自签名）
- SSH 访问权限

### 部署步骤

#### 1. 准备服务器

```bash
# SSH 进入服务器
ssh root@your-server-ip

# 创建部署目录
mkdir -p /opt/modaui
cd /opt/modaui

# 克隆或上传项目
git clone <repository-url> .
# 或
# scp -r /path/to/project root@server:/opt/modaui/
```

#### 2. 配置环境变量

```bash
# 复制环境配置文件
cp .env.production .env

# 编辑环境变量
nano .env

# 必须设置的项：
# - GEMINI_API_KEY: 你的 Gemini API Key
# - SESSION_SECRET: 随机生成的会话密钥
# - JWT_SECRET: 随机生成的 JWT 密钥
```

生成安全的密钥：
```bash
# 生成 SESSION_SECRET
openssl rand -hex 32

# 生成 JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 3. 设置 SSL 证书

**选项 A: 使用 Let's Encrypt（推荐）**

```bash
# 安装 certbot
sudo apt-get install certbot python3-certbot-nginx

# 生成证书
sudo certbot certonly --standalone -d modaui.com -d www.modaui.com

# 证书位置
ls -la /etc/letsencrypt/live/modaui.com/

# 复制证书到项目
mkdir -p ./ssl
sudo cp /etc/letsencrypt/live/modaui.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/modaui.com/privkey.pem ./ssl/key.pem
sudo chown -R $USER:$USER ./ssl
```

**选项 B: 自签名证书（测试用）**

```bash
mkdir -p ./ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ./ssl/key.pem \
  -out ./ssl/cert.pem \
  -subj "/CN=modaui.com"
```

#### 4. 启动应用

```bash
# 检查 Docker 状态
sudo systemctl start docker
sudo systemctl enable docker

# 构建并启动容器
sudo docker-compose up -d

# 检查运行状态
sudo docker-compose ps
sudo docker-compose logs -f app

# 查看 Nginx 日志
sudo docker-compose logs -f nginx
```

#### 5. 验证部署

```bash
# 检查应用健康状态
curl -k https://modaui.com/health

# 访问应用
# https://modaui.com

# 检查 SSL 证书
openssl s_client -connect modaui.com:443 -servername modaui.com
```

#### 6. 配置自动续期（Let's Encrypt）

```bash
# 创建续期脚本
sudo nano /etc/cron.d/certbot-renewal

# 添加以下内容
0 2 1 * * root certbot renew --quiet && \
  cp /etc/letsencrypt/live/modaui.com/fullchain.pem /opt/modaui/ssl/cert.pem && \
  cp /etc/letsencrypt/live/modaui.com/privkey.pem /opt/modaui/ssl/key.pem && \
  chown $USER:$USER /opt/modaui/ssl/* && \
  cd /opt/modaui && docker-compose restart nginx

# 保存并退出（Ctrl+X, Y, Enter）
```

### 常见操作

#### 查看日志

```bash
# 应用日志
docker-compose logs -f app

# Nginx 日志
docker-compose logs -f nginx

# 查看最后 100 行
docker-compose logs --tail=100 app
```

#### 更新应用

```bash
# 拉取最新代码
git pull origin main

# 重新构建并重启
docker-compose down
docker-compose up -d --build

# 或使用零停机重启
docker-compose up -d --build
```

#### 备份数据

```bash
# 备份数据库
cp server_db.json server_db.json.backup.$(date +%Y%m%d_%H%M%S)

# 备份整个数据目录
tar -czf modaui-backup-$(date +%Y%m%d_%H%M%S).tar.gz data/ server_db.json

# 上传到远程
scp modaui-backup-*.tar.gz backup-server:/backups/
```

#### 恢复数据

```bash
# 停止服务
docker-compose down

# 恢复备份
tar -xzf modaui-backup-*.tar.gz

# 重启服务
docker-compose up -d
```

#### 性能监控

```bash
# 查看容器资源使用
docker stats

# 查看磁盘使用
docker system df

# 清理未使用的资源
docker system prune -a
```

### 故障排除

#### 502 Bad Gateway

```bash
# 检查后端应用是否运行
docker-compose ps app

# 查看应用日志
docker-compose logs app

# 重启应用
docker-compose restart app
```

#### SSL 证书错误

```bash
# 检查证书有效性
openssl x509 -in ssl/cert.pem -text -noout | grep -A 2 "Validity"

# 检查证书和密钥是否匹配
openssl x509 -noout -modulus -in ssl/cert.pem | openssl md5
openssl rsa -noout -modulus -in ssl/key.pem | openssl md5
```

#### 连接被拒绝

```bash
# 检查端口是否开放
sudo netstat -tlnp | grep 443
sudo netstat -tlnp | grep 80

# 检查防火墙
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### 生产最佳实践

1. **安全性**
   - 使用强密码和密钥
   - 定期更新依赖
   - 启用 HTTPS/TLS
   - 配置安全头部

2. **监控**
   - 设置日志收集
   - 监控应用性能
   - 告警机制

3. **备份**
   - 定期备份数据库
   - 备份配置文件
   - 异地备份

4. **更新策略**
   - 定期更新 Docker 镜像
   - 测试环境验证后再部署
   - 保持回滚能力

5. **扩展性**
   - 使用 Docker Swarm 或 Kubernetes
   - 负载均衡
   - 水平扩展

### 快速启动脚本

创建 `deploy.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 开始部署 MODAUI..."

# 更新代码
echo "📦 更新代码..."
git pull origin main

# 构建镜像
echo "🔨 构建 Docker 镜像..."
docker-compose build

# 启动服务
echo "⚙️  启动服务..."
docker-compose up -d

# 检查健康
echo "✅ 检查应用状态..."
sleep 5
curl -f https://modaui.com/health || exit 1

echo "✨ 部署成功！"
echo "📍 应用地址: https://modaui.com"
```

运行部署：
```bash
chmod +x deploy.sh
./deploy.sh
```

## 总结

- 已配置 Docker + Docker Compose
- 已配置 Nginx 反向代理和 HTTPS
- 已包含 SSL 证书管理
- 已包含日志管理和监控
- 已包含备份恢复脚本

现在你可以部署到生产环境 `https://modaui.com` 了！
