/**
 * EventBus - Level 10 Decoupled Communication Hub
 * Enables independent modules to broadcast changes without direct imports/dependencies.
 */

type EventCallback = (data: any) => void;

class EventBus {
  private listeners: Record<string, EventCallback[]> = {};

  /**
   * Register a subscriber for a specific event
   */
  subscribe(event: string, callback: EventCallback): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    
    // Return unsubscribe function for clean cleanup in React useEffect hooks
    return () => this.unsubscribe(event, callback);
  }

  /**
   * Unsubscribe a listener from an event
   */
  unsubscribe(event: string, callback: EventCallback): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  /**
   * Emit an event along with payload
   */
  emit(event: string, data?: any): void {
    // Audit log (Architectural Honesty: Keep developer console updated but clean on the screen)
    console.log(`[EventBus] EMIT event="${event}"`, data);
    
    const callbacks = this.listeners[event] || [];
    callbacks.forEach(cb => {
      try {
        cb(data);
      } catch (err) {
        console.error(`[EventBus] Error executing subscriber for ${event}:`, err);
      }
    });

    // Also notify global wildcard subscribers
    const wildcards = this.listeners['*'] || [];
    wildcards.forEach(cb => {
      try {
        cb({ event, data });
      } catch (e) {
        console.error('[EventBus] Error executing wildcard subscriber:', e);
      }
    });
  }
}

export const eventBus = new EventBus();
