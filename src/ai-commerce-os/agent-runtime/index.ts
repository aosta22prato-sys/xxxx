/**
 * Layer 4: Multi-Agent Civilization (MAX ENGINEERING LEVEL)
 *
 * AI Board of Directors:
 * ├─ AI CEO
 * ├─ AI COO
 * ├─ AI CFO
 * ├─ AI CTO
 * ├─ AI CMO
 * └─ AI CRO
 */

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  status: 'idle' | 'thinking' | 'working' | 'reporting';
  lastAction: number;
  authority: number; // 0-1, higher = more authority
}

export interface Task {
  id: string;
  description: string;
  assignee: string; // Agent ID
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: number;
  createdAt: number;
  completedAt?: number;
}

export class AgentCivilization {
  private static instance: AgentCivilization;
  private agents: Map<string, Agent> = new Map();
  private taskBoard: Map<string, Task> = new Map();

  private constructor() {
    console.log('🏢 [Multi-Agent Civilization] Initializing (MAX ENGINEERING LEVEL)');
    this.initializeExecutiveBoard();
  }

  public static getInstance(): AgentCivilization {
    if (!AgentCivilization.instance) {
      AgentCivilization.instance = new AgentCivilization();
    }
    return AgentCivilization.instance;
  }

  private initializeExecutiveBoard() {
    const boardMembers: Omit<Agent, 'status' | 'lastAction'>[] = [
      {
        id: 'ai-ceo',
        name: 'AI CEO',
        role: 'Chief Executive Officer',
        description: 'Overall strategic leadership and decision-making',
        responsibilities: ['Strategy', 'Goals', 'Coordination', 'Resource Allocation'],
        skills: ['strategic_thinking', 'leadership', 'decision_making'],
        authority: 1.0,
      },
      {
        id: 'ai-coo',
        name: 'AI COO',
        role: 'Chief Operations Officer',
        description: 'Operations management and efficiency optimization',
        responsibilities: ['Operations', 'Orders', 'Inventory', 'Fulfillment'],
        skills: ['operations_management', 'process_optimization', 'supply_chain'],
        authority: 0.9,
      },
      {
        id: 'ai-cfo',
        name: 'AI CFO',
        role: 'Chief Financial Officer',
        description: 'Financial planning, analysis, and risk management',
        responsibilities: ['Finance', 'Budget', 'Profit', 'Risk Management'],
        skills: ['financial_analysis', 'budgeting', 'risk_assessment'],
        authority: 0.9,
      },
      {
        id: 'ai-cto',
        name: 'AI CTO',
        role: 'Chief Technology Officer',
        description: 'Technology strategy and system architecture',
        responsibilities: ['Technology', 'Automation', 'Systems', 'Integration'],
        skills: ['technology_strategy', 'system_architecture', 'automation'],
        authority: 0.85,
      },
      {
        id: 'ai-cmo',
        name: 'AI CMO',
        role: 'Chief Marketing Officer',
        description: 'Marketing strategy, customer acquisition, and brand',
        responsibilities: ['Ads', 'Marketing', 'Growth', 'Brand'],
        skills: ['marketing_strategy', 'customer_acquisition', 'branding'],
        authority: 0.85,
      },
      {
        id: 'ai-cro',
        name: 'AI CRO',
        role: 'Chief Revenue Officer',
        description: 'Revenue optimization and sales performance',
        responsibilities: ['Revenue', 'Sales', 'Customers', 'Growth'],
        skills: ['sales_strategy', 'revenue_optimization', 'customer_growth'],
        authority: 0.85,
      },
    ];

    boardMembers.forEach((member) => {
      this.agents.set(member.id, {
        ...member,
        status: 'idle',
        lastAction: Date.now(),
      });
    });
  }

  public assignTask(task: Omit<Task, 'id' | 'createdAt'>): Task {
    const fullTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: Date.now(),
    };
    this.taskBoard.set(fullTask.id, fullTask);

    const agent = this.agents.get(task.assignee);
    if (agent) {
      agent.status = 'working';
      agent.lastAction = Date.now();
    }

    return fullTask;
  }

  public getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  public getTaskBoard(): Task[] {
    return Array.from(this.taskBoard.values()).sort((a, b) => b.priority - a.priority);
  }

  public getStatus() {
    return {
      agentsCount: this.agents.size,
      activeTasks: Array.from(this.taskBoard.values()).filter((t) => t.status === 'in_progress')
        .length,
      capabilities: [
        'hierarchical_organization',
        'multi_agent_collaboration',
        'task_delegation',
        'authority_management',
      ],
    };
  }
}
