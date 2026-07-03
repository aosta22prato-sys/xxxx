# 🚀 MODAUI 域名部署快速指南

## 概览

已为你创建完整的生产部署配置。你现在可以将应用部署到 **https://modaui.com**。

## 已创建的文件

| 文件 | 用途 |
|------|------|
| `Dockerfile` | Docker 容器镜像构建配置 |
| `docker-compose.yml` | Docker Compose 容器编排 |
| `nginx.conf` | Nginx 反向代理和 HTTPS 配置 |
| `.env.production` | 生产环境变量模板 |
| `deploy.sh` | 自动化部署脚本 |
| `DEPLOYMENT.md` | 详细部署指南 |

## 快速部署（3 步）

### 1️⃣ 准备服务器

```bash
# SSH 进入你的服务器
ssh root@your-server-ip

# 创建部署目录
mkdir -p /opt/modaui
cd /opt/modaui

# 上传项目文件
scp -r /path/to/project/* root@your-server:/opt/modaui/
```

### 2️⃣ 运行自动部署脚本

```bash
# 赋予执行权限
chmod +x deploy.sh

# 运行部署脚本（需要 root 权限）
sudo ./deploy.sh
```

脚本会自动：
- ✅ 安装 Docker 和 Docker Compose
- ✅ 验证域名配置
- ✅ 生成安全密钥
- ✅ 设置 SSL 证书（Let's Encrypt 或自签名）
- ✅ 构建 Docker 镜像
- ✅ 启动容器
- ✅ 验证部署

### 3️⃣ 配置 API 密钥

```bash
# 编辑环境变量文件
nano /opt/modaui/.env

# 找到下列项并填充：
# GEMINI_API_KEY=YOUR_KEY_HERE  <- 填入你的 Gemini API Key

# 保存后重启服务
docker-compose restart
```

## ✨ 部署完成！

访问：**https://modaui.com**

## 常用命令

```bash
# 查看应用日志
docker-compose logs -f app

# 查看 Nginx 日志
docker-compose logs -f nginx

# 更新应用
git pull
docker-compose up -d --build

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 备份数据
tar -czf backup-$(date +%Y%m%d).tar.gz data/
```

## 故障排除

### 502 Bad Gateway
```bash
# 检查应用状态
docker-compose ps
docker-compose logs app

# 重启应用
docker-compose restart app
```

### SSL 证书错误
```bash
# 如果使用 Let's Encrypt，检查证书过期时间
openssl x509 -in ssl/cert.pem -text -noout | grep -A 2 "Validity"

# 手动更新证书
certbot renew --force-renewal
```

### 无法连接到域名
```bash
# 检查防火墙
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 检查 DNS
nslookup modaui.com
```

## 配置选项

### Let's Encrypt 自动续期

部署脚本完成后，编辑 crontab 添加自动续期：

```bash
# 编辑 crontab
crontab -e

# 添加以下行
0 2 1 * * certbot renew --quiet && \
  cp /etc/letsencrypt/live/modaui.com/fullchain.pem /opt/modaui/ssl/cert.pem && \
  cp /etc/letsencrypt/live/modaui.com/privkey.pem /opt/modaui/ssl/key.pem && \
  cd /opt/modaui && docker-compose restart nginx
```

### 自定义端口

编辑 `docker-compose.yml`：
```yaml
ports:
  - "8080:3000"  # 改为 8080
```

### 添加数据库持久化

数据已自动持久化到 `/opt/modaui/data/`，无需额外配置。

## 生产最佳实践

✅ 启用 HTTPS（自动完成）
✅ 配置防火墙（手动）
✅ 定期备份（手动运行备份命令）
✅ 监控日志（使用 `docker-compose logs`）
✅ 更新依赖（定期 `git pull` 和重建）

## 详细文档

完整的部署指南请参考：**[DEPLOYMENT.md](./DEPLOYMENT.md)**

## 支持

遇到问题？检查：
1. `.env` 是否正确配置
2. SSL 证书是否有效
3. 防火墙是否允许 80 和 443 端口
4. Docker 日志中的错误信息

---

**🎉 现在你已准备好将 MODAUI 部署到生产环境了！**

下一步：运行 `sudo ./deploy.sh` 开始部署。
