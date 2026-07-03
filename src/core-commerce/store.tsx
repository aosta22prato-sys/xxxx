/**
 * Store OS Application UI
 */

import React, { useState, useEffect } from 'react';
import { StoreConfig } from './index';

interface StoreOSAppProps {
  storeConfig: StoreConfig;
  onReady?: () => void;
}

export const StoreOSApp: React.FC<StoreOSAppProps> = ({ storeConfig, onReady }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (onReady) onReady();
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#f5f5f5', padding: '20px', borderRight: '1px solid #ddd' }}>
        <h2 style={{ margin: '0 0 20px 0' }}>🏪 {storeConfig.name}</h2>
        <nav>
          {['dashboard', 'products', 'orders', 'customers', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px',
                margin: '5px 0',
                border: 'none',
                backgroundColor: activeTab === tab ? '#007bff' : 'transparent',
                color: activeTab === tab ? 'white' : 'black',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px', overflow: 'auto' }}>
        {activeTab === 'dashboard' && (
          <div>
            <h1>Dashboard</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                <h3>Store ID</h3>
                <p>{storeConfig.id}</p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                <h3>Currency</h3>
                <p>{storeConfig.currency}</p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                <h3>Timezone</h3>
                <p>{storeConfig.timezone}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <h1>Products</h1>
            <p>Products management interface</p>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h1>Orders</h1>
            <p>Orders management interface</p>
          </div>
        )}

        {activeTab === 'customers' && (
          <div>
            <h1>Customers</h1>
            <p>Customers management interface</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h1>Settings</h1>
            <p>Store settings interface</p>
          </div>
        )}
      </div>
    </div>
  );
};
