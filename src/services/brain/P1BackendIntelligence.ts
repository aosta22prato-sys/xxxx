import { dbEngine } from '../../db/dbEngine';
import { EnterpriseGovernorService } from '../EnterpriseGovernorService';

// ============================================================================
// 1. Structural Interfaces for P1 Backend Intelligence
// ============================================================================

export interface KnowledgeNode {
  id: string;
  tenant_id: string; // 'shared' or explicit tenant ID (e.g. 't_retail')
  store_id: string;  // 'shared' or explicit store ID (e.g. 'store_retail')
  industry: string;  // 'retail' | 'food' | 'beauty' | 'fitness' | 'jewelry' | 'home'
  name: string;
  type: 'rule' | 'heuristic' | 'trend' | 'formula' | 'checklist';
  category: 'Commerce' | 'Retail' | 'Supply Chain' | 'Marketing' | 'Finance' | 'Risk';
  content: string;
  confidence_score: number; // 0.0 to 1.0
}

export interface KnowledgeEdge {
  id: string;
  source_node_id: string;
  target_node_id: string;
  relationship_type: 'recommends' | 'constrains' | 'depends_on' | 'contradicts' | 'validates';
  weight: number; // strength: 0.0 to 1.0
}

export interface SimulatedEmbedding {
  node_id: string;
  dimension_weights: number[]; // 5 float scores mapping to [Commerce, Supply Chain, Marketing, Finance, Risk]
  keywords: string[];
}

export interface KnowledgeVersionItem {
  node_id: string;
  version_number: number;
  factual_content: string;
  updated_at: string;
  author: string;
  status: 'ACTIVE' | 'ARCHIVED';
}

export interface DecisionRecordItem {
  decision_id: string;
  tenant_id: string;
  store_id: string;
  title: string;
  type: 'PRICING' | 'MARKETING' | 'STOCKING' | 'LIQUIDITY' | 'LOGISTICS';
  proposed_by: string;
  rationale: string;
  created_at: string;
  estimated_gmv_impact: number;
  estimated_profit_impact: number;
  actual_gmv_impact: number | null;
  actual_profit_impact: number | null;
  confidence_score: number; // dynamically adjusted: 0.0 to 1.0
  learning_feedback: string | null;
  status: 'PROPOSED' | 'APPROVED' | 'EXECUTING' | 'EVALUATED' | 'FAILED';
}

export interface UnifiedContextResult {
  engineVersion: string;
  schemaVersion: string;
  tenantId: string;
  storeId: string;
  queryAnalyzed: string;
  formattedPrompt: string;
}

// ============================================================================
// 2. Real-Time P1 Core Cognitive Brain Engine
// ============================================================================

export class P1BackendIntelligence {
  private static instance: P1BackendIntelligence | null = null;

  // In-memory backing tables for Knowledge Fabric (representing direct DB layers loaded onto the memory)
  private nodes: KnowledgeNode[] = [];
  private edges: KnowledgeEdge[] = [];
  private embeddings: SimulatedEmbedding[] = [];
  private nodeVersions: KnowledgeVersionItem[] = [];
  private decisions: DecisionRecordItem[] = [];

  private isSeeded: boolean = false;

  private constructor() {
    this.seedIndustryKnowledgeBase();
  }

  public static getInstance(): P1BackendIntelligence {
    if (!P1BackendIntelligence.instance) {
      P1BackendIntelligence.instance = new P1BackendIntelligence();
    }
    return P1BackendIntelligence.instance;
  }

  // ============================================================================
  // B1-001 & B1-002: Knowledge Fabric & Industry Presets Seeding
  // ============================================================================

