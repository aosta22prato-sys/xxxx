import { BrainRuntime } from './BrainRuntime';
import { dbEngine } from '../../../db/dbEngine';

export class PageAwarenessSDK {
  /**
   * Automatically tracks page navigation events, synchronizes the page contexts table, 
   * and reports state updates to the Brain Runtime Core.
   * 
   * In a real enterprise Laravel/Vue environment, this would call our Laravel API route, 
   * which updates the database state for the active tenant's digital twin and orchestrator layers.
   */
  public static trackPageNavigation(
    rawPage: string,
    tenantId: string = 'tenant_default',
    storeId: string = 'store_default'
  ): void {
    const pageTypeClean = rawPage.toLowerCase();

    // 1. Identify previous active page to capture the transition
    const pageContexts = dbEngine.page_contexts.getAll();
    const previousActivePageObj = pageContexts.find(p => p.is_active);
    const previousPage = previousActivePageObj ? previousActivePageObj.page_type : 'unknown';
    
    // Deactivate all first
    pageContexts.forEach(pc => {
      dbEngine.page_contexts.update(pc.id, { is_active: false });
    });

    const existingPage = pageContexts.find(p => p.page_type === pageTypeClean);
    if (existingPage) {
      dbEngine.page_contexts.update(existingPage.id, { is_active: true });
    } else {
      dbEngine.page_contexts.create({
        page_type: pageTypeClean,
        module: 'store_setup',
        context_key: `current_view_${pageTypeClean}`,
        extracted_metadata: { tracked_by: 'page_awareness_sdk' },
        is_active: true,
        last_visited_at: new Date().toISOString()
      });
    }

    // 2. Report state change directly to BrainRuntime
    BrainRuntime.triggerStateShift(tenantId, storeId, {
      current_page_type: pageTypeClean
    });

    // 3. Keep Context Sessions synchronized
    const activeSessions = dbEngine.context_sessions.getAll().filter(s => s.tenant_id === tenantId && s.store_id === storeId && s.is_active);
    let currentSession = activeSessions[0];
    if (!currentSession) {
      // Create a fresh new consolidated context session representing this active session
      currentSession = dbEngine.context_sessions.create({
        tenant_id: tenantId,
        store_id: storeId,
        session_token: `sess_${Math.random().toString(36).substring(2, 11)}`,
        started_at: new Date().toISOString(),
        is_active: true
      });
    }

    // 4. Capture precise Context Snapshot representing this exact view state
    dbEngine.context_snapshots.create({
      tenant_id: tenantId,
      store_id: storeId,
      snapshot_time: new Date().toISOString(),
      associated_page_type: pageTypeClean,
      captured_elements: {
        url: window.location.href || 'http://localhost:3000/',
        queryParams: { tab: pageTypeClean },
        stateIdentifiers: ['navigator_live_sensing', 'enterprise_twin_sync']
      },
      integrity_hash: `sha_${Math.random().toString(36).substring(2, 9)}`
    });

    // 5. Register Context Transition record between views
    if (previousPage !== pageTypeClean) {
      dbEngine.context_transitions.create({
        tenant_id: tenantId,
        store_id: storeId,
        from_page: previousPage,
        to_page: pageTypeClean,
        transition_trigger: 'manual_navigation',
        timestamp: new Date().toISOString()
      });
    }

    console.log(`[PageAwarenessSDK] Reported: page transitioned "${previousPage}" -> "${pageTypeClean}" for tenant: "${tenantId}", store: "${storeId}"`);
  }
}
