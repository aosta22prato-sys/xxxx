/**
 * AI Commerce OS - Data Types
 */

export type IndustryType = 
  | 'retail' 
  | 'food' 
  | 'education' 
  | 'healthcare' 
  | 'service' 
  | 'manufacturing'
  | 'fashion_wholesale' 
  | 'restaurant_takeout' 
  | 'general_merch_electronics' 
  | 'beauty_booking' 
  | 'ecommerce_store' 
  | 'pos_retail';

export interface TenantConfig {
  id: string;
  companyName: string;
  industry: IndustryType;
  storeName: string;
  createdAt: string;
  status: 'active' | 'suspended';
  aiBudget: number; // in USD
  aiSpent: number; // in USD
}

export interface Metric {
  name: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface ProductItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  minStockThreshold: number;
  price: number;
  sales: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  category?: string;
  brand?: string;
}

export interface OrderItem {
  id: string;
  customerName: string;
  contact: string;
  total: number;
  status: 'Pending' | 'AI Confirmed' | 'Shipped' | 'Refund Requested' | 'Refunded' | 'Completed' | 'Cancelled';
  createdAt: string;
  riskScore: number; // 0 to 100 calculated by AI
  shippingAddress?: string;
  paymentMethod?: string;
  items?: { productId?: string; sku?: string; name: string; price: number; quantity?: number; qty?: number }[];
}

export interface AIEmployee {
  id: string;
  name: string;
  title: string;
  role: string;
  status: 'Idle' | 'Analyzing' | 'Running Workflow' | 'Responding' | 'Offline';
  emoji: string;
  description: string;
  capabilities: string[];
  systemPrompt: string;
  model: string;
  tasksCompleted: number;
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'ai_decision';
  title: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  details: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  nodes: WorkflowNode[];
  active: boolean;
  frequency: string;
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  category: string;
  content: string;
  size: string;
  lastUpdated: string;
}

export interface McpTool {
  id: string;
  name: string;
  category: 'Shopify' | 'Marketing' | 'WMS' | 'CRM' | 'Finance';
  description: string;
  parameters: string[];
  status: 'connected' | 'disconnected';
}

export interface CollaborationLog {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  details: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'tool';
}

export interface AppMarketItem {
  id: string;
  name: string;
  developer: string;
  icon: string;
  price: string;
  rating: number;
  category: 'Agent' | 'Workflow' | 'Plugin' | 'Knowledge Pack';
  description: string;
  installed: boolean;
}

export interface SourcingRecommendation {
  name: string;
  sku: string;
  price: number;
  wholesaleCost: number;
  marginPct: number;
  targetDemand: string;
  trendReason: string;
  audience: string;
  profitabilityAnalysis: string;
  estMonthlySales: number;
  synced?: boolean;
}

export interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: '普通会员' | '白银会员' | '黄金会员' | '白金会员' | '钻石会员';
  points: number;
  tags: string[];
  totalSpend: number;
  orderCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  lastOrderAt?: string;
}

// SaaS Operator & Super Admin Types
export interface SaaSPlan {
  id: 'starter' | 'pro' | 'enterprise';
  name: string;
  priceMonthly: number;
  transactionFeePct: number;
  dailyApiLimit: number;
  storageLimitGb: number;
  grantedAiTokens: number;
  features: string[];
}

export interface PaymentGatewayConfig {
  id: 'stripe' | 'adyen' | 'base_usdc' | 'custom';
  name: string;
  publicKey: string;
  secretKey: string;
  commissionPct: number;
  status: 'active' | 'inactive';
  supportedRegions: string[];
}

export interface SmsMailChannelConfig {
  id: 'twilio' | 'sendgrid' | 'custom_smtp';
  name: string;
  apiKey: string;
  senderId: string;
  remainingCredits: number;
  status: 'active' | 'inactive';
  lowBalanceThreshold: number;
}

export interface AppInstallationTrace {
  appId: string;
  appName: string;
  tenantId: string;
  tenantName: string;
  installedAt: string;
  permissionsGranted: string[];
  status: 'authorized' | 'revoked';
}

export interface PlatformGlobalAiConfig {
  defaultModel: string;
  systemSafeguardPrompt: string;
  maxDailyTokenPool: number;
  currentTokensUsed: number;
  unauthorizedBlockText: string;
}

import { AIContext } from './types/AIContext';
export type { AIContext };

export enum UserRole {
  PLATFORM_ADMIN = 'platform_admin',
  MERCHANT_OWNER = 'merchant_owner',
  MANAGER = 'manager',
  STAFF = 'staff',
  CUSTOMER = 'customer'
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  role: UserRole;
  activeTenantId: string | null;
  emailVerified: boolean;
  createdAt: string;
  passwordHash?: string;
  sessionToken?: string;
}

export interface Tenant {
  id: string;
  name: string;
  branding: {
    primaryColor: string;
    logoUrl?: string;
  };
  billingPlan: string;
  billingStatus: string;
  ownerId: string;
  status: string;
  createdAt: string;
  teamMembers: {
    userId: string;
    role: UserRole;
  }[];
}

export interface Store {
  id: string;
  tenantId: string;
  name: string;
  domain: string;
  branding: {
    logoUrl?: string;
    coverUrl?: string;
  };
  theme: string;
  createdAt: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
  inventory: number;
  sku: string;
  variants?: {
    name: string;
    options: string[];
  }[];
  createdAt: string;
}

export enum OrderStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  SHIPPED = 'Shipped',
  REFUNDED = 'Refunded',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  AI_CONFIRMED = 'AI Confirmed',
  REFUND_REQUESTED = 'Refund Requested'
}

export interface Order {
  id: string;
  storeId: string;
  userId: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    selectedVariant?: Record<string, string>;
  }[];
  status: OrderStatus;
  total: number;
  paymentStatus: 'Unpaid' | 'Paid' | 'Refunded';
  paymentId?: string;
  paymentMethod?: string;
  shippingAddress: string;
  createdAt: string;
}

export interface FinanceRecord {
  id: string;
  tenantId: string;
  storeId: string;
  type: 'Revenue' | 'Expense';
  amount: number;
  category: string;
  description: string;
  orderId?: string;
  createdAt: string;
}

export interface AIAgent {
  id: string;
  tenantId: string;
  name: string;
  role: string;
  state: 'idle' | 'analyzing' | 'running_workflow' | 'responding' | 'offline';
  avatarUrl: string;
  memory: string[];
  systemPrompt: string;
  createdAt: string;
  assignedStoreId: string;
}

export interface TaskQueueItem {
  id: string;
  agentId: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  details: string;
  createdAt: string;
}

export interface KnowledgeItem {
  id: string;
  tenantId: string;
  title: string;
  content: string;
  score?: number;
  createdAt: string;
}

// Enterprise Self-Awareness Program (Phases 143 ~ 150) Types
export interface EnterpriseUncertaintyLog {
  id: string;
  tenantId: string;
  timestamp: string;
  targetMetric: string;
  predictedValue: string;
  confidence: number;       // 0.0 to 1.0 representing certainty level
  uncertainty: number;      // 0.0 to 1.0 representing margin of doubt/error
  unknownFactors: string[]; // Known unknowns influencing this prediction
  source: string;           // File, agent, or mechanism generating this
  evidenceId: string;       // Unique reference to raw audit evidence
  validationId: string;     // Unique validation ID for audit trail
}

export interface KnowledgeBoundaryEvent {
  id: string;
  tenantId: string;
  timestamp: string;
  queryTopic: string;
  knownCoverage: number;     // calculated content presence ratio 
  unknownCoverage: number;   // calculated missing content ratio
  missingEvidence: string[]; // Specific files/facts that are missing
  insufficientData: boolean;// Flag indicating if the decision should be blocked
  source: string;
  evidenceId: string;
  validationId: string;
}

export interface DecisionHumilityRecord {
  id: string;
  tenantId: string;
  timestamp: string;
  decisionToken: string;
  originalRating: number;    // original intent score
  finalRating: number;       // score after humidity adjustments
  confidencePenalty: number; // deducted points due to lack of samples or high conflict
  sampleCount: number;       // number of historical records found 
  conflictLevel: number;     // 0.0 to 1.0 internal conflict metric
  source: string;
  evidenceId: string;
  validationId: string;
}

export interface FailurePredictionLog {
  id: string;
  tenantId: string;
  timestamp: string;
  scenarioTitle: string;
  failureProbability: number; // estimated risk of failure (0.0 to 1.0)
  failureImpact: 'low' | 'medium' | 'high' | 'critical';
  mitigationSteps: string[];
  source: string;
  evidenceId: string;
  validationId: string;
}

export interface BlindSpotDiscovery {
  id: string;
  tenantId: string;
  timestamp: string;
  focusArea: string;
  blindSpotDetails: string;
  missingVariables: string[];
  investigationTasks: {
    id: string;
    description: string;
    assignedTo: string;
    isCompleted: boolean;
  }[];
  source: string;
  evidenceId: string;
  validationId: string;
}

export interface EvidenceSufficiencyReport {
  id: string;
  tenantId: string;
  timestamp: string;
  conclusionTarget: string;
  evidenceCoverage: number; // 0.0 to 1.0
  evidenceStrength: number; // 0.0 to 1.0
  isApproved: boolean;      // blocked if coverage/strength is too weak
  blockReason?: string;
  source: string;
  evidenceId: string;
  validationId: string;
}

export interface SelfReflectionAudit {
  id: string;
  tenantId: string;
  timestamp: string;
  scope: 'decision' | 'forecast' | 'reasoning';
  critiqueDetails: string;
  ratingScore: number;      // self-given score based on rigorous metric (0 to 100)
  actionableImprovements: string[];
  source: string;
  evidenceId: string;
  validationId: string;
}

// ==========================================
// ECOS Autonomous Discovery Program (Phases 151 ~ 158) Types
// ==========================================

export interface KnowledgeGapTask {
  id: string;
  tenantId: string;
  timestamp: string;
  gapTopic: string;
  targetEvidenceNeeded: string;
  status: 'pending' | 'resolving' | 'resolved';
  resolutionRateScore: number; // 0 to 100 tracking closure completion
  source: string;
  evidenceId: string;
  validationId: string;
}

export interface EvidenceCollectionPlan {
  id: string;
  tenantId: string;
  timestamp: string;
  gapTaskId: string;
  planTitle: string;
  plannedEvidenceItems: string[];
  importance: 'high' | 'medium' | 'low';
  estimatedValueScore: number; // 1 to 100 predictive value
  isCollected: boolean;
  source: string;
  evidenceId: string;
  validationId: string;
}

export interface InvestigationCase {
  id: string;
  tenantId: string;
  timestamp: string;
  caseTitle: string;
  associatedGapTaskId: string;
  status: 'open' | 'investigating' | 'closed';
  stages: string[];
  currentStageIndex: number;
  findingsSummary: string;
  source: string;
  evidenceId: string;
  validationId: string;
}

export interface CuriosityEvent {
  id: string;
  tenantId: string;
  timestamp: string;
  triggerAnomaly: string;
  anomalyMagnitude: number; // custom volatility size metric
  curiosityScore: number;   // 1 to 100 system interest multiplier
  proposedHypothesis: string;
  source: string;
  evidenceId: string;
  validationId: string;
}

export interface ContrarianHypothesis {
  id: string;
  tenantId: string;
  timestamp: string;
  associatedAnomalousEvent: string;
  mainstreamBelief: string;
  contrarianAssertion: string;
  validationTestCriteria: string;
  oppositeConfidenceScore: number; // 0 to 100 rating
  source: string;
  evidenceId: string;
  validationId: string;
}

export interface CompetingExplanation {
  id: string;
  tenantId: string;
  timestamp: string;
  targetAnomaly: string;
  explanationA: string;
  scoreA: number; // 0 to 100
  explanationB: string;
  scoreB: number; // 0 to 100
  explanationC: string;
  scoreC: number; // 0 to 100
  winningExplanation: 'A' | 'B' | 'C' | 'none';
  source: string;
  evidenceId: string;
  validationId: string;
}

export interface BeliefUpdate {
  id: string;
  tenantId: string;
  timestamp: string;
  beliefSubject: string;
  previousUnderstanding: string;
  newUnderstanding: string;
  beliefChangeMagnitude: number; // 0 to 100 tracking learning shift scale
  source: string;
  evidenceId: string;
  validationId: string;
}

// ==========================================
// ECOS Autonomous Operating Program (Phases 159 ~ 166) Types
// ==========================================

export interface ExecutionProposal {
  id: string;
  tenantId: string;
  storeId: string;
  timestamp: string;
  title: string;
  description: string;
  actionType: 'price_optimization' | 'restock_allocation' | 'ad_budget_redirection' | 'carrier_rerouting';
  proposedValue: number | string;
  estimatedImpactScore: number; // 1 to 100 representing positive outcomes
  estimatedRiskScore: number;   // 1 to 100 representing risk severity
  governanceLevel: 'auto' | 'manual_approval' | 'forbidden';
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'executing' | 'executed' | 'failed' | 'rolled_back';
  evidenceId: string;
  validationId: string;
  source: string;
}

export interface ExecutionApproval {
  id: string;
  tenantId: string;
  proposalId: string;
  timestamp: string;
  governanceLevel: 'auto' | 'manual_approval' | 'forbidden';
  authorizedBy: 'autonomous_governor' | 'merchant_owner' | 'none';
  riskMitigationVerified: boolean;
  budgetCheckStatus: 'passed' | 'failed';
  approvedTime?: string;
  status: 'passed' | 'rejected' | 'pending';
  source: string;
  evidenceId: string;
  validationId: string;
}

