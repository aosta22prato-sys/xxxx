# Ollama 本地大语言模型集成指南

## 概述

AI Commerce OS 现已集成 Ollama 本地大语言模型支持，让您可以在本地运行强大的 AI 模型，无需依赖云端 API。

## 功能特性

- 🚀 本地运行，无需网络请求
- 💰 免费，无 API 调用费用
- 🔒 数据完全私有化
- ⚡ 低延迟响应
- 📦 支持多种开源模型

## 安装 Ollama

### macOS / Linux

```bash
# 安装 Ollama
curl -fsSL https://ollama.com/install.sh | sh
```

### Windows

从 [Ollama 官网](https://ollama.com) 下载并安装 Windows 版本。

## 下载模型

### 推荐模型

```bash
# DeepSeek R1 8B（推理能力强）
ollama pull deepseek-r1:8b

# Llama 2（通用型）
ollama pull llama2

# Mistral（轻量高效）
ollama pull mistral

# CodeLlama（代码专用）
ollama pull codellama
```

### 查看可用模型

访问 [Ollama 模型库](https://ollama.com/models) 查看完整列表。

## 配置环境变量

在项目根目录的 `.env` 文件中添加以下配置：

```env
# Ollama 服务地址（默认）
OLLAMA_BASE_URL=http://localhost:11434

# 默认使用的模型
OLLAMA_DEFAULT_MODEL=deepseek-r1:8b
```

## API 端点说明

### 1. 健康检查

```bash
GET /api/ollama/health
```

**响应示例：**
```json
{
  "success": true,
  "available": true,
  "serviceUrl": "http://localhost:11434"
}
```

### 2. 列出已安装模型

```bash
GET /api/ollama/models
```

**响应示例：**
```json
{
  "success": true,
  "models": [
    {
      "name": "deepseek-r1:8b",
      "modified_at": "2024-06-19T10:30:00Z",
      "size": 4713568512,
      "digest": "sha256:..."
    }
  ]
}
```

### 3. 拉取模型

```bash
POST /api/ollama/pull
Content-Type: application/json

{
  "model": "deepseek-r1:8b"
}
```

### 4. 文本生成

```bash
POST /api/ollama/generate
Content-Type: application/json

{
  "prompt": "写一段关于 AI 电商的介绍",
  "system": "你是一个专业的电商顾问",
  "model": "deepseek-r1:8b",
  "options": {
    "temperature": 0.7,
    "top_p": 0.9,
    "num_predict": 500
  }
}
```

### 5. 对话聊天

```bash
POST /api/ollama/chat
Content-Type: application/json

{
  "messages": [
    {
      "role": "system",
      "content": "你是一个专业的电商助手"
    },
    {
      "role": "user",
      "content": "如何提高店铺转化率？"
    }
  ],
  "model": "deepseek-r1:8b"
}
```

## 使用示例

### JavaScript / TypeScript

```javascript
// 健康检查
async function checkOllama() {
  const response = await fetch('/api/ollama/health');
  const data = await response.json();
  return data.available;
}

// 生成文本
async function generateText(prompt) {
  const response = await fetch('/api/ollama/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      system: '你是 AI Commerce OS 的智能助手',
      model: 'deepseek-r1:8b',
      options: { temperature: 0.7 }
    })
  });
  const data = await response.json();
  return data.response;
}

// 聊天对话
async function chatWithAI(messages) {
  const response = await fetch('/api/ollama/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      model: 'deepseek-r1:8b'
    })
  });
  const data = await response.json();
  return data.response;
}
```

### cURL

```bash
# 检查健康状态
curl http://localhost:3000/api/ollama/health

# 生成文本
curl -X POST http://localhost:3000/api/ollama/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Hello, how are you?",
    "model": "deepseek-r1:8b"
  }'
```

## 故障排除

### Ollama 服务未启动

```bash
# 检查 Ollama 状态
ollama list

# 如果没启动，启动服务
ollama serve
```

### 端口被占用

如果 11434 端口被占用，可以修改 `.env` 中的 `OLLAMA_BASE_URL` 或使用环境变量：

```bash
OLLAMA_HOST=0.0.0.0:11435 ollama serve
```

### 模型下载失败

```bash
# 重试下载
ollama pull deepseek-r1:8b

# 或者使用镜像
OLLAMA_HOST=https://your-mirror.com ollama pull deepseek-r1:8b
```

## 性能优化建议

1. **选择合适的模型大小**：根据硬件配置选择 7B/8B/13B/70B 模型
2. **启用 GPU 加速**：确保安装了 CUDA 或 Metal
3. **调整生成参数**：
   - 降低 `num_predict` 提高响应速度
   - 调整 `temperature` 控制创造性
4. **预加载常用模型**：使用 `ollama serve` 保持服务运行

## 安全注意事项

1. 不要在生产环境暴露 Ollama 端口到公网
2. 使用防火墙限制访问
3. 定期更新 Ollama 和模型
4. 敏感数据处理时确保本地运行

## 下一步

- 查看 [Ollama 官方文档](https://github.com/ollama/ollama)
- 探索更多可用模型
- 集成到您的业务流程中
