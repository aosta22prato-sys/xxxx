# PostgreSQL 部署指南

## 快速开始（JSON 模式 - 默认）

系统开箱即用使用 JSON 文件存储。无需额外配置：

```bash
PORT=8888 npm run dev
```

## 升级到 PostgreSQL

### 步骤 1: 安装 PostgreSQL

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Docker:**
```bash
docker run -d --name deepay-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=deepay_commerce \
  -p 5432:5432 \
  postgres:16-alpine
```

### 步骤 2: 创建数据库

```bash
# 连接到 PostgreSQL
psql -U postgres

# 创建数据库和用户
CREATE DATABASE deepay_commerce;
CREATE USER deepay_user WITH PASSWORD 'deepay_secure_password';
GRANT ALL PRIVILEGES ON DATABASE deepay_commerce TO deepay_user;
\c deepay_commerce
```

### 步骤 3: 运行迁移脚本

```bash
# 使用迁移脚本创建所有表
psql -U deepay_user -d deepay_commerce -h localhost < database/migrations/001_init_schema.sql

# 验证表已创建
psql -U deepay_user -d deepay_commerce -h localhost -c "\dt"
```

### 步骤 4: 配置环境变量

创建或编辑 `.env` 文件：

```env
# 数据库类型: 'postgres' 或 'json'
DATABASE_TYPE=postgres

# PostgreSQL 连接配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=deepay_commerce
DB_USER=deepay_user
DB_PASSWORD=deepay_secure_password

# 连接池配置
DB_POOL_MAX=20
DB_POOL_IDLE_TIMEOUT=30000

# 服务端口
PORT=8888
```

### 步骤 5: 启动服务

```bash
# 使用 PostgreSQL 后端启动
npm run build
DATABASE_TYPE=postgres npm run dev
```

## 架构

### JSON 模式（开发）

```
Request → Express Route → CoreCommerce Engine (In-Memory)
                              ↓
                        server_db.json (持久化)
```

**优点：** 无外部依赖、零配置、快速开发
**缺点：** 单进程、无并发控制、性能有限

### PostgreSQL 模式（生产）

```
Request → Express Route → CoreCommerce Engine (In-Memory)
                              ↓
                        PostgreSQL (持久化)
                              ↓
                        Connection Pool → Database
```

**优点：** 高并发、ACID、多进程、完整功能
**缺点：** 需要外部依赖、配置更复杂

## API 数据库切换测试

### 测试创建和读取（JSON 模式）

```bash
# 创建产品
curl -X POST http://localhost:8888/api/commerce/products \
  -H "Content-Type: application/json" \
  -H "x-store-id: store_001" \
  -H "x-tenant-id: tenant_001" \
  -d '{
    "sku":"TEST-001",
    "name":"测试产品",
    "price":99.99,
    "costPrice":50,
    "stock":100
  }'

# 读取产品（验证持久化）
curl http://localhost:8888/api/commerce/products \
  -H "x-store-id: store_001" \
  -H "x-tenant-id: tenant_001"
```

## 多租户隔离

所有表都通过 `tenant_id` 和 `store_id` 复合键确保完全隔离：

```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  -- ... other fields ...
  UNIQUE(tenant_id, store_id, sku)
);

CREATE INDEX idx_products_store ON products(store_id, tenant_id);
```

## 性能优化建议

### PostgreSQL 调优

```sql
-- 创建额外索引以加速查询
CREATE INDEX idx_products_created ON products(created_at DESC);
CREATE INDEX idx_products_price ON products(price);

-- 启用查询统计
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

### 连接池配置

```env
# 增加对高并发的支持
DB_POOL_MAX=50
DB_POOL_IDLE_TIMEOUT=10000
```

### 缓存层集成

如需缓存，可在 CoreCommerce 引擎中添加 Redis：

```typescript
// 伪代码示例
const cachedProducts = await redis.get(`products:${storeId}:${tenantId}`);
if (cachedProducts) return JSON.parse(cachedProducts);

const products = await getProducts(storeId, tenantId);
await redis.set(`products:${storeId}:${tenantId}`, JSON.stringify(products), 'EX', 3600);
return products;
```

## 故障排除

### 连接错误

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**解决：** 确保 PostgreSQL 服务正在运行
```bash
sudo service postgresql status
sudo service postgresql start
```

### 权限错误

```
error: permission denied for schema public
```

**解决：** 确保用户有适当的权限
```bash
psql -U postgres -d deepay_commerce -c "GRANT ALL ON SCHEMA public TO deepay_user;"
```

### 迁移失败

```
ERROR:  relation "products" already exists
```

**解决：** 这是预期的 - 迁移系统会跳过已存在的表

## 监控和调试

### 监控连接

```sql
-- 查看活跃连接
SELECT * FROM pg_stat_activity;

-- 查看连接统计
SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;
```

### 查询性能

```sql
-- 查看最慢的查询
SELECT query, calls, mean_exec_time FROM pg_stat_statements 
ORDER BY mean_exec_time DESC LIMIT 10;
```

### 启用调试日志

在 `.env` 中添加：

```env
DEBUG=database:*
NODE_ENV=development
```

## 数据迁移

从 JSON 到 PostgreSQL 的迁移脚本（待实现）：

```bash
npm run migrate:json-to-postgres
```

## 生产部署清单

- [ ] PostgreSQL 服务器已安装并运行
- [ ] 数据库已创建
- [ ] 迁移脚本已执行
- [ ] `.env` 已配置 `DATABASE_TYPE=postgres`
- [ ] 连接池大小已根据负载调优
- [ ] 备份策略已制定
- [ ] 监控和告警已配置
- [ ] 负载测试已完成

## Docker Compose 部署

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: deepay_user
      POSTGRES_PASSWORD: deepay_secure_password
      POSTGRES_DB: deepay_commerce
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/migrations:/docker-entrypoint-initdb.d

  deepay-api:
    build: .
    environment:
      DATABASE_TYPE: postgres
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: deepay_commerce
      DB_USER: deepay_user
      DB_PASSWORD: deepay_secure_password
      PORT: 8888
    ports:
      - "8888:8888"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

启动完整栈：

```bash
docker-compose up -d
```

## 切换回 JSON 模式

如需切换回 JSON 模式：

```bash
# 只需移除 DATABASE_TYPE 环境变量
unset DATABASE_TYPE
npm run dev  # 使用 JSON 模式
```
