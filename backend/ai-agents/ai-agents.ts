/**
 * AI Agents - Intelligent Process Orchestrators
 * Sit on top of Business Brain to handle complex multi-step processes
 */

import { businessBrain, BusinessContext, BusinessDecision } from '../business-brain';
import { executionKernel, ActionRecord, eventBus, logger } from '../execution-kernel';

export interface AgentTask {
  id: string;
  name: string;
  description: string;
  steps: AgentStep[];
  context: BusinessContext;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number; // 0-100
  startTime?: number;
  endTime?: number;
}

export interface AgentStep {
  id: string;
  name: string;
  decision?: BusinessDecision;
  actions?: ActionRecord[];
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  result?: any;
  error?: string;
}

export interface AgentConfig {
  maxRetries: number;
  timeout: number;
  parallel: boolean;
  autorecover: boolean;
}

/**
 * Base AI Agent Class
 */
export abstract class AIAgent {
  protected id: string;
  protected name: string;
  protected tasks: Map<string, AgentTask> = new Map();
  protected config: AgentConfig;

  constructor(id: string, name: string, config?: Partial<AgentConfig>) {
    this.id = id;
    this.name = name;
    this.config = {
      maxRetries: 3,
      timeout: 60000,
      parallel: false,
      autorecover: true,
      ...config
    };

    logger.info('AIAgent', `Agent initialized: ${name}`, { agentId: id });
  }

  /**
   * Execute task
   */
  async executeTask(task: AgentTask): Promise<AgentTask> {
    task.status = 'running';
    task.startTime = Date.now();

    console.log(`\n[${this.name}] Executing task: ${task.name}`);

    try {
      // Execute steps
      const executionMode = this.config.parallel ? 'parallel' : 'sequential';
      console.log(`   Mode: ${executionMode}`);

      if (this.config.parallel) {
        await this.executeStepsParallel(task);
      } else {
        await this.executeStepsSequential(task);
      }

      task.status = 'completed';
      task.progress = 100;
      console.log(`✅ Task completed: ${task.name}`);
    } catch (error) {
      task.status = 'failed';
      console.error(`❌ Task failed: ${task.name}`, error);

      if (this.config.autorecover) {
        await this.handleFailure(task, error as Error);
      }
    } finally {
      task.endTime = Date.now();
      this.tasks.set(task.id, task);
    }

    return task;
  }

  /**
   * Execute steps sequentially
   */
  protected async executeStepsSequential(task: AgentTask): Promise<void> {
    for (let i = 0; i < task.steps.length; i++) {
      const step = task.steps[i];
      console.log(`   Step ${i + 1}/${task.steps.length}: ${step.name}`);

      try {
        step.status = 'running';

        // Make decision through Business Brain
        const decision = await this.makeDecision(step, task.context);
        step.decision = decision;

        // Execute through Execution Kernel
        if (decision.actions.length > 0) {
          const results = await executionKernel.execute(
            decision.actions,
            task.context,
            { parallel: false, timeout: this.config.timeout }
          );

          step.result = results;
          step.status = 'completed';
        } else {
          step.status = 'skipped';
        }

        task.progress = ((i + 1) / task.steps.length) * 100;
      } catch (error) {
        step.status = 'failed';
        step.error = (error as Error).message;
        throw error;
      }
    }
  }

  /**
   * Execute steps in parallel
   */
  protected async executeStepsParallel(task: AgentTask): Promise<void> {
    const stepPromises = task.steps.map(async (step, index) => {
      try {
        step.status = 'running';
        console.log(`   Step ${index + 1}: ${step.name} (parallel)`);

        const decision = await this.makeDecision(step, task.context);
        step.decision = decision;

        if (decision.actions.length > 0) {
          const results = await executionKernel.execute(
            decision.actions,
            task.context,
            { parallel: true, timeout: this.config.timeout }
          );

          step.result = results;
          step.status = 'completed';
        } else {
          step.status = 'skipped';
        }
      } catch (error) {
        step.status = 'failed';
        step.error = (error as Error).message;
      }
    });

    await Promise.all(stepPromises);
    task.progress = 100;
  }

  /**
   * Make decision for step - to be overridden by subclasses
   */
  protected abstract makeDecision(
    step: AgentStep,
    context: BusinessContext
  ): Promise<BusinessDecision>;

  /**
   * Handle task failure
   */
  protected async handleFailure(task: AgentTask, error: Error): Promise<void> {
    logger.error('AIAgent', `Handling failure for task: ${task.name}`, error);
    // Subclasses can override for custom recovery
  }

  /**
   * Get task status
   */
  getTask(taskId: string): AgentTask | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Get all tasks
   */
  getTasks(limit: number = 100): AgentTask[] {
    return Array.from(this.tasks.values()).slice(-limit);
  }

  /**
   * Get statistics
   */
  getStats() {
    const tasks = Array.from(this.tasks.values());
    return {
      agentId: this.id,
      agentName: this.name,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.status === 'completed').length,
      failedTasks: tasks.filter((t) => t.status === 'failed').length,
      successRate: tasks.length > 0
        ? (tasks.filter((t) => t.status === 'completed').length / tasks.length) * 100
        : 0
    };
  }
}

/**
 * Order Processing Agent - Handles complex order workflows
 */
export class OrderProcessingAgent extends AIAgent {
  constructor() {
    super('agent_order_processing', 'Order Processing Agent', {
      maxRetries: 3,
      timeout: 120000,
      parallel: false,
      autorecover: true
    });
  }

