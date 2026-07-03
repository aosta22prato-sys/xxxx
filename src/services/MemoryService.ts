import { dbEngine } from '../db/dbEngine';
import { MemoryItem, MemoryLogItem } from '../types';

export class MemoryService {
  private static instance: MemoryService | null = null;

  public static getInstance(): MemoryService {
    if (!MemoryService.instance) {
      MemoryService.instance = new MemoryService();
    }
    return MemoryService.instance;
  }

  /**
   * 1. Memory Retrieval Engine (获取并根据重要性、置信度以及时间衰减排序过滤)
   * 所有 Agent 执行前，必须调用 retrieveContext 以补充上下文
   */
  public retrieveContext(params: {
    merchant_id: string;
    agent_id: string;
    query_text?: string;
    entity_id?: string;
    limit?: number;
  }): {
    contextText: string;
    matchedMemories: MemoryItem[];
  } {
    const { merchant_id, agent_id, query_text, entity_id, limit = 5 } = params;

    // Retrieve memories for this merchant
    let memories = dbEngine.memories.getAll().filter(m => m.merchant_id === merchant_id);

    // Cross-Agent Sharing: All other agents' memories are fully searchable. No silos!
    // We can also prioritize memories matching our entities or content
    if (entity_id) {
      // Prioritize related entity matches
      const entityMatches = memories.filter(m => m.related_entity === entity_id);
      const otherMemories = memories.filter(m => m.related_entity !== entity_id);
      memories = [...entityMatches, ...otherMemories];
    }

    if (query_text) {
      const q = query_text.toLowerCase();
      // Score semantic similarity/keyword overlap simply
      const scoredMemories = memories.map(m => {
        let contentScore = 0;
        if (m.content.toLowerCase().includes(q)) contentScore += 5;
        if (m.related_entity && q.includes(m.related_entity.toLowerCase())) contentScore += 3;
        if (m.source.toLowerCase() === agent_id.toLowerCase()) contentScore += 1; // Prioritize own agent for self-consistency

        // Incorporate Memory Scoring (importance, confidence, recency)
        const baseScore = dbEngine.memories.calculateScore(m);
        const finalScore = baseScore + contentScore;

        return { memory: m, finalScore };
      });

      // Sort by final score descending
      scoredMemories.sort((a, b) => b.finalScore - a.finalScore);
      memories = scoredMemories.map(x => x.memory);
    } else {
      // No query, sort purely by decay score (importance, confidence, recency)
      const scored = memories.map(m => ({
        memory: m,
        score: dbEngine.memories.calculateScore(m)
      })).sort((a, b) => b.score - a.score);
      memories = scored.map(x => x.memory);
    }

    // Limit outputs
    const selected = memories.slice(0, limit);

    // Format context text
    let contextText = '';
    if (selected.length > 0) {
      contextText = `=== [SHARED MEMORIES RETRIEVED BY MEMORY SYSTEM] ===\n`;
      selected.forEach((m, idx) => {
        contextText += `[Memory #${idx + 1}] Type: ${m.memory_type} | Source: ${m.source} | Importance: ${m.importance}/10 | Confidence: ${Math.round(m.confidence * 100)}%\nContent: ${m.content}\nRelated Entity: ${m.related_entity || 'none'}\nCreated At: ${m.created_at}\n-----------------------------------\n`;
      });
    }

    // Audit the retrieval
    dbEngine.memory_logs.create({
      memory_id: selected.map(x => x.memory_id).join(',') || 'none',
      agent: agent_id,
      action: 'RETRACT_QUERY',
      before: { query_text, entity_id },
      after: { matched_count: selected.length }
    });

    return {
      contextText,
      matchedMemories: selected
    };
  }

  /**
   * 2. Memory Writer Engine (保存高置信度与重要度的记忆，支持分类：fact, execution, business, learning)
   */
  public writeMemory(params: {
    merchant_id: string;
    memory_type: 'fact' | 'execution' | 'business' | 'learning';
    source: string;
    content: string;
    importance: number;
    confidence: number;
    related_entity?: string;
  }): MemoryItem {
    const memory = dbEngine.memories.create(params);
    return memory;
  }

  /**
   * 2.1 Write on Tool Execution Completed
   */
  public logToolExecutionMemory(params: {
    merchant_id: string;
    agent: string;
    tool_name: string;
    parameters: any;
    result: any;
    success: boolean;
  }) {
    const { merchant_id, agent, tool_name, parameters, result, success } = params;
    const content = `Agent [${agent}] executed tool [${tool_name}] with parameter: ${JSON.stringify(parameters)}. Outcome success: ${success}. Result preview: ${typeof result === 'object' ? JSON.stringify(result).substring(0, 150) : String(result).substring(0, 150)}`;
    
    this.writeMemory({
      merchant_id,
      memory_type: 'execution',
      source: agent,
      content,
      importance: success ? 5 : 7, // Errors/Failures carry higher importance for warning/learning!
      confidence: 0.95,
      related_entity: tool_name
    });
  }

  /**
   * 2.2 Write on World State Significant Change
   */
  public logWorldStateChangeMemory(params: {
    merchant_id: string;
    metric_changed: string;
    old_value: any;
    new_value: any;
    trigger_source: string;
    severity: 'low' | 'medium' | 'high';
  }) {
    const { merchant_id, metric_changed, old_value, new_value, trigger_source, severity } = params;
    const content = `World State indicator [${metric_changed}] changed from [${old_value}] to [${new_value}] via [${trigger_source}]. Severity index: ${severity}.`;
    
    let importance = 4;
    if (severity === 'medium') importance = 7;
    if (severity === 'high') importance = 9;

    this.writeMemory({
      merchant_id,
      memory_type: 'fact',
      source: 'WorldModel',
      content,
      importance,
      confidence: 0.98,
      related_entity: metric_changed
    });
  }

