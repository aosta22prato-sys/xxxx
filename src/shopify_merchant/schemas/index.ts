/**
 * Master Decoupled Zod Schemas & Metadata Driven Platform Registry
 * Section Six Schema Architecture: Form, Validations, and Columns automatic builders
 */

import { productZodSchema, productSchemaMeta } from './product.schema';
import { orderZodSchema, orderSchemaMeta } from './order.schema';
import { customerZodSchema, customerSchemaMeta } from './customer.schema';
import { discountZodSchema, discountSchemaMeta } from './discount.schema';
import { segmentZodSchema, segmentSchemaMeta } from './segment.schema';
import { companyZodSchema, companySchemaMeta } from './company.schema';

export * from './types';
export * from './product.schema';
export * from './order.schema';
export * from './customer.schema';
export * from './discount.schema';
export * from './segment.schema';
export * from './company.schema';

export const globalSchemas = {
  product: productZodSchema,
  order: orderZodSchema,
  customer: customerZodSchema,
  discount: discountZodSchema,
  segment: segmentZodSchema,
  company: companyZodSchema,
};

export const globalSchemasMeta = {
  product: productSchemaMeta,
  order: orderSchemaMeta,
  customer: customerSchemaMeta,
  discount: discountSchemaMeta,
  segment: segmentSchemaMeta,
  company: companySchemaMeta,
};
