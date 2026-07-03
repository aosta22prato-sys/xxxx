# APIs Registry (统一网关接口服务登记表)

## 1. 脑中枢上下文关联接口 (Brain Context Group)
### GET /api/health
- **用途**: 检查系统及后端服务存活状态。
- **状态**: `[LIVE]`

### POST /api/brain/page-focus
- **用途**: 提交商家当前停留聚焦的菜单和页面，供 AI Sidekick 被动知悉定位。
- **状态**: `[LIVE]`

### GET /api/brain/context
- **用途**: 获取全局/局部多租户和店铺的元状态上下文快照。
- **状态**: `[LIVE]`

## 2. 底层数据库持久化接口 (Database Engine Sync)
### GET /api/db/get-all
- **用途**: 导出或读取全部本地 JSON 持久化数据库。
- **状态**: `[LIVE]`

### POST /api/db/save-all
- **用途**: 全量覆写覆写本地 JSON 持久化数据库（高权限保护）。
- **状态**: `[LIVE]`

### POST /api/db/approve-task
- **用途**: 商家在工作台点击 [立即批准] 时启动的自动落库与状态机扣置变更。
- **状态**: `[LIVE]`

## 3. 国标多模态 AI 命令服务 (AI Services Gateway)
### POST /api/ai/merchant-chat
- **用途**: 商家专属右侧侧边栏 420px AI Sidekick 聊天的问询。**不允许包含底层模型细节**。
- **状态**: `[LIVE]`

### POST /api/ai/admin-chat
- **用途**: 超级管理员下属 AI 中枢讨论大盘算力、战役调配的认知。
- **状态**: `[LIVE]`

### POST /api/gemini/agent-chat
- **用途**: 真正进行多智能体相互对决辩论（如供应 vs. 价格）的内部模型级调用。
- **状态**: `[LIVE]`

### POST /api/gemini/shopify-docs
- **用途**: 查询海外智库对出海或跨国零售规则的辅助解读支持。
- **状态**: `[LIVE]`
