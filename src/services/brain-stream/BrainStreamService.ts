import { dbEngine } from '../../db/dbEngine';
import { BrainEventBus } from './BrainEventBus';
import { BrainEvent } from '../../types';

class BrainStreamServiceClass {
  private static instance: BrainStreamServiceClass;

  private constructor() {}

  public static getInstance(): BrainStreamServiceClass {
    if (!BrainStreamServiceClass.instance) {
      BrainStreamServiceClass.instance = new BrainStreamServiceClass();
    }
    return BrainStreamServiceClass.instance;
  }

  /**
   * Dispatches a standardized brain stream event and automatically triggers subscriber notifications
   */
  public emitEvent(
    eventType: BrainEvent['event_type'],
    message: string,
    priority: BrainEvent['priority'],
    recommendedAction?: string,
    payload?: Record<string, any>
  ): BrainEvent {
    const event = BrainEventBus.publish({
      event_type: eventType,
      tenant_id: 'tenant_default',
      store_id: 'store_default',
      priority,
      message,
      recommended_action: recommendedAction,
      payload
    });

    // Create notifications for active channels automatically
    this.dispatchSubscribers(event);

    return event;
  }

  /**
   * Scan active distribution channels and schedule notifications
   */
  private dispatchSubscribers(event: BrainEvent) {
    const activeChannels = dbEngine.brain_channels.getAll().filter(c => c.channel_status === 'ACTIVE');

    activeChannels.forEach(channel => {
      // Create a persistent notification record reflecting delivery queues
      dbEngine.brain_notifications.create({
        tenant_id: event.tenant_id,
        store_id: event.store_id,
        source_event_id: event.id,
        destination_channel: channel.channel_code,
        notification_content: `[${event.priority}] ${event.message}. Recommended Remediation: ${event.recommended_action || 'None'}`,
        delivery_status: channel.channel_code === 'SYSTEM_WEBHOOK' ? 'QUEUED' : 'DELIVERED',
        acknowledged: false,
        dispatched_at: new Date().toISOString()
      });
    });
  }

  /**
   * Helper to fetch unified live stream logs
   */
  public getUnifiedStreamLogs(): BrainEvent[] {
    return dbEngine.brain_events.getAll().sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
}

export const BrainStreamService = BrainStreamServiceClass.getInstance();
