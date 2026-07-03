import { PromptIntelligenceEngine } from './PromptIntelligenceEngine';
import { generateIntelligentLocalReply } from '../../../utils/intelligentFallback';
import { dbEngine } from '../../../db/dbEngine';

export interface ModelOption {
  id: string;
  name: string;
  provider: 'Google' | 'OpenAI' | 'Anthropic' | 'DeepSeek';
  modelAlias: string;
  status: 'active' | 'inactive';
}

export class BrainLLMServiceClass {
  private static instance: BrainLLMServiceClass;
  private currentModelId = 'gemini-2.5-flash';

  private availableModels: ModelOption[] = [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', modelAlias: 'gemini-2.5-flash', status: 'active' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', modelAlias: 'gemini-1.5-pro', status: 'active' },
    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', modelAlias: 'claude-3-5-sonnet', status: 'active' },
    { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'DeepSeek', modelAlias: 'deepseek-chat', status: 'active' }
  ];

  private constructor() {}

  public static getInstance(): BrainLLMServiceClass {
    if (!BrainLLMServiceClass.instance) {
      BrainLLMServiceClass.instance = new BrainLLMServiceClass();
    }
    return BrainLLMServiceClass.instance;
  }

  public getAvailableModels(): ModelOption[] {
    return [...this.availableModels];
  }

  public getActiveModelId(): string {
    return this.currentModelId;
  }

  public setActiveModelId(modelId: string): void {
    if (this.availableModels.some(m => m.id === modelId)) {
      this.currentModelId = modelId;
      console.log(`[LLMOrchestrator] Switched active model paradigm to: "${modelId}"`);
    }
  }

  /**
   * Unified Conversational QA core. Integrates context intelligence compilation 
   * and communicates with backend proxy endpoints to access cloud AI models. 
   * Gracefully degrades to high-fidelity localized simulation if offline.
   */
   public async chat(
    userQuery: string,
    history: Array<{ role: 'user' | 'model'; content: string }>,
    tenantId = 't_retail',
    storeId = 'store_retail',
    activeAgent?: any
  ): Promise<{ text: string; actionType: string; metaObj: any; suggestions: any[]; autoExecute?: boolean; thought?: any }> {
    // 1. Compile contextual state and tailored system prompt
    const promptPayload = PromptIntelligenceEngine.compile(tenantId, storeId);
    
    const rawProducts = dbEngine.products?.getAll() || [];
    const orders = dbEngine.orders?.getAll() || [];
    const customers: any[] = []; 

    // Map strict backend Product definitions to client-side ProductItem definitions expected by intelligent fallback
    const productsMapped = rawProducts.map((p: any) => ({
      id: p.id,
      name: p.name,
      sku: p.sku || 'SKU_GEN_COMPLY',
      stock: p.inventory || 0,
      minStockThreshold: 15,
      price: p.price || 0,
      sales: p.sales || 0,
      status: (p.inventory || 0) > 15 ? 'In Stock' : (p.inventory || 0) > 0 ? 'Low Stock' : 'Out of Stock'
    }));

    try {
      console.log(`[LLMOrchestrator] Offloading query to backend cloud gateway (Model: ${this.currentModelId}, Agent: ${activeAgent?.name || 'Shopify Sidekick'})`);

      const res = await fetch('/api/gemini/agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: activeAgent ? {
            id: activeAgent.id,
            name: activeAgent.name,
            title: activeAgent.title,
            description: activeAgent.description,
            capabilities: activeAgent.capabilities,
            systemPrompt: `${activeAgent.systemPrompt}\n\n${promptPayload.systemPrompt}\n\n${promptPayload.contextDump}`
          } : {
            id: 'sidekick_unified',
            name: 'Shopify Sidekick',
            systemPrompt: `${promptPayload.systemPrompt}\n\n${promptPayload.contextDump}`
          },
          industry: tenantId.replace('t_', ''),
          products: productsMapped,
          orders,
          aiContext: {
            shop: {
              tenantId,
              shopId: storeId,
              shopName: storeId === 'store_retail' ? 'Milan Boutique Hub' : 'Ecos Enterprise',
              primaryLocale: 'it-IT',
              country: 'IT',
              currency: 'EUR',
              industry: tenantId.replace('t_', ''),
              lifecycleStage: 'LIVE'
            },
            user: {
              userId: 'u_admin',
              role: 'ADMINISTRATOR',
              permissions: ['ADMIN_WRITE', 'DB_MUTATE', 'MARKETING_DEPLOY'],
              language: 'zh-CN'
            },
            ui: {
              pageType: 'command'
            },
            metrics: {
              totalSalesToday: orders.reduce((s: number, o: any) => s + (o.total || 0), 0) || 420.00,
              ordersCountToday: orders.length || 3,
              totalSalesThisMonth: 12480.00,
              profitThisMonth: 4368.00,
              lowStockCount: productsMapped.filter((p: any) => p.stock <= 10).length,
              churnedCustomersCount: 3,
              paymentSuccessRate: 98.4,
              refundRate: 1.2,
              activeAIStaffCount: 6
            }
          },
          messages: [
            ...history,
            { role: 'user', content: userQuery }
          ],
          modelAlias: this.availableModels.find(m => m.id === this.currentModelId)?.modelAlias
        })
      });

      if (res.ok) {
        const payload = await res.json();
        if (payload.text) {
          return {
            text: payload.text,
            actionType: payload.actionType || 'none',
            metaObj: payload.actionMeta || null,
            suggestions: payload.suggestions || [],
            autoExecute: payload.autoExecute || false,
            thought: payload.thought || null
          };
        } else if (payload.reply) {
          return {
            text: payload.reply,
            actionType: payload.actionType || 'none',
            metaObj: payload.actionMeta || null,
            suggestions: payload.suggestions || [],
            autoExecute: payload.autoExecute || false,
            thought: payload.thought || null
          };
        }
      }
      throw new Error(`Cloud response did not return clear response lines. Status code: ${res?.status}`);
    } catch (err: any) {
      console.warn(`[LLMOrchestrator] Cloud gateway unavailable, engaging specialized local execution engine:`, err.message);

      // 2. Intelligent, deterministic fallbacks mimicking exact enterprise analysis.
      const localResult = generateIntelligentLocalReply(
        userQuery,
        productsMapped as any,
        orders as any,
        customers,
        {
          currentPage: promptPayload.structuredVariables.currentPage,
          storeReadiness: promptPayload.structuredVariables.storeReadiness,
          gaps: promptPayload.structuredVariables.gapsList,
          recommendedAction: promptPayload.structuredVariables.criticalRemediation
        }
      );

      const lowerQuery = userQuery.toLowerCase();
      const localAutoExecute = 
        lowerQuery.includes('补货') || 
        lowerQuery.includes('一键') || 
        lowerQuery.includes('立即') || 
        lowerQuery.includes('做冬季清仓') || 
        lowerQuery.includes('翻译') || 
        lowerQuery.includes('合规');

      return {
        text: localResult.text,
        actionType: localResult.actionType,
        metaObj: localResult.metaObj,
        suggestions: localResult.suggestions,
        thought: localResult.thought || null,
        autoExecute: localAutoExecute || false
      };
    }
  }
}

export const BrainLLMService = BrainLLMServiceClass.getInstance();
