import { dbEngine } from '../../../db/dbEngine';
import { BrainRuntimeState, BrainEvent } from '../../../types';
import { BrainStreamService } from '../../brain-stream/BrainStreamService';

class BrainRuntimeClass {
  private static instance: BrainRuntimeClass;

  private constructor() {}

  public static getInstance(): BrainRuntimeClass {
    if (!BrainRuntimeClass.instance) {
      BrainRuntimeClass.instance = new BrainRuntimeClass();
    }
    return BrainRuntimeClass.instance;
  }

  /**
   * Retrieves the comprehensive, synchronized runtime state for the selected merchant environment.
   * If not already present, it bootstraps it cleanly.
   */
  public getOrCreateRuntimeState(tenantId = 'tenant_default', storeId = 'store_default'): BrainRuntimeState {
    const list = dbEngine.brain_runtime_states.getAll();
    let current = list.find(s => s.tenant_id === tenantId && s.store_id === storeId);

    // Dynamic calculations representing the exact operating parameters
    const activePage = dbEngine.page_contexts.getAll().find(p => p.is_active);
    const pageType = activePage ? activePage.page_type : 'dashboard';

    const activeMissions = dbEngine.goal_missions.getAll().filter(m => m.status === 'active');
    const activeGoalId = activeMissions[0]?.id;

    const activeWorkflows = dbEngine.workflow_instances.getAll().filter(w => w.status === 'running');
    const activeWorkflowId = activeWorkflows[0]?.id;

    // Collate outstanding risks across models
    const rawHazards = dbEngine.risk_incidents?.getAll() || [];
    const activeRisks = rawHazards
      .filter(h => h.severity === 'high' || h.severity === 'critical')
      .map(h => ({
        code: h.id || 'RISK_UNRESOLVED',
        label: h.incident_name || 'Ambiguous security hazard detected',
        severity: (h.severity === 'critical' ? 'CRITICAL' : 'HIGH') as 'CRITICAL' | 'HIGH'
      }));

    // Auto-synthesize gaps from checklist compliance scores
    const activeGaps: Array<{ code: string; label: string; remediation: string }> = [];
    const storeCtx = dbEngine.store_contexts.getAll().find(c => c.tenant_id === tenantId && c.store_id === storeId);
    if (storeCtx) {
      if (!storeCtx.is_vat_registered) {
        activeGaps.push({
          code: 'VAT_MISSING',
          label: 'EU VAT Registration Required',
          remediation: 'Register VAT through OSS Portal and update settings'
        });
      }
      if (storeCtx.shipping_zones_count < 3) {
        activeGaps.push({
          code: 'EXPAND_SHIPPING',
          label: 'Limited Shipping Reach',
          remediation: 'Enable DACH, French, and Mediterranean customized shipping matrices'
        });
      }
    }

    const hasCriticalRisk = activeRisks.some(r => r.severity === 'CRITICAL');
    const loadStatus = (hasCriticalRisk ? 'CRITICAL' : activeRisks.length > 0 ? 'WARNING' : 'HEALED') as 'WARNING' | 'CRITICAL' | 'HEALED';

    const baseData = {
      tenant_id: tenantId,
      store_id: storeId,
      current_page_type: pageType,
      current_user_id: 'user_merchant_01',
      active_goal_id: activeGoalId,
      active_workflow_id: activeWorkflowId,
      detected_risks: activeRisks.length > 0 ? activeRisks : [{ code: 'STOCK_OUT', label: 'Cashmere coat stock low', severity: 'HIGH' as const }],
      detected_gaps: activeGaps.length > 0 ? activeGaps : [{ code: 'VAT_WARN', label: 'VAT Registration incomplete', remediation: 'Complete VAT settings' }],
      system_load_status: loadStatus,
      updated_at: new Date().toISOString()
    };

    if (current) {
      dbEngine.brain_runtime_states.update(current.id, baseData);
      current = { ...current, ...baseData };
    } else {
      current = dbEngine.brain_runtime_states.create(baseData);
    }

    return current;
  }

  /**
   * Dispatches updates to current operating focus parameters and alerts the event bus.
   */
  public triggerStateShift(
    tenantId: string,
    storeId: string,
    payload: Partial<Omit<BrainRuntimeState, 'id' | 'tenant_id' | 'store_id' | 'updated_at'>>
  ): BrainRuntimeState {
    const current = this.getOrCreateRuntimeState(tenantId, storeId);
    dbEngine.brain_runtime_states.update(current.id, {
      ...payload,
      updated_at: new Date().toISOString()
    });

    BrainStreamService.emitEvent(
      'GOAL_CREATED',
      `SaaS Engine Context synchronized! Refreshed focus parameters: Page focus is ${payload.current_page_type || current.current_page_type}`,
      'INFO',
      undefined,
      { triggered_by: 'BrainRuntime' }
    );

    return this.getOrCreateRuntimeState(tenantId, storeId);
  }
}

export const BrainRuntime = BrainRuntimeClass.getInstance();
