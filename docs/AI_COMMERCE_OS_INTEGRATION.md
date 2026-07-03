# AI Commerce OS - 完整整合指南

## ✅ 整合完成！

新旧架构已完整整合，你现在有：
1. 旧有 Sidekick API (保持兼容）
2. 全新 AI Commerce OS API（终极架构）
3. 两者并存，互不影响

---

## 📡 API 端点

### 1️⃣ 获取系统状态
```http
GET /api/ai-commerce-os/status
```
返回完整的系统状态和架构信息

### 2️⃣ AI Commerce OS 对话
```http
POST /api/ai-commerce-os/chat
Content-Type: application/json

{
  "message": "你的问题或指令"
}
```

### 3️⃣ 设置自主商业目标
```http
POST /api/ai-commerce-os/chat
Content-Type: application/json

{
  "goal": {
    "revenue": 3000000,
    "profitMargin": 0.25,
    "marketShare": { "region": "Europe", "percent": 40 }
  }
}
```

### 4️⃣ 因果推理测试
```http
POST /api/ai-commerce-os/chat
Content-Type: application/json

{
  "message": "Ad ROI has decreased"
}
```
自动触发世界模型因果推理

---

## 🛠️ 架构概览

### 新架构位置
```
src/ai-commerce-os/
├── kernel/
├── world-model/
├── digital-twin/
├── agent-runtime/
└── ...其他10+层
```

### 旧架构位置
```
src/services/AIBrainService.ts
src/services/brain/
```

---

## 📊 现有 Sidekick API (保持兼容)
```http
POST /api/sidekick
```
- 保持原有的 Sidekick 功能完整可用

---

## 💡 使用示例

### 前端代码调用

```typescript
// 方法 1: 检查新系统状态
fetch('/api/ai-commerce-os/status')
  .then(r => r.json())
  .then(console.log);

// 方法 2: 设置商业目标
fetch('/api/ai-commerce-os/chat', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    goal: {
      revenue: 3000000,
      profitMargin: 0.25
    }
  })
})
  .then(r => r.json())
  .then(console.log);

// 方法3: 继续使用旧 Sidekick
fetch('/api/sidekick', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    message: 'How are our sales doing?'
  })
})
  .then(r => r.json())
  .then(console.log);
```

---

## 🎯 下一步路线图

现在可以做的：
1. 逐步把旧功能迁移到新架构
2. 扩展新架构的功能
3. 逐步弃用旧架构

---

## ✅ 现状

| 功能 | 旧架构 | 新架构 |
|------|--------|--------|
| Sidekick 对话 | ✅ | ⚠️(兼容) |
| World Model | ❌ | ✅ |
| Multi-Agent | ❌ | ✅ |
| 14层架构 | ❌ | ✅ |
