export enum InventoryEvents {
  CHANGED = 'inventory.changed',
  OUT_OF_STOCK = 'inventory.out-of-stock',
  RESTOCKED = 'inventory.restocked',
}
export type InventoryEventPayload = {
  sku: string;
  value: number;
};