export interface ExecutionMonitoringLog {
  id: string;
  tenantId: string;
  proposalId: string;
  timestamp: string;
  metricMonitored: string;
  expectedValue: number | string;
  actualObservedValue: number | string;
  deviationRate: number; // percentage variance
  unexpectedEffectsDetected: string[];
  status: 'stable' | 'warning_deviation' | 'critical_failure';
  source: string;
  evidenceId: string;
  validationId: string;
  approvalId: string;
  executionId: string;
}

export interface RollbackRecord {
  id: string;
  tenantId: string;
  proposalId: string;
  timestamp: string;
  rollbackReason: string;
  actionsTaken: string[];
  restoredMetrics: Record<string, number | string>;
  estimatedRollbackCost: number; // in USD or resource unit
  status: 'success' | 'failed';
  source: string;
  evidenceId: string;
  validationId: string;
  approvalId: string;
  executionId: string;

  // Modern Governance Rollback integrations
  audit_id?: string;
  reverted_by?: string;
  revert_payload_snapshot?: Record<string, any>;
  reverted_at?: string;
}

export interface AgentConflictRecord {
  id: string;
  tenantId: string;
  timestamp: string;
  conflictTopic: string; // e.g. "Pricing adjustment vs Supplier margins"
  agentA_Id: string;
  agentA_Recommendation: string;
  agentA_TrustScore: number; // 0 to 100
  agentB_Id: string;
  agentB_Recommendation: string;
  agentB_TrustScore: number; // 0 to 100
  resolutionStatus: 'resolved' | 'escalated';
  resolutionDecision: string;
  resolvedTrustScoreWeight: number; // newly dynamic weighted score
  source: string;
  evidenceId: string;
  validationId: string;
}

export interface ResourceAllocationPlan {
  id: string;
  tenantId: string;
  timestamp: string;
  resourceType: 'marketing_budget' | 'inventory_stock' | 'ad_spends' | 'operating_cashflow';
  allocatedAmount: number;
  efficiencyScore: number; // predicted efficiency
  utilizationRate: number; // percentage utilization
  optimizationInsight: string;
  source: string;
  evidenceId: string;
  validationId: string;
}

export interface ContinuousLearningUpdate {
  id: string;
  tenantId: string;
  timestamp: string;
  modelSubject: string;
  metricObserved: string;
  outcomeScore: number; // outcome metrics (how positive the result was, 0 to 100)
  previousStrategyWeight: number; // e.g. 0.65
  newStrategyWeight: number;      // updated weighting e.g. 0.78
  decisionWeightShift: number;    // differential
  source: string;
  evidenceId: string;
  validationId: string;
  proposalId: string;
}

// ==========================================
// ECOS Enterprise Strategic Intelligence Program (Phases 167 ~ 174) Types
// ==========================================

export interface StrategicObjective {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  timeHorizonMonths: 12 | 24 | 36;
  startDate: string;
  targetMetric: string;
  targetValue: number | string;
  currentValue: number | string;
  progressPercentage: number;
  status: 'active' | 'achieved' | 'deferred' | 'abandoned';
  alignmentScore: number; // 0 to 100
  survivalWeight: number; // 0 to 100, prioritization weighting towards core longevity
  lastTrackedDate: string;
}

export interface MarketIntelligence {
  id: string;
  tenantId: string;
  timestamp: string;
  marketSector: string;
  marketPositionScore: number;     // 1 to 100 scale (100 = monopoly leader)
  competitiveThreatIndex: number;  // 1 to 100 scale (100 = hyper-aggressive rivals)
  marketOpportunityIndex: number;  // 1 to 100 scale (100 = boundless unserved blue-ocean demand)
  estimatedMarketSharePercent: number;
  annualOverAnnualGrowthRate: number;
  recentShiftsDetected: string[];
}

export interface ScenarioPlan {
  id: string;
  tenantId: string;
  objectiveId: string;
  timestamp: string;
  driverName: string; // Key pivot trigger driver
  bestCaseScenario: {
    expectedRevDelta: number; // e.g. +35%
    expectedProfitDelta: number; // e.g. +20%
    survivalImpactShift: number; // e.g. +14%
    description: string;
  };
  expectedCaseScenario: {
    expectedRevDelta: number;
    expectedProfitDelta: number;
    survivalImpactShift: number;
    description: string;
  };
  worstCaseScenario: {
    expectedRevDelta: number;
    expectedProfitDelta: number;
    survivalImpactShift: number; // e.g. -25%
    description: string;
  };
  calculatedStrategyVolatility: number; // volatility risk factor (0 to 100)
}

export interface StrategicTradeoff {
  id: string;
  tenantId: string;
  initiativeName: string;
  timestamp: string;
  weightProfit: number;      // 0.0 to 1.0 ranking
  weightGrowth: number;      // 0.0 to 1.0 ranking
  weightCashflow: number;    // 0.0 to 1.0 ranking
  weightBrandEquity: number; // 0.0 to 1.0 ranking
  weightMarketShare: number; // 0.0 to 1.0 ranking
  impactSummary: string;
  calculatedStrategicCost: number;  // friction or resource toll units (0 to 100)
  calculatedStrategicBenefit: number; // net index (0 to 100)
  longevityIndexShift: number; // Enterprise Longevity index difference (e.g. +12 or -5 percent points)
}

export interface ExecutiveDecision {
  id: string;
  tenantId: string;
  title: string;
  timestamp: string;
  boardroomRecommendation: string;
  confidenceLevel: number; // 0 to 100
  votedApprovalRate: number; // percentage of Board consensus e.g. 88%
  status: 'pending_review' | 'approved' | 'vetoed' | 'dispatched_to_governance';
  // ECOS Supreme Constitution Rule Minimum Required 5 Fields
  expectedGain: number;       // 1 to 100 rating scale / Index parameter of gain
  expectedRisk: number;       // 1 to 100 rating scale (lower is better, higher is hazard)
  expectedTimeHorizon: string; // e.g. "12 Months", "24 Months", "36 Months"
  strategicAlignment: number; // 0 to 100 matching core values
  survivalImpact: number;     // -100 to +100 representing contribution towards Enterprise Longevity (Survival probability)
}

export interface CapitalAllocation {
  id: string;
  tenantId: string;
  timestamp: string;
  initiativeId: string;
  allocatedCapitalSecured: number; // value in USD (actual funds dispatched)
  expenditureCategory: 'R&D' | 'Marketing Acquisition' | 'Inventory Stock Expansion' | 'Cash Buffer Reserve' | 'Brand Equity Uplift';
  investmentPriority: 'critical_survival' | 'high_leverage_growth' | 'moderate_maintenance' | 'low_speculative';
  expectedReturnROI: number; // e.g. 3.4 for 3.4x ROI yield
  cashFlowImpactMetric: number; // -100 to +100 relative impact on operating liquidity
}

export interface PortfolioInitiative {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  capitalRequired: number; // USD
  expectedProfitYield: number; // USD
  portfolioRiskWeight: number; // 0 to 100 risk score
  strategicPriorityRank: number; // Priority index layout (e.g., 1, 2, 3...)
  implementationComplexityRating: number; // 1 to 10 scale complexity
  status: 'pipeline' | 'active_development' | 'suspended_to_conserve' | 'completed';
}

// ==========================================
// ECOS Cognitive Governance (Phases 175 ~ 182) Types
// ==========================================

export interface CognitiveConflict {
  id: string;
  tenantId: string;
  timestamp: string;
  sourceEngines: string[]; // e.g. ["Market Intelligence", "Strategic Tradeoff"]
  conflictingDirectives: {
    engine: string;
    recommendation: string; // "expansion" or "conservative", etc.
    confidence: number;
  }[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolvedRecommendation: string;
  resolutionStrategy: 'evidence_priority' | 'consensus_voting' | 'conservative_fallback';
  status: 'active' | 'resolved';
}

export interface EvidenceHierarchyItem {
  id: string;
  tenantId: string;
  sourceName: string;
  grade: 'L1_REAL_TRANSACTIONS' | 'L2_HISTORIC_METRICS' | 'L3_INDUSTRY_STATS' | 'L4_HYPOTHETICAL_LOGIC';
  evidenceData: Record<string, any>;
  lastVerified: string;
  reliabilityScore: number; // 0 to 100
}

export interface ReasoningReliability {
  id: string;
  tenantId: string;
  chainName: string; // e.g. "Liquidity Defend Chain"
  stepsEvaluated: string[];
  calculatedReliabilityScore: number; // 0 to 100
  failureCount: number;
  successCount: number;
  unresolvedLogicLoops: number;
}

export interface ConfidenceCalibration {
  id: string;
  tenantId: string;
  timestamp: string;
  decisionId: string;
  rawConfidence: number;      // e.g. 95
  calibratedConfidence: number; // e.g. 75
  calibrationDelta: number;    // e.g. -20
  biasType: 'overconfidence' | 'underconfidence' | 'aligned';
  adjustmentReason: string;
}

export interface CognitiveLoadMetric {
  id: string;
  tenantId: string;
  timestamp: string;
  activeReasoningChains: number;
  averageCpuPerChainMs: number;
  memoryRetainedBytes: number;
  loadStatus: 'optimal' | 'moderate' | 'congested_throttling';
  prunedChainCount: number;
  reasoningCostSavedUsd: number;
}

export interface CognitiveAuditReplay {
  id: string;
  tenantId: string;
  decisionId: string;
  originalTimestamp: string;
  replayTimestamp: string;
  originalRationale: string;
  counterfactualOutcome: string; // counterfactual consequences description
  governanceScore: number; // score 0 to 100 on how governance aligned it was
  retrogradeErrorChecked: boolean;
}

export interface GovernanceDriftLog {
  id: string;
  tenantId: string;
  timestamp: string;
  ruleId: string;
  varianceDetected: number; // percentage variance from constitution rules
  driftDirection: 'aggression' | 'excessive_caution' | 'computational_sluggishness';
  actionTaken: string;
}

// ==========================================
// ECOS Enterprise Nervous System (Phases 183 ~ 190) Types
// ==========================================

export interface BusinessEvent {
  id: string;
  tenantId: string;
  timestamp: string;
  eventType: 'InventoryLow' | 'SalesDrop' | 'CashFlowRisk' | 'CustomerChurn' | 'MarginViolation' | 'ExternalTariffShock' | 'AnomalyDetected';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  metricsAffected: Record<string, number>;
  status: 'new' | 'processed' | 'correlated' | 'archived';
}

export interface StateTransition {
  id: string;
  tenantId: string;
  timestamp: string;
  subSystem: string; // e.g. "Inventory", "Sales Pipeline", "Liquidity Reserves"
  fromState: 'Healthy' | 'Warning' | 'Critical';
  toState: 'Healthy' | 'Warning' | 'Critical';
  triggerEventId: string;
  rationale: string;
}

export interface GoalMonitor {
  id: string;
  tenantId: string;
  goalType: 'IncreaseRevenue' | 'ImproveMargin' | 'ReduceReturns' | 'IncreaseRetention' | 'EnsureLiquidity';
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  toleranceThresholdPercent: number; // e.g. 5 means 5% deviation is tolerated
  driftIndex: number; // 0 to 100 percentage deviation from expectation
  status: 'on_track' | 'deviated' | 'severe_drift';
}

export interface TriggerLog {
  id: string;
  tenantId: string;
  timestamp: string;
  triggerType: 'Threshold Trigger' | 'Pattern Trigger' | 'Anomaly Trigger' | 'Goal Trigger';
  sourceEventIds: string[];
  ruleBinding: string; // Rule description, e.g. "Trigger warn state when margin falls below 55%"
  firedAction: string; // e.g. "Generate executive warning alert & trigger escalation chain"
  status: 'fired' | 'handled' | 'ignored';
}

export interface EscalationRecord {
  id: string;
  tenantId: string;
  timestamp: string;
  alertId: string;
  escalationLevel: 1 | 2 | 3 | 4 | 5; // Level 1 is local automatic, Level 5 is Supreme Boardroom/C-Suite manual approval
  responsibleCoordinator: string; // e.g. "ECOS Operational Dispatch Group"
  remediationPathProposed: string;
  approvalRequired: boolean;
  status: 'pending_mitigation' | 'mitigated' | 'approval_granted' | 'vetoed_by_constitution';
}

export interface SignalCorrelation {
  id: string;
  tenantId: string;
  timestamp: string;
  correlatedSignalIds: string[]; // e.g. ["InventoryLow", "SalesDrop"]
  unifiedEventTitle: string; // Aggregate single business event
  confidenceScore: number; // percent probability that they are causal
  analyticalSynthesis: string; // explanation of how the spikes are correlated
}

export interface ExecutiveAlert {
  id: string;
  tenantId: string;
  timestamp: string;
  alertType: 'Alert' | 'Warning' | 'Critical Notice' | 'Strategic Alert';
  title: string;
  description: string;
  impactEstimation: string;
  proposedAction: string;
  status: 'unread' | 'read' | 'authorizing_execution' | 'executed' | 'dismissed';
}

// ==========================================
// ECOS Enterprise Executive Reasoning Core & Self Evolution (Phases 191 ~ 210) Types
// ==========================================

export interface PersistedOpinion {
  perspective: 'marketing' | 'finance' | 'inventory' | 'risk' | 'strategy' | 'customer';
  recommenderName: string;
  avatar: string;
  recommendation: string;
  rationale: string;
  financialImpact: string;
  confidenceScore: number;
}

export interface BoardroomDebate {
  id: string;
  tenantId: string;
  timestamp: string;
  topic: string;
  status: 'debating' | 'ruled' | 'executing' | 'archived';
  opinions: PersistedOpinion[];
  ceoRuling: {
    decision: string;
    actionPlan: string[];
    justification: string;
    confidenceScore: number;
  } | null;
}

export interface CognitiveHypothesis {
  id: string;
  tenantId: string;
  timestamp: string;
  topic: string;
  hypothesisLabel: string; // e.g. "Hypothesis A: Ad Budget Inefficiency"
  description: string;
  confidenceScore: number; // 0 - 100
  status: 'competing' | 'dominant' | 'eliminated';
  supportingEvidence: string[];
  opposingEvidence: string[];
  refutationTrigger: string; // "What condition shifts my judgment"
  logicalChain: string[];
}

export interface SelfEvolutionLog {
  id: string;
  tenantId: string;
  timestamp: string;
  targetStrategy: 'Learning Strategy' | 'Reasoning Strategy' | 'Memory Strategy' | 'Decision Strategy';
  optimizationTitle: string;
  description: string;
  businessGainsRecorded: string; // e.g. "+€3,200/month by auto-shifting inventory budgets"
  cognitiveImpact: string;
  status: 'enforced' | 'simulating';
}

export interface AIOperatorTask {
  id: string;
  tenantId: string;
  timestamp: string;
  taskName: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  subSteps: { name: string; status: 'pending' | 'running' | 'completed' }[];
}

export interface AILearningInsight {
  id: string;
  tenantId: string;
  timestamp: string;
  insightCategory: string; // e.g. "Customer Cohorts", "Pricing Floors", "Regional Funnels"
  factLearned: string;
  impactScore: string; // e.g. "+18% GMV" or "-14% margin waste avoided"
  validatedAt: string;
}

export interface AICoreMemoryRecord {
  id: string;
  tenantId: string;
  category: string; // e.g. "Brand DNA", "Pricing Bounds", "Strategic Destination"
  fact: string;
  importance: 'critical' | 'normal';
}

export interface GoalMission {
  id: string;
  tenant_id: string;
  goal_name: string;
  target_metric: string;
  target_value: number;
  current_value: number;
  deadline: string;
  status: string; // e.g. 'active' | 'completed' | 'failed' | 'adjusted'
  created_at: string;
  updated_at: string;
}

export interface GoalTask {
  id: string;
  mission_id: string;
  agent_type: string; // 'InventoryAgent' | 'MarketingAgent' | 'CustomerAgent' etc.
  task_name: string;
  priority: string;   // 'high' | 'medium' | 'low'
  status: string;     // 'pending' | 'running' | 'completed' | 'failed'
  assigned_at: string;
  completed_at: string | null;
}

export interface GoalProgress {
  id: string;
  mission_id: string;
  date: string;
  metric_value: number;
  progress_percent: number;
  notes: string;
}

export interface GoalAdjustment {
  id: string;
  mission_id: string;
  reason: string;
  old_strategy: string;
  new_strategy: string;
  created_at: string;
}

// Business Workflow Engine
export interface WorkflowTemplate {
  id: string;
  tenant_id: string;
  name: string;
  trigger_type: 'inventory_low' | 'customer_churn' | 'pricing_anomaly' | 'scheduled';
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface WorkflowInstance {
  id: string;
  tenant_id: string;
  template_id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'governed';
  current_step_id: string | null;
  trigger_reason: string;
  created_at: string;
  completed_at: string | null;
}

export interface WorkflowStep {
  id: string;
  workflow_id: string;
  step_number: number;
  name: string;
  action_type: 'inventory_check' | 'purchase_plan' | 'risk_review' | 'execute' | 'verify_results' | 'customer_segment' | 'generate_plan' | 'price_simulate' | 'revenue_forecast';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'governing';
  assigned_agent: string | null;
  execution_response: string | null;
  started_at: string | null;
  completed_at: string | null;
}

export interface WorkflowExecutionLog {
  id: string;
  tenant_id: string;
  workflow_instance_id: string;
  step_id: string | null;
  log_level: 'info' | 'warning' | 'error' | 'governance_audit';
  message: string;
  timestamp: string;
}

export interface WorkflowResult {
  id: string;
  tenant_id: string;
  workflow_instance_id: string;
  outcome: 'success' | 'failure' | 'partially_completed';
  revenue_gained: number;
  cost_saved: number;
  metrics_impact: string;
  verified_at: string;
}

// Agent Registry
export interface AgentRegistryItem {
  id: string;
  tenant_id: string;
  name: string;
  role: 'InventoryAgent' | 'MarketingAgent' | 'CustomerAgent' | 'PricingAgent' | 'FinanceAgent' | string;
  assigned_capabilities: string[];
  status: 'idle' | 'running' | 'governed' | 'offline';
  tasks_count: number;
  success_rate: number;
  revenue_created: number;
  failed_count: number;
  last_active_at: string;
}

export interface AgentCapability {
  id: string;
  agent_role: string;
  capability_name: string;
  description: string;
}

export interface AgentAssignment {
  id: string;
  tenant_id?: string;
  agent_id: string;
  workflow_step_id?: string;
  assigned_at: string;
  status?: 'assigned' | 'running' | 'completed' | 'failed';

