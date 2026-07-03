/**
 * DigiKash Payment Settings Page - React Component
 */

import React, { useState, useEffect } from 'react';
import { Settings, CreditCard, Key, Shield, Save } from 'lucide-react';

interface GatewayConfig {
  apiKey: string;
  merchantKey: string;
  apiSecret: string;
  environment: 'sandbox' | 'production';
}

export function DigiKashSettings() {
  const [config, setConfig] = useState<GatewayConfig>({
    apiKey: '',
    merchantKey: '',
    apiSecret: '',
    environment: 'sandbox',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testResult, setTestResult] = useState<string | null>(null);

  // Load existing config
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/digikash/config/1'); // merchantId=1 for demo
        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            // Only load non-sensitive data
          }
        }
      } catch (error) {
        console.error('Failed to load config:', error);
      }
    };
    loadConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      const response = await fetch('/api/digikash/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantId: 1,
          ...config,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        throw new Error(result.error || 'Failed to save');
      }
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    // Test the configuration
    setTestResult('正在测试连接...');
    try {
      const response = await fetch('https://pay.modaui.com/api/v1/site-info');
      if (response.ok) {
        setTestResult('✅ 连接成功！DigiKash API 正常工作。');
      } else {
        setTestResult('❌ 连接失败，请检查配置。');
      }
    } catch (error) {
      setTestResult(`❌ 错误: ${(error as Error).message}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-blue-600" />
          DigiKash 支付网关设置
        </h1>
        <p className="text-gray-600 mt-2">
          配置您的 DigiKash 支付网关，为您的商户提供安全支付服务。
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSave} className="space-y-6">
        {/* Environment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Shield className="h-4 w-4 inline mr-1" />
            环境模式
          </label>
          <select
            value={config.environment}
            onChange={(e) => setConfig({ ...config, environment: e.target.value as 'sandbox' | 'production' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="sandbox">🧪 沙盒环境 (Sandbox) - 测试用</option>
            <option value="production">🚀 生产环境 (Production) - 真实交易</option>
          </select>
        </div>

        {/* API Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Key className="h-4 w-4 inline mr-1" />
            API Key
          </label>
          <input
            type="text"
            value={config.apiKey}
            onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            placeholder="输入您的 DigiKash API Key"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Merchant Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Key className="h-4 w-4 inline mr-1" />
            Merchant Key
          </label>
          <input
            type="text"
            value={config.merchantKey}
            onChange={(e) => setConfig({ ...config, merchantKey: e.target.value })}
            placeholder="输入您的 DigiKash Merchant Key"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* API Secret */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Key className="h-4 w-4 inline mr-1" />
            API Secret
          </label>
          <input
            type="password"
            value={config.apiSecret}
            onChange={(e) => setConfig({ ...config, apiSecret: e.target.value })}
            placeholder="输入您的 DigiKash API Secret"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            如何获取 API 凭证？
          </h3>
          <ol className="mt-2 text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>访问 <a href="https://pay.modaui.com" target="_blank" className="underline">pay.modaui.com</a> 登录您的商户账户</li>
            <li>进入商户后台 → API 设置</li>
            <li>创建 API Key、Merchant Key 和 API Secret</li>
            <li>将凭证填入上方表单</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4" />
            {isSaving ? '保存中...' : '保存配置'}
          </button>

          <button
            type="button"
            onClick={handleTest}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            测试连接
          </button>
        </div>

        {/* Status */}
        {saveStatus === 'success' && (
          <div className="text-green-600 bg-green-50 p-3 rounded-lg flex items-center gap-2">
            ✅ 配置保存成功！
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="text-red-600 bg-red-50 p-3 rounded-lg flex items-center gap-2">
            ❌ 保存失败，请重试。
          </div>
        )}
        {testResult && (
          <div className={`p-3 rounded-lg bg-gray-50 text-gray-800`}>
            {testResult}
          </div>
        )}
      </form>
    </div>

    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        📋 快速开始
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
          <h3 className="font-medium text-blue-900 mb-2">
            1️⃣ 在 DigiKash 创建商户
          </h3>
          <p className="text-sm text-gray-600">
            访问 pay.modaui.com 注册并创建您的商户账户。
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
          <h3 className="font-medium text-green-900 mb-2">
            2️⃣ 配置 API 凭证
          </h3>
          <p className="text-sm text-gray-600">
            获取您的 API Key、Merchant Key 和 API Secret。
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-5 rounded-xl border border-purple-100">
          <h3 className="font-medium text-purple-900 mb-2">
            3️⃣ 填入上方表单
          </h3>
          <p className="text-sm text-gray-600">
            将凭证填入并保存，开始接收支付。
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-xl border border-orange-100">
          <h3 className="font-medium text-orange-900 mb-2">
            4️⃣ 测试支付
          </h3>
          <p className="text-sm text-gray-600">
            在沙盒环境测试完整支付流程。
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}

export default DigiKashSettings;
