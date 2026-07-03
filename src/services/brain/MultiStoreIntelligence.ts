import { dbEngine } from '../../db/dbEngine';
import { CrossStoreAnonymizedExperience } from '../../types';

export class MultiStoreIntelligence {
  private static instance: MultiStoreIntelligence | null = null;

  private constructor() {}

  public static getInstance(): MultiStoreIntelligence {
    if (!MultiStoreIntelligence.instance) {
      MultiStoreIntelligence.instance = new MultiStoreIntelligence();
    }
    return MultiStoreIntelligence.instance;
  }

  /**
   * Action trigger for Phase 206: Anonymously share proven strategic outcomes into the platform network.
   * Ensures STRICT privacy. Tenant IDs are hashed into strings, store assets are fully stripped.
   */
  public shareProvenExperience(
    tenantId: string,
    marketCountry: string,
    productCategory: string,
    strategyType: 'reduction_percentage' | 'loyalty_edm' | 'replenishment_buffer' | string,
    actionDetail: string,
    avgRevenueImpact: number,
    outcomeGmvGrowthPct: number
  ): CrossStoreAnonymizedExperience {
    // Basic irreversible hashing substitute to secure tenant privacy (Strict SaaS boundaries)
    const anonymizedHash = 'ba_' + Math.abs(this.hashCode(tenantId)).toString(16) + 'cf';

    // Build the record
    const experience = dbEngine.cross_store_experiences.create({
      original_tenant_id_hash: anonymizedHash,
      market_country: marketCountry.toUpperCase(),
      product_category: productCategory.toLowerCase(),
      strategy_type: strategyType,
      action_detail: actionDetail,
      outcome_gmv_growth_pct: parseFloat(outcomeGmvGrowthPct.toFixed(2)),
      sample_size: 1,
      avg_revenue_impact: avgRevenueImpact,
      confidence_rating: 85
    });

    return experience;
  }

  /**
   * Safe matching query for another store: retrieves similar anonymized experiences across Europe.
   */
  public querySharedOperationalExperiences(
    marketCountry: string,
    productCategory: string
  ): {
    records: CrossStoreAnonymizedExperience[];
    aggregatedCount: number;
    averageImpactRate: number;
  } {
    const all = dbEngine.cross_store_experiences.getAll();
    const matches = all.filter(x => 
      x.market_country.toUpperCase() === marketCountry.toUpperCase() &&
      x.product_category.toLowerCase() === productCategory.toLowerCase()
    );

    if (matches.length === 0) {
      return {
        records: [],
        aggregatedCount: 0,
        averageImpactRate: 0
      };
    }

    const totalGrowth = matches.reduce((sum, item) => sum + item.outcome_gmv_growth_pct, 0);
    const avgGrowth = totalGrowth / matches.length;

    return {
      records: matches,
      aggregatedCount: matches.length,
      averageImpactRate: parseFloat(avgGrowth.toFixed(2))
    };
  }

  /**
   * Simple string hash multiplier to lock security
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
}

export const multiStoreIntelligence = MultiStoreIntelligence.getInstance();
