# Execution Kernel - Production Deployment Guide

## 🚀 快速开始

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Docker & Docker Compose (可选)
- npm 9+

## 📦 部署方式

### 方式 1: Docker Compose (推荐)

**最简单快速的部署方式**

```bash
# 1. 克隆项目
git clone <repo-url>
cd backend/execution-kernel

# 2. 创建环境配置
cp .env.example .env

# 3. 配置数据库密码
nano .env  # 修改 DB_PASSWORD 和其他敏感信息

# 4. 启动服务
docker-compose up -d

# 5. 验证服务
curl http://localhost:3000/api/kernel/stats

# 6. 查看日志
docker-compose logs -f kernel-api
```

**停止服务**
```bash
docker-compose down
```

### 方式 2: 手动部署

**用于定制化部署**

#### 步骤 1: 安装依赖
```bash
npm install
```

#### 步骤 2: 编译 TypeScript
```bash
npm run build
```

#### 步骤 3: 配置环境
```bash
cp .env.example .env
# 编辑 .env 文件配置数据库等信息
```

#### 步骤 4: 初始化数据库
```bash
# 确保 PostgreSQL 运行并且数据库存在
createdb -U kernel kernel_db
```

#### 步骤 5: 启动应用
```bash
npm start
```

#### 步骤 6: 验证
```bash
curl http://localhost:3000/api/kernel/stats
```

### 方式 3: Kubernetes (企业级)

**创建 kubernetes deployment**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: execution-kernel
spec:
  replicas: 3
  selector:
    matchLabels:
      app: execution-kernel
  template:
    metadata:
      labels:
        app: execution-kernel
    spec:
      containers:
      - name: kernel
        image: your-registry/execution-kernel:latest
        ports:
        - containerPort: 3000
        env:
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: kernel-config
              key: db-host
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: kernel-secrets
              key: db-password
        healthCheck:
          httpGet:
            path: /api/kernel/stats
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
```

## 🔒 安全配置

### 1. 数据库安全
```bash
# 修改默认密码 (在 .env 中)
DB_PASSWORD=strong_password_here_min_16_chars

# 使用 SSL 连接
DB_SSL=true
```

### 2. API 安全
```bash
# 启用审计日志
AUDIT_ENABLED=true

# 启用请求加密（可选）
ENCRYPTION_ENABLED=true

# 限制请求超时
API_REQUEST_TIMEOUT=60000
```

### 3. 防火墙配置
```bash
# 只允许必要的端口
# Port 3000: API server
# Port 5432: PostgreSQL (仅内部)
# 其他端口应该关闭
```

### 4. 日志安全
```bash
# 启用日志加密
LOG_FILE=true
LOG_ENCRYPTION=true

# 定期清理旧日志
CLEANUP_ENABLED=true
CLEANUP_INTERVAL=3600000  # 每小时
```

## 📊 性能调优

### 1. 数据库优化
```sql
-- 创建索引
CREATE INDEX idx_kernel_tx_tenant_store ON kernel_transactions(tenant_id, store_id);
CREATE INDEX idx_kernel_events_type ON kernel_events(type);

-- 分析查询
ANALYZE kernel_transactions;
```

### 2. 连接池优化
```env
# .env
DB_MAX_POOL=30        # 增加连接数
DB_IDLE_TIMEOUT=30000 # 连接空闲超时
```

### 3. 事件历史优化
```env
# .env
EVENT_BUS_MAX_HISTORY=5000  # 减少内存占用
AUDIT_MAX_LOGS=50000         # 定期清理审计日志
```

### 4. 启用缓存
```env
# .env
REDIS_ENABLED=true
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600000
```

## 🔍 监控和日志

### 日志查看
```bash
# 实时日志
docker-compose logs -f kernel-api

# 特定日志级别
LOG_LEVEL=DEBUG npm start

# 文件日志
tail -f logs/kernel.log
```

### 性能监控
```bash
# 获取统计信息
curl http://localhost:3000/api/kernel/stats

# 获取审计日志
curl http://localhost:3000/api/kernel/audit?limit=100

# 订阅事件（SSE）
curl http://localhost:3000/api/kernel/subscribe?eventType=*
```

### 健康检查
```bash
# 检查服务状态
curl http://localhost:3000/api/kernel/stats

# 检查数据库连接
curl http://localhost:3000/api/kernel/health
```

## 🚨 故障排查

### 数据库连接失败
```bash
# 检查 PostgreSQL 状态
docker ps | grep postgres

# 检查连接
psql -h localhost -U kernel -d kernel_db

# 查看日志
docker-compose logs postgres
```

### API 启动失败
```bash
# 检查端口占用
lsof -i :3000

# 查看详细日志
LOG_LEVEL=DEBUG docker-compose up kernel-api

# 检查配置
cat .env | grep -v "^#"
```

### 高内存占用
```bash
# 查看内存使用
docker stats kernel-api

# 调整参数
EVENT_BUS_MAX_HISTORY=2000  # 减少事件历史
AUDIT_MAX_LOGS=20000        # 减少审计日志

# 启用自动清理
CLEANUP_ENABLED=true
CLEANUP_INTERVAL=1800000    # 每 30 分钟清理一次
```

## 📈 扩展部署

### 水平扩展
```yaml
# docker-compose.yml
version: '3.8'
services:
  kernel-api-1:
    # ... config ...
  kernel-api-2:
    # ... config ...
  kernel-api-3:
    # ... config ...
  
  # 添加负载均衡
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

### 数据库副本
```bash
# 主从配置
REPLICA_MODE=primary  # 主实例
REPLICA_MODE=standby  # 备用实例
REPLICA_DSN=...
```

## 🔄 升级和维护

### 备份
```bash
# 备份数据库
docker-compose exec postgres pg_dump kernel_db > backup.sql

# 备份日志
tar -czf logs_backup.tar.gz logs/
```

### 恢复
```bash
# 恢复数据库
docker-compose exec -T postgres psql kernel_db < backup.sql

# 验证恢复
curl http://localhost:3000/api/kernel/stats
```

### 更新应用
```bash
# 拉取最新版本
git pull origin main

# 重新构建
docker-compose build

# 重启服务
docker-compose restart kernel-api
```

## 📋 检查清单

部署前验证：
- [ ] PostgreSQL 已安装并运行
- [ ] 数据库用户和密码已配置
- [ ] Node.js 版本 >= 18
- [ ] 所有环境变量已配置
- [ ] 防火墙规则已配置
- [ ] SSL 证书已配置（如需要）
- [ ] 备份策略已制定
- [ ] 监控告警已配置
- [ ] 日志路径有写权限
- [ ] 系统资源充足

## 🆘 获取帮助

**常见问题**
- 查看 README.md
- 查看 QUICKSTART.md
- 查看源代码中的注释

**错误排查**
1. 查看日志 `LOG_LEVEL=DEBUG`
2. 检查环境配置 `.env`
3. 验证数据库连接
4. 检查系统资源

## 📚 相关文档

- README.md - 系统说明
- QUICKSTART.md - 快速参考
- ARCHITECTURE.md - 架构设计
- 源代码中的注释 - 详细实现

---

**🎉 祝部署顺利！**
