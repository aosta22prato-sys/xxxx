/**
 * Modular Inventory Backend Controller
 */

import { dbEngine } from '../../src/db/dbEngine';

export class InventoryController {
  public static checkAlerts(storeId: string) {
    const products = dbEngine.products.getAll().filter(p => p.storeId === storeId);
    return products
      .filter(p => p.inventory < 15)
      .map(p => ({
        productId: p.id,
        title: p.name,
        stock: p.inventory,
        suggestedRestock: 50,
        severity: p.inventory <= 5 ? 'critical' : 'warning',
      }));
  }
}
