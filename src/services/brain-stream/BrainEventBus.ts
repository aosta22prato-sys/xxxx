import { dbEngine } from '../../db/dbEngine';
import { BrainEvent } from '../../types';

type BrainEventListener = (event: BrainEvent) => void;

class BrainEventBusService {
  private static instance: BrainEventBusService;
  private listeners: Set<BrainEventListener> = new Set();

  private constructor() {}

  public static getInstance(): BrainEventBusService {
    if (!BrainEventBusService.instance) {
      BrainEventBusService.instance = new BrainEventBusService();
    }
    return BrainEventBusService.instance;
  }

  /**
   * Publish a high-intelligence event to the database and notify all live memory-stream listeners
   */
  public publish(eventData: Omit<BrainEvent, 'id' | 'timestamp'>): BrainEvent {
    const event = dbEngine.brain_events.create({
      ...eventData,
      timestamp: new Date().toISOString()
    });

    // Fire live local listeners for reactive UI stream updates
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in BrainEventBus listener:', err);
      }
    });

    // Also update statistics in the active Brain Stream
    const streams = dbEngine.brain_streams.getAll();
    const targetStreamKey = event.priority === 'CRITICAL' || event.priority === 'HIGH' ? 'governance' : 'general';
    const activeStream = streams.find(s => s.stream_key === targetStreamKey);
    if (activeStream) {
      dbEngine.brain_streams.update(activeStream.id, {
        total_events_dispatched: activeStream.total_events_dispatched + 1,
        data_throughput_kb: activeStream.data_throughput_kb + 0.8,
        updated_at: new Date().toISOString()
      });
    }

    return event;
  }

  /**
   * Subscribe to live brain outputs in memory
   */
  public subscribe(listener: BrainEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Backward-compatible legacy publisher that maps old event types directly to the modern unified schema
   */
  public publishLegacy(
    type: string,
    tenantId: string,
    storeId: string,
    summary: string,
    metadata: Record<string, any> = {}
  ): BrainEvent {
    let mappedType: BrainEvent['event_type'] = 'CAMPAIGN_TRIGGER';
    if (type === 'RISK_TRIGGERED' || type === 'RISK_TRIGGER') {
      mappedType = 'ANOMALY';
    } else if (type === 'GOAL_CHANGED') {
      mappedType = 'GOAL_CREATED';
    } else if (type === 'TASK_COMPLETED') {
      mappedType = 'GOAL_COMPLETED';
    } else if (type === 'OPPORTUNITY_FOUND') {
      mappedType = 'STORE_GAP_FOUND';
    } else {
      mappedType = 'CAMPAIGN_TRIGGER';
    }

    return this.publish({
      event_type: mappedType,
      tenant_id: tenantId,
      store_id: storeId,
      priority: (type === 'RISK_TRIGGERED' || type === 'RISK_TRIGGER') ? 'HIGH' : 'INFO',
      message: summary,
      payload: metadata
    });
  }
}

export const BrainEventBus = BrainEventBusService.getInstance();

export const eventBus = {
  publish(
    type: string,
    tenantId: string,
    storeId: string,
    summary: string,
    metadata: Record<string, any> = {}
  ): any {
    return BrainEventBus.publishLegacy(type, tenantId, storeId, summary, metadata);
  }
};