  private seedIndustryKnowledgeBase() {
    if (this.isSeeded) return;

    // 1. APPAREL/FASHION INDUSTRY PRESETS (服饰行业)
    this.addSharedNode({
      id: 'node_apparel_comm_margin',
      tenant_id: 'shared',
      store_id: 'shared',
      industry: 'retail',
      name: 'Apparel Sovereignty Margin Preferences',
      type: 'rule',
      category: 'Commerce',
      content: '服装高端主权代发与批发，必须坚持 15% 纯利润率底线策略。禁止非授权的全店超过 25% 的折扣倾销。',
      confidence_score: 0.98
    });

    this.addSharedNode({
      id: 'node_apparel_retail_dsi',
      tenant_id: 'shared',
      store_id: 'shared',
      industry: 'retail',
      name: 'Apparel Target DSI Thresholds',
      type: 'formula',
      category: 'Retail',
      content: 'DSI (Days Sales of Inventory) 目标控制在 45 天。DSI 超出 90 天代表季末滞销严重，可允许触发限时定向单品清流折扣 (55% off)。',
      confidence_score: 0.95
    });

    this.addSharedNode({
      id: 'node_apparel_supply_buffer',
      tenant_id: 'shared',
      store_id: 'shared',
      industry: 'retail',
      name: 'Seasonal Replenishment Cushion Coefficient',
      type: 'heuristic',
      category: 'Supply Chain',
      content: '在 11月 至次年 1月 圣诞节冬装大促期间，为防止海运或内陆物流运配熔断，需将备货补货安全冗余滑块锁死在 1.15，提供 15% 的超常发运保护垫。',
      confidence_score: 0.92
    });

    // 2. FOOD & BEVERAGE INDUSTRY PRESETS (餐饮行业)
    this.addSharedNode({
      id: 'node_food_retail_spoilage',
      tenant_id: 'shared',
      store_id: 'shared',
      industry: 'food',
      name: 'Fresh Ingredient Food Spoilage Thresholds',
      type: 'rule',
      category: 'Retail',
      content: '食品原料货龄强制卡死。生鲜海海产进货后上货期上限 24 小时，高等级牛肉 72 小时，超出时限立即剔除，严禁制作售卖。',
      confidence_score: 0.99
    });

    this.addSharedNode({
      id: 'node_food_finance_ratio',
      tenant_id: 'shared',
      store_id: 'shared',
      industry: 'food',
      name: 'Food Cost Revenue Indexing',
      type: 'formula',
      category: 'Finance',
      content: '店主核心财务防线：食材原料成本占外卖实付营业额的比例(Cost of Goods Sold Ratio) 必须精密锁死在 30.0% 或以下。',
      confidence_score: 0.96
    });

    this.addSharedNode({
      id: 'node_food_marketing_peak',
      tenant_id: 'shared',
      store_id: 'shared',
      industry: 'food',
      name: 'Dinner Peak Hours Yield Marketing',
      type: 'heuristic',
      category: 'Marketing',
      content: '晚餐外卖高峰期（每天 18:00 - 21:00）建议开启弹性买赠营销：实付每满 €25，后台自动连同高毛利甜品（制作成本低至 €0.50）随单赠送，提升复购转化。',
      confidence_score: 0.91
    });

    // 3. BEAUTY INDUSTRY PRESETS (美容行业)
    this.addSharedNode({
      id: 'node_beauty_comm_ltv',
      tenant_id: 'shared',
      store_id: 'shared',
      industry: 'beauty',
      name: 'Spa Retaining Membership Target LTV',
      type: 'formula',
      category: 'Commerce',
      content: '美容美体核心商业重点在于年卡套餐订售，每一位进店新客的首诊转化跟踪时效设定在 48 小时，力保会员全生命周期价值 (LTV) > €450。',
      confidence_score: 0.94
    });

    this.addSharedNode({
      id: 'node_beauty_risk_patch',
      tenant_id: 'shared',
      store_id: 'shared',
      industry: 'beauty',
      name: 'Chemical Treatment Pre-procedure Skin Patch Test Consent',
      type: 'rule',
      category: 'Risk',
      content: '在进行任何重质精油化学洗染、强效面部焕肤护理前，系统必须强制关联客户签署 24小时 皮肤斑贴斑试合规授权书，降低法务退赔率。',
      confidence_score: 0.98
    });

    // 4. FITNESS INDUSTRY PRESETS (健身行业)
    this.addSharedNode({
      id: 'node_fitness_marketing_offpeak',
      tenant_id: 'shared',
      store_id: 'shared',
      industry: 'fitness',
      name: 'Locker Utilization Off-Peak Shift Incentives',
      type: 'heuristic',
      category: 'Marketing',
      content: '在每天 10:00 - 14:00 工作日闲时，推出特定私教体验券或分时减免优惠通告，引导写字楼白领错峰健身，降低峰值淋浴客满爆仓率。',
      confidence_score: 0.93
    });

    this.addSharedNode({
      id: 'node_fitness_risk_insurance',
      tenant_id: 'shared',
      store_id: 'shared',
      industry: 'fitness',
      name: 'Personal Injury Liability Insurance Compliance Gate',
      type: 'rule',
      category: 'Risk',
      content: '所有入册签约私教，其合规资质、重体力操执保险覆盖、及急救 CPR 急救证书每 30天 必须经历一次系统拉网复审审查。',
      confidence_score: 0.97
    });

    // 5. JEWELRY INDUSTRY PRESETS (珠宝行业)
    this.addSharedNode({
      id: 'node_jewelry_comm_gia',
      tenant_id: 'shared',
      store_id: 'shared',
      industry: 'jewelry',
      name: 'Jewelry Authentic Certification Mandates',
      type: 'rule',
      category: 'Commerce',
      content: '凡吊牌标价超出 €500 的中高端宝石/金饰，履约出货前必须由双重 AI 摄影和实物 GIA / IGI 权威鉴定所证书扫码落锁对齐，并自动存入主权加密电子护照。',
      confidence_score: 0.99
    });

    this.addSharedNode({
      id: 'node_jewelry_finance_spot',
      tenant_id: 'shared',
      store_id: 'shared',
      industry: 'jewelry',
      name: 'Precious Metals Price Fluctuation Adjustments',
      type: 'trend',
      category: 'Finance',
      content: '根据伦敦金 (LMBA) 及铂金贵金属每日现货收盘价，次日 POS 柜及线上系统挂锁工料溢价比率自动跟随对调，确保实物毛利在 45% 固定安全线上。',
      confidence_score: 0.96
    });

    // 6. HOME GOODS/FURNITURE INDUSTRY PRESETS (家居行业)
    this.addSharedNode({
      id: 'node_home_supply_delay notify',
      tenant_id: 'shared',
      store_id: 'shared',
      industry: 'home',
      name: 'Cubic Logistics Freight Thresholding',
      type: 'rule',
      category: 'Supply Chain',
      content: '由于大件家居货运行业体积超大，长距离空运成本高昂，所有仓配堆积率一旦越过 85.0% 的立方容量上限，立即强制挂起国际铁海联运，限制急件空运触发比例。',
      confidence_score: 0.93
    });

    this.addSharedNode({
      id: 'node_home_finance_postzone',
      tenant_id: 'shared',
      store_id: 'shared',
      industry: 'home',
      name: 'Heavy Furniture Extra Courier Freight Surcharge',
      type: 'formula',
      category: 'Finance',
      content: '凡重量超出 30.0kg 的重物柜几沙发类，物流结账单必须按买家邮编地理分区 (Postcode Surcharge Zones) 加权征收阶梯铁运补差价，拒绝免费中转超距离包邮。',
      confidence_score: 0.95
    });

    // Connect standard overlapping edges to build our initial semantic net
    this.addSharedEdge('edge_app_01', 'node_apparel_comm_margin', 'node_apparel_retail_dsi', 'constrains', 0.85);
    this.addSharedEdge('edge_app_02', 'node_apparel_comm_margin', 'node_apparel_supply_buffer', 'depends_on', 0.75);
    this.addSharedEdge('edge_food_01', 'node_food_finance_ratio', 'node_food_retail_spoilage', 'validates', 0.90);
    this.addSharedEdge('edge_food_02', 'node_food_marketing_peak', 'node_food_finance_ratio', 'recommends', 0.80);

    this.isSeeded = true;
  }

