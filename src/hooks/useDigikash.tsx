/**
 * DigiKash Payment Hook - React
 */

import { useState, useCallback } from 'react';
import DigiKash from '../lib/digikash';

interface PaymentState {
  isLoading: boolean;
  error: string | null;
  paymentUrl: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
}

interface UseDigikashOptions {
  merchantId: number | string; // Required - no default
}

export function useDigikash(options: UseDigikashOptions) {
  const [state, setState] = useState<PaymentState>({
    isLoading: false,
    error: null,
    paymentUrl: null,
    status: 'idle',
  });

  const initiatePayment = useCallback(async (params: {
    amount: number;
    currency: string;
    orderId: string;
    description?: string;
    customerName?: string;
    customerEmail?: string;
  }) => {
    setState(prev => ({ ...prev, isLoading: true, status: 'loading', error: null }));

    try {
      // Call our backend API to initiate payment
      const response = await fetch('/api/digikash/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantId: options.merchantId,
          ...params,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Payment initiation failed');
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        status: 'success',
        paymentUrl: result.data.payment_url,
      }));

      return result.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        status: 'error',
        error: (error as Error).message,
      }));
      throw error;
    }
  }, [options.merchantId]);

  const verifyPayment = useCallback(async (orderId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch(`/api/digikash/payment/${orderId}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      setState(prev => ({ ...prev, isLoading: false }));
      return result;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, error: (error as Error).message, status: 'error' }));
      throw error;
    }
  }, []);

  return {
    ...state,
    initiatePayment,
    verifyPayment,
    redirectToPayment: () => {
      if (state.paymentUrl) {
        // 验证支付URL的安全性 - 确保使用HTTPS且来自可信域名
        let validUrl;
        try {
          validUrl = new URL(state.paymentUrl);
        } catch {
          console.error('Invalid payment URL format');
          return;
        }

        // 检查协议是否为HTTPS
        if (validUrl.protocol !== 'https:') {
          console.error('Insecure payment URL - must use HTTPS');
          return;
        }

        // 检查是否为可信支付提供商域名
        const trustedDomains = [
          process.env.DIGIKASH_DOMAIN || 'pay.digikash.com',
          process.env.DIGIKASH_SANDBOX_DOMAIN || 'sandbox.digikash.com'
        ];
        if (!trustedDomains.includes(validUrl.hostname)) {
          console.error('Untrusted payment domain:', validUrl.hostname);
          return;
        }

        window.location.href = state.paymentUrl;
      }
    },
    reset: () => setState({
      isLoading: false,
      error: null,
      paymentUrl: null,
      status: 'idle',
    }),
  };
}

/**
 * Payment Button Component
 */
interface PaymentButtonProps {
  amount: number;
  currency: string;
  orderId: string;
  customerName?: string;
  customerEmail?: string;
  description?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  digikashOptions: UseDigikashOptions; // Required
}

export function DigikashPaymentButton({
  amount,
  currency,
  orderId,
  customerName,
  customerEmail,
  description,
  onSuccess,
  onError,
  className = '',
  digikashOptions,
}: PaymentButtonProps) {
  const { isLoading, error, paymentUrl, initiatePayment, redirectToPayment } = useDigikash(digikashOptions);

  const handlePayment = async () => {
    try {
      await initiatePayment({
        amount,
        currency,
        orderId,
        customerName,
        customerEmail,
        description,
      });
      onSuccess?.();
    } catch (err) {
      onError?.((err as Error).message);
    }
  };

  if (paymentUrl) {
    return (
      <button
        onClick={redirectToPayment}
        className={`bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors ${className}`}
      >
        🔐 前往支付页面
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={`bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg transition-colors ${className}`}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⏳</span> 处理中...
          </span>
        ) : (
          `💳 支付 ${currency} ${amount.toFixed(2)}`
        )}
      </button>
      
      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
          ❌ {error}
        </div>
      )}
    </div>
  );
}
