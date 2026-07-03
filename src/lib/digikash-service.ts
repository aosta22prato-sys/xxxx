/**
 * DigiKash 集成服务 - TypeScript 版本
 */

export interface MerchantSyncData {
  modaui_merchant_id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  business_name: string;
  business_email: string;
  site_url?: string;
  country: string;
  phone: string;
  currency_code?: string;
}

export interface CreateMerchantResponse {
  success: boolean;
  error?: string;
  data?: {
    user: {
      id: number;
      email: string;
      username: string;
    };
    merchant: {
      id: number;
      business_name: string;
      modaui_merchant_id: string;
    };
    credentials: {
      sandbox: {
        api_key: string;
        merchant_key: string;
        api_secret: string;
      };
      production: {
        api_key: string;
        merchant_key: string;
        api_secret: string;
      };
    };
    temporary_password: string;
  };
}

export interface LoginTokenResponse {
  success: boolean;
  error?: string;
  data?: {
    login_url: string;
    expires_in: number; // seconds
  };
}

export class DigiKashService {
  private baseUrl: string;
  private apiKey: string;

  constructor(options?: {
    baseUrl?: string;
    apiKey?: string;
  }) {
    this.baseUrl = options?.baseUrl || process.env.DIGIKASH_BASE_URL || 'https://pay.modaui.com';
    this.apiKey = options?.apiKey || process.env.DIGIKASH_API_KEY || '';
  }

  /**
   * 在 DigiKash 中创建商户
   */
  async createMerchant(merchantData: MerchantSyncData): Promise<CreateMerchantResponse> {
    const url = `${this.baseUrl}/api/external/modaui/create-merchant`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Modaui-API-Key': this.apiKey,
      },
      body: JSON.stringify(merchantData),
    });

    const result = await response.json() as CreateMerchantResponse;

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create merchant in DigiKash');
    }

    return result;
  }

  /**
   * 生成一键登录 URL
   */
  async generateLoginUrl(modauiMerchantId: string): Promise<string> {
    const url = `${this.baseUrl}/api/external/modaui/generate-login-token`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Modaui-API-Key': this.apiKey,
      },
      body: JSON.stringify({
        modaui_merchant_id: modauiMerchantId,
      }),
    });

    const result = await response.json() as LoginTokenResponse;

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to generate login URL');
    }

    return result.data!.login_url;
  }

  /**
   * 同步商户到 DigiKash（在商户注册成功后调用）
   */
  async syncMerchantOnRegistration(
    modauiMerchant: {
      id: string;
      email: string;
      username: string;
      firstName: string;
      lastName: string;
      businessName: string;
      businessEmail: string;
      siteUrl?: string;
      country: string;
      phone: string;
      currency?: string;
    }
  ): Promise<CreateMerchantResponse> {
    const syncData: MerchantSyncData = {
      modaui_merchant_id: modauiMerchant.id,
      email: modauiMerchant.email,
      username: modauiMerchant.username,
      first_name: modauiMerchant.firstName,
      last_name: modauiMerchant.lastName,
      business_name: modauiMerchant.businessName,
      business_email: modauiMerchant.businessEmail,
      site_url: modauiMerchant.siteUrl,
      country: modauiMerchant.country,
      phone: modauiMerchant.phone,
      currency_code: modauiMerchant.currency || 'USD',
    };

    return await this.createMerchant(syncData);
  }
}

export default DigiKashService;
