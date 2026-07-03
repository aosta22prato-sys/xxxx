/**
 * Event Bus - System Nervous Network
 * Pub/Sub pattern for decoupled event-driven architecture
 */

import { Event, EventListener } from './types';

export class EventBus {
  private listeners: Map<string, EventListener[]> = new Map();
  private eventHistory: Event[] = [];
  private maxHistorySize: number = 10000;

  /**
   * Subscribe to event type
   */
  on(eventType: string, handler: EventListener): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(handler);
    console.log(`[EventBus] Listener registered for: ${eventType}`);
  }

  /**
   * Subscribe to one event only
   */
  once(eventType: string, handler: EventListener): void {
    const wrapper: EventListener = (event: Event) => {
      handler(event);
      this.off(eventType, wrapper);
    };
    this.on(eventType, wrapper);
  }

  /**
   * Unsubscribe from event type
   */
  off(eventType: string, handler: EventListener): void {
    const handlers = this.listeners.get(eventType);
    if (!handlers) return;

    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  /**
   * Emit event to all listeners (synchronous)
   */
  emit(event: Event): void {
    event.timestamp = event.timestamp || Date.now();

    // Store in history
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // Get handlers
    const handlers = this.listeners.get(event.type) || [];
    const wildCardHandlers = this.listeners.get('*') || [];

    // Execute handlers
    for (const handler of [...handlers, ...wildCardHandlers]) {
      try {
        handler(event);
      } catch (err) {
        console.error(`[EventBus] Handler error for event ${event.type}:`, err);
      }
    }

    console.log(`[EventBus] Event emitted: ${event.type} (${handlers.length} listeners)`);
  }

  /**
   * Emit event asynchronously (fire and forget)
   */
  emitAsync(event: Event): Promise<void> {
    return new Promise((resolve) => {
      setImmediate(() => {
        this.emit(event);
        resolve();
      });
    });
  }

  /**
   * Wait for specific event
   */
  waitFor(eventType: string, timeout?: number): Promise<Event> {
    return new Promise((resolve, reject) => {
      const timer = timeout ? setTimeout(() => {
        this.off(eventType, handler);
        reject(new Error(`Timeout waiting for event: ${eventType}`));
      }, timeout) : null;

      const handler: EventListener = (event: Event) => {
        if (timer) clearTimeout(timer);
        this.off(eventType, handler);
        resolve(event);
      };

      this.on(eventType, handler);
    });
  }

  /**
   * Get event history
   */
  getHistory(limit: number = 100): Event[] {
    return this.eventHistory.slice(-limit);
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * Get listener count for event type
   */
  listenerCount(eventType: string): number {
    return (this.listeners.get(eventType) || []).length;
  }

  /**
   * Get all registered event types
   */
  getEventTypes(): string[] {
    return Array.from(this.listeners.keys());
  }

  /**
   * Dispose bus (cleanup)
   */
  dispose(): void {
    this.listeners.clear();
    this.eventHistory = [];
    console.log('[EventBus] Disposed');
  }
}

// Export singleton instance
export const eventBus = new EventBus();
