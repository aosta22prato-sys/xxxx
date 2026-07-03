# 单账户集成方案（推荐）

## 🎯 方案概述

**商户只在 Modaui 注册一次**，DigiKash 作为后台支付系统自动同步，用户体验最流畅！

## 📋 架构

```
Modaui (主平台)
├── 商户注册
├── 同步到 DigiKash (自动)
├── 管理商户
└── 一键跳转 DigiKash

DigiKash (支付系统)
├── 接收同步
├── 处理支付
└── 回调通知 Modaui
```

## 🚀 使用步骤

### 1. 数据库迁移 (DigiKash 端)

```bash
cd /www/wwwroot/pay.modaui.com
php artisan migrate
```

这会在 `merchants` 表添加 `modaui_merchant_id` 字段。

### 2. 配置 API 密钥 (DigiKash 端)

在 `config/services.php` 添加：

```php
'modaui' => [
    'api_key' => env('MODAUI_API_KEY', 'your-secret-key-here'),
],
```

在 `.env` 文件设置：

```
MODAUI_API_KEY=your-secure-api-key-change-this
```

### 3. Modaui 端配置

在 `.env` 添加：

```
DIGIKASH_BASE_URL=https://pay.modaui.com
DIGIKASH_API_KEY=same-as-digikash-modaui-api-key
```

### 4. 在 Modaui 商户注册后同步

在你的商户注册流程中调用：

```typescript
import { useDigiKash } from '@/hooks/use-digikash-sync';

// 在注册成功后
const { createDigiKashMerchant } = useDigiKash();

const onMerchantRegistered = async (merchant) => {
  const result = await createDigiKashMerchant({
    id: merchant.id,
    email: merchant.email,
    username: merchant.username,
    firstName: merchant.firstName,
    lastName: merchant.lastName,
    businessName: merchant.businessName,
    businessEmail: merchant.email,
    country: 'US',
    phone: merchant.phone,
  });

  // 保存凭证到数据库
  if (result.success) {
    await saveMerchantCredentials(result.data);
  }
};
```

### 5. 一键跳转按钮

```typescript
import { useDigiKash } from '@/hooks/use-digikash-sync';

function DigiKashButton({ merchantId }: { merchantId: string }) {
  const { goToDigiKash, isLoading } = useDigiKash();

  return (
    <button
      onClick={() => goToDigiKash(merchantId)}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : '💳 管理支付'}
    </button>
  );
}
```

## 🔗 API 端点

### DigiKash API

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/external/modaui/create-merchant` | POST | 创建商户 |
| `/api/external/modaui/generate-login-token` | POST | 生成登录令牌 |
| `/auth/modaui/sso?token=xxx` | GET | SSO 登录 |

### 请求头

```
X-Modaui-API-Key: your-api-key
Content-Type: application/json
```

## 📊 流程

### 商户注册流程

1. 商户在 Modaui 注册
2. Modaui 调用 DigiKash API 创建账户
3. DigiKash 返回 API 凭证
4. Modaui 保存凭证
5. 商户可以开始使用支付功能

### 支付流程

1. 买家在 Modaui 下单
2. Modaui 调用 DigiKash 发起支付
3. 买家在 DigiKash 完成支付
4. DigiKash 回调通知 Modaui
5. Modaui 更新订单状态

## 🔒 安全建议

1. 使用强 API 密钥
2. 通过 HTTPS 通信
3. 验证回调签名
4. 限制 API 访问频率
5. 定期轮换密钥

## 📝 文件清单

### DigiKash 端

- `app/Http/Controllers/Api/External/ModauiIntegrationController.php`
- `app/Http/Controllers/Frontend/Auth/Modaui/SsoLoginController.php`
- `database/migrations/2025_01_01_000001_add_modaui_merchant_id_to_merchants.php`
- `routes/api.php` (已更新)
- `routes/web.php` (已更新)

### Modaui 端

- `src/lib/digikash-service.ts`
- `src/hooks/use-digikash-sync.ts`
- `src/lib/digikash.ts` (已有)
- `src/hooks/useDigikash.ts` (已有)
- `src/components/DigiKashSettings.tsx` (已有)
- `src/components/CheckoutPage.tsx` (已有)
