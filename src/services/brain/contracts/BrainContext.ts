export interface UnifiedNextAction {
  id: string;
  code: string;
  title: string;
  description: string;
  priority: 'P1' | 'P2' | 'P3';
  remediation: string;
  btnLabel: string;
  estimatedImpact: string;
  estimatedTime: string;
  actionType: 'switch_tab' | 'restock' | 'campaign' | 'none';
  actionMeta: any;
}

export interface ConsolidatedBrainContext {
  tenantId: string;
  storeId: string;
  currentPage: string;
  currentGoalName: string;
  associatedWorkflowName: string;
  readinessScore: number;
  identifiedGaps: string[];
  activeRisks: string[];
  commercialOpportunities: string[];
  nextBestAction: UnifiedNextAction | null;
}
