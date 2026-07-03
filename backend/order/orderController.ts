/**
 * Modular Order Backend Controller
 */

import { dbEngine } from '../../src/db/dbEngine';

export class OrderController {
  public static getAll() {
    return dbEngine.orders.getAll();
  }

  public static getByStore(storeId: string) {
    return dbEngine.orders.getAll().filter(o => o.storeId === storeId);
  }

  public static create(orderData: any) {
    return dbEngine.orders.create(orderData);
  }
}
