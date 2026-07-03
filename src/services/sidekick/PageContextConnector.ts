import { dbEngine } from '../../db/dbEngine';

export interface PageMetadata {
  currentPage: string;
  focusEntityId?: string;
  focusEntityName?: string;
  relevanceTag: string;
}

export class PageContextConnector {
  private static instance: PageContextConnector | null = null;

  private constructor() {}

  public static getInstance(): PageContextConnector {
    if (!PageContextConnector.instance) {
      PageContextConnector.instance = new PageContextConnector();
    }
    return PageContextConnector.instance;
  }

  /**
   * Translates active dashboard navigation tab or sub-view parameters into a high-fidelity
   * context payload, resolving relevant focused entities.
   */
  public resolvePageContext(activeTab: string, tenantId = 't_retail', storeId = 'store_retail'): PageMetadata {
    const tabClean = activeTab.toLowerCase();
    let relevanceTag = 'general';
    let focusEntityId: string | undefined;
    let focusEntityName: string | undefined;

    // Direct dynamic resolution of focused merchant data
    if (tabClean === 'products' || tabClean === 'inventory' || tabClean === 'sourcing') {
      relevanceTag = 'supply_chain';
      const recentProduct = dbEngine.products.getAll().find(p => p.storeId === storeId);
      if (recentProduct) {
        focusEntityId = recentProduct.id;
        focusEntityName = recentProduct.name;
      }
        } else if (tabClean === 'orders' || tabClean === 'customers' || tabClean === 'risk') {
      relevanceTag = 'sales_compliance';
      const recentOrder = dbEngine.orders.getAll().find(o => o.storeId === storeId);
      if (recentOrder) {
        focusEntityId = recentOrder.id;
        focusEntityName = `Order #${recentOrder.id}`;
      }
    } else if (tabClean === 'markets' || tabClean === 'languages' || tabClean === 'settings') {
      relevanceTag = 'globalization';
      const storeCtx = dbEngine.store_contexts.getAll().find(c => c.tenant_id === tenantId && c.store_id === storeId);
      if (storeCtx) {
        focusEntityId = storeCtx.id;
        focusEntityName = `Store #${storeCtx.store_id} (${storeCtx.locale})`;
      }
    }

    return {
      currentPage: tabClean,
      focusEntityId,
      focusEntityName,
      relevanceTag
    };
  }
}

export const pageContextConnector = PageContextConnector.getInstance();