  // Mission runtime integrations
  mission_id?: string;
  target_module?: string;
  workload_pct?: number;
}

export interface AgentMetrics {
  id: string;
  agent_id: string;
  date: string;
  tasks_processed: number;
  success_rate: number;
  revenue_impact: number;
}

// Playbook Engine
export interface PlaybookTemplate {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  trigger_prompt: string;
  created_at: string;
}

export interface PlaybookRun {
  id: string;
  tenant_id: string;
  playbook_id: string;
  triggered_by_prompt: string;
  status: 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at: string | null;
}

export interface PlaybookStep {
  id: string;
  playbook_run_id: string;
  step_number: number;
  workflow_template_id: string;
  target_trigger_reason: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface PlaybookResult {
  id: string;
  tenant_id: string;
  playbook_run_id: string;
  overall_outcome: 'success' | 'failure';
  achieved_metric_growth: string;
  total_revenue_impact: number;
  notes: string;
}

// Phase 199: Goal Orchestrator
export interface GoalOrchestrator {
  id: string;
  tenant_id: string;
  store_id: string;
  name: string;
  target_metric: string;
  target_value: number;
  current_value: number;
  status: 'pending' | 'active' | 'completed' | 'failed';
  created_at: string;
  deadline: string;
}

export interface GoalExecutionPlan {
  id: string;
  orchestrator_id: string;
  name: string;
  status: 'draft' | 'approved' | 'executing' | 'completed' | 'failed';
  created_at: string;
  estimated_impact: string;
}

export interface GoalAgentAssignment {
  id: string;
  plan_id: string;
  agent_id: string;
  role: string;
  assigned_task: string;
  status: 'assigned' | 'running' | 'completed' | 'failed';
  assigned_at: string;
}

export interface GoalOutcomeEvaluation {
  id: string;
  orchestrator_id: string;
  evaluation_metric: string;
  expected_value: number;
  actual_value: number;
  variance_percent: number;
  success: boolean;
  evaluated_at: string;
}

// Phase 200: Strategy Planner
export interface StrategyPlan {
  id: string;
  tenant_id: string;
  goal_id: string; // references GoalOrchestrator.id
  title: string;
  description: string;
  confidence_score: number;
  status: 'proposed' | 'approved' | 'rejected' | 'executed';
  created_at: string;
}

export interface StrategyHypothesis {
  id: string;
  strategy_id: string;
  statement: string;
  confidence_level: number;
  variable_tested: string;
  status: 'untested' | 'proven' | 'disproven';
}

export interface StrategyExperiment {
  id: string;
  hypothesis_id: string;
  experiment_name: string;
  control_group: string;
  test_group: string;
  metrics_to_track: string[];
  status: 'scheduled' | 'running' | 'completed';
  started_at: string;
  ended_at: string | null;
}

export interface StrategyResult {
  id: string;
  strategy_id: string;
  outcome_summary: string;
  revenue_impact: number;
  margin_impact: number;
  conclusions: string;
  created_at: string;
}

// Phase 201: Outcome Learning Engine
export interface OutcomeMemory {
  id: string;
  tenant_id: string;
  context: string;
  decision_taken: string;
  outcome_rating: number; // 1-100
  key_learnings: string;
  created_at: string;
}

export interface DecisionOutcome {
  id: string;
  decision_id: string;
  decision_type: string;
  expected_metrics: string;
  actual_metrics: string;
  deviation_analysis: string;
  logged_at: string;
}

export interface StrategyPerformance {
  id: string;
  strategy_template_id: string;
  success_count: number;
  failure_count: number;
  avg_revenue_impact: number;
  reliability_score: number; // 0-100
  last_optimized_at: string;
}

export interface ExecutionFeedback {
  id: string;
  instance_id: string;
  feedback_loop: 'workflow' | 'goal' | 'strategy';
  agent_sender_id: string;
  message: string;
  issue_detected: boolean;
  adjustment_suggested: string | null;
  created_at: string;
}

// Phase 202: Business Memory
export interface BusinessMemory {
  id: string;
  tenant_id: string;
  category: 'market' | 'customer' | 'supplier' | 'product_performance' | 'general';
  experience_summary: string;
  context_tags: string[];
  importance_score: number; // 1-10
  retrieved_count: number;
  last_accessed_at: string;
  created_at: string;
}

// Phase 203: Capability Scoring Engine
export interface CapabilityScore {
  id: string;
  tenant_id: string;
  name: string;
  category: 'market_operation' | 'inventory_opt' | 'customer_recall' | 'pricing_model' | string;
  score: number; // 0-100
  trend: 'up' | 'down' | 'stable';
  assessed_at: string;
  strengths: string[];
  weaknesses: string[];
}

// Phase 204: Confidence Engine
export interface DecisionConfidence {
  id: string;
  tenant_id: string;
  decision_ref_id: string;
  decision_type: 'replenishment' | 'pricing' | 'recall' | 'strategy' | string;
  title: string;
  decision_confidence: number; // 0-100
  strategy_confidence: number; // 0-100
  forecast_confidence: number; // 0-100
  requires_governor_approval: boolean;
  governor_status: 'pending_review' | 'approved' | 'rejected' | 'auto_passed';
  analysis_breakdown: string;
  assessed_at: string;
}

// Phase 205: Enterprise Skill Graph
export interface SkillGraphNode {
  id: string;
  tenant_id: string;
  skill_key: 'market_expansion' | 'inventory_optimization' | 'dynamic_pricing' | 'customer_recall' | 'advertising_delivery' | 'margin_management';
  name: string;
  level: 'Novice' | 'Competent' | 'Advanced' | 'Expert' | 'Master';
  success_rate: number; // 0-100
  historical_revenue_gain: number;
  failure_rate: number; // 0-100
  experience_count: number;
  last_used_at: string;
  updated_at: string;
}

// Phase 206: Multi-Store Intelligence (Cross-store experience sharing without leakage)
export interface CrossStoreAnonymizedExperience {
  id: string;
  original_tenant_id_hash: string;
  market_country: string;
  product_category: string;
  strategy_type: 'reduction_percentage' | 'loyalty_edm' | 'replenishment_buffer' | string;
  action_detail: string;
  outcome_gmv_growth_pct: number;
  sample_size: number;
  avg_revenue_impact: number;
  confidence_rating: number; // 0-100
  created_at: string;
}

// Phase 207: European Fashion Intelligence - P1: Fashion Knowledge Center
export interface FashionCategory {
  id: string;
  name: string; // e.g., 'Wool Coat', 'Cashmere Coat', 'Trench Coat'
  parent_category: string; // e.g., 'Outerwear'
  demand_velocity: 'High' | 'Medium' | 'Low';
}

export interface FashionMaterial {
  id: string;
  name: string; // e.g., 'Merino Wool', 'Recycled Cashmere', 'Organic Cotton'
  thermal_rating: number; // 1-10
  cost_multiplier: number;
  weight_class: 'lightweight' | 'midweight' | 'heavyweight';
}

export interface FashionStyle {
  id: string;
  name: string; // 'Old Money', 'Quiet Luxury', 'Minimalist', 'Parisian chic'
  core_colors: string[];
  target_demographic: string;
}

export interface FashionSeason {
  id: string;
  name: string; // 'Winter-2025', 'Spring-25', 'Autumn-25'
  peak_start_month: number;
  peak_end_month: number;
}

export interface FashionOccasion {
  id: string;
  name: string; // 'Business Casual', 'Evening Gala', 'Daily Lounge'
  associated_tags: string[];
}

// Phase 207: European Fashion Intelligence - P2: European Market Intelligence Center
export interface MarketTrend {
  id: string;
  country_code: string; // e.g., 'FR', 'DE', 'UK'
  category_name: string; // e.g., 'Wool Coat'
  growth_rate_pct: number; // e.g., 34
  quarter: string; // e.g., '2025-Q4'
  confidence_score: number; // 0-100
  updated_at: string;
}

export interface TrendSignal {
  id: string;
  source: string; // e.g., 'Vogue France', 'Google Trends Europe'
  keyword: string;
  search_volume_index: number; // 1-100
  momentum: 'rising' | 'stable' | 'fading';
}

export interface TrendReport {
  id: string;
  title: string;
  summary: string;
  key_findings: string[];
  published_date: string;
}

// Phase 207: European Fashion Intelligence - P3: Competitor Intelligence Center
export interface Competitor {
  id: string;
  name: string; // 'Zara', 'H&M', 'Mango', 'COS', 'Massimo Dutti', 'Sandro', 'Maje'
  brand_segment: 'Mass Market' | 'Premium' | 'Affordable Luxury';
  average_confidence_index: number; // 0-100
}

export interface CompetitorProduct {
  id: string;
  competitor_id: string;
  category: string;
  name?: string;
  item_name?: string;
  retail_price?: number;
  estimated_retail_price?: number;
  stock_status?: 'In Stock' | 'Sold Out' | 'Low Stock';
  assessed_stock_level?: 'Low' | 'Medium' | 'High';
}

export interface CompetitorPrice {
  id: string;
  competitor_product_id: string;
  original_price: number;
  current_price: number;
  is_on_sale: boolean;
  currency: string;
}

export interface CompetitorPromotion {
  id: string;
  competitor_id: string;
  description: string; // e.g., 'Mid-season Sale 20% Off'
  discount_percentage: number;
  channels: string[]; // ['EDM', 'Homepage Banner']
}

// Phase 207: European Fashion Intelligence - P4: Consumer Intelligence Center
export interface CustomerPersona {
  id: string;
  name: string; // e.g., 'Parisian Chic Careerist (France Female 25-35)'
  age_range: string;
  core_focus: string[]; // ['design', 'material_quality', 'brand_identity', 'fit']
  average_order_value: number;
}

export interface CountryPreference {
  id: string;
  country_code: string;
  preferred_styles: string[]; // ['Old Money', 'Quiet Luxury']
  preferred_materials: string[]; // ['Cashmere', 'Merino Wool']
  sensitivity_tags: string[]; // ['extremely_price_sensitive', 'delivery_speed_sensitive']
}

export interface ShoppingBehavior {
  id: string;
  persona_id: string;
  peak_shopping_hours: number[]; // e.g. [19, 20, 21, 22]
  conversion_funnel_efficiency: number; // 0-100
  average_return_rate_pct: number;
}

// Phase 207: European Fashion Intelligence - P5: Supply Intelligence Center
export interface Supplier {
  id: string;
  name: string;
  region: string;
  reliability_score: number; // 0-100
  capacity_units_per_month: number;
}

export interface Factory {
  id: string;
  supplier_id: string;
  location: string;
  specialty_materials: string[];
  minimum_order_qty: number;
}

export interface LeadTimeRule {
  id: string;
  supplier_id: string;
  origin_country: string;
  destination_country: string;
  standard_lead_time_days: number;
  express_lead_time_days: number;
}

export interface ShippingCostRule {
  id: string;
  shipper_name: string; // e.g., 'DHL Express', 'Schenker Link'
  origin_country: string;
  destination_country: string;
  cost_per_kg: number;
  base_consignment_fee: number;
}

// Phase 203 - 208: Extended Databases for the European Fashion & Multi-Sector Brain
export interface ProductCatalogSpec {
  id: string;
  category: 'Fashion' | 'Electronics' | 'Beauty' | 'Home';
  sub_category: string; // e.g., 'Coat', 'Smartphone', 'Lipstick', 'Rug'
  brand_reference: string; // e.g., 'COS', 'Apple', 'La Mer', 'Notion Home'
  standard_features: string[]; // e.g., ['A18 Chip', 'Titanium casing', '120Hz display'] or ['Cashmere', 'Double-breasted']
  description_structure_template: string; // template structure for AI writing description
  parameter_structure: Record<string, string>; // expected JSON metadata fields
}

export interface ProductAssetItem {
  id: string;
  category_slug: string; // e.g., 'women_coat', 'smartphone_flagship', 'beauty_serum', 'handcrafted_rug'
  title_template: string; // e.g., 'Premium [Material] [Silhouette] Coat'
  high_res_unspash_urls: string[]; // actual high quality image URLs
  typical_bullet_points: string[];
}

export interface BusinessMemoryRecord {
  id: string;
  country: string; // e.g., 'France', 'Germany', 'Italy', 'Spain', 'Netherlands'
  category: string; // e.g., 'Women Coat', 'Smartphone'
  trigger_issue: string; // e.g., 'High returns on size mismatch', 'Low slow-moving inventory velocity'
  applied_strategy: string; // e.g., 'Reduce Price by 8% and offer €15 local accessory voucher'
  outcome_growth_pct: number; // e.g., 17 (meaning +17% GMV)
  confidence_score: number; // 0-100
  historical_samples_count: number; // e.g., 247
  audit_verifiable_date: string;
}

// Phase 210: Global Fashion Ontology Engine
export interface FashionEntity {
  id: string;
  type: 'category' | 'material' | 'season' | 'occasion' | 'customer_segment' | 'style' | 'color_family';
  name: string;
  code: string;
}

export interface FashionRelation {
  id: string;
  source_id: string;
  target_id: string;
  relation_type: 'requires' | 'pairs_with' | 'popular_in' | 'season_fit' | 'segment_default';
}

export interface FashionTaxonomy {
  id: string;
  entity_id: string;
  taxonomy_tree_path: string; // e.g. "Outerwear > Coat > Wool Coat"
  level: number;
}

// Phase 211: European Consumer Intelligence Center
export interface ConsumerProfile {
  id: string;
  country: string; // e.g., 'FR', 'DE', 'IT'
  city: string;    // e.g., 'Paris', 'Lyon', 'Marseille', 'Berlin', 'Munich', 'Hamburg', 'Milan', 'Rome'
  preferred_styles: string[]; // e.g. ['Quiet Luxury', 'Parisian Chic']
  avg_order_value: number;
  return_rate: number; // e.g. 18.5
  size_preference: Record<string, number>; // e.g. { "S": 20, "M": 50, "L": 30 }
  seasonal_buying_patterns: Record<string, string>; // e.g. { "Winter": "High Cashmere Wool", "Summer": "Cotton Blends" }
}

export interface ConsumerPattern {
  id: string;
  country: string;
  label: string;
  trigger_event: string;
  probability: number; // 0-100
}

export interface ConsumerSegment {
  id: string;
  code: string; // e.g., 'A1'
  segment_name: string; // e.g., 'Eco-Conscious Gen Z'
  volume_share_pct: number;
  target_vibe: string;
}

// Phase 212: Trend Forecasting Center
export interface TrendPrediction {
  id: string;
  keyword: string;
  confidence_score: number; // 1-100
  trajectory: 'Trending' | 'Stable' | 'Declining' | 'Emerging';
  forecast_quarter: string; // e.g., '2026-Q3'
  target_category_id: string;
  reasoning_summary: string;
}

export interface TrendConfidenceLog {
  id: string;
  trend_id: string;
  calibration_score: number;
  assessed_date: string;
  proof_points: string[];
}

// Phase 213: Supply Chain Intelligence Center
export interface WarehouseNode {
  id: string;
  name: string;
  location_city: string;
  capacity_sqm: number;
  active_stock_units: number;
  overhead_cost_monthly: number;
}

export interface ShippingRoute {
  id: string;
  origin_city: string;
  destination_city: string;
  transport_mode: 'Air' | 'Sea' | 'Rail' | 'ExpressRoad';
  lead_time_days: number;
  cost_per_kg: number;
  current_risk_status: 'Low' | 'Medium' | 'High';
  delay_probability_pct: number;
}

// Phase 214: Pricing Intelligence Engine
export interface PricingModel {
  id: string;
  name: string;
  factor_weights: Record<string, number>; // e.g., { "competitor_weight": 0.4, "demand_elasticity": 0.6 }
  elasticities: Record<string, number>;   // e.g., { "wool_materials": -1.2, "silk_blends": -0.8 }
}

export interface PricingDecision {
  id: string;
  product_id: string;
  current_price: number;
  competitor_price_reference: number;
  simulated_margin_pct: number;
  action_output: 'Raise Price' | 'Keep Price' | 'Reduce Price';
  applied_at: string;
}

export interface PricingOutcome {
  id: string;
  decision_id: string;
  conversion_rate_delta_pct: number;
  realized_profit_yield: number;
  validation_notes: string;
}

// Phase 215: Business DNA Memory System
export interface BusinessDNA {
  id: string;
  signature_segment: string;
  core_growth_multiplier: number;
  core_margin_barrier: number;
}

export interface BusinessExperience {
  id: string;
  label: string;
  campaign_or_action_type: string;
  is_success: boolean;
  net_gain_eur: number;
  primary_reason: string;
  memory_anchor_hash: string;
}

export interface BusinessPattern {
  id: string;
  pattern_expression: string;
  context_triggers: string[];
  recommended_action_val: string;
}

// Phase 216: Multi-Agent Command Center
export interface InventoryAgentAction {
  id: string;
  agent_id: string;
  action_type: string;
  parameters: Record<string, any>;
  status: 'pending' | 'success' | 'failed';
  executed_at: string;
}

// Phase 217: Executive Board AI
export interface BoardMeeting {
  id: string;
  topic: string;
  proposed_at: string;
  agenda_items: string[];
  status: 'adjourned' | 'session' | 'governed';
}

export interface BoardVote {
  id: string;
  meeting_id: string;
  board_member_role: 'CEO' | 'CFO' | 'COO' | 'CRO';
  vote_choice: 'Approve' | 'Abstain' | 'Reject';
  confidence_score: number;
  reasoning: string;
}

export interface BoardDecisionSpec {
  id: string;
  meeting_id: string;
  final_action_plan: string[];
  vote_outcome: 'passed' | 'rejected' | 'hung';
  approved_by: string[];
  enacted_at: string;
}

// Phase 218: Enterprise World Model
export interface WorldState {
  id: string;
  europe_economic_index: number; // 0-100
  consumer_confidence_score: number; // 0-100
  logistics_congestion_status: 'Fluid' | 'Moderate' | 'SeverelyCongested';
  weather_shift_indicator: string; // e.g. "Cold_Wave_Coming"
  competitive_intensity: 'Low' | 'Medium' | 'High';
  raw_silk_cotton_cost_multiplier: number;
  
