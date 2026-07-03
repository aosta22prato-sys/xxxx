import { create } from 'zustand';
import { FlowWorkflow } from '../database/flows';
import { FlowService } from '../services/flow.service';

interface FlowState {
  flows: FlowWorkflow[];
  loading: boolean;
  hydrateFlows: () => void;
  updateWorkflow: (id: string, updated: Partial<FlowWorkflow>) => void;
  addWorkflow: (wf: FlowWorkflow) => void;
  deleteWorkflow: (id: string) => void;
  simulateTrigger: (trigger: string, context?: any) => { success: boolean; triggeredFlows: string[]; message: string };
}

export const useFlowStore = create<FlowState>((set, get) => ({
  flows: [],
  loading: false,

  hydrateFlows: () => {
    set({ loading: true });
    const list = FlowService.getFlows();
    set({ flows: list, loading: false });
  },

  updateWorkflow: (id, updated) => {
    const list = get().flows.map(f => (f.id === id ? { ...f, ...updated, updatedAt: new Date().toISOString() } : f));
    set({ flows: list });
    FlowService.saveFlows(list);
  },

  addWorkflow: (wf) => {
    const list = [wf, ...get().flows];
    set({ flows: list });
    FlowService.saveFlows(list);
  },

  deleteWorkflow: (id) => {
    const list = get().flows.filter(f => f.id !== id);
    set({ flows: list });
    FlowService.saveFlows(list);
  },

  simulateTrigger: (trigger, context = {}) => {
    const result = FlowService.triggerEvent(trigger, context);
    // Reload state after trigger running increment
    get().hydrateFlows();
    return result;
  }
}));