  /**
   * 2.3 Write on Agent Collaboration Completed
   */
  public logAgentCollaborationMemory(params: {
    merchant_id: string;
    agents_involved: string[];
    task_description: string;
    collaboration_outcome: string;
  }) {
    const { merchant_id, agents_involved, task_description, collaboration_outcome } = params;
    const content = `Multi-Agent joint network collab completed. Agents involved: [${agents_involved.join(', ')}]. Mission: ${task_description}. Final consensus outcome: ${collaboration_outcome}`;
    
    this.writeMemory({
      merchant_id,
      memory_type: 'business',
      source: agents_involved[0] || 'Orchestrator',
      content,
      importance: 7,
      confidence: 0.90,
      related_entity: 'collaboration'
    });
  }

  /**
   * 2.4 Write on Threat/Risk Event Occurred
   */
  public logRiskEventMemory(params: {
    merchant_id: string;
    risk_type: string;
    agent_responder: string;
    threat_details: string;
    mitigation_action: string;
  }) {
    const { merchant_id, risk_type, agent_responder, threat_details, mitigation_action } = params;
    const content = `SECURITY RISK DETECTED: [${risk_type}]. Threat vectors: ${threat_details}. Agent [${agent_responder}] executed action plan: ${mitigation_action}.`;
    
    this.writeMemory({
      merchant_id,
      memory_type: 'learning',
      source: agent_responder,
      content,
      importance: 9, // Threat events carry utmost importance!
      confidence: 0.95,
      related_entity: 'threat_defense'
    });
  }

  /**
   * 2.5 Write on Knowledge Verification Succeeded
   */
  public logKnowledgeVerifiedMemory(params: {
    merchant_id: string;
    source_agent: string;
    rule_or_manual: string;
    verification_clauses: string;
    confidence_multiplier: number;
  }) {
    const { merchant_id, source_agent, rule_or_manual, verification_clauses, confidence_multiplier } = params;
    const content = `Tactical SOP documentation matched and verified. Source rule manual: [${rule_or_manual}]. Extraction detail context: "${verification_clauses}". Verified confidence multiplier: ${confidence_multiplier}`;
    
    this.writeMemory({
      merchant_id,
      memory_type: 'learning',
      source: source_agent,
      content,
      importance: 6,
      confidence: Math.min(1.0, 0.9 * confidence_multiplier),
      related_entity: 'SOP_Verification'
    });
  }

  /**
   * 3. Memory Decay triggers
   */
  public decayOldMemories(): void {
    dbEngine.memories.applyDecay();
  }

  /**
   * 4. Operational Experiences / Digital Twin Memory Alignment
   * Records a distinct operational experience. Used by diagnostics and automated remediation evaluation.
   */
  public commitExperience(
    tenantId: string,
    storeId: string,
    domain: 'pricing' | 'inventory' | 'marketing' | 'tax_compliance' | 'general',
    situation: string,
    intervention: string,
    outcomeScore: number,
    learnedRules: string[]
  ): any {
    const experienceId = `exp_${Math.random().toString(36).substring(2, 9)}`;
    const newExp = {
      id: experienceId,
      tenantId,
      storeId,
      domain,
      situation,
      intervention,
      outcomeScore,
      learnedRules,
      recordedAt: new Date().toISOString()
    };

    // Store in the dbEngine's memory block persistence under learning_experiences
    if (dbEngine.store_digital_twins) {
      const twins = dbEngine.store_digital_twins.getAll();
      const clientTwin = twins.find(x => x.tenant_id === tenantId && x.store_id === storeId);
      if (clientTwin) {
        const curMemory = clientTwin.learned_rules_json ? JSON.parse(clientTwin.learned_rules_json) : [];
        curMemory.push(newExp);
        dbEngine.store_digital_twins.update(clientTwin.id, {
          learned_rules_json: JSON.stringify(curMemory),
          last_snapshot_at: new Date().toISOString()
        });
      }
    }

    // Write to unified Memories database as well so it's fully indexed and searchable!
    this.writeMemory({
      merchant_id: tenantId,
      memory_type: 'learning',
      source: `BrainMemory_${domain}`,
      content: `Situation: ${situation} | Intervention: ${intervention} | Rules: ${learnedRules.join(', ')}`,
      importance: Math.ceil(outcomeScore / 10),
      confidence: 0.95,
      related_entity: domain
    });

    console.log(`[MemoryService] Committed Experience (${domain}): ${situation.substring(0, 50)}...`);
    return newExp;
  }

  /**
   * Retrieves all committed store-level operational experiences
   */
  public queryExperiences(tenantId: string, storeId: string): any[] {
    if (!dbEngine.store_digital_twins) return [];
    const twins = dbEngine.store_digital_twins.getAll();
    const clientTwin = twins.find(x => x.tenant_id === tenantId && x.store_id === storeId);
    if (clientTwin && clientTwin.learned_rules_json) {
      try {
        return JSON.parse(clientTwin.learned_rules_json);
      } catch (err) {
        console.error('[MemoryService] Failed to parse learned rules JSON experience array', err);
        return [];
      }
    }
    return [];
  }

  /**
   * Retrieve the complete digital twin parameters.
   */
  public getDigitalTwinState(tenantId: string, storeId: string) {
    if (!dbEngine.store_digital_twins) return null;
    return dbEngine.store_digital_twins.getAll().find(x => x.tenant_id === tenantId && x.store_id === storeId) || null;
  }
}

export const memoryService = MemoryService.getInstance();
export const brainMemory = MemoryService.getInstance();

