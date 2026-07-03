/**
 * DigiKash 集成 Hook - React 版本
 */

import { useState, useCallback } from 'react';
import DigiKashService, { type CreateMerchantResponse } from './digikash-service';

export function useDigiKash() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = new DigiKashService();

  /**
   * 创建 DigiKash 商户并获取凭证
   */
  const createDigiKashMerchant = useCallback(async (
    merchantData: {
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
  ): Promise<CreateMerchantResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await service.syncMerchantOnRegistration(merchantData);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync with DigiKash';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  /**
   * 跳转到 DigiKash（一键登录）
   */
  const goToDigiKash = useCallback(async (
    modauiMerchantId: string
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const loginUrl = await service.generateLoginUrl(modauiMerchantId);
      window.open(loginUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate login URL';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  return {
    isLoading,
    error,
    createDigiKashMerchant,
    goToDigiKash,
  };
}

export default useDigiKash;
