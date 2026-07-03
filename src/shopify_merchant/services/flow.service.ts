import { FlowWorkflow, INITIAL_FLOW_DATA } from '../database/flows';

export class FlowService {
  private static STORAGE_KEY = 'noir_admin_flows';

  static getFlows(): FlowWorkflow[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(INITIAL_FLOW_DATA));
      return INITIAL_FLOW_DATA;
    }
    return JSON.parse(stored);
  }

  static saveFlows(flows: FlowWorkflow[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(flows));
  }

  static triggerEvent(trigger: string, contextData: any): { success: boolean; triggeredFlows: string[]; message: string } {
    const flows = this.getFlows();
    const activeFlowsToTrigger = flows.filter(f => f.status === 'active' && f.trigger === trigger);
    
    const triggeredFlows: string[] = [];
    
    const updatedFlows = flows.map(f => {
      const isMatch = f.status === 'active' && f.trigger === trigger;
      if (isMatch) {
        triggeredFlows.push(f.title);
        return {
          ...f,
          runCount: f.runCount + 1,
          lastRunAt: new Date().toISOString()
        };
      }
      return f;
    });

    if (triggeredFlows.length > 0) {
      this.saveFlows(updatedFlows);
    }

    return {
      success: triggeredFlows.length > 0,
      triggeredFlows,
      message: triggeredFlows.length > 0 
        ? `Successfully auto-triggered ${triggeredFlows.length} workflow(s): ${triggeredFlows.join(', ')}`
        : 'Active workflows found: 0. Ensure status is set to ACTIVE and triggers align.'
    };
  }
}
