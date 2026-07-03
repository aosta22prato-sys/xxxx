/**
 * ECOS Store POS Cashier Terminal
 */

import React, { useState } from 'react';
import { dbEngine } from '../../src/db/dbEngine';
import { OrderStatus } from '../../src/types';

export default function PosTerminal() {
  const [cart, setCart] = useState<{ id: string; name: string; price: number; qty: number }[]>([]);
  const [products] = useState(() => dbEngine.products.getAll().slice(0, 6));
  const [paymentDone, setPaymentDone] = useState(false);

  const addToCart = (p: any) => {
    const existing = cart.find(item => item.id === p.id);
    if (existing) {
      setCart(cart.map(item => item.id === p.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { id: p.id, name: p.name, price: p.price, qty: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Construct structurally compliant Order object
    const newOrder: any = {
      storeId: 's_paris_pos_1',
      userId: 'u_cashier_pos',
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.qty
      })),
      status: OrderStatus.COMPLETED,
      total: total,
      paymentStatus: 'Paid',
      shippingAddress: 'Cashier Offline Store Checkout Counter 1',
      createdAt: new Date().toISOString()
    };

    dbEngine.orders.create(newOrder);

    setCart([]);
    setPaymentDone(true);
    setTimeout(() => setPaymentDone(false), 3000);
  };

  return (
    <div className="min-h-[85vh] bg-slate-900 text-slate-100 flex flex-col md:flex-row gap-6 p-6 font-sans text-left">
      
      {/* Products list selection grid */}
      <div className="flex-1 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-white">线下门市 POS 收银台</h2>
            <p className="text-xs text-slate-400">选择商品加入右侧购物车，秒级自动扣减本地硬分仓库存</p>
          </div>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold uppercase animate-pulse">
            ● 钱箱状态: 在线
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p, idx) => (
            <div 
              key={p.id || idx} 
              onClick={() => addToCart(p)}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4 hover:border-[#07C2E3]/40 cursor-pointer active:scale-95 transition-all text-left flex flex-col justify-between h-40"
            >
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 bg-slate-900 border border-slate-850 px-2 py-0.5 rounded">
                  {p.sku}
                </span>
                <h4 className="font-extrabold text-[#07C2E3] text-xs mt-2 truncate">{p.name}</h4>
                <p className="text-[10.5px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
              </div>
              <div className="flex justify-between items-center mt-3 border-t border-slate-900 pt-2">
                <span className="font-mono text-white text-xs font-black">€{p.price}</span>
                <span className="text-[9px] text-emerald-400 font-bold">库存: {p.inventory}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POS Cart Summary Drawer */}
      <div className="w-full md:w-80 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="border-b border-slate-850 pb-3 flex justify-between items-center">
            <h3 className="font-black text-rose-100 text-xs uppercase">购物车内明细</h3>
            <span className="bg-rose-500/10 text-rose-400 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
              {cart.reduce((s, c) => s + c.qty, 0)} 件商品
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <div className="text-3xl">🛒</div>
              <p className="text-xs">收银车内暂无商品</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs border-b border-slate-900 pb-2">
                  <div>
                    <h5 className="font-bold text-slate-200">{item.name}</h5>
                    <span className="font-mono text-[10px] text-slate-500">
                      € {item.price} x {item.qty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-white">
                      € {(item.price * item.qty).toFixed(2)}
                    </span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-500 hover:text-rose-400 font-bold font-mono px-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sum and checkout options */}
        <div className="border-t border-slate-850 pt-4 mt-4 space-y-4">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>税款 (VAT 20%)</span>
            <span className="font-mono">€ {(total * 0.2).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center border-t border-slate-900 pt-2">
            <span className="text-xs font-bold text-slate-200">应付总额</span>
            <span className="text-base font-black text-[#07C2E3] font-mono">
              € {total.toFixed(2)}
            </span>
          </div>

          {paymentDone && (
            <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] p-2.5 rounded-lg text-center font-bold">
              ✓ 交易完成！资金注入结算账单库，库存完成扣减
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 disabled:opacity-50 text-slate-950 font-black text-xs py-3 rounded-lg cursor-pointer transition-all shadow-md flex justify-center items-center gap-1.5"
          >
            <span>现金/借记卡收款</span>
          </button>
        </div>
      </div>

    </div>
  );
}
