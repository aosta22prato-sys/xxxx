import { dbEngine } from '../db/dbEngine';
import { 
  NervousEventItem, 
  NervousSubscriptionItem, 
  NervousDispatchLogItem, 
  AgentMessageItem 
} from '../types';

export class EnterpriseNervousSystemService {
  private static instance: EnterpriseNervousSystemService | null = null;
  private deadLetterQueue: NervousEventItem[] = [];

  private constructor() {
    // Initializer
  }

  public static getInstance(): EnterpriseNervousSystemService {
    if (!EnterpriseNervousSystemService.instance) {
      EnterpriseNervousSystemService.instance = new EnterpriseNervousSystemService();
    }
    return EnterpriseNervousSystemService.instance;
  }

  /**
   * Publishes an event to the global high-speed Event Bus.
   * Leverages real-time Runtime Broadcasting, reactive workflow cascades, and routing hooks.
   */
  public publishEvent(params: {
    eventType: 'world_state' | 'tool' | 'agent' | 'memory' | 'knowledge' | 'dna' | 'evolution' | 'audit';
    source: string;
    sourceRuntime: string;
    payload: any;
    priority: 'low' | 'medium' | 'high' | 'critical';
    delayMs?: number; // Supports delayed broadcasting
  }): NervousEventItem {
    const payloadStr = typeof params.payload === 'string'
      ? params.payload
      : JSON.stringify(params.payload);

    // 1. Create the base event payload
    const event = dbEngine.nervous_events.create({
      event_type: params.eventType,
      source: params.source,
      source_runtime: params.sourceRuntime,
      payload: payloadStr,
      priority: params.priority,
      status: 'pending'
    });

    // 2. Broadcast handling block (Async or Delayed)
    if (params.delayMs && params.delayMs > 0) {
      setTimeout(() => {
        this.dispatchEventToSubscribers(event);
      }, params.delayMs);
    } else {
      // Simulate real-time streaming thread execution
      this.dispatchEventToSubscribers(event);
    }

    return event;
  }

  /**
   * Dispatches the pending event to all active matching subscriber nodes
   */
  private dispatchEventToSubscribers(event: NervousEventItem): void {
    const startTime = Date.now();
    const activeSubs = dbEngine.nervous_subscriptions.getAll().filter(
      sub => (sub.event_type === event.event_type || sub.event_type === 'all') && sub.status === 'active'
    );

    let dispatchSuccessCount = 0;
    
    // Sort subscriptions according to execution priority weight
    activeSubs.sort((a, b) => a.priority - b.priority);

    for (const sub of activeSubs) {
      try {
        // Evaluate simulated latency (typical broker delivery overhead)
        const latency = Math.floor(2 + Math.random() * 8);

        // Record high-fidelity dispatch log
        dbEngine.nervous_dispatch_logs.create({
          event_id: event.event_id,
          target: sub.subscriber,
          status: 'success',
          latency
        });

        dispatchSuccessCount++;
      } catch (err) {
        // Push delivery retry audit or fallback to DLQ (Dead Letter Queue)
        dbEngine.nervous_dispatch_logs.create({
          event_id: event.event_id,
          target: sub.subscriber,
          status: 'failed',
          latency: Date.now() - startTime
        });
      }
    }

    // Update dispatch status of the Event record safely
    if (dispatchSuccessCount === 0 && activeSubs.length > 0) {
      dbEngine.nervous_events.update(event.event_id, { status: 'failed' });
      this.deadLetterQueue.push(event);
    } else {
      dbEngine.nervous_events.update(event.event_id, { status: 'dispatched' });
    }

    // 3. Trigger Reactive Chains (Automated cascading workflows)
    this.cascadeReactiveWorkflows(event);
  }

