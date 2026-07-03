export enum ProductEvents {
  CREATED = 'product.created',
  UPDATED = 'product.updated',
  DELETED = 'product.deleted',
}
export type ProductEventPayload = {
  id: string;
  title: string;
  sku: string;
  price: number;
};
