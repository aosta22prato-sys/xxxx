# DigiKash 集成指南 - TypeScript/React 版本

## 📁 已创建的文件

| 文件 | 位置 | 说明 |
|------|------|------|
| `src/lib/digikash.ts` | SDK 核心类 | TypeScript 版本的 DigiKash SDK |
| `src/routes/digikash.ts` | 后端路由 | Express API 路由 |
| `src/hooks/useDigikash.ts` | React Hooks | 支付 Hook 和按钮组件 |
| `src/components/DigiKashSettings.tsx` | 设置页面 | 商户配置页面 |
| `src/components/CheckoutPage.tsx` | 结账页面 | 集成示例 |

## 🚀 快速开始

### 1. 安装依赖 (如果需要)

```bash
cd /www/wwwroot/modaui.com
# 已有的依赖足够，无需额外安装
```

### 2. 配置环境变量

在 `.env` 或 `.env.local` 中添加：

```env
DIGIKASH_BASE_URL=https://pay.modaui.com
BASE_URL=https://your-domain.com
```

### 3. 集成到你的 Express 服务器

在 `server.ts` (或你的后端入口文件) 中添加：

```typescript
import digikashRoutes from './src/routes/digikash';

// ... 现有代码 ...

app.use('/api/digikash', digikashRoutes);
```

### 4. 添加路由

在你的路由配置中添加页面路由：

```typescript
// 管理后台设置页面
// /admin/payment/digikash
```

## 📝 使用示例

### 在后端创建支付

```typescript
import DigiKash from './lib/digikash';

const digikash = new DigiKash({
  apiKey: 'your-api-key',
  merchantKey: 'your-merchant-key',
  apiSecret: 'your-api-secret',
  environment: 'sandbox',
});

const payment = await digikash.initiatePayment({
  payment_amount: 99.99,
  currency_code: 'USD',
  ref_trx: 'ORDER-12345',
  description: 'Order payment',
  success_redirect: 'https://your-site.com/success',
  cancel_redirect: 'https://your-site.com/cancel',
  customer_name: 'John Doe',
  customer_email: 'john@example.com',
});

// Redirect user to payment.payment_url
```

### 在 React 中使用

```tsx
import { DigikashPaymentButton } from './hooks/useDigikash';

function YourComponent() {
  return (
    <DigikashPaymentButton
      amount={99.99}
      currency="USD"
      orderId="ORDER-12345"
      customerName="张三"
      customerEmail="zhangsan@example.com"
    />
  );
}
```

## 🔐 安全说明

1. **不要在前端直接使用 SDK！
   - 前端只调用你自己的后端 API (`/api/digikash/payment`)
   - 你的后端再调用 DigiKash API
   - 这样可以保护 API Secret

2. **API Secret 只在服务器端保存
   - 永远不要提交到代码仓库
   - 使用环境变量管理

## 🧪 测试流程

1. 在 `pay.modaui.com` 后台创建测试商户
2. 获取 sandbox 环境的 API 凭证
3. 在你的平台配置这些凭证
4. 创建测试订单，走完整支付流程
5. 确认订单状态正确更新
6. 切换到 production 环境

## 📋 下一步

- [ ] 在 Express 服务器中添加路由
- [ ] 创建数据库表（如果需要）
- [ ] 配置 webhook URL
- [ ] 沙盒环境测试
- [ ] 上线到生产环境