  // Real dynamic world parameters (Task #002)
  today_sales?: number;
  france_inventory_total?: number;
  france_inventory_status?: string;
  low_stock_sku_count?: number;
  average_ad_roi?: number;
  cash_flow_buffer_days?: number;
  alpine_carrier_delay_days?: number;
  confidence?: number; // 0-100 calibration index
  last_updated?: string;
}

export interface WorldStateEvent {
  id: string;
  merchant_id: string;
  event_type: string;
  source: string;
  before_state: any;
  after_state: any;
  created_at: string;
}

export interface WorldStateAuditLog {
  id: string;
  source: string;
  updated_at: string;
  sync_duration_ms: number;
  exception_info?: string;
}

export interface ToolExecution {
  execution_id: string;
  merchant_id: string;
  agent: string;
  tool: string;
  params: any;
  result: any;
  before_state: any;
  after_state: any;
  status: 'pending' | 'success' | 'failed' | 'denied';
  latency: number;
  cost: number;
  created_at: string;
}

export interface WorldEvent {
  id: string;
  title: string;
  impact_sector: string;
  severity: 'low' | 'medium' | 'critical';
  observed_date: string;
  description: string;
}

export interface WorldPrediction {
  id: string;
  forecast_title: string;
  horizon_months: number;
  variance_probability_pct: number;
  confidence: number;
}

// Phase 219: Self-Evolution Engine
export interface SelfEvaluation {
  id: string;
  evaluated_date: string;
  strategy_type: 'Pricing' | 'Inventory_Replenish' | 'Marketing_Campaign';
  calculated_effectiveness_pct: number;
  identified_poor_agent_id: string | null;
  fastest_growth_market: string;
  details: string;
}

export interface ImprovementPlan {
  id: string;
  evaluation_id: string;
  proposal_title: string;
  action_steps: string[];
  target_remediation_days: number;
  approval_status: 'draft' | 'approved' | 'enforced';
}

export interface EvolutionCycle {
  id: string;
  cycle_number: number;
  initiated_at: string;
  gains_recorded_mrd_eur: number;
  status: 'active' | 'completed';
}

// ==========================================
// PHASE 221: European Fashion Season Intelligence
// ==========================================
export interface SeasonProfile {
  id: string;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  target_categories: string[];
  launch_duration_weeks: number;
  preorder_lead_days: number;
  stock_buffer_multiplier: number;
}

export interface SeasonMaterial {
  id: string;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  material_name: string;
  suitability_index: number; // 0-100
  notes: string;
}

export interface SeasonProductMapping {
  id: string;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  product_sku_prefix: string;
  recommended_allocation_pct: number;
}

export interface SeasonDemandPattern {
  id: string;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  region_code: string;
  spike_severity: 'Low' | 'Medium' | 'High' | 'Extreme';
  historical_return_rate_offset: number;
}

// ==========================================
// PHASE 222: Fashion Material Intelligence
// ==========================================
export interface MaterialProfile {
  id: string;
  material_name: string;
  average_cost_eur_per_kg: number;
  insulation_rating: number; // 0-100
  weight_grams_sqm: number;
  breathability_rating: number; // 0-100
  return_risk_category: 'Low' | 'Medium' | 'High';
  european_adoption_score: number; // 0-100
}

export interface MaterialAttribute {
  id: string;
  material_name: string;
  key_attribute_tag: string;
  sustainability_certified: boolean;
}

export interface MaterialPerformance {
  id: string;
  material_name: string;
  abrasion_durability_cycles: number;
  color_retention_score: number; // 0-100
  pill_resistance_rating: number; // 1-5
}

// ==========================================
// PHASE 223: European Size Intelligence Engine
// ==========================================
export interface SizeProfile {
  id: string;
  country: 'France' | 'Germany' | 'Italy' | 'Spain' | 'UK';
  size_system: string; // e.g. "FR-Standard", "DE-Standard"
  size_code: string; // e.g., "38", "40", "M", "L"
  average_chests_cm: number;
  average_waists_cm: number;
  gender_focus: 'Unisex' | 'Womenswear' | 'Menswear';
}

export interface SizeConversionRule {
  id: string;
  brand_standard_code: string; // e.g., "M"
  target_country: 'France' | 'Germany' | 'Italy' | 'Spain' | 'UK';
  target_national_code: string; // e.g. "38" or "40"
  variance_tolerance_pct: number;
}

export interface SizeReturnPattern {
  id: string;
  country: 'France' | 'Germany' | 'Italy' | 'Spain' | 'UK';
  product_category: string;
  risk_index: number; // 0-100
  return_reasons_distribution: { [reason: string]: number }; // e.g. "Too Small" => 65
  recommended_size_strategy: string;
}

// ==========================================
// PHASE 224: Brand Fashion Lifecycle Engine
// ==========================================
export interface ProductLifecycle {
  id: string;
  product_id: string;
  current_stage: 'Launch' | 'Growth' | 'Peak' | 'Decline' | 'Clearance' | 'Retired';
  stage_duration_days: number;
  current_retail_price: number;
  cumulative_sales_units: number;
  stock_coverage_weeks: number;
}

export interface LifecycleEvent {
  id: string;
  product_id: string;
  from_stage: string;
  to_stage: string;
  trigger_reason: string;
  timestamp: string;
  executed_action: string;
}

export interface LifecyclePrediction {
  id: string;
  product_id: string;
  forecasted_peak_date: string;
  estimated_decline_days_countdown: number;
  recommended_markdown_pct: number;
  clearance_priority_tier: 'Low' | 'Medium' | 'High' | 'Immediate';
}

// ==========================================
// PHASE 225: Competitive Battlefield Engine
// ==========================================
export interface CompetitorProfile {
  id: string;
  competitor_name: 'Zara' | 'H&M' | 'Mango' | 'Massimo Dutti' | 'COS' | 'Uniqlo Europe';
  average_price_point_eur: number;
  market_density_index: number; // 0-100
  brand_voice_tag: string;
  delivery_cycle_days: number;
}

export interface CompetitorPricing {
  id: string;
  competitor_id: string;
  pricing_strategy_bias: 'Aggressive_Discount' | 'Premium_Anchor' | 'Stable_Parity';
  underpricing_threat_index: number; // 0-100
}

export interface CompetitorCampaign {
  id: string;
  competitor_id: string;
  campaign_name: string;
  target_europe_regions: string[];
  estimated_marketing_impact: number; // 0-100
}

// ==========================================
// PHASE 226: European Warehouse Intelligent Network
// ==========================================
export interface WarehouseRegion {
  id: string;
  region_name: 'France' | 'Germany' | 'Italy' | 'Spain' | 'Netherlands' | 'Poland';
  customs_clearance_speed_rating: number; // 1-10
  regional_vat_tax_pct: number;
  administrative_overhead_score: number; // 0-100
}

export interface WarehouseCapacity {
  id: string;
  warehouse_id: string;
  region_name: string;
  total_rack_space_m3: number;
  utilized_rack_space_m3: number;
  overflow_area_available: boolean;
}

export interface WarehousePerformance {
  id: string;
  warehouse_id: string;
  order_fulfillment_speed_hours: number;
  safety_incident_count: number;
  dock_utilization_pct: number;
}

// ==========================================
// PHASE 227: Logistics Prediction Center
// ==========================================
export interface ShippingEvent {
  id: string;
  hub_or_route_name: string;
  transit_mode: 'Sea' | 'Air' | 'Truck' | 'Rail';
  event_category: 'Strike' | 'Severe_Weather' | 'Customs_Lockdown' | 'Congestion_Peak';
  impact_delay_days: number;
  active_status: boolean;
}

export interface ShippingPrediction {
  id: string;
  route_id: string;
  simulated_arrival_date: string;
  delay_likelihood_pct: number;
  confidence_index: number; // 0-100
}

export interface ShippingRisk {
  id: string;
  shipping_route_id: string;
  calculated_risk_tier: 'Low' | 'Medium' | 'High' | 'Critical';
  mitigation_bypass_code: string;
}

// ==========================================
// PHASE 228: Executive Strategy Simulator
// ==========================================
export interface StrategySimulation {
  id: string;
  simulation_title: string;
  target_lever: 'Price_Reduction_10' | 'Ad_Inflation_20' | 'New_FR_Warehouse' | 'Insert_Premium_SKUs' | 'Trim_Inactive_SKUs';
  simulated_duration_days: number;
  projected_gmv_delta_pct: number;
  projected_ebitda_delta_pct: number;
  projected_stock_depletion_velocity: number;
  projected_cashflow_eur_gain: number;
  simulated_run_at: string;
}

export interface SimulationInput {
  id: string;
  simulation_id: string;
  lever_code: string;
  numerical_modifier: number;
}

export interface SimulationResult {
  id: string;
  simulation_id: string;
  score_rating: number; // 1-100
  mitigation_warnings: string[];
}

// ==========================================
// PHASE 229: Enterprise Risk Brain Ledger
// ==========================================
export interface RiskRegistry {
  id: string;
  risk_domain: 'Inventory' | 'Logistics' | 'Cash_Flow' | 'Market' | 'Competitor' | 'Returns';
  severity_level: 'Low' | 'Medium' | 'High' | 'Critical';
  risk_description: string;
  exposure_rating_score: number; // 0-100
  trigger_indicators_present: boolean;
}

export interface RiskEvent {
  id: string;
  risk_id: string;
  event_title: string;
  detected_at: string;
  incident_status: 'Investigating' | 'Mitigating' | 'Resolved';
}

export interface RiskAssessment {
  id: string;
  risk_id: string;
  loss_probability_pct: number;
  calculated_remediation_cost_eur: number;
  remediation_timehouse_days: number;
}

export interface RiskResponse {
  id: string;
  risk_id: string;
  assigned_agent_id: string;
  mitigation_action_protocol: string;
  execution_outcome_brief: string;
}

// ==========================================
// PHASE 230: Autonomous Business Governor
// ==========================================
export interface GovernorCycle {
  id: string;
  cycle_number: number;
  governing_target: string;
  dispatched_agent_count: number;
  decisions_ratified_count: number;
  anomaly_remedies_applied: number;
  cycle_start_time: string;
  cycle_end_time: string | null;
  performance_gain_score_pct: number;
}

export interface GovernorAction {
  id: string;
  cycle_id: string;
  action_slug: string; // e.g., "reallocate_german_stock"
  decision_weight_evidence: string;
  enforced_by_agent: string;
  governance_audit_approved: boolean;
}

export interface GovernorOutcome {
  id: string;
  action_id: string;
  kpi_shift_category: string;
  delta_shift_pct: number;
  learning_gain_record: string;
}

// ==========================================
// PHASE 231: Global Economic World Model
// ==========================================
export interface EconomicIndicator {
  id: string;
  country_or_bloc: string; // e.g. "Eurozone"
  inflation_rate_pct: number;
  interest_rate_pct: number;
  consumer_confidence_score: number; // 0-100
  retail_spending_index: number; // 0-100
  gdp_growth_trend_status: 'Expanding' | 'Stagnant' | 'Contracting';
}

export interface EconomicSnapshot {
  id: string;
  recorded_at: string;
  average_purchasing_power_factor: number;
  cost_of_freight_sea_multiplier: number;
}

export interface EconomicForecast {
  id: string;
  indicator_id: string;
  horizon_months_ahead: number;
  mean_projection_value: number;
  recession_risk_trigger_pct: number;
}

// ==========================================
// PHASE 232: European Weather Intelligence Model
// ==========================================
export interface WeatherEvent {
  id: string;
  target_country: 'France' | 'Germany' | 'Italy' | 'Spain' | 'Netherlands';
  event_type: 'Cold_Wave' | 'Heat_Wave' | 'Extended_Rainfall' | 'Early_Winter';
  current_temperature_c: number;
  deviation_from_norm_c: number;
  impact_category_category: string; // e.g. "Heavy Coats demand x1.5"
}

export interface WeatherPattern {
  id: string;
  region: string;
  seasonal_precipitaion_multiplier: number;
  historical_year_counterpart: string;
}

export interface WeatherPrediction {
  id: string;
  expected_arrival_days_countdown: number;
  confidence_rating: number; // 0-100
  recommended_stock_multiplier: number;
}

// ==========================================
// PHASE 233: Consumer Sentiment World Model
// ==========================================
export interface ConsumerSentiment {
  id: string;
  target_cohort_code: string;
  sentiment_score: number; // 0-100
  macro_economic_influence: 'Optimistic' | 'Neutral' | 'Pessimistic';
  last_updated_date: string;
}

export interface SentimentTrend {
  id: string;
  sentiment_id: string;
  movement_direction: 'Surging' | 'Steady' | 'Plunging';
  velocity_coefficient_score: number;
}

export interface SentimentSignal {
  id: string;
  sentiment_id: string;
  source_channel: string; // "Trustpilot_Euro", "LVMH_Macro_Report"
  signal_strength_index: number;
}

// ==========================================
// PHASE 234: Demand Simulation Engine
// ==========================================
export interface DemandModel {
  id: string;
  sku_category_focus: string;
  base_daily_velocity_units: number;
  weather_coefficient_multiplier: number;
  price_elasticity_score: number;
  competition_intensity_coefficient: number;
}

export interface DemandForecast {
  id: string;
  model_id: string;
  horizon_days: 30 | 60 | 90;
  estimated_sales_volume_units: number;
  stockout_risk_probability_pct: number;
}

export interface DemandResult {
  id: string;
  forecast_id: string;
  target_gross_margin_secured_pct: number;
  pricing_optimization_recommendation_override: number;
}

// ==========================================
// PHASE 235: Supply Shock Model
// ==========================================
export interface SupplyEvent {
  id: string;
  shock_cause_title: string; // e.g., "Suez Canal Bypass", "Lille Factory Lockdown"
  disrupted_node_type: 'Port' | 'Factory' | 'Customs' | 'Raw_Material';
  escalation_status: 'Monitoring' | 'Active_Surcharge' | 'Critical_Blocked';
  duration_days_anticipated: number;
}

export interface SupplyShock {
  id: string;
  event_id: string;
  raw_material_yield_reduction_pct: number;
  estimated_freight_surcharge_eur: number;
  affected_store_ids: string[];
}

export interface SupplyPrediction {
  id: string;
  shock_id: string;
  safety_buffer_adjustment_required_pct: number;
  remedy_hub_transfer_cost_estimate: number;
}

// ==========================================
// PHASE 236: Market Opportunity Radar
// ==========================================
export interface MarketOpportunity {
  id: string;
  target_country: 'France' | 'Germany' | 'Italy' | 'Spain' | 'UK';
  sub_region_or_category: string;
  market_growth_score: number; // 0-100
  projected_gross_margin_pct: number;
  competitor_saturation_index: number; // 0-100
  viability_tier_classification: 'Tier_1_Direct_Slay' | 'Tier_2_Medium_Viability' | 'Tier_3_High_Risk_Niche';
}

export interface OpportunityScore {
  id: string;
  opportunity_id: string;
  demand_pull_multiplier: number;
  logistic_cost_drain_score: number;
  net_strategic_viability_score: number;
}

// ==========================================
// PHASE 237: Competitive Dynamics Simulator
// ==========================================
export interface CompetitorEvent {
  id: string;
  competitor_name: string;
  predicted_action_type: 'Price_Flash_Markdown' | 'Promo_Campaign_Launch' | 'Inventory_Expansion' | 'New_Material_Focus';
  assessed_threat_density: number; // 0-100
  predicted_execution_week: string;
}

export interface CompetitorPrediction {
  id: string;
  event_id: string;
  estimated_gmv_risk_exposure_pct: number;
  recommended_price_offset_pct: number;
}

// ==========================================
// PHASE 238: World State Timeline
// ==========================================
export interface WorldTimeline {
  id: string;
  observed_period_cycle: string; // e.g. "Q1-2026"
  recorded_macro_event_count: number;
  future_predictions_compiled: number;
  system_learning_index_score: number; // 0-100
}

export interface TimelineEvent {
  id: string;
  timeline_id: string;
  event_timestamp: string;
  event_title: string;
  associated_risk_tag: string;
  phase_impact_tag: string;
}

export interface TimelinePrediction {
  id: string;
  timeline_id: string;
  target_date: string;
  prediction_thesis: string;
  realization_confidence_pct: number;
}

// ==========================================
// PHASE 239: Causal Impact Engine
// ==========================================
export interface CausalChain {
  id: string;
  chain_name: string; // "European Blasted Freeze Cascade"
  primary_trigger_cause: string;
  impact_coefficient_index: number; // 0-100
}

export interface CausalNode {
  id: string;
  chain_id: string;
  node_sequence_index: number;
  causal_phrase: string; // e.g. "FR Cold Wave -> Coat Demand Up"
  downstream_impact_weight_pct: number;
}

export interface CausalResult {
  id: string;
  chain_id: string;
  validated_by_empirical_history: boolean;
  model_congruence_index: number; // 0-100
}

// ==========================================
// PHASE 240: Unified World Model 2.0
// ==========================================
export interface WorldModel {
  id: string;
  aggregated_status_score: number; // 0-100
  opportunity_total_index: number; // 0-100
  risk_aggregate_index: number; // 0-100
  governor_alignment_level_pct: number;
  last_model_calculation_timestamp: string;
}

export interface WorldStateScore {
  id: string;
  model_id: string;
  score_time_sequence: string;
  europe_economic_index: number;
  consumer_confidence_score: number;
}

export interface WorldPredictionState {
  id: string;
  model_id: string;
  simulation_run_id: string;
  forecast_accuracy_score: number;
}

// ==========================================
// PHASES 241-250: Industry Knowledge Network
// ==========================================
export interface IndustryEntity {
  id: string;
  category: 'Apparel_Suite' | 'Footwear_Elite' | 'Premium_Bags' | 'High_Jewelry' | 'Luxury_Accessories';
  sub_category_name: string; // e.g., "Coat", "Merino Jacket", "Parisian Dress"
  material_composition_spec: string; // "Cashmere 100%"
  pricing_tier_anchors: string; // "Premium High"
  style_alignment_tag: string; // e.g. "Old Money" | "Quiet Luxury" | "Minimalist"
}

export interface IndustryRelation {
  id: string;
  source_entity_id: string;
  target_entity_id: string;
  domain_affinity_index: number; // 0-100
  connectivity_concept_phrase: string; // "Pairs with classic camel jackets"
}

// ==========================================
// PHASES 251-260: Global Fashion Ontology Engine
// ==========================================

// Phase 251: Fashion DNA Engine
export interface FashionDnaProfile {
  id: string;
  product_id: string;
  material_composition: string; // e.g. "100% Cashmere"
  season_affinity: 'Winter' | 'Summer' | 'Spring' | 'Autumn' | 'All_Season';
  luxury_coefficient: number; // 0-100
  price_tier: 'Low' | 'Medium' | 'High' | 'Ultra_Premium';
  style_type: string; // e.g. "Quiet Luxury"
}

export interface FashionDnaAttribute {
  id: string;
  dna_profile_id: string;
  attribute_key: string;
  attribute_val: string;
}

export interface FashionDnaScore {
  id: string;
  dna_profile_id: string;
  sustainability_index: number; // 0-100
  durability_rating: number; // 1-10
  margin_potential_score: number; // 0-100
}

export interface FashionDnaRelation {
  id: string;
  source_dna_id: string;
  target_dna_id: string;
  complementary_score: number; // 0-100
}

// Phase 252: Style Gene Engine
export interface StyleGene {
  id: string;
  gene_name: string; // e.g. "Old Money", "Quiet Luxury", "Parisian Chic"
  gene_code: string; // STY_OLDMNY
  historical_popularity_index: number; // 0-100
}

export interface StyleGenePattern {
  id: string;
  gene_id: string;
  pattern_signature: string; // e.g. "Tailored, clean silhouettes"
  primary_color_families: string[]; // e.g. ["beige", "camel", "navy"]
}

export interface StyleGeneWeight {
  id: string;
  gene_id: string;
  sku_category: string; // e.g. "Coat"
  weight_coefficient: number; // 0.0 - 1.0
}

// Phase 253: Material Intelligence Engine
export interface MaterialKnowledge {
  id: string;
  material_name: string; // e.g. "Cashmere", "Merino Wool", "Mulberry Silk"
  warmth_index: number; // 0-100
  breathability_index: number; // 0-100
  durability_index: number; // 0-100
}

export interface MaterialOntologyPerformance {
  id: string;
  material_id: string;
  average_return_rate_pct: number;
  shrinkage_risk_probability_pct: number;
}

export interface MaterialMarketScore {
  id: string;
  material_id: string;
  country_code: string; // e.g., 'FR', 'DE'
  premium_desirability_score: number; // 0-100
}

// Phase 254: Fashion Relationship Graph
export interface FashionGraphCluster {
  id: string;
  cluster_name: string; // e.g. "Sophisticated Winter Core"
  central_entity_id: string;
  entity_ids: string[];
  cohesion_index: number; // 0-100
}

// Phase 255: Product Semantic Understanding
export interface SemanticProduct {
  id: string;
  product_id: string;
  semantic_title_context: string;
  audience_archetype: string;
  perceived_value_eur: number;
}

export interface SemanticTag {
  id: string;
  semantic_product_id: string;
  tag_label: string;
  relevance_confidence_pct: number;
}

export interface SemanticEmbedding {
  id: string;
  semantic_product_id: string;
  vector_hash: string;
  latent_space_dimension_count: number;
}

// Phase 256-260: Ontology Reasoning Layer
export interface OntologyReasoningTask {
  id: string;
  task_name: string;
  triggered_by: string; // e.g. "weather_cold_wave", "manual_run"
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: string;
}

export interface OntologyReasoningResult {
  id: string;
  task_id: string;
  logic_deduction_sequence: string[];
  confidence_score: number; // 0-100
}

export interface OntologyInsight {
  id: string;
  insight_type: string; // e.g. "Demand_Heuristics", "Pricing_Hedging"
  subject_entity: string; // e.g. "Premium Wool Coats in France"
  rational_explanation: string;
  recommended_action_code: string;
  impact_rating_score: number; // 0-100
  timestamp: string;
}

// Phase 261-270: European Consumer Intelligence
export interface ConsumerPersona {
  id: string;
  persona_name: string; // e.g. "法国时尚白领", "德国理性商务"
  country: string; // e.g. "FR", "DE", "IT", "GB"
  gender: 'Female' | 'Male' | 'Unisex';
  age_segment: '18-24' | '25-34' | '35-50' | '50+';
  market_category: 'Luxury' | 'Premium' | 'Pragmatic' | 'Casual';
  preferred_channels: string[]; // e.g. ["Instagram", "Direct Store", "Email"]
  monthly_fashion_budget: number; // in Euros
  conversion_probability: number; // 0-100
}

export interface PurchaseMotivation {
  id: string;
  persona_id: string;
  primary_motivator: string; // e.g. "Social Status", "Physical Comfort", "Eco-Consciousness"
  social_proof_weight: number; // 0-100
  quality_importance: number; // 0-100
  price_weight: number; // 0-100
  sustainability_score: number; // 0-100
}

export interface PriceSensitivity {
  id: string;
  persona_id: string;
  price_tolerance_index: number; // 0-100
  promotion_buyer_flag: number; // 0 or 1
  luxury_markup_acceptance_ratio: number; // e.g. 1.5 - 3.0
}

export interface LifestyleCluster {
  id: string;
  persona_id: string;
  cluster_name: string; // e.g. "Urban Minimalist", "Agritourism Eco", "High-Street Commuter"
  work_home_ratio: number; // 0-100
  brand_loyalty_index: number; // 0-100
}

export interface RegionalPreference {
  id: string;
  country: string; // e.g. 'FR', 'DE', 'IT', 'GB'
  color_preference: string; // e.g. 'Navy/Beige', 'Black/Dark', 'Warm/Tonal', 'Grey/Navy'
  silhouette_preference: string; // e.g. 'Tailored Fit', 'Relaxed Oversized', 'Classic Structured'
  average_size_preference: string; // e.g. '38-40 (M)', '36-38 (S)', '40-42 (L)'
}

export interface AgeSegmentBehavior {
  id: string;
  age_segment: string; // e.g. '18-24', '25-34', '35-50', '50+'
  seasonal_switching_frequency: number; // e.g. 4
  influencer_susceptibility_score: number; // 0-100
}

// Phase 271: Demand Signal Engine
export interface DemandSignal {
  id: string;
  source_id: string;
  signal_type: string; // e.g. 'Temperature Drop', 'Tourism Boom'
  magnitude_score: number; // 0-100
  recorded_at: string;
  status: 'Active' | 'Processed' | 'Suppressed';
}

export interface DemandSignalSource {
  id: string;
  name: string;
  category: 'Weather' | 'Temperature' | 'Holiday' | 'WageCycle' | 'Tourism' | 'SocialHeat' | 'Competitor';
  base_weight: number; // 0-100
  is_active: boolean;
}

export interface DemandSignalWeight {
  id: string;
  source_id: string;
  country: string; // 'FR' | 'DE' | 'IT' | 'GB'
  applied_weight: number; // 0-100
}

export interface DemandSignalHistory {
  id: string;
  signal_id: string;
  date_logged: string;
  previous_value: number;
  new_value: number;
}

// Phase 272: Regional Demand Forecast
export interface RegionalForecast {
  id: string;
  country: string; // 'FR' | 'DE' | 'IT' | 'GB'
  category_name: string; // e.g. 'Wool Coats', 'Knitwear', 'Silk Blouses'
  time_horizon: '7d' | '30d' | '90d';
  forecasted_growth_pct: number; // e.g. +14.5%
  confidence_score: number; // 0-100
  model_id: string;
  run_date: string;
}

export interface RegionalForecastModel {
  id: string;
  model_name: string;
  version: string;
  hyperparameters: string;
  accuracy_score: number; // e.g. 92.4
}

export interface RegionalForecastResult {
  id: string;
  forecast_id: string;
  trend_direction: 'UP' | 'DOWN' | 'STABLE';
  upper_bound_pct: number;
  lower_bound_pct: number;
}

// Phase 273: Trend Detection Engine
export interface TrendSignalV2 {
  id: string;
  trend_name: string; // 'Quiet Luxury' | 'Old Money' | 'Oversized' | 'Minimalist'
  signal_strength: number; // 0-100
  source_platform: string; // e.g. 'Vogue Analytics', 'TikTok Spikes'
  detection_date: string;
}

export interface TrendPattern {
  id: string;
  pattern_name: string;
  coherence_score: number; // 0-100
  lifecycle_velocity: 'Accelerating' | 'Steady' | 'Decelerating';
}

export interface TrendEvent {
  id: string;
  title: string;
  impact_factor: number; // 1-10 scale
  event_date: string;
}

export interface TrendAlert {
  id: string;
  title: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  triggered_at: string;
  is_acknowledged: boolean;
}

// Phase 274: Fashion Lifecycle Engine
export interface ProductLifecycleV2 {
  id: string;
  product_id: string;
  current_stage: 'Introduction' | 'Growth' | 'Maturity' | 'Decline';
  days_in_stage: number;
  predicted_stage_transition_date: string;
}

export interface LifecycleStage {
  id: string;
  stage_name: 'Introduction' | 'Growth' | 'Maturity' | 'Decline';
  typical_duration_days: number;
  target_margin_pct: number;
}

export interface LifecyclePredictionV2 {
  id: string;
  product_id: string;
  predicted_peak_demand_date: string;
  terminal_salvage_value_pct: number;
}

// Phase 275: Inventory Demand Intelligence
export interface InventoryForecast {
  id: string;
  product_id: string;
  country: string;
  days_to_stockout: number;
  predicted_overstock_units: number;
  recommended_safety_stock: number;
}

export interface InventoryRecommendation {
  id: string;
  product_id: string;
  recommendation_type: 'Replenish' | 'Mark Down' | 'Reallocate' | 'Hold';
  recommended_qty: number;
  potential_profit_restored: number;
}

export interface InventoryRiskAlert {
  id: string;
  product_id: string;
  risk_type: 'Stockout' | 'Overstock' | 'Supply Delay';
  risk_severity: 'Medium' | 'High' | 'Critical';
  triggered_date: string;
}

// Phase 276: Price Elasticity AI
export interface PriceElasticityModel {
  id: string;
  product_id: string;
  elasticity_coefficient: number; // e.g. -1.85
  optimal_price: number;
  current_price: number;
}

export interface ElasticityObservation {
  id: string;
  product_id: string;
  price_point: number;
  observed_demand_units: number;
  observation_date: string;
}

export interface ElasticityPrediction {
  id: string;
  product_id: string;
  simulated_price_change_pct: number; // e.g. +5 or -10
  predicted_volume_change_pct: number;
  predicted_profit_change_pct: number;
}

// Phase 277: Promotion Intelligence Engine
export interface PromotionModel {
  id: string;
  promo_type: 'Percentage' | 'FixedAmount' | 'BOGO' | 'GiftWithPurchase';
  expected_uplift_pct: number;
  historical_roi: number;
}

export interface PromotionEffectiveness {
  id: string;
  campaign_name: string;
  conversion_rate_multiplier: number;
  margin_dilution_pct: number;
}

export interface PromotionPrediction {
  id: string;
  campaign_id: string;
  predicted_gmv_uplift: number;
  predicted_units_sold: number;
}

// Phase 278: Demand Risk Engine
export interface DemandRisk {
  id: string;
  risk_category: 'DemandCrash' | 'Overstock' | 'SupplyChainDelay' | 'MarketVolatility';
  risk_score: number; // 0-100
  description: string;
  mitigation_playbook: string;
}

export interface MarketRisk {
  id: string;
  macro_variable: string; // e.g. 'EUR Inflation Spot', 'Consumer Mood Index FR'
  current_deviation_pct: number;
  risk_level: 'Safe' | 'Warning' | 'Hazard';
}

export interface SupplyRisk {
  id: string;
  supplier_id: string;
  delay_probability_pct: number;
  capacity_utilization_pct: number;
}

// Phase 279: Opportunity Discovery Engine
export interface Opportunity {
  id: string;
  opportunity_title: string;
  niche_tag: string; // e.g. 'French Wool Coat'
  country: string;
  demand_growth_pct: number;
  competition_index: number; // 0-100
  profit_margin_space_pct: number;
}

export interface OpportunityScoreV2 {
  id: string;
  opportunity_id: string;
  viability_score: number; // 0-100
  confidence_factor: number; // 0-100
}

export interface OpportunityAction {
  id: string;
  opportunity_id: string;
  suggested_action: string;
  action_status: 'Discovered' | 'Executing' | 'Completed';
}

// Phase 280: Autonomous Forecast Board
export interface ForecastBoardReport {
  id: string;
  report_title: string;
  author_agent_id: string; // e.g. 'DemandIntelligenceAgent'
  summary_text: string;
  created_at: string;
}

export interface ForecastBoardDecision {
  id: string;
  report_id: string;
  subject: string;
  required_action: string;
  p_success: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface ForecastBoardAction {
  id: string;
  decision_id: string;
  task_executor_agent: string;
  execution_log_summary: string;
  execution_status: 'Scheduled' | 'In Progress' | 'Success' | 'Failed';
}

// Phase 321-330: Enterprise Memory Consolidation Engine
export interface MemoryPattern {
  id: string;
  pattern_name: string; // e.g. "法国羊毛大衣秋冬大卖"
  context_tags: string[]; // ['France', 'Wool', 'Coat', 'Autumn', 'Winter']
  success_rate: number; // e.g. 89 (in %)
  total_applications: number;
  last_applied_at: string;
}

export interface MemoryWeight {
  id: string;
  pattern_id: string;
  factor_name: string; // e.g. "Material: Wool" or "Country: France"
  weight_modifier: number; // e.g. 1.35
  is_positive: boolean;
}

export interface MemoryConfidence {
  id: string;
  pattern_id: string;
  confidence_score: number; // 0-100 indicating confidence based on sample size and deviation
  sample_size: number;
  std_deviation: number;
}

export interface MemoryDecay {
  id: string;
  pattern_id: string;
  half_life_days: number;
  current_decay_factor: number; // 0.0 to 1.0 (retains full weight or decays over time)
  last_decay_calculated_at: string;
}

export interface MemoryReinforcement {
  id: string;
  pattern_id: string;
  reinforcement_event: string; // e.g. "Autumn 2025 Campaign Success"
  adjustment_delta: number; // e.g., +5
  logged_at: string;
}

// Phase 331-340: Autonomous Agent Governance Engine
export interface AgentDebate {
  id: string;
  topic?: string; // e.g., "Marketing wants to drop price of Wool Coat by 25%"
  initiator_agent_id?: string; // 'marketing_agent'
  status: 'active' | 'resolved' | 'vetoed' | 'OPEN' | 'VOTING' | 'RESOLVED';
  created_at: string;
  context_data?: string;