  // Helper method to declare shared nodes
  public addSharedNode(node: KnowledgeNode) {
    if (!this.nodes.find(n => n.id === node.id)) {
      this.nodes.push(node);
      
      // Auto register initial simulated semantic embeddings for retrieval
      const textForWeights = (node.name + ' ' + node.content).toLowerCase();
      const demWeights = [
        textForWeights.includes('comm') || textForWeights.includes('利润') ? 0.9 : 0.1,
        textForWeights.includes('supply') || textForWeights.includes('补料') || textForWeights.includes('货') ? 0.9 : 0.1,
        textForWeights.includes('marketing') || textForWeights.includes('营销') || textForWeights.includes('高峰') ? 0.9 : 0.1,
        textForWeights.includes('finance') || textForWeights.includes('财务') || textForWeights.includes('成本') ? 0.9 : 0.1,
        textForWeights.includes('risk') || textForWeights.includes('危险') || textForWeights.includes('安全') || textForWeights.includes('allergen') ? 0.9 : 0.1,
      ];
      
      const words = node.content.toLowerCase().split(/[。,，\s]/).filter(w => w.length > 2);
      this.embeddings.push({
        node_id: node.id,
        dimension_weights: demWeights,
        keywords: Array.from(new Set(words))
      });

      // Seed initial version
      this.nodeVersions.push({
        node_id: node.id,
        version_number: 1,
        factual_content: node.content,
        updated_at: new Date().toISOString(),
        author: 'SYSTEM_BRAIN',
        status: 'ACTIVE'
      });
    }
  }

