import { dbEngine } from '../../db/dbEngine';
import { ReadinessScorecard, StoreContext } from '../../types';
import { BrainStreamService } from '../brain-stream/BrainStreamService';

class StoreReadinessEngineClass {
  private static instance: StoreReadinessEngineClass;

  private constructor() {}

  public static getInstance(): StoreReadinessEngineClass {
    if (!StoreReadinessEngineClass.instance) {
      StoreReadinessEngineClass.instance = new StoreReadinessEngineClass();
    }
    return StoreReadinessEngineClass.instance;
  }

  /**
   * Retrieves or computes the highly detailed Readiness Scorecard 2.0.
   */
  public evaluateStoreReadiness(tenantId = 'tenant_default', storeId = 'store_default'): ReadinessScorecard {
    const list = dbEngine.readiness_scorecards.getAll();
    let current = list.find(s => s.tenant_id === tenantId && s.store_id === storeId);

    // Dynamic metrics pulled from our core Store Context
    const storeCtxList = dbEngine.store_contexts?.getAll() || [];
    let activeCtx = storeCtxList.find(s => s.tenant_id === tenantId && s.store_id === storeId);

    if (!activeCtx) {
      activeCtx = dbEngine.store_contexts.create({
        tenant_id: tenantId,
        store_id: storeId,
        locale: 'fr-FR',
        base_currency: 'EUR',
        active_sales_channels: ['Shopify Storefront'],
        shipping_zones_count: 2,
        is_vat_registered: false,
        compliance_score: 65,
        updated_at: new Date().toISOString()
      });
    }

    // Direct Scorecard 2.0 weights
    const hasVat = activeCtx.is_vat_registered;
    const multiChannelCount = activeCtx.active_sales_channels.length;
    const zoneCount = activeCtx.shipping_zones_count;

    // Detailed breakdown computing
    const breakdowns = {
      products: 92, // Static mock default base high
      payments: hasVat ? 98 : 65,
      shipping: Math.min(100, zoneCount * 30),
      markets: Math.min(100, zoneCount * 25),
      translations: activeCtx.locale === 'fr-FR' ? 85 : 45,
      seo: activeCtx.active_sales_channels.includes('Instagram Checkout') ? 90 : 70
    };

    // Synthesize six major dimensions requested by Phase 561-570
    const launch_score = Math.round((breakdowns.products + breakdowns.payments + breakdowns.shipping) / 3);
    const growth_score = Math.round((breakdowns.markets + breakdowns.seo + breakdowns.translations) / 3);
    const eu_ready_score = hasVat ? 95 : 40;
    const loc_ready_score = breakdowns.translations;
    const auto_ready_score = multiChannelCount > 1 ? 88 : 50;
    const ai_ready_score = breakdowns.seo > 80 ? 94 : 75;

    const baseData = {
      tenant_id: tenantId,
      store_id: storeId,
      launch_score,
      growth_score,
      eu_ready_score,
      loc_ready_score,
      auto_ready_score,
      ai_ready_score,
      breakdowns,
      last_evaluated_at: new Date().toISOString()
    };

    if (current) {
      dbEngine.readiness_scorecards.update(current.id, baseData);
      current = { ...current, ...baseData };
    } else {
      current = dbEngine.readiness_scorecards.create(baseData);
    }

    return current;
  }

  /**
   * Performs an immediate diagnostic optimization action, updates compliance ratings, and registers a brain_event.
   */
  public triggerAutonomicHeal(tenantId: string, storeId: string, actionKey: string): ReadinessScorecard {
    const list = dbEngine.store_contexts.getAll();
    const matched = list.find(s => s.tenant_id === tenantId && s.store_id === storeId);

    if (matched) {
      if (actionKey === 'ACTIVATE_VAT') {
        dbEngine.store_contexts.update(matched.id, {
          is_vat_registered: true,
          compliance_score: 90
        });
      } else if (actionKey === 'EXPAND_SHIPPING_CHANNELS') {
        dbEngine.store_contexts.update(matched.id, {
          shipping_zones_count: 3,
          active_sales_channels: [...matched.active_sales_channels, 'Instagram Checkout'],
          compliance_score: 95
        });
      }
    }

    // Recalculate
    const scorecard = this.evaluateStoreReadiness(tenantId, storeId);

    BrainStreamService.emitEvent(
      'COMPLIANCE_PASS',
      `Autonomic compliance heal executed successfully! Action: ${actionKey}. Overall Launch Score is now ${scorecard.launch_score}%.`,
      'HIGH',
      undefined,
      { heal_action: actionKey }
    );

    return scorecard;
  }
}

export const StoreReadinessEngine = StoreReadinessEngineClass.getInstance();
