/**
 * Ultimate Modular Discounts Module - Level 10 Schema & Event Driven Marketing
 * Uses Zod schemas, FormBuilder, DataGrid, plus live DiscountService proxying.
 */

import React, { useState } from 'react';
import { useDiscountStore } from '../../stores/discountStore';
import { usePanelStore } from '../../stores/panelStore';
import { useShopStore } from '../../stores/shopStore';
import { Discount } from '../../types';
import { DiscountEvents, NotificationEvents, eventBus } from '../../events';
import { discountSchemaMeta } from '../../schemas';
import DataGrid from '../../components/ui/DataGrid';
import { DiscountService } from '../../services/discount.service';

// De-coupled sub-components
import DiscountsHeader from './components/DiscountsHeader';
import DiscountsSummaryBar from './components/DiscountsSummaryBar';
import DiscountForm from './components/DiscountForm';

export default function DiscountsView() {
  const { discounts, addDiscount } = useDiscountStore();
  const { togglePreview } = usePanelStore();
  const { settings } = useShopStore();
  const [isCreating, setIsCreating] = useState(false);

  const currencySymbol = settings.currencySymbol || '€';

  const handleCreateSubmit = async (formData: any) => {
    const isPercent = formData.type === 'percentage';
    const cleanCode = String(formData.code).toUpperCase().trim().replace(/\s+/g, '');

    const freshDiscount: Discount = {
      id: `disc-${Date.now()}`,
      code: cleanCode,
      type: formData.type,
      value: Number(formData.value),
      valueText: isPercent ? `${formData.value}% OFF` : `${currencySymbol}${formData.value} OFF`,
      status: formData.status || 'active',
      usageCount: 0,
      minRequirement: formData.minRequirement || 'None Spent'
    };

    // 1. Commit and sync with Service Proxy
    addDiscount(freshDiscount);
    await DiscountService.saveDiscounts([...discounts, freshDiscount]);

    // 2. Transmit decoupled events to EventBus
    eventBus.emit(DiscountEvents.CREATED, freshDiscount);
    eventBus.emit(NotificationEvents.CREATED, {
      text: `🏷️ 新增限时营销卡券 [${freshDiscount.code}]- 规格: ${freshDiscount.valueText}`
    });

    setIsCreating(false);
  };

  if (isCreating) {
    return (
      <DiscountForm 
        onBack={() => setIsCreating(false)}
        onSubmit={handleCreateSubmit}
      />
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Decoupled header block */}
      <DiscountsHeader onAddClick={() => setIsCreating(true)} />

      {/* Decoupled summary section */}
      <DiscountsSummaryBar totalCount={discounts.length} />

      {/* Fully dynamic DataGrid governed by schemas */}
      <DataGrid
        columns={discountSchemaMeta.columns}
        records={discounts}
        searchPlaceholder="检索优惠口令、抵扣类型、结算要求状态..."
        currencySymbol={currencySymbol}
        onRowClick={(d) => togglePreview('discount', d.id)}
      />
    </div>
  );
}
