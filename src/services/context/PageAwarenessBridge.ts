import { dbEngine } from '../../db/dbEngine';
import { PageContext, ContextSnapshot } from '../../types';
import { BrainStreamService } from '../brain-stream/BrainStreamService';

class PageAwarenessBridgeClass {
  private static instance: PageAwarenessBridgeClass;

  private constructor() {}

  public static getInstance(): PageAwarenessBridgeClass {
    if (!PageAwarenessBridgeClass.instance) {
      PageAwarenessBridgeClass.instance = new PageAwarenessBridgeClass();
    }
    return PageAwarenessBridgeClass.instance;
  }

  /**
   * Translates active router navigation into standard state awareness and takes dynamic snapshots
   */
  public setCurrentPageContext(
    pageType: string,
    module: string,
    contextKey: string,
    metadata: Record<string, any>
  ): PageContext {
    // 1. Mark existing page contexts as inactive
    const existing = dbEngine.page_contexts.getAll();
    existing.forEach(p => {
      if (p.is_active) {
        dbEngine.page_contexts.update(p.id, { is_active: false });
      }
    });

    // 2. Insert or update standard page context
    const matched = existing.find(p => p.page_type === pageType);
    let activeContext: PageContext;

    if (matched) {
      dbEngine.page_contexts.update(matched.id, {
        is_active: true,
        module,
        context_key: contextKey,
        extracted_metadata: metadata,
        last_visited_at: new Date().toISOString()
      });
      activeContext = { ...matched, is_active: true, module, context_key: contextKey, extracted_metadata: metadata, last_visited_at: new Date().toISOString() };
    } else {
      activeContext = dbEngine.page_contexts.create({
        page_type: pageType,
        module,
        context_key: contextKey,
        extracted_metadata: metadata,
        is_active: true,
        last_visited_at: new Date().toISOString()
      });
    }

    // 3. Emit a Brain Stream Event indicating Page Context has shifted
    BrainStreamService.emitEvent(
      'STORE_GAP_FOUND', // General awareness trigger
      `Store context shifted to Shopify Administrative Area: [${module.toUpperCase()} > ${pageType}]`,
      'INFO',
      `Observe telemetry related to active settings in ${pageType}`,
      { page_type: pageType, module }
    );

    return activeContext;
  }

  /**
   * Retrieves current active merchant location
   */
  public getCurrentPageContext(): PageContext | undefined {
    return dbEngine.page_contexts.getAll().find(p => p.is_active);
  }

  /**
   * Take an integrity context snapshot of the current state of UI, query parameters, and states
   */
  public captureSnapshot(url: string, queryParams: Record<string, string>, stateIdentifiers: string[]): ContextSnapshot {
    const activePage = this.getCurrentPageContext();
    const pageType = activePage ? activePage.page_type : 'unknown';

    // Simple integrity check hash
    const valuesString = `${url}-${JSON.stringify(queryParams)}-${stateIdentifiers.join(',')}`;
    let hash = 0;
    for (let i = 0; i < valuesString.length; i++) {
      hash = (hash << 5) - hash + valuesString.charCodeAt(i);
      hash |= 0;
    }
    const integrity_hash = `matchmd5_${Math.abs(hash).toString(16)}`;

    const snapshot = dbEngine.context_snapshots.create({
      tenant_id: 'tenant_default',
      store_id: 'store_default',
      snapshot_time: new Date().toISOString(),
      associated_page_type: pageType,
      captured_elements: {
        url,
        queryParams,
        stateIdentifiers
      },
      integrity_hash
    });

    return snapshot;
  }
}

export const PageAwarenessBridge = PageAwarenessBridgeClass.getInstance();
