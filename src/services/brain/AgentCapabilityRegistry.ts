import { dbEngine } from '../../db/dbEngine';
import { AgentRegistryItem } from '../../types';
import { BrainStreamService } from '../brain-stream/BrainStreamService';

// Standard high-fidelity agent profiles representing our professional AI commerce workforce
export interface AgentSpec {
  role: string;
  name: string;
  assigned_capabilities: string[];
  limitations: string[];
  permission_level: 'READ_ONLY' | 'SAFE_WRITE' | 'FULL_SYSTEM';
  max_authorized_budget_eur: number;
  associated_risk_category: 'FINANCIAL' | 'INVENTORY' | 'MARKETING_SPEND' | 'STORE_SETTINGS';
  requires_manual_approval: boolean;
}

class AgentCapabilityRegistryClass {
  private static instance: AgentCapabilityRegistryClass;

  private constructor() {}

  public static getInstance(): AgentCapabilityRegistryClass {
    if (!AgentCapabilityRegistryClass.instance) {
      AgentCapabilityRegistryClass.instance = new AgentCapabilityRegistryClass();
    }
    return AgentCapabilityRegistryClass.instance;
  }

  /**
   * Returns standard operational specifications for our coordinated active commerce workforce.
   */
  public getWorkforceAgents(): AgentSpec[] {
    return [
      {
        role: 'CEO Sophia',
        name: 'CEO Sophia (Executive Orchestrator)',
        assigned_capabilities: ['Cross-Agent Synergy Planning', 'Global Budget Allocation', 'High-Trust Strategy Execution'],
        limitations: ['Cannot direct physical inventory procurement values above 25,000 EUR directly'],
        permission_level: 'FULL_SYSTEM',
        max_authorized_budget_eur: 50000,
        associated_risk_category: 'FINANCIAL',
        requires_manual_approval: true
      },
      {
        role: 'WMS Oliver',
        name: 'WMS Oliver (Inventory Tracker)',
        assigned_capabilities: ['Physical Stock Auditing', 'Supplier Procurement Sourcing', 'Safety Cushion Threshold Tuning'],
        limitations: ['Cannot execute promotional markdowns or coupon creation'],
        permission_level: 'SAFE_WRITE',
        max_authorized_budget_eur: 5000,
        associated_risk_category: 'INVENTORY',
        requires_manual_approval: false
      },
      {
        role: '精算师 Fiona',
        name: '精算师 Fiona (Pricing Board Actuary)',
        assigned_capabilities: ['Price Elasticity Analytics', 'Tier-Discount Optimization', 'SaaS Profit-Margin Protection'],
        limitations: ['Cannot modify logistics provider matrices or warehouse settings'],
        permission_level: 'SAFE_WRITE',
        max_authorized_budget_eur: 0,
        associated_risk_category: 'FINANCIAL',
        requires_manual_approval: false
      },
      {
        role: '编排官 Leo',
        name: '编排官 Leo (SEO & Metadata Architect)',
        assigned_capabilities: ['Localized Multi-Language Translation', 'Rich Schema Injection', 'Search Tag Optimization'],
        limitations: ['Cannot adjust baseline product prices or trigger supplier requests'],
        permission_level: 'SAFE_WRITE',
        max_authorized_budget_eur: 0,
        associated_risk_category: 'STORE_SETTINGS',
        requires_manual_approval: false
      },
      {
        role: 'CRM Grace',
        name: 'CRM Grace (Customer Engagement Expert)',
        assigned_capabilities: ['VIP Loyalty Analysis', 'Slowing Segment Retention', 'Email Hook Personalization'],
        limitations: ['Cannot issue cashback or modify default store theme assets'],
        permission_level: 'SAFE_WRITE',
        max_authorized_budget_eur: 1500,
        associated_risk_category: 'MARKETING_SPEND',
        requires_manual_approval: false
      },
      {
        role: '营销官 Marcus',
        name: '营销官 Marcus (Campaign Strategist)',
        assigned_capabilities: ['Promotional Ad Funnels', 'Coupon Campaign Generation', 'ROAS Attribution Diagnostics'],
        limitations: ['Cannot edit store tax parameters or change VAT settings'],
        permission_level: 'SAFE_WRITE',
        max_authorized_budget_eur: 3000,
        associated_risk_category: 'MARKETING_SPEND',
        requires_manual_approval: true
      }
    ];
  }

  /**
   * Verifies if a specific action and role are compliant with registry definitions.
   */
  public checkComplianceAndLog(
    agentRole: AgentSpec['role'],
    estimatedCost: number,
    actionType: string
  ): { allowed: boolean; reason: string } {
    const specs = this.getWorkforceAgents();
    const match = specs.find(s => s.role === agentRole);

    if (!match) {
      return { allowed: false, reason: `Unregistered role: [${agentRole}]. Execution blocked.` };
    }

    // Check financial authorization threshold
    if (estimatedCost > match.max_authorized_budget_eur) {
      const reason = `Cost of ${estimatedCost} EUR exceeds the authorized budget limit of ${match.max_authorized_budget_eur} EUR for ${agentRole}.`;
      
      BrainStreamService.emitEvent(
        'TASK_BLOCKED',
        `Agent boundary violated: [${agentRole}] blocked on action: [${actionType}] due to budget limits.`,
        'HIGH',
        `Review of the specific action's budget is recommended`,
        { agent_role: agentRole, cost: estimatedCost }
      );

      return { allowed: false, reason };
    }

    return { allowed: true, reason: 'Approved via Governor and Capability Registry.' };
  }
}

export const AgentCapabilityRegistry = AgentCapabilityRegistryClass.getInstance();