  // Modern Coordination Engine integrations
  issue_title?: string;
  resolved_at?: string;
  initiator?: string;
  compromising_summary?: string;
}

export interface AgentVote {
  id: string;
  debate_id: string;
  agent_id?: string; // 'finance_agent', etc.
  vote?: 'approve' | 'oppose' | 'abstain';
  rationale?: string; // reasoning phrase
  voted_at?: string;

  // Modern Coordination Engine integrations
  agent_role?: 'MarketingAgent' | 'InventoryAgent' | 'PricingAgent' | 'CustomerAgent' | 'FinanceAgent';
  vote_position?: string;
  reason?: string;
  timestamp?: string;
}

export interface AgentConsensus {
  id: string;
  debate_id: string;
  outcome_summary?: string; // "Drop price by 10% instead of 20%, and run a VIP-only push."
  agreement_rate?: number; // e.g. 75 (%)
  is_implemented?: boolean;
  resolved_at?: string;

  // Modern Coordination Engine integrations
  final_decision_summary?: string;
  confidence_rating_pct?: number;
  approved_rules?: string[];
}

export interface AgentVeto {
  id: string;
  debate_id: string;
  vetoing_agent_id: string; // 'finance_agent'
  veto_reason: string; // "Profit margin drops below 15% threshold set by core constitution."
  vetoed_at: string;
}

// Phase 341-350: Enterprise Simulation Engine
export interface EnterpriseSimulationForecast {
  gmv_eur: number;
  ebitda_eur: number;
  stock_level_pct: number;
  cash_flow_balance_eur: number;
}

export interface EnterpriseSimulation {
  id: string;
  simulation_name: string; // e.g. "2026年全市场综合仿真系统"
  simulated_at: string;
  regions: string[]; // ['France', 'Germany', 'Italy']
  stock_model_params: string; // "Just-in-Time Hubs, Alpine safety buffs"
  ad_model_params: string; // "Scale search 2.5x, dynamic social push"
  logistic_model_params: string; // "Direct-to-consumer express shipping routes"
  cashflow_model_params: string; // "30-day merchant payout deferrals"
  forecast_90_days: EnterpriseSimulationForecast;
  forecast_180_days: EnterpriseSimulationForecast;
  forecast_360_days: EnterpriseSimulationForecast;
}

// Phase 351-360: Strategic Campaign Engine
export interface CampaignKPIs {
  target_gmv: number;
  target_roi: number;
  current_gmv: number;
  current_roi: number;
}

export interface StrategicCampaign {
  id: string;
  campaign_name: string; // e.g., "Winter Warmth Wool Campaign"
  type: 'Winter' | 'BlackFriday' | 'Summer' | 'MarketExpansion';
  goal: string; // "Increase French wool coat stock turn rates to 4.2x while keeping Gross Margin >= 45%"
  status: 'draft' | 'active' | 'completed';
  budget_allocated: number; // in EUR
  kpis: CampaignKPIs;
  workflow_steps: string[]; // ["Sync alpine inventories", "Target Paris persona", "Deploy 15% VIP code"]
  learnings: string[]; // ["Experienced 92% lift in Parisian core segment", "Minor size returns on L sizes"]
  created_at: string;
}

// Phase 371-380: Enterprise Risk Intelligence Engine
export interface RiskIncident {
  id: string;
  incident_name: string; // e.g., "马赛港口海关遭遇间歇性罢工"
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'mitigating' | 'resolved';
  category: 'Logistics' | 'Financial' | 'Inventory' | 'ExchangeRate' | 'Compliance';
  trigger_details: string; // "巴黎时段气象异常 + 卡来尔运河积淤"
  detected_at: string;
}

export interface RiskMitigationRule {
  id: string;
  incident_id: string;
  rule_name: string; // "路由重定向-绕行里昂高架快线"
  action_dispatched: string; // "分流马赛滞留货品200件到马恩河谷备选仓"
  mitigation_effectiveness_pct: number; // 0-100%
  executed_at: string;
}

// Phase 381-390: Autonomous Opportunity Discovery Engine
export interface SpotOpportunity {
  id: string;
  opportunity_title: string; // e.g., "慕尼黑周末强寒流，大衣毛利套利空间额外+8%"
  category: 'MarketDemand' | 'Arbitrage' | 'AdChannel' | 'PriceOptimization';
  confidence_score: number; // 0-100
  projected_gmv_impact: number; // in EUR
  status: 'discovered' | 'evaluating' | 'activated' | 'ignored';
  discovered_at: string;
}

export interface GrowthCatalyst {
  id: string;
  opportunity_id: string;
  action_taken: string; // "自动上浮1.8%广告流量系数，并发起冷冬折扣券"
  actual_gmv_lift_eur: number;
  roi_achieved: number;
  logged_at: string;
}

// Phase 391-400: Executive Operating System
export interface ExecTask {
  id: string;
  task_name: string; // e.g. "自动路由转移：里尔仓 - 索恩主干线路"
  executor_agent_id: string; // "inventory_agent"
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'running' | 'completed' | 'failed';
  system_health_index: number; // 0-100
  execution_log: string[]; // ["Task initialised", "Executing secure API route proxy...", "Success"]
  completed_at: string;
}

export interface SystemHealthHeartbeat {
  id: string;
  timestamp: string;
  cpu_usage_pct: number;
  memory_usage_pct: number;
  db_queue_backlog: number;
  agent_active_threads_count: number;
  os_status: 'healthy' | 'degraded' | 'critical';
}

// Learning Engine Risk outcome evaluation
export interface RiskOutcome {
  id: string;
  incident_id: string;
  action_taken: string;
  expected_loss_eur: number;
  actual_loss_eur: number;
  mitigation_effectiveness_pct: number;
  resolved_at: string;
}

// Phase 401-410: Business Context Engine
export interface BusinessContextSnapshot {
  id: string;
  tenant_id: string;
  store_id: string;
  snapshot_timestamp: string;
  who_am_i_country: string;
  who_am_i_language: string;
  where_am_i_module: string;
  what_am_i_doing_task: string;
}

export interface ContextEvent {
  id: string;
  tenant_id: string;
  store_id: string;
  event_type: string; // "NAV_PAGE", "TASK_ENGAGE", "GOAL_ALINE"
  description: string;
  timestamp: string;
}

export interface ContextRecommendationResult {
  id: string;
  recommendation_id: string;
  applied_status: 'pending' | 'success' | 'failed';
  feedback_score: number;
  logged_at: string;
}

// Phase 411-420: Store Readiness Engine
export interface StoreReadiness {
  id: string;
  tenant_id: string;
  store_id: string;
  overall_score: number;
  assessment_date: string;
}

export interface StoreChecklist {
  id: string;
  store_id: string;
  item_name: string;
  category: 'Language' | 'Market' | 'Tax' | 'Policy' | 'Shipping' | 'Review' | 'Payment';
  status: 'pending' | 'completed';
  required_country: string;
  weight: number;
}

export interface StoreGap {
  id: string;
  store_id: string;
  gap_type: string; // "No localized VAT OSS", "Missing French Translate", "French payment overlay offline"
  severity: 'low' | 'medium' | 'high' | 'critical';
  remedy_directive: string;
  status: 'open' | 'resolved';
}

// Phase 421-430: External Intelligence Stream
export interface ExternalSignal {
  id: string;
  source: 'Google Trends' | 'TikTok Trends' | 'European Weather' | 'Competitor Watch' | 'SocioEconomic';
  signal_title: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact_coefficient: number; // e.g. +1.35
  signal_value: string; // e.g. "Rainy cold front in Paris/Berlin"
  harvested_at: string;
}

// Phase 431-450: European Fashion Market Radar
export interface MarketRadarTrend {
  id: string;
  country_code: string; // "FR", "DE", "NL", "BE"
  style_heat_index: number; // 0-100
  style_category: string; // "Oversized Knitwear", "Silk Shirts", "Heavy Woolen Coats"
  momentum_pct: number; // e.g. +48.2%
  radar_status: 'SURGING' | 'STABLE' | 'DECAYING';
  last_updated: string;
}

// Phase 451-470: Copilot Core
export interface CopilotPerceptionState {
  id: string;
  tenant_id: string;
  store_id: string;
  active_intent: string; // "LAUNCH_COMPLIANCE", "PROMO_CAMPAIGN", "RISK_MITIGATION"
  confidence: number; // 0-100
  multimodal_triggers: string[]; // ["PAGE_URL", "USER_QUESTION", "OUTSIDE_WEATHER"]
  orchestrator_next_actions: string[]; // ["Trigger oss setup", "Alert pricing agent"]
  updated_at: string;
}

// Phase 471-480: Agent Workforce Runtime
export interface AgentMission {
  id: string;
  agent_role: 'MarketingAgent' | 'InventoryAgent' | 'PricingAgent' | 'CustomerAgent' | 'FinanceAgent';
  mission_title: string;
  status: 'PENDING' | 'EXECUTING' | 'SUGGESTION_READY' | 'SUCCESS' | 'CANCELLED';
  priority: 'P1' | 'P2' | 'P3';
  started_at: string;
  payload: Record<string, any>;
}

export interface AgentExecutionLog {
  id: string;
  agent_role: 'MarketingAgent' | 'InventoryAgent' | 'PricingAgent' | 'CustomerAgent' | 'FinanceAgent';
  action_type: string; // "READ_TABLE", "WRITE_TABLE", "EXECUTE_CALC"
  affected_tables: string[]; // e.g. ["store_checklists", "products"]
  description: string;
  generated_value_eur: number;
  logged_at: string;
}

export interface AgentWorkload {
  id: string;
  agent_role: 'MarketingAgent' | 'InventoryAgent' | 'PricingAgent' | 'CustomerAgent' | 'FinanceAgent';
  current_tasks_count: number;
  cpu_allocation_pct: number;
  memory_allocation_mb: number;
  system_state: 'IDLE' | 'BUSY' | 'STRESSED';
}

// Phase 491-500: Autonomous Execution Governance
export interface ExecutionPermission {
  id: string;
  action_key: string; // e.g. "MARKDOWN_PRICE_20", "UPDATE_VAT_REGISTRY"
  agent_role: 'MarketingAgent' | 'InventoryAgent' | 'PricingAgent' | 'CustomerAgent' | 'FinanceAgent';
  requires_manual_approval: boolean;
  min_confidence_pct: number;
  governance_check_status: 'PASS' | 'RESTRICTED' | 'WARNING';
}

export interface ExecutionLimit {
  id: string;
  agent_role: 'MarketingAgent' | 'InventoryAgent' | 'PricingAgent' | 'CustomerAgent' | 'FinanceAgent';
  max_hourly_budget_eur: number;
  max_daily_changes_count: number;
  current_used_budget_eur: number;
  updated_at: string;
}

export interface ExecutionAudit {
  id: string;
  agent_role: 'MarketingAgent' | 'InventoryAgent' | 'PricingAgent' | 'CustomerAgent' | 'FinanceAgent';
  affected_row_id: string;
  action_summary: string;
  risk_rating: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'AUDITED' | 'FLAGGED' | 'RESOLVED_BY_ADMIN';
  logged_at: string;
}

// Phase 501-520: Business Context Engine 2.0 (Sidekick Gateway metadata)
export interface ContextGapV2 {
  id: string;
  gap_code: string; // "GAP_VAT_EU" etc.
  gap_name: string;
  why_missing: string;
  remedy_agent: 'MarketingAgent' | 'InventoryAgent' | 'PricingAgent' | 'CustomerAgent' | 'FinanceAgent';
  priority: 'P1' | 'P2' | 'P3';
  impact_loss_eur_mo: number;
  readiness_hit_pct: number;
  status: 'PENDING_FIX' | 'DEPLOYED_HEALER' | 'FIXED';
}

// Phase 521-526: Brain Stream API (企业大脑消息总线)
export interface BrainEvent {
  id: string;
  event_type: 'GOAL_CREATED' | 'GOAL_COMPLETED' | 'GOAL_FAILED' | 'STRATEGY_PLANNED' | 'BUDGET_WARN' | 'STORE_GAP_FOUND' | 'TASK_BLOCKED' | 'ANOMALY' | 'COMPLIANCE_PASS' | 'CAMPAIGN_TRIGGER';
  tenant_id: string;
  store_id: string;
  priority: 'INFO' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  recommended_action?: string;
  payload?: Record<string, any>;
  timestamp: string;
}

export interface BrainChannel {
  id: string;
  channel_code: string; // "SIDEKICK_CHAT", "EMAIL_FEED", "ADMIN_PANEL_REALTIME", "SYSTEM_WEBHOOK"
  channel_name: string;
  channel_status: 'ACTIVE' | 'PAUSED' | 'BROKEN';
  subscribers_count: number;
  last_published_at?: string;
}

export interface BrainStream {
  id: string;
  stream_name: string; // "General Output Stream", "Security & Governance Stream", "Merchant Analytics Broadcast"
  stream_key: string; // "general", "governance", "analytics"
  data_throughput_kb: number;
  total_events_dispatched: number;
  status: 'ONLINE' | 'OFFLINE';
  updated_at: string;
}

export interface BrainNotification {
  id: string;
  tenant_id: string;
  store_id: string;
  source_event_id: string;
  destination_channel: string; // e.g. "SIDEKICK_CHAT"
  notification_content: string;
  delivery_status: 'QUEUED' | 'SENT' | 'DELIVERED' | 'FAILED';
  acknowledged: boolean;
  dispatched_at: string;
}

// Phase 527-533: Page & Store Awareness Bridge (页面感知桥)
export interface PageContext {
  id: string;
  page_type: string; // "dashboard" | "products" | "orders" | "marketing" | "settings_markets" | "settings_general" etc.
  module: string; // "store_setup" | "sales" | "inventory" ...
  context_key: string;
  extracted_metadata: Record<string, any>;
  is_active: boolean;
  last_visited_at: string;
}

export interface StoreContext {
  id: string;
  tenant_id: string;
  store_id: string;
  locale: string;
  base_currency: string;
  active_sales_channels: string[]; // ["Shopify Storefront", "Amazon", "TikTok Shop"]
  shipping_zones_count: number;
  is_vat_registered: boolean;
  compliance_score: number; // 0 - 100
  updated_at: string;
}

export interface ContextSnapshot {
  id: string;
  tenant_id: string;
  store_id: string;
  snapshot_time: string;
  associated_page_type: string;
  captured_elements: {
    url: string;
    queryParams: Record<string, string>;
    stateIdentifiers: string[];
  };
  integrity_hash: string;
}

export interface ContextSession {
  id: string;
  tenant_id: string;
  store_id: string;
  session_token: string;
  started_at: string;
  ended_at?: string;
  is_active: boolean;
}

export interface ContextTransition {
  id: string;
  tenant_id: string;
  store_id: string;
  from_page: string;
  to_page: string;
  transition_trigger: string;
  timestamp: string;
}

export interface BotbleEventLog {
  id: string;
  tenant_id: string;
  store_id: string;
  hook_category: string;
  event_payload: string;
  acting_commander: string;
  resolution_status: 'SUCCEEDED' | 'FAILED' | 'PENDING';
  resolution_log: string;
  timestamp: string;
}


// Phase 534-540: Task Gateway Isolation (任务隔离网关)
export interface TaskRequest {
  id: string;
  tenant_id: string;
  store_id: string;
  target_agent_role: 'MarketingAgent' | 'InventoryAgent' | 'PricingAgent' | 'CustomerAgent' | 'FinanceAgent';
  task_action_type: 'REPLENISH_STOCK' | 'ADJUST_PRICE' | 'CREATE_COUPON' | 'CREATE_MARKET' | 'TRIGGER_ROLLBACK';
  task_payload: Record<string, any>;
  requested_by: string; // "User" | "Sidekick" | "WorkflowEngine"
  status: 'PENDING_RESOLVE' | 'APPROVED' | 'DENIED' | 'EXECUTING' | 'SUCCESSFUL' | 'FAILED';
  risk_rating: 'LOW' | 'MEDIUM' | 'HIGH';
  created_at: string;
}

export interface TaskAudit {
  id: string;
  task_request_id: string;
  audited_by: string; // "TenantIsolationGuard"
  tenant_isolation_passed: boolean;
  permission_resolved_passed: boolean;
  audit_message: string;
  audited_at: string;
  governor_signature: string;
}

export interface TaskApproval {
  id: string;
  task_request_id: string;
  approved_by: string; // "Governor" | "SuperAdmin" | "AutoHealer"
  applied_rules_count: number;
  override_reason?: string;
  approved_at: string;
}

export interface TaskDenial {
  id: string;
  task_request_id: string;
  denied_by: string; // "TenantIsolationGuard" | "LimitEnforcer"
  violated_rule_code: string; // "TENANT_MISMATCH" | "BUDGET_EXCEEDED" | "PERMISSION_RESTRICTED"
  denial_reason: string;
  denied_at: string;
}

// Phase 541-550: Brain Runtime Engine
export interface BrainRuntimeState {
  id: string;
  tenant_id: string;
  store_id: string;
  current_page_type: string;
  current_user_id: string;
  active_goal_id?: string;
  active_workflow_id?: string;
  detected_risks: Array<{ code: string; label: string; severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' }>;
  detected_gaps: Array<{ code: string; label: string; remediation: string }>;
  system_load_status: 'HEALED' | 'WARNING' | 'CRITICAL';
  updated_at: string;
}

// Phase 551-560: Store Digital Twin
export interface StoreDigitalTwin {
  id: string;
  tenant_id: string;
  store_id: string;
  twin_status: 'SYNCED' | 'DRIFTED' | 'STALE';
  last_snapshot_at: string;
  learned_rules_json?: string;
  snapshot_data: {
    products_count: number;
    active_orders_count: number;
    enabled_markets: string[];
    currencies: string[];
    locales: string[];
    payment_gateways: Array<{ name: string; status: 'ACTIVE' | 'TEST_MODE' | 'INACTIVE' }>;
    shipping_rates_count: number;
    storefront_url: string;
    installed_apps: string[];
    legal_policies: string[];
  };
}

// Phase 561-570: Readiness Engine 2.0
export interface ReadinessScorecard {
  id: string;
  tenant_id: string;
  store_id: string;
  launch_score: number;       // 0-100
  growth_score: number;       // 0-100
  eu_ready_score: number;     // 0-100
  loc_ready_score: number;    // 0-100
  auto_ready_score: number;   // 0-100
  ai_ready_score: number;     // 0-100
  breakdowns: {
    products: number;
    payments: number;
    shipping: number;
    markets: number;
    translations: number;
    seo: number;
  };
  last_evaluated_at: string;
}

// Phase 581-600: Enterprise Action Graph
export interface ActionGraphNode {
  id: string;
  node_type: 'GOAL' | 'STRATEGY' | 'WORKFLOW' | 'AGENT' | 'TASK' | 'EXECUTION' | 'OUTCOME' | 'LEARNING';
  label: string;
  status: 'SUCCESS' | 'RUNNING' | 'FAILED' | 'PENDING';
  reference_id: string; // references real engine table id e.g. goalTaskId or strategyPlanId
  timestamp: string;
}

export interface ActionGraphEdge {
  id: string;
  source_node_id: string;
  target_node_id: string;
  relation_type: 'PLANNED_BY' | 'ENGAGED_IN' | 'DEPLOYED' | 'EXECUTION_TRACED' | 'RESULTED_IN' | 'FEEDBACK_TO';
}

export interface EnterpriseActionGraphData {
  id: string;
  tenant_id: string;
  store_id: string;
  nodes: ActionGraphNode[];
  edges: ActionGraphEdge[];
  updated_at: string;
}

export interface NavigationRegistryItem {
  id: string;
  name: string;
  aliases: string[];
  route: string;
  component: string;
  parent: string;
  status: 'LIVE' | 'TEST' | 'DEV' | 'DEPRECATED';
  permissions: string[];
  created_at: string;
}

export interface MemoryItem {
  memory_id: string;
  merchant_id: string;
  memory_type: 'fact' | 'execution' | 'business' | 'learning';
  source: string;
  content: string;
  importance: number;
  confidence: number;
  related_entity?: string;
  created_at: string;
  updated_at: string;
}

export interface MemoryLogItem {
  log_id: string;
  memory_id: string;
  agent: string;
  action: string;
  before: any;
  after: any;
  created_at: string;
}

export interface KnowledgeRecordItem {
  knowledge_id: string;
  merchant_id: string;
  knowledge_type: 'fact' | 'business' | 'strategy' | 'operation' | 'learning';
  source_memory_ids: string[];
  title: string;
  content: string;
  confidence: number;
  validation_score: number;
  status: 'pending_review' | 'approved' | 'conflicted' | 'deprecated';
  created_at: string;
  updated_at: string;
}

export interface KnowledgeValidationLogItem {
  log_id: string;
  knowledge_id: string;
  validator: string;
  validation_type: 'fact_consistency' | 'world_state_consistency' | 'history_execution_consistency' | 'cross_agent_validation';
  result: 'success' | 'failed';
  reason: string;
  confidence_before: number;
  confidence_after: number;
  created_at: string;
}

// ==========================================================
// P0-007 DNA Governance Runtime Interfaces
// ==========================================================
export interface DNARuleItem {
  rule_id: string;
  rule_type: 'business' | 'finance' | 'inventory' | 'risk' | 'permission' | 'compliance';
  rule_name: string;
  description: string;
  priority: number; // 1 (critical) to 5 (info)
  status: 'active' | 'inactive';
  created_at: string;
}

export interface DNAViolationItem {
  violation_id: string;
  agent: string;
  tool: string;
  rule_id: string;
  input: string; // serialized data checked
  reason: string;
  severity: 'block' | 'escalate' | 'review' | 'allow';
  created_at: string;
}

// ==========================================================
// P0-008 Evolution Runtime Interfaces
// ==========================================================
export interface EvolutionCandidateItem {
  candidate_id: string;
  source: string; // e.g. Memory, Knowledge, Execution, World State
  category: string; // e.g. 'high-roi', 'high-profit', 'inventory-pattern', 'ad-pattern', 'risk-pattern'
  description: string;
  confidence: number;
  impact_score: number; // 1-100 rating
  status: 'pending' | 'simulated' | 'approved' | 'rejected' | 'evolved' | 'rolled_back';
  created_at: string;
}

export interface EvolutionRunItem {
  run_id: string;
  candidate_id: string;
  result: 'success' | 'failed' | 'rolled_back';
  impact_before: number;
  impact_after: number;
  status: 'simulating' | 'active' | 'rolled_back';
  created_at: string;
}

// ==========================================================
// P0-009 Enterprise Nervous System Runtime Interfaces
// ==========================================================
export interface NervousEventItem {
  event_id: string;
  event_type: 'world_state' | 'tool' | 'agent' | 'memory' | 'knowledge' | 'dna' | 'evolution' | 'audit';
  source: string; // Actor / Agent or System component name
  source_runtime: string; // e.g. 'WorldStateRuntime', 'ToolRuntime', etc.
  payload: string; // Serialized JSON payload or general info
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'dispatched' | 'failed' | 'dead_letter';
  created_at: string;
}

export interface NervousSubscriptionItem {
  subscription_id: string;
  subscriber: string; // Agent name, micro-service or subscriber callback label
  event_type: 'world_state' | 'tool' | 'agent' | 'memory' | 'knowledge' | 'dna' | 'evolution' | 'audit' | 'all';
  priority: number;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface NervousDispatchLogItem {
  dispatch_id: string;
  event_id: string;
  target: string; // Target agent/subscribers
  status: 'success' | 'failed' | 'retry';
  latency: number; // latency in milliseconds
  created_at: string;
}

export interface AgentMessageItem {
  message_id: string;
  task_id: string;
  sender: string;
  receiver: string;
  message_type: 'query' | 'response' | 'instruction' | 'broadcast' | 'alert';
  content: string;
  status: 'sent' | 'received' | 'processed';
  created_at: string;
}

// ==========================================================
// P0-010 Enterprise Governor Runtime Interfaces
// ==========================================================
export interface GovernorPolicyItem {
  policy_id: string;
  policy_type: 'financial_limit' | 'inventory_risk' | 'ad_spend' | 'compliance' | 'permission_escalation';
  policy_name: string;
  description: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  approval_mode: 'automatic' | 'manual_admin' | 'multi_signature' | 'emergency_bypass';
  status: 'active' | 'suspended';
  created_at: string;
}

export interface GovernorDecisionItem {
  decision_id: string;
  task_id: string;
  source: string; // Calling agent or component
  decision: 'approved' | 'rejected' | 'escalated' | 'circuit_broke' | 'emergency_blocked';
  reason: string;
  risk_score: number; // 0 to 100
  confidence: number; // 0.0 to 1.0 (Governor's assessment confidence)
  created_at: string;
}

export interface GovernorAuditLogItem {
  audit_id: string;
  decision_id: string;
  action: 'approve' | 'reject' | 'escalate' | 'circuit_breaker_triggered' | 'system_locked' | 'unlocked' | 'rollback';
  before_state: string; // serialized JSON
  after_state: string; // serialized JSON
  operator: string; // 'System' | 'Admin' | 'Orchestrator'
  created_at: string;
}

// ==========================================================
// P0-011 Autonomous Planning Runtime Interfaces
// ==========================================================
export interface PlanningGoalItem {
  goal_id: string;
  merchant_id: string;
  goal_type: 'growth' | 'profit' | 'inventory' | 'marketing' | 'operational';
  goal_name: string;
  priority: number; // 1 (critical) to 5 (low)
  target_value: string;
  status: 'pending' | 'planning' | 'active' | 'completed' | 'failed';
  created_at: string;
}

export interface PlanningTaskItem {
  task_id: string;
  goal_id: string;
  owner_agent: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  priority: number;
  created_at: string;
}

export interface PlanningRunItem {
  run_id: string;
  goal_id: string;
  plan_summary: string;
  expected_impact: string;
  actual_impact: string;
  status: 'running' | 'success' | 'failed' | 'aborted';
  created_at: string;
}

// ==========================================================
// P0-012 Self-Healing Runtime Interfaces
// ==========================================================
export interface HealingIncidentItem {
  incident_id: string;
  incident_type: 'world_state' | 'tool' | 'agent' | 'memory' | 'knowledge' | 'dna' | 'governor' | 'nervous_system' | 'planning';
  severity: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  description: string;
  status: 'detected' | 'diagnosed' | 'repaired' | 'validated' | 'resolved' | 'failed';
  created_at: string;
}

export interface HealingActionItem {
  action_id: string;
  incident_id: string;
  action_type: 'retry' | 'rollback' | 'resync' | 'revalidate' | 'rebuild_index' | 'isolate_agent' | 'freeze_tool';
  result: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  created_at: string;
}

export interface HealingAuditLogItem {
  audit_id: string;
  incident_id: string;
  action: string;
  before_state: string; // serialized state
  after_state: string; // serialized state
  created_at: string;
}



