import { dbEngine } from '../../db/dbEngine';
import {
  FashionCategory,
  FashionMaterial,
  FashionStyle,
  MarketTrend,
  TrendSignal,
  Competitor,
  CompetitorProduct,
  CustomerPersona,
  CountryPreference,
  Supplier,
  LeadTimeRule,
  ShippingCostRule
} from '../../types';

export interface FusedIntelligenceContext {
  fashion: {
    matchedCategories: FashionCategory[];
    matchedMaterials: FashionMaterial[];
    matchedStyles: FashionStyle[];
  };
  market: {
    trends: MarketTrend[];
    signals: TrendSignal[];
    marketReportsSummary: string;
  };
  competitors: {
    trackedBrands: {
      name: string;
      brandSegment: string;
      pricingInference: string;
    }[];
  };
  consumer: {
    personas: CustomerPersona[];
    countryPreference?: CountryPreference;
    behaviorSummary: string;
  };
  supply: {
    potentialSuppliers: Supplier[];
    leadTimes: LeadTimeRule[];
    shippingCostRules: ShippingCostRule[];
    strategicAdvice: string;
  };
}

export class KnowledgeFusionEngine {
  private static instance: KnowledgeFusionEngine | null = null;

  private constructor() {}

  public static getInstance(): KnowledgeFusionEngine {
    if (!KnowledgeFusionEngine.instance) {
      KnowledgeFusionEngine.instance = new KnowledgeFusionEngine();
    }
    return KnowledgeFusionEngine.instance;
  }

  /**
   * Evaluates any strategic goal context or campaign title, fusing P1 - P5 European fashion intelligence.
   * Leveraged by Strategy Planner and Goal Orchestrator during strategy design or feedback evaluation.
   */
  public generateFusedContext(campaignTitle: string, targetCountry: string = 'FR'): FusedIntelligenceContext {
    const query = campaignTitle.toLowerCase();
    
    // 1. P1: Fashion Knowledge Fusion
    const allCategories = dbEngine.fashion_categories.getAll();
    const allMaterials = dbEngine.fashion_materials.getAll();
    const allStyles = dbEngine.fashion_styles.getAll();

    // Match categories based on keyword
    const matchedCategories = allCategories.filter(c => 
      query.includes(c.name.toLowerCase()) || c.name.toLowerCase().split(' ').some(word => query.includes(word))
    );
    
    // Match materials
    const matchedMaterials = allMaterials.filter(m => 
      query.includes(m.name.toLowerCase()) || 
      (query.includes('coat') && m.name.includes('Wool')) || // default wool mapping for coat campaigns
      (query.includes('大衣') && m.name.includes('Wool'))
    );

    // Style match
    const matchedStyles = allStyles.filter(s => 
      query.includes(s.name.toLowerCase()) || 
      (targetCountry === 'FR' && s.name.includes('Parisian')) ||
      (query.includes('luxury') && s.name.includes('Luxury'))
    );

    // 2. P2: European Market Intelligence Fusion
    const trends = dbEngine.market_trends.getAll().filter(t => 
      t.country_code.toUpperCase() === targetCountry.toUpperCase() &&
      (matchedCategories.length === 0 || matchedCategories.some(mc => mc.name.toLowerCase() === t.category_name.toLowerCase()))
    );

    const signals = dbEngine.trend_signals.getAll().filter(sig => 
      query.includes(sig.keyword.toLowerCase()) || 
      matchedCategories.some(mc => sig.keyword.toLowerCase().includes(mc.name.toLowerCase()))
    );

    const reports = dbEngine.trend_reports.getAll();
    const marketReportsSummary = reports.length > 0 
      ? reports.map(r => `【${r.title}】${r.summary} 主要发现: ${r.key_findings.join('; ')}`).join('\n')
      : '暂无当前市场专项情报报告。';

    // 3. P3: Competitor Intelligence Fusion
    const competitors = dbEngine.competitors.getAll();
    const cProducts = dbEngine.competitor_products.getAll();
    const cPrices = dbEngine.competitor_prices.getAll();
    const cPromos = dbEngine.competitor_promotions.getAll();

    const trackedBrands = competitors.map(comp => {
      // Find competitor products matching our category
      const associatedProducts = cProducts.filter(p => p.competitor_id === comp.id);
      const saleCount = cPromos.filter(p => p.competitor_id === comp.id).length;
      
      let pricingInference = '无活跃定价监控';
      if (associatedProducts.length > 0) {
        const sampleProd = associatedProducts[0];
        const priceRec = cPrices.find(p => p.competitor_product_id === sampleProd.id);
        pricingInference = priceRec 
          ? `监控单品 "${sampleProd.name}" 标价 €${priceRec.original_price} (当前售价 €${priceRec.current_price}${priceRec.is_on_sale ? ' [打折中]' : ''})`
          : `关联监控单品 "${sampleProd.name}"`;
      }
      if (saleCount > 0) {
        pricingInference += ` 且该品牌近期正在推进 "${cPromos[0].description}"`;
      }

      return {
        name: comp.name,
        brandSegment: comp.brand_segment,
        pricingInference
      };
    });

    // 4. P4: Consumer Intelligence Fusion
    const personas = dbEngine.customer_personas.getAll().filter(p => 
      p.name.includes(targetCountry) || targetCountry === 'FR' // Fallback to french personas if FR is target
    );
    const countryPreference = dbEngine.country_preferences.getByCountry(targetCountry);
    const behaviorSummary = personas.map(p => {
      const bObj = dbEngine.shopping_behaviors.getAll().find(b => b.persona_id === p.id);
      return bObj 
        ? `客群 "${p.name}" 转化流控效率为 ${bObj.conversion_funnel_efficiency}%，退货流动摩擦率为 ${bObj.average_return_rate_pct}%，晚上峰值消费时段段为 ${bObj.peak_shopping_hours.join(', ')} 点`
        : `客群 "${p.name}" 偏好平均客单价级为 $${p.average_order_value}`;
    }).join('\n');

    // 5. P5: Supply Intelligence Fusion
    const potentialSuppliers = dbEngine.suppliers.getAll();
    const leadTimes = dbEngine.lead_time_rules.getAll().filter(lt => 
      lt.destination_country.toUpperCase() === targetCountry.toUpperCase()
    );
    const shippingCostRules = dbEngine.shipping_cost_rules.getAll().filter(sc => 
      sc.destination_country.toUpperCase() === targetCountry.toUpperCase()
    );

    // Compute supply chains warning advice
    let strategicAdvice = '未配置特定直航线路，建议默认采用中欧干线调度。';
    if (leadTimes.length > 0) {
      const bestRoute = leadTimes[0];
      const supplierName = potentialSuppliers.find(s => s.id === bestRoute.supplier_id)?.name || '主要供应商';
      strategicAdvice = `检测到源头工厂直达线：建议由 【${supplierName}】 发往 ${targetCountry}。标准空海运调拨周期为 ${bestRoute.standard_lead_time_days} 天，精干加急航空时效约 ${bestRoute.express_lead_time_days} 天抵达本地。`;
    }

    return {
      fashion: {
        matchedCategories,
        matchedMaterials,
        matchedStyles
      },
      market: {
        trends,
        signals,
        marketReportsSummary
      },
      competitors: {
        trackedBrands
      },
      consumer: {
        personas,
        countryPreference,
        behaviorSummary
      },
      supply: {
        potentialSuppliers,
        leadTimes,
        shippingCostRules,
        strategicAdvice
      }
    };
  }
}

export const knowledgeFusionEngine = KnowledgeFusionEngine.getInstance();
