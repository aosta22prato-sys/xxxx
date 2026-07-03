import { NextActionEngine, BusinessDiagnosis } from './NextActionEngine';
import { PromptIntelligenceEngine, CompiledPromptPayload } from './llm/PromptIntelligenceEngine';
import { BrainLLMService, ModelOption } from './llm/BrainLLMService';
import { BrainRuntime } from './runtime/BrainRuntime';
import { BusinessContextEngine, ConsolidatedContext } from './BusinessContextEngine';
import { eventBus } from '../brain-stream/BrainEventBus';
import { brainMemory } from '../MemoryService';
import { pageContextConnector } from '../sidekick/PageContextConnector';
import { storeStateConnector } from '../sidekick/StoreStateConnector';
import { sidekickResponseEngine, HumanizedResponsePayload } from '../sidekick/SidekickResponseEngine';

export class BrainAPIGatewayClass {
  private static instance: BrainAPIGatewayClass;

  private constructor() {}

  public static getInstance(): BrainAPIGatewayClass {
    if (!BrainAPIGatewayClass.instance) {
      BrainAPIGatewayClass.instance = new BrainAPIGatewayClass();
    }
    return BrainAPIGatewayClass.instance;
  }

  /**
   * Translates current focus status, compiles real-time digital twin state, and outputs humanized merchant-ready advices.
   */
  public getSidekickResponse(activeTab: string, tenantId = 't_retail', storeId = 'store_retail'): HumanizedResponsePayload {
    // 0. Trigger Autonomous Operational Loops (Phase C: Let it run autonomously!)
    try {
      import('../SelfHealingService').then(({ SelfHealingService }) => {
        SelfHealingService.getInstance().runAutonomousOperationalCycle(tenantId, storeId);
      }).catch(() => {});
    } catch (err) {}

    // 1. Sync Page Focus Context
    pageContextConnector.resolvePageContext(activeTab, tenantId, storeId);

    // 2. Synchronize store-level Digital Twin state
    storeStateConnector.compileState(tenantId, storeId);

    // 3. Fetch consolidated contextual facts
    const context = BusinessContextEngine.getInstance().getCurrentContext(tenantId, storeId);

    // 4. Humanize facts for the store builder
    return sidekickResponseEngine.humanize(context);
  }

  /**
   * Single source of truth context provider for any AI agent or UI screen.
   */
  public getCurrentContext(tenantId = 't_retail', storeId = 'store_retail'): ConsolidatedContext {
    return BusinessContextEngine.getInstance().getCurrentContext(tenantId, storeId);
  }

  /**
   * Retrieves immediate tactical actions available for executive execution.
   */
  public getNextActions(tenantId = 't_retail', storeId = 'store_retail') {
    return NextActionEngine.diagnose(tenantId, storeId);
  }

  /**
   * Executes a concrete action triggered by the Merchant's directive button.
   */
  public executeAction(actionCode: string, tenantId = 't_retail', storeId = 'store_retail', payload: any = {}) {
    console.log(`[BrainAPIGateway] Executing corporate directive: "${actionCode}"`);

    // 1. Publish standard event through the nervous system event bus
    eventBus.publish('ACTION_EXECUTED', tenantId, storeId, `Merchant executed standard action "${actionCode}"`, {
      payload,
      triggerType: 'manual_remediation'
    });

    // 2. Log positive enterprise learning experience
    brainMemory.commitExperience(
      tenantId,
      storeId,
      'general',
      `Identified setup gaps resolved by manual executive action`,
      `Executed standard direct remediation action: ${actionCode}`,
      98,
      [`Action ${actionCode} mitigates corresponding digital twin discrepancies`]
    );

    return {
      success: true,
      executedAction: actionCode,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Retrieves current page and business metrics diagnosis including identified gaps and platform corrective actions.
   */
  public queryDiagnosis(tenantId = 't_retail', storeId = 'store_retail'): BusinessDiagnosis {
    return NextActionEngine.diagnose(tenantId, storeId);
  }

  /**
   * Compiles and outputs current system prompt payload representing context state.
   */
  public compileActivePrompt(tenantId = 't_retail', storeId = 'store_retail'): CompiledPromptPayload {
    return PromptIntelligenceEngine.compile(tenantId, storeId);
  }

  /**
   * Returns available models in our LLM Orchestrator.
   */
  public getModels(): ModelOption[] {
    return BrainLLMService.getAvailableModels();
  }

  /**
   * Switches the active LLM provider.
   */
  public switchModel(modelId: string): void {
    BrainLLMService.setActiveModelId(modelId);
  }

  /**
   * Dispatches queries directly through the context compilation and LLM pipelines.
   */
  public async executeChatQuery(
    query: string,
    history: Array<{ role: 'user' | 'model'; content: string }>,
    tenantId = 't_retail',
    storeId = 'store_retail',
    activeAgent?: any
  ) {
    return BrainLLMService.chat(query, history, tenantId, storeId, activeAgent);
  }

  /**
   * Calculates structural cross-system simulation impact based on specific operational missions.
   */
  public calculateCrossSystemImpact(missionId: string) {
    // Standard impact simulations targeting enterprise nodes
    if (missionId.includes('m_01') || missionId.toLowerCase().includes('winter')) {
      return {
        missionId,
        revenueImpact: 48000,
        marginImpact: '-2.5% Temporary / +11.2% Net Recovery',
        inventoryRecovery: 'Clear 70% Overstock (78,715 Winter Units liquidated)',
        cashflowImpact: 65000,
        affectedSystems: ['Products', 'Marketing', 'Finance', 'Warehouse']
      };
    } else if (missionId.includes('m_02') || missionId.toLowerCase().includes('fraud') || missionId.toLowerCase().includes('shield')) {
      return {
        missionId,
        revenueImpact: 12500,
        marginImpact: '0.00% Slip (Zero leak protection secured)',
        inventoryRecovery: 'Defends Cash Ledger (Prevents POS abuse voids)',
        cashflowImpact: 12500,
        affectedSystems: ['Finance', 'Orders', 'Compliance', 'Support']
      };
    } else if (missionId.includes('m_03') || missionId.toLowerCase().includes('vip') || missionId.toLowerCase().includes('reactivation')) {
      return {
        missionId,
        revenueImpact: 32000,
        marginImpact: '+8.50% Average Order Value (LTV boost)',
        inventoryRecovery: 'Redistribute High-margin Premium items (S/M sizing)',
        cashflowImpact: 27000,
        affectedSystems: ['Marketing', 'Customers', 'Products', 'Finance']
      };
    }

    // Default catch-all calculations for dynamic and user-defined goals
    return {
      missionId,
      revenueImpact: 15400,
      marginImpact: '+4.5% Baseline Improvement',
      inventoryRecovery: 'Turn rate increased +18.5%',
      cashflowImpact: 11000,
      affectedSystems: ['Products', 'Finance']
    };
  }
}

export const BrainAPIGateway = BrainAPIGatewayClass.getInstance();
