import React from 'react';
import SidekickAI from '../components/SidekickAI';
import { Product, Order, Discount } from '../types';

interface SidekickPanelProps {
  products: Product[];
  orders: Order[];
  discounts: Discount[];
  onClose: () => void;
  isMaximized: boolean;
  setIsMaximized: (val: boolean) => void;
}

export default function SidekickPanel({
  products,
  orders,
  discounts,
  onClose,
  isMaximized,
  setIsMaximized,
}: SidekickPanelProps) {
  return (
    <div className="flex flex-col h-full relative">
      <SidekickAI 
        products={products}
        orders={orders}
        discounts={discounts}
        onClose={onClose}
        isMaximized={isMaximized}
        setIsMaximized={setIsMaximized}
      />
    </div>
  );
}