  protected async makeDecision(
    step: AgentStep,
    context: BusinessContext
  ): Promise<BusinessDecision> {
    // Delegate to Business Brain
    const situation = { stepName: step.name, stepId: step.id };
    return businessBrain.makeDecision(situation, context);
  }

  /**
   * Create order processing task
   */
  createOrderProcessingTask(orderId: string, orderData: any, context: BusinessContext): AgentTask {
    return {
      id: `task_order_${Date.now()}`,
      name: `Process Order ${orderId}`,
      description: `Complete order processing workflow for ${orderId}`,
      steps: [
        {
          id: `step_validate`,
          name: 'Validate Order',
          status: 'pending'
        },
        {
          id: `step_check_inventory`,
          name: 'Check Inventory',
          status: 'pending'
        },
        {
          id: `step_reserve_items`,
          name: 'Reserve Items',
          status: 'pending'
        },
        {
          id: `step_process_payment`,
          name: 'Process Payment',
          status: 'pending'
        },
        {
          id: `step_create_shipment`,
          name: 'Create Shipment',
          status: 'pending'
        },
        {
          id: `step_notify_customer`,
          name: 'Notify Customer',
          status: 'pending'
        }
      ],
      context,
      status: 'pending',
      progress: 0
    };
  }
}

/**
 * Inventory Management Agent - Handles stock optimization
 */
export class InventoryManagementAgent extends AIAgent {
  constructor() {
    super('agent_inventory', 'Inventory Management Agent', {
      maxRetries: 2,
      timeout: 60000,
      parallel: true,
      autorecover: true
    });
  }

  protected async makeDecision(
    step: AgentStep,
    context: BusinessContext
  ): Promise<BusinessDecision> {
    const situation = { stepName: step.name };
    return businessBrain.makeDecision(situation, context);
  }

  /**
   * Create inventory optimization task
   */
  createInventoryOptimizationTask(context: BusinessContext): AgentTask {
    return {
      id: `task_inventory_${Date.now()}`,
      name: 'Daily Inventory Optimization',
      description: 'Optimize inventory across all SKUs',
      steps: [
        {
          id: `step_analyze_sales`,
          name: 'Analyze Sales Trends',
          status: 'pending'
        },
        {
          id: `step_forecast_demand`,
          name: 'Forecast Demand',
          status: 'pending'
        },
        {
          id: `step_identify_shortages`,
          name: 'Identify Shortages',
          status: 'pending'
        },
        {
          id: `step_create_orders`,
          name: 'Create Replenishment Orders',
          status: 'pending'
        },
        {
          id: `step_mark_obsolete`,
          name: 'Mark Obsolete Items',
          status: 'pending'
        }
      ],
      context,
      status: 'pending',
      progress: 0
    };
  }
}

/**
 * Customer Engagement Agent - Handles customer interactions
 */
export class CustomerEngagementAgent extends AIAgent {
  constructor() {
    super('agent_customer', 'Customer Engagement Agent', {
      maxRetries: 2,
      timeout: 90000,
      parallel: true,
      autorecover: true
    });
  }

  protected async makeDecision(
    step: AgentStep,
    context: BusinessContext
  ): Promise<BusinessDecision> {
    const situation = { stepName: step.name };
    return businessBrain.makeDecision(situation, context);
  }

  /**
   * Create customer retention task
   */
  createRetentionTask(customerId: string, context: BusinessContext): AgentTask {
    return {
      id: `task_retention_${Date.now()}`,
      name: `Retain Customer ${customerId}`,
      description: `Execute retention workflow for customer ${customerId}`,
      steps: [
        {
          id: `step_analyze_behavior`,
          name: 'Analyze Customer Behavior',
          status: 'pending'
        },
        {
          id: `step_score_churn`,
          name: 'Score Churn Risk',
          status: 'pending'
        },
        {
          id: `step_personalize_offer`,
          name: 'Personalize Offer',
          status: 'pending'
        },
        {
          id: `step_send_campaign`,
          name: 'Send Campaign',
          status: 'pending'
        },
        {
          id: `step_track_engagement`,
          name: 'Track Engagement',
          status: 'pending'
        }
      ],
      context,
      status: 'pending',
      progress: 0
    };
  }
}

/**
 * AI Agent Manager - Manages multiple agents
 */
export class AIAgentManager {
  private agents: Map<string, AIAgent> = new Map();
  private maxAgents: number = 100;

  constructor() {
    // Register default agents
    this.registerAgent(new OrderProcessingAgent());
    this.registerAgent(new InventoryManagementAgent());
    this.registerAgent(new CustomerEngagementAgent());

    console.log('[AIAgentManager] Manager initialized with default agents');
  }

  /**
   * Register agent
   */
  registerAgent(agent: AIAgent): void {
    if (this.agents.size >= this.maxAgents) {
      logger.warn('AIAgentManager', 'Max agents reached');
      return;
    }
    this.agents.set(agent['id'], agent);
    logger.info('AIAgentManager', `Agent registered`, { agentId: agent['id'] });
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): AIAgent | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Execute task with specific agent
   */
  async executeTaskWithAgent(agentId: string, task: AgentTask): Promise<AgentTask> {
    const agent = this.getAgent(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }

    return agent.executeTask(task);
  }

  /**
   * Get all agents
   */
  getAllAgents(): AIAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get statistics
   */
  getStats() {
    const agents = Array.from(this.agents.values());
    return {
      totalAgents: agents.length,
      agents: agents.map((a) => a.getStats())
    };
  }
}

// Export singleton
export const agentManager = new AIAgentManager();
