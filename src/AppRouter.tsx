/**
 * Application Mode Router
 * 
 * Allows switching between:
 * 1. Original AI Command Center (Traditional Mode)
 * 2. New Store OS (Modern Mode)
 */

import React, { useState, useEffect } from 'react';
import { Zap, ShoppingCart, Settings, ChevronRight } from 'lucide-react';
import App from './App';
import { StoreOSApp } from './core-commerce/store';
import { StoreConfig } from './core-commerce';

export type AppMode = 'select' | 'traditional' | 'store-os';

interface AppRouterProps {
  defaultMode?: AppMode;
}

const ModeSelector: React.FC<{
  onSelect: (mode: 'traditional' | 'store-os') => void;
}> = ({ onSelect }) => {
  return (
    <div className="mode-selector-container">
      <style>{`
        .mode-selector-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        }
        
        .selector-content {
          background: white;
          border-radius: 16px;
          padding: 48px;
          max-width: 900px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .selector-header {
          text-align: center;
          margin-bottom: 48px;
        }
        
        .selector-header h1 {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 12px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .selector-header p {
          font-size: 16px;
          color: #666;
          margin: 0;
        }
        
        .mode-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 32px;
        }
        
        @media (max-width: 768px) {
          .mode-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .mode-card {
          padding: 32px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .mode-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .mode-card:hover {
          border-color: #667eea;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
        }
        
        .mode-card:hover::before {
          opacity: 1;
        }
        
        .mode-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        
        .mode-title {
          font-size: 22px;
          font-weight: 600;
          margin: 0 0 12px 0;
          color: #222;
        }
        
        .mode-description {
          font-size: 14px;
          color: #666;
          margin: 0 0 20px 0;
          line-height: 1.6;
        }
        
        .mode-features {
          list-style: none;
          padding: 0;
          margin: 0 0 24px 0;
        }
        
        .mode-features li {
          font-size: 13px;
          color: #555;
          margin-bottom: 8px;
          padding-left: 24px;
          position: relative;
        }
        
        .mode-features li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #667eea;
          font-weight: 600;
        }
        
        .mode-card-button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
          width: 100%;
        }
        
        .mode-card-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
        }
        
        .mode-card-button:active {
          transform: translateY(0);
        }
        
        .mode-footer {
          text-align: center;
          font-size: 12px;
          color: #999;
        }
        
        .mode-footer p {
          margin: 0;
        }
      `}</style>

      <div className="selector-content">
        <div className="selector-header">
          <h1>🚀 AI Commerce OS</h1>
          <p>选择应用模式</p>
        </div>

        <div className="mode-grid">
          {/* Traditional Mode */}
          <div className="mode-card">
            <div className="mode-icon">⚡</div>
            <h3 className="mode-title">传统模式</h3>
            <p className="mode-description">
              原始的 AI Command Center，支持多个行业、多租户管理、高级智能体编排
            </p>
            <ul className="mode-features">
              <li>多租户管理</li>
              <li>行业预设</li>
              <li>智能体编排</li>
              <li>完整的 AI 大脑</li>
            </ul>
            <button 
              className="mode-card-button"
              onClick={() => onSelect('traditional')}
            >
              <span>进入传统模式</span>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Store OS Mode */}
          <div className="mode-card">
            <div className="mode-icon">🏪</div>
            <h3 className="mode-title">Store OS</h3>
            <p className="mode-description">
              全新的 AI-Native Shopify OS，统一的商店运营系统，AI 作为操作系统
            </p>
            <ul className="mode-features">
              <li>统一商店引擎</li>
              <li>事件驱动架构</li>
              <li>动态定价</li>
              <li>AI 自动化</li>
            </ul>
            <button 
              className="mode-card-button"
              onClick={() => onSelect('store-os')}
            >
              <span>进入 Store OS</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="mode-footer">
          <p>💡 提示：你可以在应用设置中随时切换模式</p>
        </div>
      </div>
    </div>
  );
};

export const AppRouter: React.FC<AppRouterProps> = ({ defaultMode = 'select' }) => {
  const [appMode, setAppMode] = useState<AppMode>(defaultMode);

  // Try to load saved preference
  useEffect(() => {
    const saved = localStorage.getItem('appMode');
    if (saved && (saved === 'traditional' || saved === 'store-os')) {
      setAppMode(saved);
    }
  }, []);

  const handleModeSelect = (mode: 'traditional' | 'store-os') => {
    setAppMode(mode);
    localStorage.setItem('appMode', mode);
  };

  const handleModeSwitch = () => {
    setAppMode('select');
    localStorage.removeItem('appMode');
  };

  if (appMode === 'select') {
    return <ModeSelector onSelect={handleModeSelect} />;
  }

  if (appMode === 'traditional') {
    return <App />;
  }

  if (appMode === 'store-os') {
    const storeConfig: StoreConfig = {
      id: 'store_default',
      tenantId: 'tenant_default',
      name: 'My Store',
      timezone: 'Europe/Berlin',
      currency: 'EUR',
      language: 'zh-CN',
      country: 'DE',
      strategy: {
        pricingModel: 'dynamic',
        marginTarget: 15.0,
        maxDiscount: 25.0,
      },
      supply: {
        defaultLeadTime: 5,
        replenishmentBuffer: 1.15,
        minStockThreshold: 10,
      },
      ai: {
        autoReplenishment: true,
        autoPricing: true,
        autoMarketing: true,
        autonomyLevel: 'guided',
      },
    };

    return (
      <StoreOSApp 
        storeConfig={storeConfig}
        onReady={() => console.log('Store OS Ready!')}
      />
    );
  }

  return null;
};

export default AppRouter;
