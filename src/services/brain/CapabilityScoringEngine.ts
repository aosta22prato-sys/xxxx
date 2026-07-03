import { dbEngine } from '../../db/dbEngine';
import { CapabilityScore } from '../../types';

export class CapabilityScoringEngine {
  private static instance: CapabilityScoringEngine | null = null;

  private constructor() {}

  public static getInstance(): CapabilityScoringEngine {
    if (!CapabilityScoringEngine.instance) {
      CapabilityScoringEngine.instance = new CapabilityScoringEngine();
    }
    return CapabilityScoringEngine.instance;
  }

  /**
   * Assess and dynamically recalculate all cognitive capability scores for a tenant.
   * Based on real-time empirical outcomes from strategy plans, results, and memories.
   */
  public assessAllCapabilities(tenantId: string): CapabilityScore[] {
    const existingScores = dbEngine.capability_scores.getAll().filter(s => s.tenant_id === tenantId);

    // Retrieve historical results to compute live feedback parameters
    const results = dbEngine.strategy_results.getAll();
    const outcomes = dbEngine.outcome_memories.getAll().filter(m => m.tenant_id === tenantId);
    const goals = dbEngine.goal_orchestrators.getAll().filter(g => g.tenant_id === tenantId);

    // Calculate baseline multipliers from actual strategic performance
    let inventoryBumps = 0;
    let priceBumps = 0;
    let recallBumps = 0;
    let overallSuccessRatio = 0.82; // standard baseline

    if (results.length > 0) {
      results.forEach(res => {
        if (res.outcome_summary.includes('补货') || res.outcome_summary.includes('库存') || res.outcome_summary.includes('safety')) {
          inventoryBumps += res.revenue_impact > 10000 ? 2 : 1;
        }
        if (res.outcome_summary.includes('改价') || res.outcome_summary.includes('定价') || res.outcome_summary.includes('price')) {
          priceBumps += res.revenue_impact > 5000 ? 1.5 : 0.5;
        }
      });
    }

    if (outcomes.length > 0) {
      const positiveOutcomes = outcomes.filter(o => o.outcome_rating >= 80).length;
      overallSuccessRatio = positiveOutcomes / outcomes.length;
    }

    // List of core capabilities mapped to dynamic parameters
    const capDefinitions = [
      {
        key: 'cap_fr_ops',
        name: '法国市场经营能力',
        category: 'market_operation',
        baseScore: 80,
        bump: priceBumps + (overallSuccessRatio > 0.8 ? 2 : -2),
        strengths: ['法国直邮干线时效高', '大衣等品类降价购买力强', '本地仓容积对折流控制度精细'],
        weaknesses: ['非大货时段的尺码缺损偏多', '客群转化仍存在高额退货摩擦']
      },
      {
        key: 'cap_de_ops',
        name: '德国市场经营能力',
        category: 'market_operation',
        baseScore: 60,
        bump: (overallSuccessRatio > 0.8 ? 1 : -1),
        strengths: ['法德中欧大仓仓储互通顺畅', '首单支付欺诈审核迅速'],
        weaknesses: ['德语区对直接改价的承受弹性差', 'EDM 邀约唤回客群的触达漏洞损毁大']
      },
      {
        key: 'cap_inv_opt',
        name: '库存优化能力',
        category: 'inventory_opt',
        baseScore: 88,
        bump: inventoryBumps + (overallSuccessRatio > 0.85 ? 3 : 0),
        strengths: ['在途补充在库锁定高度一致', '爆品安全库存警戒线自愈灵敏'],
        weaknesses: ['边缘细分 SKU 补给易占压流动资金']
      },
      {
        key: 'cap_cust_rec',
        name: '客户召回能力',
        category: 'customer_recall',
        baseScore: 62,
        bump: (overallSuccessRatio < 0.7 ? -4 : 0.5),
        strengths: ['VVIP 标签归类对齐算法成熟', '复购归因漏斗清晰'],
        weaknesses: ['高净值流失 VIP 的挽留单兵话术略显僵硬', '送达转化率略微下滑']
      }
    ];

    const updatedScores: CapabilityScore[] = [];

    capDefinitions.forEach(def => {
      const match = existingScores.find(s => s.id === def.key);
      const computedScore = Math.min(100, Math.max(10, Math.round(def.baseScore + def.bump)));
      
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (match) {
        if (computedScore > match.score) trend = 'up';
        else if (computedScore < match.score) trend = 'down';
      }

      const payload = {
        name: def.name,
        category: def.category,
        score: computedScore,
        trend,
        strengths: def.strengths,
        weaknesses: def.weaknesses,
        tenant_id: tenantId
      };

      if (match) {
        const updated = dbEngine.capability_scores.update(match.id, payload);
        updatedScores.push(updated);
      } else {
        const created = dbEngine.capability_scores.create({
          ...payload,
          id: def.key
        } as any);
        updatedScores.push(created);
      }
    });

    return updatedScores;
  }

  /**
   * Retrieves the current scores. If none exist, initializes and returns them.
   */
  public getScores(tenantId: string): CapabilityScore[] {
    const scores = dbEngine.capability_scores.getAll().filter(s => s.tenant_id === tenantId);
    if (scores.length === 0) {
      return this.assessAllCapabilities(tenantId);
    }
    return scores;
  }
}

export const capabilityScoringEngine = CapabilityScoringEngine.getInstance();