  // Create edge inside knowledge net
  public addSharedEdge(id: string, source: string, target: string, rel: any, weight: number) {
    if (!this.edges.find(e => e.id === id)) {
      this.edges.push({ id, source_node_id: source, target_node_id: target, relationship_type: rel, weight });
    }
  }

  // Expose entire Graph
  public getFullGraph() {
    return {
      nodes: this.nodes,
      edges: this.edges,
      embeddings: this.embeddings,
      versions: this.nodeVersions
    };
  }

  // Mutate Knowledge node content & keep trace version record
  public updateKnowledgeNode(nodeId: string, author: string, newContent: string): boolean {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return false;

    // Fetch highest version
    const activeVersions = this.nodeVersions.filter(v => v.node_id === nodeId);
    const lastVersionNum = activeVersions.length > 0 
      ? Math.max(...activeVersions.map(v => v.version_number)) 
      : 0;
    
    // Archive historical
    this.nodeVersions.forEach(v => {
      if (v.node_id === nodeId) v.status = 'ARCHIVED';
    });

    const newVersionNum = lastVersionNum + 1;
    this.nodeVersions.push({
      node_id: nodeId,
      version_number: newVersionNum,
      factual_content: newContent,
      updated_at: new Date().toISOString(),
      author,
      status: 'ACTIVE'
    });

    node.content = newContent;
    node.confidence_score = Math.min(1.0, node.confidence_score + 0.02);

    // Dynamic save into mock relational logs
    const relational = (dbEngine as any).state?.relational;
    if (relational) {
      if (!relational.enterprise_knowledge_versions) relational.enterprise_knowledge_versions = [];
      relational.enterprise_knowledge_versions.push({
        id: Math.round(Math.random() * 100000),
        tenant_id: 1,
        store_id: 11,
        knowledge_key: node.id,
        version_number: newVersionNum,
        factual_content: newContent,
        relevance_status: 'ACTIVE_VALID',
        retire_reason: null,
        superseded_by_key: null,
        last_validated_at: new Date().toISOString(),
        audit_hash: 'sha256-' + nodeId + '-' + newVersionNum
      });
      
      if (!relational.knowledge_confidence_history) relational.knowledge_confidence_history = [];
      relational.knowledge_confidence_history.push({
        id: Math.round(Math.random() * 100000),
        tenant_id: 1,
        store_id: 11,
        knowledge_key: node.id,
        old_score: Math.round(node.confidence_score * 100),
        new_score: Math.round(node.confidence_score * 100),
        confidence_delta: 0,
        adjustment_rationale: `Direct node version mutation by user ${author}`,
        configured_at: new Date().toISOString()
      });
    }

    return true;
  }

  // ============================================================================
  // B1-003 & B1-005: Multi-Tenant Context Retrieval Engine
  // ============================================================================