  /**
   * Cascade Workflow Engine
   * Executes deterministic reactive triggers for systemic autonomic adjustments.
   * e.g., low stock event -> triggers automated agent pricing and SMS warnings without user input.
   */
  private cascadeReactiveWorkflows(event: NervousEventItem): void {
    // Scenario 1: Inventory Stock falls below safety bounds (Tool/Inventory event)
    if (event.event_type === 'tool' && event.payload.includes('"new_stock": 4')) {
      // Trigger cascading responses:
      // a. Publish memory state modification log
      dbEngine.memory_logs.create({
        memory_id: 'pat_01', 
        agent: 'Inventory Coordinator Agent (agt_reg_inv)',
        action: 'Autonomous Stock Alert Detection',
        before: { stock: 12 },
        after: { stock: 4 }
      });

      // b. Inject direct Agent-to-Agent message proposing pricing adjustment candidate!
      this.addAgentMessage({
        taskId: 'task_02',
        sender: 'Inventory Coordinator Agent (agt_reg_inv)',
        receiver: 'Dynamic Pricing Agent',
        messageType: 'instruction',
        content: 'URGENT CASCADE: SKU-COAT-WOOL-M fell to stock 4. Restrict velocity. Suggest price update +5%.'
      });

      // c. Trigger a simulated pricing model recalculation
      setTimeout(() => {
        this.addAgentMessage({
          taskId: 'task_02',
          sender: 'Dynamic Pricing Agent',
          receiver: 'Inventory Coordinator Agent (agt_reg_inv)',
          messageType: 'response',
          content: 'CASCADING RESOLVED: Calculated dynamic adjustment model. Submitting evolution candidate ID [ev_cand_01].'
        });
      }, 500);
    }

    // Scenario 2: World State Thermal Drop Event
    if (event.event_type === 'world_state' && event.payload.includes('temperature": -4.2')) {
      this.addAgentMessage({
        taskId: 'task_01',
        sender: 'Thermal Intelligence Node',
        receiver: 'Inventory Coordinator Agent (agt_reg_inv)',
        messageType: 'alert',
        content: 'CRITICAL CASCADE: Cold wave detected in Germany (-4.2°C). Proposing immediate winter apparel forward buffer release.'
      });
    }

    // Scenario 3: DNA Compliance Violation Blocking Event
    if (event.event_type === 'dna' && event.payload.includes('block')) {
      this.publishEvent({
        eventType: 'audit',
        source: 'Nervous Security Sentinel',
        sourceRuntime: 'EnterpriseNervousSystemRuntime',
        payload: { alert: `DNA violation was blocked systematically. All associated worker thread states quarantined.` },
        priority: 'critical'
      });
    }
  }

  /**
   * Dispatches direct dialog messages via the Agent Message Stream
   */
  public addAgentMessage(params: {
    taskId: string;
    sender: string;
    receiver: string;
    messageType: 'query' | 'response' | 'instruction' | 'broadcast' | 'alert';
    content: string;
  }): AgentMessageItem {
    return dbEngine.agent_messages.create({
      task_id: params.taskId,
      sender: params.sender,
      receiver: params.receiver,
      message_type: params.messageType,
      content: params.content,
      status: 'sent'
    });
  }

  /**
   * Returns all dead letter events for SuperAdmin examination
   */
  public getDeadLetterQueue(): NervousEventItem[] {
    return [...this.deadLetterQueue];
  }

  /**
   * Triggers replay action on historical logs (Audit and troubleshooting support)
   */
  public replayEvent(eventId: string): boolean {
    const historicalEvent = dbEngine.nervous_events.getById(eventId);
    if (historicalEvent) {
      // Create a Replayed Event
      this.publishEvent({
        eventType: 'audit',
        source: `Replay Monitor Console`,
        sourceRuntime: 'EnterpriseNervousSystemRuntime',
        payload: { replayed_event_id: eventId, original_type: historicalEvent.event_type, msg: `Replayed historical transaction` },
        priority: 'low'
      });
      
      this.dispatchEventToSubscribers(historicalEvent);
      return true;
    }
    return false;
  }
}
