/**
 * Modular Product Backend Controller
 */

import { dbEngine } from '../../src/db/dbEngine';

export class ProductController {
  public static getAll() {
    return dbEngine.products.getAll();
  }

  public static getByStore(storeId: string) {
    return dbEngine.products.getAll().filter(p => p.storeId === storeId);
  }

  public static create(productData: any) {
    return dbEngine.products.create(productData);
  }
}