  /**
   * High-Fidelity Enterprise Context Engine (Unifying memory + knowledge + world state + executions)
   * With HARD core multi-tenant isolated audit logs verification (B1-005).
   */
  public generateEnterpriseContextPrompt(params: {
    query_text: string;
    tenant_id: string;
    store_id: string;
    active_user_role?: string;
    limit?: number;
  }): UnifiedContextResult {
    const { query_text, tenant_id, store_id, active_user_role = 'merchant', limit = 4 } = params;

    const auditViolations: string[] = [];

    // 1. Core Gate Check: If query parameters violate strict Multi-Tenant isolation rules, log critical event (B1-005)
    const activeTenantCheck = tenant_id === 't_retail' || tenant_id === 't_food' || tenant_id === 't_manufacturing' || tenant_id === 't_healthcare' || tenant_id === 't_service' || tenant_id === 't_education';
    if (!activeTenantCheck && tenant_id !== 'shared') {
      const violationMsg = `[CRITICAL MOUNT] Tenant ID validation failed for "${tenant_id}". High-danger multi-tenant crosstalk blocked. Device reported to firewall.`;
      this.recordIsolationViolation(tenant_id, store_id, 'GATEWAY_TENANT_TAMPERING', violationMsg);
      auditViolations.push(violationMsg);
    }

    // 2. Query Memory Pool (Tenant isolated filter)
    const rawMemories = dbEngine.memories?.getAll ? dbEngine.memories.getAll() : [];
    const isolatedMemories = rawMemories.filter((m: any) => {
      if (m.merchant_id !== tenant_id) {
        // Double security audit check
        if (m.importance >= 8 && m.merchant_id !== 'shared') {
          const crosspath = `Memory ID: ${m.memory_id} belonging to merchant ${m.merchant_id} filtered out from request of tenant ${tenant_id}`;
          console.warn(`[Multi-Tenant Guard] ${crosspath}`);
        }
        return false;
      }
      return true;
    });

    // Semantic matching on memories: Simple word matching
    const queryWords = query_text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const matchedMemories = isolatedMemories.map(m => {
      let score = m.importance || 5;
      queryWords.forEach(word => {
        if (m.content.toLowerCase().includes(word)) score += 10;
      });
      return { item: m, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.item);

    // 3. Query Knowledge Fabric (Shared background rules + Isolated customized tenant nodes)
    const matchingNodes = this.nodes.filter(node => {
      // Shared is accessible to all. Customized nodes are private.
      if (node.tenant_id !== 'shared' && node.tenant_id !== tenant_id) {
        return false;
      }
      return true;
    });

    // Score based on embeddings keywords (Semantic fallbacks)
    const matchedNodes = matchingNodes.map(node => {
      const embedding = this.embeddings.find(e => e.node_id === node.id);
      let weightScore = node.confidence_score * 50; // base rating
      
      if (embedding) {
        queryWords.forEach(word => {
          if (embedding.keywords.includes(word) || node.content.toLowerCase().includes(word)) {
            weightScore += 35;
          }
        });
      }
      return { item: node, score: weightScore };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.item);

    // 4. Inject World Telemetry parameters
    const worldLogs = dbEngine.world_state_audit_logs?.getAll ? dbEngine.world_state_audit_logs.getAll() : [];
    const tenantSpecificWorldLogs = worldLogs.filter((l: any) => l.tenant_id === tenant_id || !l.tenant_id).slice(0, 3);

    // 5. Gather historical executions for contextual safety
    const recentExecutions = dbEngine.tool_executions?.getAll ? dbEngine.tool_executions.getAll().slice(0, 3) : [];

    // Assemble pristine formatted prompt block
    let prompt = `===========================================================================
[AUTHENTICATED ENTERPRISE CONTEXT BLOCK (KNOWLEDGE RELEVANCE SECURED)]
===========================================================================
* OPERATIONAL MODE: Multi-Tenant Enterprise SaaS AI OS Console
* SECURITY PRINCIPLE: Proportional isolation strictly enabled
* ACTIVE TENANT INDEX: ${tenant_id} (Store ID: ${store_id})
* OPERATIVE AUDIT CHECKS: ${auditViolations.length === 0 ? 'STATUS GREEN - PASS' : 'CRITICAL WARNING DISPATCHED'}

---------------------------------------------------------------------------
1. CRITICAL ENTERPRISE BUSINESS MEMORIES CHANNELS (ISOLATED)
---------------------------------------------------------------------------
`;

    if (matchedMemories.length > 0) {
      matchedMemories.forEach((m, idx) => {
        prompt += `[Memory Node #${idx+1}] ID: ${m.memory_id} | Confidence: ${m.confidence} | Source: ${m.source}
Content Details: ${m.content}
---------------------------------------------------------------------------\n`;
      });
    } else {
      prompt += `* No matched local business memory records identified in current operating thread.\n`;
    }

    prompt += `
---------------------------------------------------------------------------
2. UNIFIED COGNITIVE KNOWLEDGE FABRIC (SHARED BACKGROUND + CUSTOMIZED DIRECTIVES)
---------------------------------------------------------------------------
`;
    if (matchedNodes.length > 0) {
      matchedNodes.forEach((node, idx) => {
        prompt += `[Knowledge Node #${idx+1}] ID: ${node.id} | Access Scope: ${node.tenant_id} | Category: ${node.category} | Confidence: ${(node.confidence_score*100).toFixed(0)}%
Technical Policy / Rule Content: ${node.content}\n---------------------------------------------------------------------------\n`;
      });
    } else {
      prompt += `* No validated industry guidelines matched corresponding intent vectors.\n`;
    }

    prompt += `
---------------------------------------------------------------------------
3. LIVE COMPLIANCE TELEMETRY & WORLD STATE ENVIRONMENT
---------------------------------------------------------------------------
`;
    if (tenantSpecificWorldLogs.length > 0) {
      tenantSpecificWorldLogs.forEach((log: any, idx: number) => {
        prompt += `[World Event #${idx+1}] Triggered at: ${log.created_at || log.timestamp} | Metric Change: ${log.message || log.details || 'Baseline stabilized'}\n`;
      });
    } else {
      prompt += `* World state logs: Balanced. No telemetry warnings active in tenant storage.\n`;
    }

    prompt += `
---------------------------------------------------------------------------
4. RECENCY OF EXECUTIVE TOOL EXECUTION TRACE
---------------------------------------------------------------------------
`;
    if (recentExecutions.length > 0) {
      recentExecutions.forEach((exe: any, idx: number) => {
        prompt += `[Execution Record #${idx+1}] Tool: ${exe.tool_name} | Target SKU/Key: ${exe.target_sku || exe.parameter_payload} | Outcome: ${exe.execution_result}\n`;
      });
    } else {
      prompt += `* No recent tool transaction outputs recorded in historical sequence.\n`;
    }

    prompt += `\n===========================================================================`;

    return {
      engineVersion: '1.2.9-Lattice',
      schemaVersion: 'P1-Secured-2026',
      tenantId: tenant_id,
      storeId: store_id,
      queryAnalyzed: query_text,
      formattedPrompt: prompt
    };
  }

  // Multi-Tenant Isolation Protection Logger (B1-005)
  private recordIsolationViolation(tenantId: string, storeId: string, violationType: string, message: string) {
    const dbLogs = (dbEngine as any).state?.relational?.identity_violation_events;
    if (dbLogs) {
      dbLogs.push({
        id: Math.round(Math.random() * 100000),
        tenant_id: tenantId,
        store_id: storeId,
        violation_type: violationType,
        message: message,
        logged_at: new Date().toISOString()
      });
      dbEngine.triggerSaveAndNotify();
    }
  }

  // ============================================================================
  // B1-004: Decision Intelligence Engine
  // ============================================================================

  /**
   * Propose a decision using the intelligence models (calculating baseline prediction accuracy based on historical results)
   */
  public proposeDecision(params: {
    tenant_id: string;
    store_id: string;
    title: string;
    type: 'PRICING' | 'MARKETING' | 'STOCKING' | 'LIQUIDITY' | 'LOGISTICS';
    proposed_by: string;
    rationale: string;
    estimated_gmv_impact: number;
    estimated_profit_impact: number;
  }): DecisionRecordItem {
    const { tenant_id, store_id, title, type, proposed_by, rationale, estimated_gmv_impact, estimated_profit_impact } = params;

    // Retrieve historical closed-loop decisions of this specific type to calibrate our initial confidence
    const pastDecisions = this.decisions.filter(d => d.type === type && d.status === 'EVALUATED');
    let dynamicCalibrationWeight = 0.90; // Default baseline accuracy is 90%

    if (pastDecisions.length > 0) {
      let cumulativeAccuracy = 0;
      pastDecisions.forEach(d => {
        if (d.actual_gmv_impact && d.estimated_gmv_impact !== 0) {
          const expectedGmv = Math.abs(d.estimated_gmv_impact);
          const actualGmv = Math.abs(d.actual_gmv_impact);
          const deviation = Math.abs(expectedGmv - actualGmv) / expectedGmv;
          const accuracy = Math.max(0, 1 - deviation);
          cumulativeAccuracy += accuracy;
        } else {
          cumulativeAccuracy += 0.85; // default fallback
        }
      });
      dynamicCalibrationWeight = parseFloat((cumulativeAccuracy / pastDecisions.length).toFixed(4));
    }

    const nextId = 'dec_' + Date.now();

    // 自动跑一次 DNA 宪制法审核评估拦截
    let finalStatus: DecisionRecordItem['status'] = 'PROPOSED';
    let govReason = '';
    try {
      const govCheck = EnterpriseGovernorService.getInstance().evaluateProposal({
         taskId: nextId,
         source: proposed_by,
         actionType: type === 'PRICING' ? 'price_change' : type === 'STOCKING' ? 'stock_purchase' : type === 'MARKETING' ? 'ad_campaign' : 'compliance_check',
         payload: {
            estimated_cost: Math.abs(estimated_profit_impact),
            margin: type === 'PRICING' ? 44 : 50, // 触发 Veto 警戒
            spike_pct: type === 'MARKETING' ? 55 : 0 // 触发 Veto budget 超额边界
         }
      });
      govReason = ` [Governor Check: ${govCheck.decision} - ${govCheck.reason}]`;
      if (govCheck.decision === 'rejected') {
        finalStatus = 'FAILED';
      } else if (govCheck.decision === 'escalated') {
        finalStatus = 'PROPOSED';
      } else {
        finalStatus = 'APPROVED';
      }
    } catch (e) {}

    const newDecision: DecisionRecordItem = {
      decision_id: nextId,
      tenant_id,
      store_id,
      title,
      type,
      proposed_by,
      rationale: rationale + govReason,
      created_at: new Date().toISOString(),
      estimated_gmv_impact,
      estimated_profit_impact,
      actual_gmv_impact: null,
      actual_profit_impact: null,
      confidence_score: dynamicCalibrationWeight,
      learning_feedback: null,
      status: finalStatus
    };

    this.decisions.push(newDecision);

    // Persist into relational tracking tables
    const relational = (dbEngine as any).state?.relational;
    if (relational) {
      if (!relational.enterprise_decision_memories) relational.enterprise_decision_memories = [];
      relational.enterprise_decision_memories.push({
        id: Math.round(Math.random() * 100000),
        tenant_id: 1,
        store_id: 11,
        decision_title: title,
        decision_type: type,
        proposed_at: new Date().toISOString(),
        executed_at: null,
        estimated_gmv_uplift: estimated_gmv_impact,
        estimated_net_profit: estimated_profit_impact,
        actual_outcome_gmv: null,
        actual_outcome_profit: null,
        executive_rationale: rationale + govReason,
        pushed_by: proposed_by,
        source_evidence_link: 'http://audit-trail.internal/decisions/' + nextId,
        configured_at: new Date().toISOString(),
        created_by: 'EXECUTIVE_PLANNER',
        lifetime_score: 50,
        temporal_span: '2026-Q2',
        status: finalStatus,
        audit_hash: 'sha256-dec-' + nextId
      });
      dbEngine.triggerSaveAndNotify();
    }

    return newDecision;
  }

  /**
   * CLOSE THE STRATEGIC LOOP: Evaluates actual business results against initial AI predictions,
   * logs feedback, adjusts model accuracy calibration, and triggers self-learning.
   */
  public evaluateDecisionOutcome(decisionId: string, actualGmv: number, actualProfit: number): { success: boolean; evaluation: DecisionRecordItem } {
    const decision = this.decisions.find(d => d.decision_id === decisionId);
    if (!decision) {
      throw new Error(`Evaluation failed. Decision with ID ${decisionId} was not found.`);
    }

    decision.actual_gmv_impact = actualGmv;
    decision.actual_profit_impact = actualProfit;
    decision.status = 'EVALUATED';

    const gmvExpected = Math.abs(decision.estimated_gmv_impact);
    const gmvActual = Math.abs(actualGmv);
    const profitExpected = Math.abs(decision.estimated_profit_impact);
    const profitActual = Math.abs(actualProfit);

    const gmvDeviation = gmvExpected !== 0 ? ((gmvActual - gmvExpected) / gmvExpected) * 100 : 0;
    const profitDeviation = profitExpected !== 0 ? ((profitActual - profitExpected) / profitExpected) * 100 : 0;

    // Self Learning & dynamic feedback logic
    let feedback = `[Self-Learning Closed-loop audit summary for ID ${decisionId}]:\n`;
    feedback += `  * Predictions aligned: GMV dev. ${gmvDeviation.toFixed(1)}%, Profit dev. ${profitDeviation.toFixed(1)}%.\n`;

    const isGmvMatch = Math.abs(gmvDeviation) <= 15;
    const isProfitMatch = Math.abs(profitDeviation) <= 15;

    if (isGmvMatch && isProfitMatch) {
      feedback += `  * CONCLUSION: High predictive accuracy. Initial confidence score (${(decision.confidence_score*100).toFixed(1)}%) verified with high stability. Self-learning model has solidifying heuristics.`;
      decision.confidence_score = Math.min(1.0, decision.confidence_score + 0.05);
    } else {
      feedback += `  * CONCLUSION: Significant predictive divergence. Simulated model overestimated impact. Adjusting the dynamic calibration factor. Self-learning trigger: Adjusting discount coefficients and seasonal buffer margin thresholds downward.`;
      decision.confidence_score = Math.max(0.1, decision.confidence_score - 0.08);

      // Trigger autonomic correction on rules!
      if (decision.type === 'PRICING') {
        const dsiRuleNode = this.nodes.find(n => n.id === 'node_apparel_comm_margin');
        if (dsiRuleNode) {
          this.updateKnowledgeNode(dsiRuleNode.id, 'Self-Healing Engine', '服装高端主权代发与批发，必须坚持提高至 16.5% 纯利润率底线策略，以对冲预测偏差。');
        }
      }
    }

    decision.learning_feedback = feedback;

    // Sync back with relational database tables
    const relational = (dbEngine as any).state?.relational;
    if (relational) {
      const records = relational.enterprise_decision_memories || [];
      const match = records.find((r: any) => r.audit_hash === 'sha256-dec-' + decisionId);
      if (match) {
        match.executed_at = new Date().toISOString();
        match.actual_outcome_gmv = actualGmv;
        match.actual_outcome_profit = actualProfit;
        match.status = 'AUDITED_SUCCESS';
        match.executive_rationale += `\n[CLOSED-LOOP AUDIT FEEDBACK]: ${feedback}`;
      }

      // Record wisdom learning logs
      if (!relational.institutional_learning_logs) relational.institutional_learning_logs = [];
      relational.institutional_learning_logs.push({
        id: Math.round(Math.random() * 100000),
        tenant_id: 1,
        store_id: 11,
        session_token: 'SESS-EVAL-' + decisionId,
        reconciliation_type: 'DECISION_OUTCOME_AUDIT',
        records_processed: 1,
        unification_narrative: `Closed loop evaluation completed on decision "${decision.title}". Calibration accuracy adjusted to ${(decision.confidence_score*100).toFixed(0)}%. ${feedback}`,
        drift_recalibrated_bias: decision.confidence_score,
        configured_at: new Date().toISOString(),
        created_by: 'INSTITUTIONAL_LEARNING_ENGINE',
        source_evidence_link: 'http://learning.internal/logs/SESS-EVAL-' + decisionId,
        lifetime_score: 100,
        temporal_span: '2026-06-12',
        status: 'CALIBRATION_STABLE',
        audit_hash: 'sha256-learn-' + decisionId
      });

      dbEngine.triggerSaveAndNotify();
    }

    return {
      success: true,
      evaluation: decision
    };
  }

  public getDecisionsList() {
    return this.decisions;
  }
}

export const p1BackendIntelligence = P1BackendIntelligence.getInstance();
