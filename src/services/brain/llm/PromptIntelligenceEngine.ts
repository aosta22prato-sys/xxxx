import { dbEngine } from '../../../db/dbEngine';
import { BusinessContextEngine } from '../BusinessContextEngine';
import { NextActionEngine } from '../NextActionEngine';

export interface CompiledPromptPayload {
  systemPrompt: string;
  contextDump: string;
  recommendedNextActions: string;
  structuredVariables: {
    tenantId: string;
    storeId: string;
    currentPage: string;
    storeReadiness: number;
    activeGoal: string;
    gapsList: string[];
    criticalRemediation: string;
  };
}

export class PromptIntelligenceEngineClass {
  private static instance: PromptIntelligenceEngineClass;

  private constructor() {}

  public static getInstance(): PromptIntelligenceEngineClass {
    if (!PromptIntelligenceEngineClass.instance) {
      PromptIntelligenceEngineClass.instance = new PromptIntelligenceEngineClass();
    }
    return PromptIntelligenceEngineClass.instance;
  }

  /**
   * Compiles and synthesizes global shop variables, goals, and next-action diagnoses 
   * into a highly directive system prompt tailored for advanced LLM operations.
   */
  public compile(tenantId = 't_retail', storeId = 'store_retail'): CompiledPromptPayload {
    // 1. Fetch unified, singular business context
    const ctx = BusinessContextEngine.getInstance().getCurrentContext(tenantId, storeId);
    
    // 2. Fetch active missions and rules for structural confirmation
    const activeGoalString = ctx.currentGoal;

    // 3. Compile merchant inventory levels & metrics summary
    const prods = dbEngine.products?.getAll() || [];
    const ords = dbEngine.orders?.getAll() || [];
    const activeOrdersCount = ords.filter(o => o.status === 'Pending' || o.status === 'AI Confirmed').length;

    const complianceScore = ctx.readinessScore;

    const systemPrompt = `You are the Shopify Sidekick interface to our Enterprise Operating Brain (AI Commerce OS).
You excel at discussing store metrics, SKU lists, customer logs, outstanding legal registrations, and supply-chain logistics.

STRICT OPERATING BARS:
- Your response MUST focus purely on business execution: inventory management, European tax合规, localized translations, SEO titles, shipping lanes, and merchant KPIs.
- ALWAYS align recommendations with the next-action diagnosis plan.
- DO NOT speak of internal micro-servers, Bayes graph calculations, semantic vector stores, or database schema tables (e.g. do not say "dbEngine has page_contexts", "I queried database"). Keep it humble and professional.
- Refer strictly to the active screen focus: "${ctx.currentPage}"
- Place high value on directing the merchant of their operational readiness: ${complianceScore}% and prompt them to use the interactive "立即执行" command buttons to resolve issues.`;

    // Retrieve active actions from NextActionEngine but synchronized with current page
    const diagnosis = NextActionEngine.diagnose(tenantId, storeId);
    const nextActionsString = diagnosis.actions.map(action => 
      `- **[${action.priority}] ${action.title}**: ${action.description} -> Button Directive: "${action.btnLabel}"`
    ).join('\n');

    const contextDump = `--- SAAS ENTERPRISE BRAIN STATE SNAPSHOT ---
Tenant Identifier: ${ctx.tenantId}
Store Identifier: ${ctx.storeId}
Active Page Focus: ${ctx.currentPage}
Setup Readiness Grade: ${complianceScore}%
Macroscopic Mission: ${activeGoalString}
Pending Sub-orders: ${activeOrdersCount}
Low Stock Products: ${prods.filter(p => p.inventory && p.inventory < 15).length}
Gaps Identified:
${ctx.gaps.map((g, i) => `  ${i + 1}. ${g}`).join('\n')}

Macroscopic Tactical Recommendation:
👉 "${diagnosis.recommendedAction}"`;

    return {
      systemPrompt,
      contextDump,
      recommendedNextActions: nextActionsString,
      structuredVariables: {
        tenantId,
        storeId,
        currentPage: ctx.currentPage,
        storeReadiness: complianceScore,
        activeGoal: activeGoalString,
        gapsList: ctx.gaps,
        criticalRemediation: diagnosis.recommendedAction
      }
    };
  }
}

export const PromptIntelligenceEngine = PromptIntelligenceEngineClass.getInstance();
