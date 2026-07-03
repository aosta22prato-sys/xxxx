import { dbEngine } from '../../db/dbEngine';
import { StoreContext } from '../../types';
import { BrainStreamService } from '../brain-stream/BrainStreamService';

class StoreAwarenessBridgeClass {
  private static instance: StoreAwarenessBridgeClass;

  private constructor() {}

  public static getInstance(): StoreAwarenessBridgeClass {
    if (!StoreAwarenessBridgeClass.instance) {
      StoreAwarenessBridgeClass.instance = new StoreAwarenessBridgeClass();
    }
    return StoreAwarenessBridgeClass.instance;
  }

  /**
   * Fetch active Store Context vector or bootstrap a default one if empty
   */
  public getStoreContext(tenantId = 'tenant_default', storeId = 'store_default'): StoreContext {
    const list = dbEngine.store_contexts.getAll();
    const matched = list.find(s => s.tenant_id === tenantId && s.store_id === storeId);

    if (matched) {
      return matched;
    }

    // Bootstrap initial high-fidelity mock context for a modern European brand
    const initialContext = dbEngine.store_contexts.create({
      tenant_id: tenantId,
      store_id: storeId,
      locale: 'fr-FR',
      base_currency: 'EUR',
      active_sales_channels: ['Shopify Online Store', 'Instagram Shop'],
      shipping_zones_count: 1, // Restricted EU shipping
      is_vat_registered: false, // The biggest Compliance Gap
      compliance_score: 65, // Low setup score
      updated_at: new Date().toISOString()
    });

    return initialContext;
  }

  /**
   * Apply merchant updates and trigger recalculation of compliance diagnostic score
   */
  public updateStoreContext(id: string, updates: Partial<StoreContext>): void {
    const original = dbEngine.store_contexts.getAll().find(s => s.id === id);
    if (!original) return;

    const merged = { ...original, ...updates };
    const recalculatedScore = this.evaluateCompliance(merged);

    dbEngine.store_contexts.update(id, {
      ...updates,
      compliance_score: recalculatedScore,
      updated_at: new Date().toISOString()
    });

    // Notify Brain Stream of changes
    BrainStreamService.emitEvent(
      'COMPLIANCE_PASS',
      `Merchant environment updated. Diagnostics re-evaluated. Compliance score: ${recalculatedScore}%`,
      recalculatedScore < 80 ? 'MEDIUM' : 'INFO',
      recalculatedScore < 80 ? 'Register VAT and enable expanded international zones' : undefined,
      { previous_score: original.compliance_score, current_score: recalculatedScore }
    );
  }

  /**
   * Local rule evaluator estimating compliance standing based on configuration checklist parameters
   */
  private evaluateCompliance(ctx: StoreContext): number {
    let score = 50;

    if (ctx.is_vat_registered) {
      score += 25; // VAT-certified
    }
    if (ctx.shipping_zones_count >= 3) {
      score += 15; // International ready
    }
    if (ctx.active_sales_channels.length >= 3) {
      score += 10; // Multi-channel setup
    }

    return Math.min(100, score);
  }
}

export const StoreAwarenessBridge = StoreAwarenessBridgeClass.getInstance();
