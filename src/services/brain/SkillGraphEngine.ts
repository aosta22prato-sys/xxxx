import { dbEngine } from '../../db/dbEngine';
import { SkillGraphNode } from '../../types';

export class SkillGraphEngine {
  private static instance: SkillGraphEngine | null = null;

  private constructor() {}

  public static getInstance(): SkillGraphEngine {
    if (!SkillGraphEngine.instance) {
      SkillGraphEngine.instance = new SkillGraphEngine();
    }
    return SkillGraphEngine.instance;
  }

  /**
   * Action: Register a live operational event and update corresponding business skill node states.
   * This adapts our learning focus directly on core enterprise skills instead of just unstructured data.
   */
  public registerSkillUsage(
    tenantId: string,
    skillKey: 'market_expansion' | 'inventory_optimization' | 'dynamic_pricing' | 'customer_recall' | 'advertising_delivery' | 'margin_management',
    success: boolean,
    revenueGained: number
  ): SkillGraphNode {
    const existing = dbEngine.skill_graph_nodes.getAll().find(s => s.tenant_id === tenantId && s.skill_key === skillKey);

    // Baseline definitions
    let skillName = '未知能力';
    if (skillKey === 'market_expansion') skillName = '市场扩张';
    else if (skillKey === 'inventory_optimization') skillName = '库存优化';
    else if (skillKey === 'dynamic_pricing') skillName = '动态定价';
    else if (skillKey === 'customer_recall') skillName = '客户召回';
    else if (skillKey === 'advertising_delivery') skillName = '广告投放';
    else if (skillKey === 'margin_management') skillName = '利润管理';

    const baselineData = {
      tenant_id: tenantId,
      skill_key: skillKey,
      name: skillName,
      level: 'Novice' as const,
      success_rate: success ? 100 : 0,
      historical_revenue_gain: revenueGained,
      failure_rate: success ? 0 : 100,
      experience_count: 1
    };

    if (!existing) {
      return dbEngine.skill_graph_nodes.create(baselineData);
    }

    // Recalculate metrics
    const totalRuns = existing.experience_count + 1;
    const currentSuccessCount = Math.round((existing.success_rate / 100) * existing.experience_count);
    const newSuccessCount = currentSuccessCount + (success ? 1 : 0);
    const success_rate = Math.round((newSuccessCount / totalRuns) * 100);
    const failure_rate = 100 - success_rate;
    const historical_revenue_gain = existing.historical_revenue_gain + revenueGained;

    // Recalculate ability levels chronologically
    let level: 'Novice' | 'Competent' | 'Advanced' | 'Expert' | 'Master' = 'Novice';
    if (totalRuns > 40) level = 'Master';
    else if (totalRuns > 20) level = 'Expert';
    else if (totalRuns > 10) level = 'Advanced';
    else if (totalRuns > 2) level = 'Competent';

    return dbEngine.skill_graph_nodes.update(existing.id, {
      level,
      success_rate,
      failure_rate,
      historical_revenue_gain,
      experience_count: totalRuns,
      last_used_at: new Date().toISOString()
    });
  }

  /**
   * Return the overall competency summary index of the brain.
   */
  public getSkillNodes(tenantId: string): SkillGraphNode[] {
    const nodes = dbEngine.skill_graph_nodes.getAll().filter(s => s.tenant_id === tenantId);
    if (nodes.length === 0) {
      // Create initial preseed skills
      const initialSkills: Array<'market_expansion' | 'inventory_optimization' | 'dynamic_pricing' | 'customer_recall' | 'margin_management'> = [
        'market_expansion',
        'inventory_optimization',
        'dynamic_pricing',
        'customer_recall',
        'margin_management'
      ];
      initialSkills.forEach(key => {
        let name = '';
        let level: any = 'Competent';
        let success = 80;
        let revenue = 30000;
        let count = 8;

        if (key === 'market_expansion') { name = '市场扩张'; level = 'Expert'; success = 85; revenue = 154000; count = 28; }
        else if (key === 'inventory_optimization') { name = '库存优化'; level = 'Master'; success = 91; revenue = 125000; count = 42; }
        else if (key === 'dynamic_pricing') { name = '动态定价'; level = 'Advanced'; success = 78; revenue = 84000; count = 19; }
        else if (key === 'customer_recall') { name = '客户召回'; level = 'Competent'; success = 58; revenue = 32000; count = 11; }
        else if (key === 'margin_management') { name = '利润管理'; level = 'Expert'; success = 88; revenue = 98000; count = 25; }

        dbEngine.skill_graph_nodes.create({
          tenant_id: tenantId,
          skill_key: key,
          name,
          level,
          success_rate: success,
          historical_revenue_gain: revenue,
          failure_rate: 100 - success,
          experience_count: count
        });
      });
      return dbEngine.skill_graph_nodes.getAll().filter(s => s.tenant_id === tenantId);
    }
    return nodes;
  }
}

export const skillGraphEngine = SkillGraphEngine.getInstance();
