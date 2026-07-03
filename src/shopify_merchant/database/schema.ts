/**
 * Admin OS Client Schema & Security Contract
 * Level 5 Database Slots & Level 8 Runtime Schemas
 */

import { Product, Order, Customer, Discount, StoreSettings } from '../types';

// Client-side schema validators simulating Zod / Yup assertions
export const schemas = {
  product: {
    validate: (data: Partial<Product>): { success: boolean; errors?: string[] } => {
      const errorsList: string[] = [];
      if (!data.title || data.title.trim().length === 0) {
        errorsList.push('商品标题不能为空 (Title is required)');
      }
      if (data.price !== undefined && data.price < 0) {
        errorsList.push('价格不能为负数 (Price cannot be negative)');
      }
      if (data.inventory !== undefined && data.inventory < 0) {
        errorsList.push('库存不能小于0 (Inventory cannot be negative)');
      }
      return {
        success: errorsList.length === 0,
        errors: errorsList.length > 0 ? errorsList : undefined,
      };
    }
  },
  order: {
    validate: (data: Partial<Order>): { success: boolean; errors?: string[] } => {
      const errorsList: string[] = [];
      if (!data.customerEmail || !data.customerEmail.includes('@')) {
        errorsList.push('必须指派有效的客户邮箱 (A valid customer email is required)');
      }
      if (!data.items || data.items.length === 0) {
        errorsList.push('订单必须至少包含一件商品 (Order must contain at least 1 item)');
      }
      return {
        success: errorsList.length === 0,
        errors: errorsList.length > 0 ? errorsList : undefined,
      };
    }
  },
  customer: {
    validate: (data: Partial<Customer>): { success: boolean; errors?: string[] } => {
      const errorsList: string[] = [];
      if (!data.email || !data.email.includes('@')) {
        errorsList.push('必须填入有效的邮箱地址 (Valid email is required)');
      }
      if (!data.firstName || !data.lastName) {
        errorsList.push('姓名栏信息不能为空完整的属性 (First and last name are required)');
      }
      return {
        success: errorsList.length === 0,
        errors: errorsList.length > 0 ? errorsList : undefined,
      };
    }
  },
  discount: {
    validate: (data: Partial<Discount>): { success: boolean; errors?: string[] } => {
      const errorsList: string[] = [];
      if (!data.code || data.code.trim().length === 0) {
        errorsList.push('折扣优惠码不能留空 (Discount code is required)');
      }
      if (data.value === undefined || data.value <= 0) {
        errorsList.push('券面额度必须大于零 (Value must be greater than zero)');
      }
      return {
        success: errorsList.length === 0,
        errors: errorsList.length > 0 ? errorsList : undefined,
      };
    }
  }
};
