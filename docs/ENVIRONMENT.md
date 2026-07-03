# MODAUI Environment & Deployment Configuration

此文档描述 MODAUI 企业级部署所需的环境变量、机密管理与最佳实践。

## 概览
- 在生产环境中，请勿将 `*.env` 文件提交到版本控制。使用密钥管理服务（如 AWS Secrets Manager、Azure Key Vault、HashiCorp Vault）或 CI/CD 平台的 secret 功能。
- 使用 `.env.example` 在代码仓库中记录所需的变量与说明，便于开发者快速上手。

## 关键变量（示例）
- `NODE_ENV` - `production|development`。
- `PORT` - API 监听端口。
- `API_BASE_URL` - 对外 API 基础地址（注意前端回调使用）。
- `APP_URL` / `ADMIN_URL` - 站点与后台管理域名。

## 安全类（生产必须配置）
- `SESSION_SECRET` - 用于签发 session cookie 的密钥。
- `JWT_SECRET` - JWT 签名密钥。

## 数据库
- `DB_CLIENT` - `sqlite|pg|mysql`。
- `DATABASE_URL` - 推荐用于云数据库的连接串。
- `SQLITE_DB_PATH` - 本地 sqlite 存储路径（开发与小型部署）。

## 付款（按需）
- `STRIPE_SECRET_KEY`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`

## AI / LLM 提供商
- `GEMINI_API_KEY` - Google Gemini API Key。
- `OPENAI_API_KEY` - OpenAI Key（如果使用）。
- `OLLAMA_BASE_URL` - 本地 Ollama 服务地址（如有）。

## OAuth / 社交登陆
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- `WECHAT_APP_ID`, `WECHAT_APP_SECRET`

## 前端开发相关
- 以 `VITE_` 前缀暴露给前端的变量只应包含非敏感信息，例如 `VITE_DEV_API`（开发时的后端 URL）。

## 部署建议
1. 在 CI/CD 中使用环境变量注入，而不要在仓库中保存 `.env`。2. 在生产部署前运行 `pnpm run build`，并确保 `NODE_ENV=production` 时关键密钥已就绪。3. 使用 TLS/HTTPS 并限制管理面板访问。

## 故障排查
- 如果服务在生产中退出，请检查启动日志是否提示缺少 `SESSION_SECRET` 或 `JWT_SECRET`。这些为必需项。

