/**
 * Example Checkout Page with DigiKash Integration
 */

import React, { useState } from 'react';
import { ShoppingCart, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DigikashPaymentButton } from '../hooks/useDigikash';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export function CheckoutPage() {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
  });
  const [step, setStep] = useState<'cart' | 'payment' | 'success'>('cart');

  const cartItems: CartItem[] = [
    { id: '1', name: '示例商品 1', price: 29.99, quantity: 1 },
    { id: '2', name: '示例商品 2', price: 69.99, quantity: 1 },
  ];

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handlePaymentSuccess = () => {
    setStep('success');
  };

  const handlePaymentError = (error: string) => {
    alert(`支付失败: ${error}`);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            🎉 支付成功！
          </h1>
          <p className="text-gray-600 mb-8">
            您的订单已确认，感谢您的购买！
          </p>
          <button
            onClick={() => setStep('cart')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            结账
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Cart Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              购物车
            </h2>
            
            <div className="divide-y divide-gray-200 mb-6">
              {cartItems.map(item => (
                <div key={item.id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">数量: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                <span>总计</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">包含运费</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              支付信息
            </h2>

            {/* Customer Info */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  姓名
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  placeholder="请输入您的姓名"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  邮箱
                </label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Payment Button */}
            {customerInfo.name && customerInfo.email ? (
              <div className="space-y-4">
                <DigikashPaymentButton
                  amount={calculateTotal()}
                  currency="USD"
                  orderId={`ORDER-${Date.now()}`}
                  customerName={customerInfo.name}
                  customerEmail={customerInfo.email}
                  description={`Order from shop`}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-500">
                  <p>🔐 由 DigiKash 提供安全支付服务</p>
                </div>
              </div>
            ) : (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg cursor-not-allowed"
              >
                请先填写信息
              </button>
            )}

            {/* Payment Methods Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                💳 支持多种支付方式
              </p>
              <div className="flex justify-center gap-4 mt-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs">信用卡</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs">支付宝</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs">微信</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
