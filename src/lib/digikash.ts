/**
 * DigiKash Payment SDK - TypeScript Version
 * For integration with Shopify-style e-commerce platform
 */

export interface DigiKashConfig {
  apiKey: string;
  merchantKey: string;
  apiSecret: string;
  baseUrl?: string;
  environment?: 'sandbox' | 'production';
}

export interface PaymentRequest {
  payment_amount: number;
  currency_code: string;
  ref_trx: string;
  description?: string;
  ipn_url?: string;
  success_redirect?: string;
  cancel_redirect?: string;
  customer_name?: string;
  customer_email?: string;
  allow_payment_methods?: string | string[];
}

export interface PaymentResponse {
  payment_url: string;
  info: Record<string, any>;
}

export interface PaymentVerification {
  status: 'success' | 'pending' | 'failed' | 'cancelled';
  trx_id: string;
  amount: number;
  fee: number;
  currency: string;
  net_amount: number;
  customer?: {
    name?: string;
    email?: string;
  };
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface SiteInfo {
  site_name: string;
  site_logo: string;
  site_url: string;
  gateway_name: string;
  gateway_description: string;
  security_message: string;
  features: Record<string, string>;
  branding: {
    primary_color: string;
    secondary_color: string;
    powered_by_text: string;
  };
  environments: Record<string, string>;
  api_version: string;
  status: string;
}

export class DigiKash {
  private config: Required<DigiKashConfig>;

  constructor(config: DigiKashConfig) {
    this.config = {
      baseUrl: 'https://pay.modaui.com',
      environment: 'sandbox',
      ...config
    };
  }

  /**
   * Initiate a payment
   */
  async initiatePayment(data: PaymentRequest): Promise<PaymentResponse> {
    const url = `${this.config.baseUrl}/api/v1/initiate-payment`;
    return this.makeRequest('POST', url, data);
  }

  /**
   * Verify a payment
   */
  async verifyPayment(trxId: string): Promise<PaymentVerification> {
    const url = `${this.config.baseUrl}/api/v1/verify-payment/${encodeURIComponent(trxId)}`;
    return this.makeRequest('GET', url);
  }

  /**
   * Get site info
   */
  async getSiteInfo(): Promise<SiteInfo> {
    const url = `${this.config.baseUrl}/api/v1/site-info`;
    return this.makeRequest('GET', url);
  }

  /**
   * Make signed API request
   */
  private async makeRequest<T>(
    method: 'GET' | 'POST',
    url: string,
    data?: Record<string, any>
  ): Promise<T> {
    const timestamp = Math.floor(Date.now() / 1000);
    const body = data ? JSON.stringify(data) : '';
    
    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname + parsedUrl.search;
    
    const signaturePayload = `${timestamp}.${method}.${path}.${body}`;
    const signature = await this.hmacSha256(signaturePayload, this.config.apiSecret);

    const headers: Record<string, string> = {
      'X-Merchant-Key': this.config.merchantKey,
      'X-API-Key': this.config.apiKey,
      'X-Timestamp': timestamp.toString(),
      'X-Signature': `sha256=${signature}`,
      'X-Environment': this.config.environment,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (method === 'POST' && data) {
      options.body = body;
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Create HMAC SHA256 signature
   */
  private async hmacSha256(data: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const dataToSign = encoder.encode(data);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataToSign);
    
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}

// For Node.js environment (with crypto module)
export class DigiKashNode extends DigiKash {
  private async hmacSha256(data: string, secret: string): Promise<string> {
    const crypto = await import('node:crypto');
    return crypto.createHmac('sha256', secret)
      .update(data)
      .digest('hex');
  }
}

export default DigiKash;
