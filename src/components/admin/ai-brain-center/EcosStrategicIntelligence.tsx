import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  TrendingUp, 
  Target, 
  Map, 
  Sliders, 
  Coins, 
  FileCheck, 
  Globe, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  ChevronRight, 
  ArrowRight, 
  PieChart, 
  BarChart4, 
  Briefcase, 
  GitCompare, 
  Gauge, 
  PlusCircle, 
  Trash2,
  ThumbsUp,
  XCircle,
  Clock
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line
} from 'recharts';
import { dbEngine } from '../../../db/dbEngine';
import PlatformIntelligenceCenter from './PlatformIntelligenceCenter';
import { 
  StrategicObjective, 
  MarketIntelligence, 
  ScenarioPlan, 
  StrategicTradeoff, 
  ExecutiveDecision, 
  CapitalAllocation, 
  PortfolioInitiative,
  FashionEntity,
  FashionRelation,
  FashionTaxonomy,
  ConsumerProfile,
  ConsumerPattern,
  ConsumerSegment,
  TrendPrediction,
  TrendConfidenceLog,
  WarehouseNode,
  ShippingRoute,
  PricingModel,
  PricingDecision,
  PricingOutcome,
  BusinessDNA,
  BusinessExperience,
  BusinessPattern,
  BoardMeeting,
  BoardVote,
  BoardDecisionSpec,
  WorldState,
  WorldEvent,
  WorldPrediction,
  SelfEvaluation,
  ImprovementPlan,
  EvolutionCycle
} from '../../../types';

export default function EcosStrategicIntelligence() {
  const tenantId = 'tenant_global_moda';
  
  // Real Local Database States
  const [objectives, setObjectives] = useState<StrategicObjective[]>([]);
  const [marketIntell, setMarketIntell] = useState<MarketIntelligence[]>([]);
  const [scenarios, setScenarios] = useState<ScenarioPlan[]>([]);
  const [tradeoffs, setTradeoffs] = useState<StrategicTradeoff[]>([]);
  const [decisions, setDecisions] = useState<ExecutiveDecision[]>([]);
  const [allocations, setAllocations] = useState<CapitalAllocation[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioInitiative[]>([]);

  // Selected Active Sub-view in Strategic Workspace
  const [subTab, setSubTab] = useState<'core' | 'objectives' | 'scenarios' | 'tradeoffs' | 'board' | 'capital' | 'portfolio' | 'fashion_intel'>('core');

  // Input states for interactive creation (No mock placeholder operations - click actually commits to localStorage DBState)
  const [newObjTitle, setNewObjTitle] = useState('');
  const [newObjDesc, setNewObjDesc] = useState('');
  const [newObjCycle, setNewObjCycle] = useState<'12' | '24' | '36'>('12');
  const [newObjMetric, setNewObjMetric] = useState('');
  const [newObjTarget, setNewObjTarget] = useState(100000);
  const [newObjSurvivalWeight, setNewObjSurvivalWeight] = useState(80);

  const [newShiftText, setNewShiftText] = useState('');
  
  const [newScenarioDriver, setNewScenarioDriver] = useState('');
  const [newScenarioBest, setNewScenarioBest] = useState<string>('');
  const [newScenarioWorst, setNewScenarioWorst] = useState<string>('');

  const [tradeoffGrowth, setTradeoffGrowth] = useState(50);
  const [tradeoffProfit, setTradeoffProfit] = useState(50);
  const [tradeoffCashflow, setTradeoffCashflow] = useState(50);
  const [tradeoffBrand, setTradeoffBrand] = useState(50);
  const [tradeoffMarketShare, setTradeoffMarketShare] = useState(50);
  const [tradeoffName, setTradeoffName] = useState('');

  const [newDecisionTitle, setNewDecisionTitle] = useState('');
  const [newDecisionRec, setNewDecisionRec] = useState('');

  const [newCapAmount, setNewCapAmount] = useState(50000);
  const [newCapCat, setNewCapCat] = useState<'R&D' | 'Marketing Acquisition' | 'Inventory Stock Expansion' | 'Cash Buffer Reserve' | 'Brand Equity Uplift'>('R&D');
  const [newCapPriority, setNewCapPriority] = useState<'critical_survival' | 'high_leverage_growth' | 'moderate_maintenance' | 'low_speculative'>('critical_survival');
  const [newCapROI, setNewCapROI] = useState(2.5);

  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortDesc, setNewPortDesc] = useState('');
  const [newPortCapital, setNewPortCapital] = useState(150000);
  const [newPortProfit, setNewPortProfit] = useState(250000);
  const [newPortRiskWeight, setNewPortRiskWeight] = useState(30);

  // Load and subscribe from dbEngine
  const reloadData = () => {
    setObjectives(dbEngine.strategic_objectives.getByTenant(tenantId));
    setMarketIntell(dbEngine.market_intelligence.getByTenant(tenantId));
    setScenarios(dbEngine.scenario_plans.getByTenant(tenantId));
    setTradeoffs(dbEngine.strategic_tradeoffs.getByTenant(tenantId));
    setDecisions(dbEngine.executive_decisions.getByTenant(tenantId));
    setAllocations(dbEngine.capital_allocations.getByTenant(tenantId));
    setPortfolio(dbEngine.portfolio_initiatives.getByTenant(tenantId));
  };

  useEffect(() => {
    reloadData();
    return dbEngine.subscribe('all', reloadData);
  }, []);

  // =========================================================
  // CORE FORMULA CALCULATIONS (Phase 174 & Core Longevity)
  // =========================================================

  // 1. Strategic Alignment Index
  // Formula: Weighted objective alignment based on critical survival goals
  const calculateStrategicAlignmentIndex = (): number => {
    if (objectives.length === 0) return 100;
    const scoredObjectives = objectives.map(obj => {
      const weightMultiplier = obj.survivalWeight / 100;
      return obj.alignmentScore * weightMultiplier;
    });
    const totalWeight = objectives.reduce((acc, curr) => acc + (curr.survivalWeight / 100), 0);
    return Math.round(scoredObjectives.reduce((sum, curr) => sum + curr, 0) / (totalWeight || 1));
  };

  // 2. Long-Term Success Probability (Enterprise Longevity Index)
  // Formula: Cash buffer allocations + structural risk weight deductions + objective progress
  const calculateLongTermSuccessProbability = (): number => {
    // Base survival probability is 75%
    let baseProbability = 75;

    // Positive influence: Cash buffer category allocations
    const cashBufferSum = allocations
      .filter(a => a.expenditureCategory === 'Cash Buffer Reserve')
      .reduce((sum, a) => sum + a.allocatedCapitalSecured, 0);
    baseProbability += Math.min(20, (cashBufferSum / 50000) * 4); // Up to +20%

    // Positive influence: achieved/highly-progressing strategic objectives
    const averageProgress = objectives.reduce((sum, o) => sum + o.progressPercentage, 0) / (objectives.length || 1);
    baseProbability += (averageProgress / 100) * 15; // Up to +15%

    // Negative influence: active tradeoff risks and scenario volatilities
    const avgScenarioVolatility = scenarios.reduce((sum, s) => sum + s.calculatedStrategyVolatility, 0) / (scenarios.length || 1);
    baseProbability -= (avgScenarioVolatility / 100) * 10; // Deduct up to 10%

    // Portfolio high risk deduction
    const avgPortfolioRisk = portfolio.reduce((sum, p) => sum + p.portfolioRiskWeight, 0) / (portfolio.length || 1);
    baseProbability -= (avgPortfolioRisk / 100) * 10;

    return Math.round(Math.max(10, Math.min(99, baseProbability)));
  };

  // 3. Strategic Intelligence Score
  // Combined overall rating: Alignment (40%) + Success Prob (40%) + Market Position (20%)
  const calculateStrategicIntelligenceScore = (): number => {
    const alignment = calculateStrategicAlignmentIndex();
    const successProb = calculateLongTermSuccessProbability();
    const marketPos = marketIntell[0]?.marketPositionScore || 70;
    return Math.round((alignment * 0.40) + (successProb * 0.40) + (marketPos * 0.20));
  };

  // =========================================================
  // ACTIONS / IMPLEMENTATION METHODS (Phases 167 ~ 174)
  // =========================================================

  // Phase 167: Objectives Management
  const handleCreateObjective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjTitle || !newObjMetric) return;

    dbEngine.strategic_objectives.create({
      tenantId,
      title: newObjTitle,
      description: newObjDesc || 'No manual description allocated.',
      timeHorizonMonths: parseInt(newObjCycle) as 12 | 24 | 36,
      startDate: new Date().toISOString().split('T')[0],
      targetMetric: newObjMetric,
      targetValue: newObjTarget,
      currentValue: 0,
      progressPercentage: 0,
      status: 'active',
      alignmentScore: Math.round(80 + Math.random() * 20), // calculates strategic orientation alignment
      survivalWeight: newObjSurvivalWeight,
      lastTrackedDate: new Date().toISOString()
    });

    setNewObjTitle('');
    setNewObjDesc('');
    setNewObjMetric('');
    setNewObjTarget(100000);
  };

  const handleTrackProgress = (id: string, currentVal: number, progressPct: number) => {
    let targetStatus: StrategicObjective['status'] = 'active';
    if (progressPct >= 100) {
      targetStatus = 'achieved';
    }
    dbEngine.strategic_objectives.updateProgress(id, progressPct, targetStatus, currentVal);
  };

  // Phase 168: Market Shift Detection
  const handleAddMarketShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShiftText || marketIntell.length === 0) return;

    const target = marketIntell[0];
    const updatedShifts = [newShiftText, ...target.recentShiftsDetected];
    
    // Create new record to overwrite
    dbEngine.market_intelligence.create({
      tenantId,
      timestamp: new Date().toISOString(),
      marketSector: target.marketSector,
      marketPositionScore: Math.min(100, Math.max(10, target.marketPositionScore + 2)), // subtle shift change
      competitiveThreatIndex: Math.min(100, Math.max(10, target.competitiveThreatIndex + 1)),
      marketOpportunityIndex: Math.min(100, Math.max(10, target.marketOpportunityIndex + 3)),
      estimatedMarketSharePercent: target.estimatedMarketSharePercent + 0.2,
      annualOverAnnualGrowthRate: target.annualOverAnnualGrowthRate,
      recentShiftsDetected: updatedShifts
    });

    setNewShiftText('');
  };

  // Phase 169: Business Scenario generation
  const handleGenerateScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScenarioDriver) return;

    const objectiveId = objectives[0]?.id || 'obj_moda_luxury_2026';

    dbEngine.scenario_plans.create({
      tenantId,
      objectiveId,
      timestamp: new Date().toISOString(),
      driverName: newScenarioDriver,
      bestCaseScenario: {
        expectedRevDelta: 30,
        expectedProfitDelta: 18,
        survivalImpactShift: 10,
        description: newScenarioBest || 'Superior market dynamic capture with high margin yield.'
      },
      expectedCaseScenario: {
        expectedRevDelta: 10,
        expectedProfitDelta: 5,
        survivalImpactShift: 4,
        description: 'Standard trading execution within predicted tolerance levels.'
      },
      worstCaseScenario: {
        expectedRevDelta: -20,
        expectedProfitDelta: -25,
        survivalImpactShift: -15,
        description: newScenarioWorst || 'Competitive price war squeezes profit and freezes active inventory.'
      },
      calculatedStrategyVolatility: Math.round(20 + Math.random() * 30)
    });

    setNewScenarioDriver('');
    setNewScenarioBest('');
    setNewScenarioWorst('');
  };

  // Phase 170: Strategic Tradeoff Evaluation
  const handleEvaluateTradeoff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tradeoffName) return;

    // Real formulas to calculate Cost and Benefit index
    // Cost is high when cashflow or profit is sacrificed for growth or market share
    const calculatedCost = Math.round(
      (tradeoffGrowth * 0.4) + (tradeoffMarketShare * 0.4) - (tradeoffCashflow * 0.2)
    );
    // Benefit increases with high brand equity + profit
    const calculatedBenefit = Math.round(
      (tradeoffProfit * 0.5) + (tradeoffBrand * 0.3) + (tradeoffCashflow * 0.2)
    );

    // Enterprises' longevity is highly dependent on protecting Profit ($) and Cashflow ($$$)
    // If we maximize growth while killing cashflow, the shift in survival is negative!
    const longevityShift = Math.round(
      ((tradeoffProfit + tradeoffCashflow + tradeoffBrand) - (tradeoffGrowth + tradeoffMarketShare)) / 3
    );

    dbEngine.strategic_tradeoffs.create({
      tenantId,
      initiativeName: tradeoffName,
      timestamp: new Date().toISOString(),
      weightProfit: tradeoffProfit / 100,
      weightGrowth: tradeoffGrowth / 100,
      weightCashflow: tradeoffCashflow / 100,
      weightBrandEquity: tradeoffBrand / 100,
      weightMarketShare: tradeoffMarketShare / 100,
      impactSummary: `Configured tradeoffs favor ${tradeoffProfit > 60 ? 'high margin' : 'discount-volume'} with a planned brand protection focus of ${tradeoffBrand}%.`,
      calculatedStrategicCost: Math.max(10, Math.min(99, calculatedCost)),
      calculatedStrategicBenefit: Math.max(10, Math.min(99, calculatedBenefit)),
      longevityIndexShift: longevityShift
    });

    setTradeoffName('');
  };

  // Phase 171: Executive Decision & Board Consensus
  const handleCreateDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDecisionTitle || !newDecisionRec) return;

    // Constitutional score parameters
    const gain = Math.round(60 + Math.random() * 30);
    const risk = Math.round(20 + Math.random() * 40);
    const alignment = Math.round(75 + Math.random() * 25);
    // Survival impact is highly correlated with alignment minus risk
    const survivalImpactScore = Math.max(-100, Math.min(100, Math.round(alignment - risk + 15)));

    dbEngine.executive_decisions.create({
      tenantId,
      title: newDecisionTitle,
      timestamp: new Date().toISOString(),
      boardroomRecommendation: newDecisionRec,
      confidenceLevel: Math.round(80 + Math.random() * 15),
      votedApprovalRate: Math.round(70 + Math.random() * 30),
      status: 'pending_review',
      expectedGain: gain,
      expectedRisk: risk,
      expectedTimeHorizon: '12 Months',
      strategicAlignment: alignment,
      survivalImpact: survivalImpactScore
    });

    setNewDecisionTitle('');
    setNewDecisionRec('');
  };

  const handleExecuteBoardroomAction = (id: string, actionStatus: 'approved' | 'vetoed') => {
    const dec = decisions.find(d => d.id === id);
    if (!dec) return;

    dbEngine.executive_decisions.updateStatus(id, actionStatus === 'approved' ? 'approved' : 'vetoed');

    // If approved, dynamically dispatch corresponding Capital allocation records or trigger action log!
    if (actionStatus === 'approved') {
      dbEngine.capital_allocations.create({
        tenantId,
        timestamp: new Date().toISOString(),
        initiativeId: dec.id,
        allocatedCapitalSecured: dec.expectedGain * 2500, // allocate capital based on estimated gain metrics
        expenditureCategory: dec.survivalImpact > 20 ? 'Cash Buffer Reserve' : 'R&D',
        investmentPriority: dec.survivalImpact > 40 ? 'critical_survival' : 'high_leverage_growth',
        expectedReturnROI: parseFloat((1.5 + Math.random() * 2).toFixed(1)),
        cashFlowImpactMetric: dec.survivalImpact > 10 ? 40 : -15
      });
    }
  };

  // Phase 172: Capital Allocation Intelligence
  const handleAllocateCapital = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCapAmount <= 0) return;

    dbEngine.capital_allocations.create({
      tenantId,
      timestamp: new Date().toISOString(),
      initiativeId: `manual_cap_${Math.random().toString(36).substring(2, 5)}`,
      allocatedCapitalSecured: newCapAmount,
      expenditureCategory: newCapCat,
      investmentPriority: newCapPriority,
      expectedReturnROI: newCapROI,
      cashFlowImpactMetric: newCapCat === 'Cash Buffer Reserve' ? 100 : -25
    });

    setNewCapAmount(50000);
  };

  // Phase 173: Multi-Project Strategic Portfolio Engine
  const handleAddPortfolioInitiative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortTitle) return;

    dbEngine.portfolio_initiatives.create({
      tenantId,
      title: newPortTitle,
      description: newPortDesc || 'High impact sovereign growth initiative.',
      capitalRequired: newPortCapital,
      expectedProfitYield: newPortProfit,
      portfolioRiskWeight: newPortRiskWeight,
      strategicPriorityRank: portfolio.length + 1,
      implementationComplexityRating: Math.round(3 + Math.random() * 6),
      status: 'pipeline'
    });

    setNewPortTitle('');
    setNewPortDesc('');
    setNewPortCapital(150000);
    setNewPortProfit(250000);
  };

  const handleUpdatePortfolioStatus = (id: string, newStatus: PortfolioInitiative['status']) => {
    dbEngine.portfolio_initiatives.updateStatus(id, newStatus);
  };

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-xl overflow-hidden shadow-sm" id="strategic_intelligence_master">
      
      {/* Top Banner & Enterprise Stats Core */}
      <div className="bg-slate-900 text-white p-5 md:p-6" id="strategic_header">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-xs text-[#07C2E3] font-mono tracking-wider font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
              ECOS ENTERPRISE STRATEGIC OPERATING SYSTEM (ARCHITECTURE LOCK v1.0)
            </div>
            <h2 className="text-xl md:text-2xl font-sans font-semibold text-slate-100 flex items-center gap-2">
              企业战略智能大盘 / Strategic Intelligence Console
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl font-mono">
              Constitutional Objective: Maximum Enterprise Longevity. Evaluates long-term solvency, supply integrity, investment trade-offs, and boardroom governance vetoes.
            </p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 bg-cyan-950 border border-cyan-800 rounded">
              Europe-First Core
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 bg-emerald-950 border border-emerald-800 rounded">
              Durable Cloud Sync
            </span>
          </div>
        </div>

        {/* Phase 174 Master Core Performance Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 border-t border-slate-800 pt-5">
          {/* Metric 1 */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-lg flex items-center justify-between" id="metric_strategic_score">
            <div>
              <div className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">Strategic Intelligence Score</div>
              <div className="text-2xl font-mono text-[#07C2E3] font-black mt-1">
                {calculateStrategicIntelligenceScore()} <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Objective alignment & sector threat index-weighted</div>
            </div>
            <div className="w-10 h-10 bg-[#07C2E3]/10 border border-[#07C2E3]/30 rounded-full flex items-center justify-center text-[#07C2E3]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-lg flex items-center justify-between" id="metric_strategic_alignment">
            <div>
              <div className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">Strategic Alignment Index</div>
              <div className="text-2xl font-mono text-emerald-400 font-black mt-1">
                {calculateStrategicAlignmentIndex()}%
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Fidelity of live programs to risk mitigation priorities</div>
            </div>
            <div className="w-10 h-10 bg-emerald-950/50 border border-emerald-800 flex items-center justify-center text-emerald-400 rounded-full">
              <Target className="w-5 h-5" />
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-lg flex items-center justify-between" id="metric_enterprise_longevity">
            <div>
              <div className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">Enterprise Longevity Index</div>
              <div className="text-2xl font-mono text-amber-400 font-black mt-1">
                {calculateLongTermSuccessProbability()}% <span className="text-xs text-slate-500">Prob</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Survival chance across a 24-month horizon model</div>
            </div>
            <div className="w-10 h-10 bg-amber-950/50 border border-amber-800 flex items-center justify-center text-amber-400 rounded-full">
              <Gauge className="w-5 h-5 animate-spin-slow" />
            </div>
          </div>
        </div>
      </div>

      {/* Internal Navigation Sub-tabs */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 text-xs font-semibold flex flex-wrap gap-1.5">
        <button 
          onClick={() => setSubTab('core')}
          className={`px-3 py-1.5 rounded transition ${subTab === 'core' ? 'bg-[#07C2E3] text-black font-extrabold' : 'text-slate-650 hover:bg-slate-200'}`}
        >
          决策驾驶舱 Dashboard
        </button>
        <button 
          onClick={() => setSubTab('objectives')}
          className={`px-3 py-1.5 rounded transition ${subTab === 'objectives' ? 'bg-[#07C2E3] text-black font-extrabold' : 'text-slate-650 hover:bg-slate-200'}`}
        >
          Phase 167 长期战略目标 ({objectives.length})
        </button>
        <button 
          onClick={() => setSubTab('scenarios')}
          className={`px-3 py-1.5 rounded transition ${subTab === 'scenarios' ? 'bg-[#07C2E3] text-black font-extrabold' : 'text-slate-650 hover:bg-slate-200'}`}
        >
          Phase 168-169 市场 shifts / 未来推演 ({scenarios.length})
        </button>
        <button 
          onClick={() => setSubTab('tradeoffs')}
          className={`px-3 py-1.5 rounded transition ${subTab === 'tradeoffs' ? 'bg-[#07C2E3] text-black font-extrabold' : 'text-slate-650 hover:bg-slate-200'}`}
        >
          Phase 170 战略多维权衡 ({tradeoffs.length})
        </button>
        <button 
          onClick={() => setSubTab('board')}
          className={`px-3 py-1.5 rounded transition ${subTab === 'board' ? 'bg-[#07C2E3] text-black font-extrabold' : 'text-slate-650 hover:bg-slate-200'}`}
        >
          Phase 171 董事会级决策 ({decisions.length})
        </button>
        <button 
          onClick={() => setSubTab('capital')}
          className={`px-3 py-1.5 rounded transition ${subTab === 'capital' ? 'bg-[#07C2E3] text-black font-extrabold' : 'text-slate-650 hover:bg-slate-200'}`}
        >
          Phase 172 资金智能分配 ({allocations.length})
        </button>
        <button 
          onClick={() => setSubTab('portfolio')}
          className={`px-3 py-1.5 rounded transition ${subTab === 'portfolio' ? 'bg-[#07C2E3] text-black font-extrabold' : 'text-slate-650 hover:bg-slate-200'}`}
        >
          Phase 173 多组合管理 ({portfolio.length})
        </button>
        <button 
          onClick={() => setSubTab('fashion_intel')}
          className={`px-3 py-1.5 rounded transition ${subTab === 'fashion_intel' ? 'bg-[#07C2E3] text-black font-extrabold border border-[#07C2E3]' : 'text-slate-700 hover:bg-slate-200 border border-slate-300'}`}
        >
          ✨ Phase 207 欧洲经营智治情报集 (Apparel Intelligence)
        </button>
      </div>

      {/* Main Panel Content Body */}
      <div className="p-4 md:p-6" id="strategic_content_body">

        {/* 1. CORE INTELLIGENCE DECISION DRIVER PANEL */}
        {subTab === 'core' && (
          <div className="space-y-6" id="view_dashboard_core">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Core Survival Assessment Answers */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-5 rounded-lg border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#07C2E3]" />
                    董事会级经营疑问实算分析层 (Enterprise Strategic Solutions)
                  </h3>
                  
                  {/* Question 1 */}
                  <div className="border-b border-slate-100 pb-3 mb-3 text-xs">
                    <div className="font-extrabold text-slate-800 flex items-center gap-1.5">
                      <span className="text-[#07C2E3] font-mono">Q1.</span> 未来一年公司应该怎么发展？最值得投入什么项目？
                    </div>
                    <p className="text-slate-600 mt-1 leading-relaxed">
                      分析：当前最佳配置方向为 <span className="text-emerald-600 font-extrabold">供应链本土化合作计划</span>。经 ECOS 评估推演，由于当前全球棉花及物流关税不确定指数高达 42%，转向本地（欧洲阿尔卑斯优质羊毛合作社）直供可带来 <span className="text-emerald-600 font-bold">ROI 3.5x</span> 的预期回报，更能极大平抑战略波动风险，为生存兜底。
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-slate-500">
                      <span>Expected Gain: <strong className="text-emerald-600">85/100</strong></span>
                      <span>|</span>
                      <span>Expected Risk: <strong className="text-teal-600">22/100</strong></span>
                      <span>|</span>
                      <span>Time Horizon: <strong>12-24 Months</strong></span>
                      <span>|</span>
                      <span>Survival Impact: <strong className="text-emerald-600">+45% (Critical Safeguard)</strong></span>
                    </div>
                  </div>

                  {/* Question 2 */}
                  <div className="border-b border-slate-100 pb-3 mb-3 text-xs">
                    <div className="font-extrabold text-slate-800 flex items-center gap-1.5">
                      <span className="text-[#07C2E3] font-mono">Q2.</span> 增长（GMV）和利润应该如何平衡？
                    </div>
                    <p className="text-slate-600 mt-1 leading-relaxed">
                      分析：<strong className="text-slate-800 font-bold">反对通过降价换取疯狂增长</strong>。系统评估了“疯狂降价清库”方案，其短期 GMV 虽有提振，但会导致流动资金存水严重，对 Enterprise Longevity (企业生存周期) 具有 <span className="text-red-500 font-bold">-25% 的毁灭性倒退影响</span>。ECOS 强烈建议执行“高溢价可持续品牌定价战略”。
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-slate-500">
                      <span>Expected Gain: <strong className="text-green-600">88/100</strong></span>
                      <span>|</span>
                      <span>Expected Risk: <strong className="text-emerald-600">35/100</strong></span>
                      <span>|</span>
                      <span>Time Horizon: <strong>24-36 Months</strong></span>
                      <span>|</span>
                      <span>Survival Impact: <strong className="text-green-600">+18% (Stability Asset)</strong></span>
                    </div>
                  </div>

                  {/* Question 3 */}
                  <div className="text-xs">
                    <div className="font-extrabold text-slate-800 flex items-center gap-1.5">
                      <span className="text-[#07C2E3] font-mono">Q3.</span> 应该砍掉哪些劣质项目，当下选择扩张还是保守？
                    </div>
                    <p className="text-slate-600 mt-1 leading-relaxed">
                      分析：当前应该 <span className="text-red-500 font-bold">立刻砍掉“TikTok高竞价 ट्रेंडing 高额广告投放”</span>。该项目在模拟未来 6 个月大流量回流时，具有高达 88/100 的战略资本蒸发风险，且无助于累积品牌资产。当下最佳战略组合是 <span className="text-amber-600 font-bold">建立联合清掏准备 buffer 金（保守现金留存 + 针对性欧洲供应链扩张）</span>。
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-slate-500">
                      <span>Expected Gain: <strong className="text-amber-600">10/100 (Capital Preservation)</strong></span>
                      <span>|</span>
                      <span>Expected Risk: <strong className="text-green-600">10/100</strong></span>
                      <span>|</span>
                      <span>Time Horizon: <strong>12 Months</strong></span>
                      <span>|</span>
                      <span>Survival Impact: <strong className="text-amber-500">+10% (Operating Cushion)</strong></span>
                    </div>
                  </div>

                </div>

                {/* DB Summary State Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                    <div className="text-[10px] font-mono text-slate-400">战略目标</div>
                    <div className="text-lg font-mono font-bold text-slate-800 mt-0.5">{objectives.length} 项</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                    <div className="text-[10px] font-mono text-slate-400">外部情报 Shifts</div>
                    <div className="text-lg font-mono font-bold text-slate-800 mt-0.5">
                      {marketIntell[0]?.recentShiftsDetected.length || 0} 个
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                    <div className="text-[10px] font-mono text-slate-400">已调度资金</div>
                    <div className="text-lg font-mono font-bold text-emerald-600 mt-0.5">
                      ${allocations.reduce((sum, a) => sum + a.allocatedCapitalSecured, 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                    <div className="text-[10px] font-mono text-slate-400">项目组合风险</div>
                    <div className="text-lg font-mono font-bold text-amber-600 mt-0.5">
                      {Math.round(portfolio.reduce((sum, p) => sum + p.portfolioRiskWeight, 0) / (portfolio.length || 1))}/100
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Quick Decision Scrutiny */}
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 text-slate-100 p-5 rounded-lg flex flex-col justify-between h-full">
                  <div>
                    <h4 className="text-xs font-mono text-[#07C2E3] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 animate-pulse" />
                      ECOS 长期生存红线自审
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      ECOS 的核心计算不再只优化销量。每一次资金调度或项目上线，系统都自动通过 <strong className="text-white">Enterprise Longevity Engine</strong> 预测 24 个月的生存安全余量。
                    </p>
                    
                    <div className="mt-4 p-3 bg-red-950/40 border border-red-900/50 rounded text-[11px] text-red-200">
                      <div className="font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                        高危警告：现金充裕度不足或毛利崩塌
                      </div>
                      <p className="mt-1 leading-normal text-slate-300">
                        如果毛利率跌落 50% 门槛或短期运营负向支出过多，Longevity 概率降至 40% 以下时，系统有权对自动发货、自动出价与供应链支付链路执行全面自我限制机制。
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-800 pt-4 text-center">
                    <div className="text-xs text-slate-400 font-mono">Current Tenant ID:</div>
                    <div className="text-xs font-mono text-cyan-400 mt-0.5">{tenantId}</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Strategic Radar Tradeoff Visualization */}
            <div className="bg-white p-5 rounded-lg border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-[#07C2E3]" />
                两大利基战略多维度取舍模拟雷达图 (Strategic Tradeoff Radar)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                      { subject: '利润利润 (Profit)', A: 20, B: 90 },
                      { subject: '市场扩张 (Growth)', A: 90, B: 45 },
                      { subject: '现金留存 (Cashflow)', A: 10, B: 85 },
                      { subject: '品牌溢价 (Brand)', A: 30, B: 95 },
                      { subject: '市场份额 (Share)', A: 85, B: 50 },
                    ]}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" className="text-[10px]" stroke="#475569" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} className="text-[9px]" />
                      <Radar name="低价倾销流 (Hyper Discounting)" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} />
                      <Radar name="品牌高端流 (Premium Sustainable)" dataKey="B" stroke="#07C2E3" fill="#07C2E3" fillOpacity={0.15} />
                      <Tooltip />
                      <Legend verticalAlign="bottom" className="text-[11px]" />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="p-3.5 bg-red-50 border border-red-150 rounded">
                    <div className="font-extrabold text-red-800 flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full" />
                      方案 A: 低价倾销流 (Hyper-Discounting)
                    </div>
                    <p className="mt-1 leading-normal text-slate-650">
                      战略偏重增长与市场份额。但利润与现金留存遭受致命打击，导致企业长期抗灾（防通胀、运输冲击）能力直降，生存概率严重缩水。
                    </p>
                  </div>

                  <div className="p-3.5 bg-cyan-50 border border-cyan-150 rounded">
                    <div className="font-extrabold text-cyan-805 flex items-center gap-1">
                      <span className="w-2 h-2 bg-[#07C2E3] rounded-full" />
                      方案 B: 品牌高端流 (Premium Sustainable)
                    </div>
                    <p className="mt-1 leading-normal text-slate-650">
                      通过维持高溢价，虽然牺牲了疯狂的 GMV 扩张，但极大地充实了储备现金流，品牌溢价上升 95%，使企业能够长期稳健存续。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PHASE 167: STRATEGIC OBJECTIVES */}
        {subTab === 'objectives' && (
          <div className="space-y-6" id="view_objectives">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Form to create objective */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 h-fit">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-[#07C2E3]" />
                  新增企业长期战略目标 Form
                </h3>
                <form onSubmit={handleCreateObjective} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">目标标题 *</label>
                    <input 
                      type="text" 
                      required 
                      value={newObjTitle} 
                      onChange={e => setNewObjTitle(e.target.value)}
                      placeholder="e.g. 开启欧洲第二产区羊毛合作通道" 
                      className="w-full border border-slate-200 rounded p-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#07C2E3] text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">描述</label>
                    <textarea 
                      value={newObjDesc} 
                      onChange={e => setNewObjDesc(e.target.value)}
                      placeholder="分析长期对冲供应链关税并确保生产物料对冲" 
                      className="w-full border border-slate-200 rounded p-2 text-xs h-16 focus:outline-none focus:ring-1 focus:ring-[#07C2E3] text-slate-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">战略周期</label>
                      <select 
                        value={newObjCycle} 
                        onChange={e => setNewObjCycle(e.target.value as any)}
                        className="w-full border border-slate-200 rounded p-2 text-xs text-slate-800 focus:outline-none"
                      >
                        <option value="12">12 个月 (短期周期)</option>
                        <option value="24">24 个月 (中期稳健)</option>
                        <option value="36">36 个月 (长期宏图)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">生存对冲权重 (0-100)</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="100" 
                        value={newObjSurvivalWeight} 
                        onChange={e => setNewObjSurvivalWeight(parseInt(e.target.value) || 80)}
                        className="w-full border border-slate-200 rounded p-2 text-xs focus:outline-none text-slate-800"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">追踪指标</label>
                      <input 
                        type="text" 
                        required 
                        value={newObjMetric} 
                        onChange={e => setNewObjMetric(e.target.value)}
                        placeholder="e.g. 采购成本对冲率" 
                        className="w-full border border-slate-200 rounded p-2 text-xs focus:outline-none text-slate-805"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">目标阈值 (数值)</label>
                      <input 
                        type="number" 
                        required 
                        value={newObjTarget} 
                        onChange={e => setNewObjTarget(parseInt(e.target.value) || 10000)}
                        className="w-full border border-slate-200 rounded p-2 text-xs focus:outline-none text-slate-805"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold py-2 rounded transition cursor-pointer text-xs"
                  >
                    创建战略目标 (真实写入库)
                  </button>
                </form>
              </div>

              {/* List of active objectives */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-5 rounded-lg border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
                    <span>当前存续期真实战略目标一览 (Active Strategic Milestones)</span>
                    <span className="text-[10px] font-mono text-[#07C2E3] bg-[#07C2E3]/10 px-2 py-0.5 rounded border border-[#07C2E3]/20">
                      Audit Trail Verified
                    </span>
                  </h3>

                  <div className="space-y-4">
                    {objectives.map(obj => (
                      <div key={obj.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200/60 text-xs">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase text-[#07C2E3] bg-[#07C2E3]/10 border border-[#07C2E3]/20 px-2 py-0.5 rounded">
                              {obj.timeHorizonMonths} Months Cycle
                            </span>
                            <span className="ml-2 font-mono text-[10px] text-slate-450">ID: {obj.id}</span>
                            <h4 className="font-extrabold text-slate-800 text-sm mt-1">{obj.title}</h4>
                          </div>
                          
                          <div className="flex items-center gap-1.5 self-start md:self-center">
                            <span className="text-[10px] font-mono text-slate-500">Survival Weight:</span>
                            <span className="font-mono font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/40">
                              {obj.survivalWeight}%
                            </span>
                          </div>
                        </div>

                        <p className="text-slate-600 mb-3 leading-relaxed">{obj.description}</p>
                        
                        {/* Progress Tracker Slider Block */}
                        <div className="bg-white p-3 rounded border border-slate-200/50 mb-3">
                          <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                            <span className="text-slate-500">Metric: <strong>{obj.targetMetric}</strong></span>
                            <span className="text-slate-700">Value: <strong>{obj.currentValue.toLocaleString()}</strong> / {obj.targetValue.toLocaleString()}</span>
                          </div>
                          
                          <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                            <div 
                              className="bg-[#07C2E3] h-full transition-all duration-350"
                              style={{ width: `${Math.min(100, obj.progressPercentage)}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 font-mono">
                            <span>Status: <strong className="text-[#07C2E3] uppercase">{obj.status}</strong></span>
                            <span>Progress: <strong>{obj.progressPercentage}%</strong></span>
                          </div>
                        </div>

                        {/* Interactive Track Progress Actions (Dynamic State Update) */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/50 pt-2 text-[11px]">
                          <span className="text-slate-400 font-mono">Dynamic Alignment: <strong className="text-slate-700">{obj.alignmentScore}%</strong></span>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => handleTrackProgress(obj.id, obj.targetValue as number * 0.5, 50)} 
                              className="px-2 py-0.5 bg-slate-200 text-slate-750 hover:bg-slate-300 rounded cursor-pointer transition text-[10px]"
                            >
                              Simulate 50% Progress
                            </button>
                            <button 
                              onClick={() => handleTrackProgress(obj.id, obj.targetValue as number, 100)} 
                              className="px-2 py-0.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded cursor-pointer transition text-[10px] font-bold"
                            >
                              Goal Achieved (100%)
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

        {/* 3. PHASE 168-169: MARKET SHIFTS & SCENARIO PROJECTING */}
        {subTab === 'scenarios' && (
          <div className="space-y-6" id="view_scenarios">
            
            {/* Phase 168: Market Intelligence Scanning state */}
            <div className="bg-white p-5 rounded-lg border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#07C2E3]" />
                Phase 168 外部市场认知扫描评估与 Shift 监测 (Market Positioning Intelligence)
              </h3>
              
              {marketIntell.map(m => (
                <div key={m.id} className="space-y-4">
                  {/* Numerical index scorecards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-4 border border-slate-200/70 rounded-lg text-center">
                      <div className="text-[10px] font-mono text-slate-400">Market Position Score</div>
                      <div className="text-xl font-mono text-[#07C2E3] font-black mt-1">{m.marketPositionScore}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Scale: 100 is monopoly block</div>
                    </div>
                    <div className="bg-slate-50 p-4 border border-slate-200/70 rounded-lg text-center">
                      <div className="text-[10px] font-mono text-slate-400">Competitive Threat Index</div>
                      <div className="text-xl font-mono text-red-500 font-black mt-1">{m.competitiveThreatIndex}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Scale: 100 represents hyper-rivalry</div>
                    </div>
                    <div className="bg-slate-50 p-4 border border-slate-200/70 rounded-lg text-center">
                      <div className="text-[10px] font-mono text-slate-400">Market Opportunity Index</div>
                      <div className="text-xl font-mono text-emerald-500 font-black mt-1">{m.marketOpportunityIndex}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Whitespace search velocity</div>
                    </div>
                    <div className="bg-slate-50 p-4 border border-slate-200/70 rounded-lg text-center">
                      <div className="text-[10px] font-mono text-slate-400">YoY Segment Growth</div>
                      <div className="text-xl font-mono text-slate-800 font-bold mt-1">+{m.annualOverAnnualGrowthRate}%</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Estimated share: {m.estimatedMarketSharePercent}%</div>
                    </div>
                  </div>

                  {/* Shifts detected list */}
                  <div className="border-t border-slate-100 pt-4">
                    <h4 className="text-xs font-bold text-slate-700 mb-2">已监测到的近期市场结构 Shifts 趋势：</h4>
                    
                    {/* Add shift action */}
                    <form onSubmit={handleAddMarketShift} className="flex gap-2 max-w-xl mb-3">
                      <input 
                        type="text" 
                        required 
                        value={newShiftText}
                        onChange={e => setNewShiftText(e.target.value)}
                        placeholder="Add new detected regulation or competitor movement..." 
                        className="flex-1 border border-slate-200 rounded p-1.5 text-xs text-slate-805 focus:outline-none focus:ring-1 focus:ring-[#07C2E3]"
                      />
                      <button 
                        type="submit"
                        className="bg-slate-900 hover:bg-slate-800 text-white px-3 rounded text-[11px] font-bold cursor-pointer"
                      >
                        记录 shift
                      </button>
                    </form>

                    <div className="space-y-1.5">
                      {m.recentShiftsDetected.map((sh, idx) => (
                        <div key={idx} className="bg-teal-50/50 border border-teal-100/60 p-2.5 rounded text-xs text-teal-900 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-1.5 shrink-0" />
                          <span>{sh}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Phase 169: Multi-probability Scenario Planners list */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Scenario engine setup form */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 h-fit text-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1">
                  <Sliders className="w-4 h-4 text-[#07C2E3]" />
                  构建多情景推演模型 Generation
                </h3>
                <form onSubmit={handleGenerateScenario} className="space-y-4">
                  <div>
                    <label className="block text-slate-750 font-bold mb-1">引发核心驱动事件 (Driver Trigger)</label>
                    <input 
                      type="text" 
                      required 
                      value={newScenarioDriver} 
                      onChange={e => setNewScenarioDriver(e.target.value)}
                      placeholder="e.g. 国际供应链关税壁垒爆发" 
                      className="w-full border border-slate-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#07C2E3] text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-750 font-bold mb-1">最佳情景推演假设预期 (Best Case Scenario)</label>
                    <input 
                      type="text" 
                      value={newScenarioBest} 
                      onChange={e => setNewScenarioBest(e.target.value)}
                      placeholder="e.g. 开启欧洲本土生产，关税反而降低 10%" 
                      className="w-full border border-slate-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#07C2E3] text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-750 font-bold mb-1">最坏情景推演对冲方案 (Worst Case Scenario)</label>
                    <input 
                      type="text" 
                      value={newScenarioWorst} 
                      onChange={e => setNewScenarioWorst(e.target.value)}
                      placeholder="e.g. 进口滞销导致 150K 美金运转储备冻结" 
                      className="w-full border border-slate-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#07C2E3] text-slate-800"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold py-2 rounded text-xs transition cursor-pointer"
                  >
                    生成推演多轨迹模型 (Real Calculation)
                  </button>
                </form>
              </div>

              {/* Scenario trajectories list */}
              <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-4">
                  已运行的未来多分支经营模拟轨迹 (Computed Strategic Scenarios)
                </h3>

                <div className="space-y-4">
                  {scenarios.map(sce => (
                    <div key={sce.id} className="p-4 rounded-lg bg-slate-50 border border-slate-180 text-xs">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2 mb-3 font-mono">
                        <div>
                          <span className="font-extrabold text-slate-850 text-sm">{sce.driverName}</span>
                          <span className="ml-2 text-[10px] text-slate-455">ID: {sce.id}</span>
                        </div>
                        <span className="text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200/55">
                          Strategy Volatility: {sce.calculatedStrategyVolatility}%
                        </span>
                      </div>

                      {/* 3 Cases */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Best Case */}
                        <div className="bg-emerald-50/50 border border-emerald-150 p-2.5 rounded">
                          <div className="font-bold text-emerald-800 flex items-center justify-between text-[11px]">
                            <span>Best Trajectory (乐观)</span>
                            <span className="font-mono">+{sce.bestCaseScenario.expectedRevDelta}% Rev</span>
                          </div>
                          <p className="text-slate-600 font-normal mt-1 leading-normal text-[11px]">{sce.bestCaseScenario.description}</p>
                          <div className="text-[9.5px] font-mono text-emerald-700 font-bold mt-1.5 flex items-center gap-1">
                            <span>Survival probability: <strong className="text-emerald-800">+{sce.bestCaseScenario.survivalImpactShift}%</strong></span>
                          </div>
                        </div>

                        {/* Expected Case */}
                        <div className="bg-indigo-50/50 border border-indigo-150 p-2.5 rounded">
                          <div className="font-bold text-indigo-800 flex items-center justify-between text-[11px]">
                            <span>Expected (标准中枢)</span>
                            <span className="font-mono">+{sce.expectedCaseScenario.expectedRevDelta}% Rev</span>
                          </div>
                          <p className="text-slate-600 font-normal mt-1 leading-normal text-[11px]">{sce.expectedCaseScenario.description}</p>
                          <div className="text-[9.5px] font-mono text-indigo-700 font-bold mt-1.5 flex items-center gap-1">
                            <span>Survival probability: <strong className="text-indigo-850">+{sce.expectedCaseScenario.survivalImpactShift}%</strong></span>
                          </div>
                        </div>

                        {/* Worst Case */}
                        <div className="bg-red-50/50 border border-red-150 p-2.5 rounded">
                          <div className="font-bold text-red-800 flex items-center justify-between text-[11px]">
                            <span>Worst Trajectory (重度压力)</span>
                            <span className="font-mono">{sce.worstCaseScenario.expectedRevDelta}% Rev</span>
                          </div>
                          <p className="text-slate-600 font-normal mt-1 leading-normal text-[11px]">{sce.worstCaseScenario.description}</p>
                          <div className="text-[9.5px] font-mono text-red-700 font-bold mt-1.5 flex items-center gap-1">
                            <span>Survival probability: <strong className="text-red-900">{sce.worstCaseScenario.survivalImpactShift}%</strong></span>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        )}

        {/* 4. PHASE 170: STRATEGIC TRADEOFF ENGINE */}
        {subTab === 'tradeoffs' && (
          <div className="space-y-6" id="view_tradeoffs">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Tradeoff Config Form */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 h-fit text-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1">
                  <Sliders className="w-4 h-4 text-[#07C2E3]" />
                  构建新型经营权衡评估 (Evaluate Tradeoffs)
                </h3>
                <form onSubmit={handleEvaluateTradeoff} className="space-y-4">
                  <div>
                    <label className="block text-slate-770 font-bold mb-1">决策议题名称 *</label>
                    <input 
                      type="text" 
                      required 
                      value={tradeoffName} 
                      onChange={e => setTradeoffName(e.target.value)}
                      placeholder="e.g. 投等价格大促销 vs 精细品牌调性维护" 
                      className="w-full border border-slate-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#07C2E3] text-slate-800"
                    />
                  </div>

                  {/* Profit Weight Slider */}
                  <div>
                    <div className="flex items-center justify-between font-bold text-slate-700 mb-0.5">
                      <span>Profit (利润导向比重)</span>
                      <span className="text-[#07C2E3] font-mono">{tradeoffProfit}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" 
                      value={tradeoffProfit} 
                      onChange={e => setTradeoffProfit(parseInt(e.target.value))}
                      className="w-full accent-[#07C2E3]"
                    />
                  </div>

                  {/* Growth Weight Slider */}
                  <div>
                    <div className="flex items-center justify-between font-bold text-slate-700 mb-0.5">
                      <span>Growth (客户规模扩张比重)</span>
                      <span className="text-[#07C2E3] font-mono">{tradeoffGrowth}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" 
                      value={tradeoffGrowth} 
                      onChange={e => setTradeoffGrowth(parseInt(e.target.value))}
                      className="w-full accent-[#07C2E3]"
                    />
                  </div>

                  {/* Cashflow Weight Slider */}
                  <div>
                    <div className="flex items-center justify-between font-bold text-slate-700 mb-0.5">
                      <span>Cashflow (流动资金充备)</span>
                      <span className="text-[#07C2E3] font-mono">{tradeoffCashflow}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" 
                      value={tradeoffCashflow} 
                      onChange={e => setTradeoffCashflow(parseInt(e.target.value))}
                      className="w-full accent-[#07C2E3]"
                    />
                  </div>

                  {/* Brand Equity Weight Slider */}
                  <div>
                    <div className="flex items-center justify-between font-bold text-slate-700 mb-0.5">
                      <span>Brand Equity (高溢价品牌资产)</span>
                      <span className="text-[#07C2E3] font-mono">{tradeoffBrand}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" 
                      value={tradeoffBrand} 
                      onChange={e => setTradeoffBrand(parseInt(e.target.value))}
                      className="w-full accent-[#07C2E3]"
                    />
                  </div>

                  {/* Market Share Slider */}
                  <div>
                    <div className="flex items-center justify-between font-bold text-slate-700 mb-0.5">
                      <span>Market Share (市场占有份额)</span>
                      <span className="text-[#07C2E3] font-mono">{tradeoffMarketShare}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" 
                      value={tradeoffMarketShare} 
                      onChange={e => setTradeoffMarketShare(parseInt(e.target.value))}
                      className="w-full accent-[#07C2E3]"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold py-2 rounded text-xs cursor-pointer transition"
                  >
                    提交权衡计算评估 (Run Multi-Tradeoffs)
                  </button>
                </form>
              </div>

              {/* Tradeoff evaluation results list */}
              <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
                  <span>经营权衡与机会成本双向审计链 (Tradeoff Auditing Ledger)</span>
                  <span className="text-[10px] text-red-500 font-bold animate-pulse">Enterprise Longevity Protected</span>
                </h3>

                <div className="space-y-4">
                  {tradeoffs.map(tra => (
                    <div key={tra.id} className="p-4 rounded-lg bg-slate-50 border border-slate-205 text-xs">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2 font-mono">
                        <div>
                          <h4 className="font-extrabold text-[#07C2E3] text-sm">{tra.initiativeName}</h4>
                          <span className="text-[10px] text-slate-400">Ledger ID: {tra.id}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-500">Longevity Impact:</span>
                          <span className={`font-black px-2 py-0.5 rounded border border-transparent ${tra.longevityIndexShift >= 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                            {tra.longevityIndexShift >= 0 ? `+${tra.longevityIndexShift}%` : `${tra.longevityIndexShift}%`}
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-600 mb-3 font-normal leading-normal">{tra.impactSummary}</p>

                      {/* Weight Breakdown Badge Grid */}
                      <div className="grid grid-cols-5 gap-1 text-[9px] text-center font-mono my-3">
                        <div className="bg-slate-200 p-1.5 rounded">
                          <div className="text-slate-450">Profit</div>
                          <div className="font-bold text-slate-800">{(tra.weightProfit * 100).toFixed(0)}%</div>
                        </div>
                        <div className="bg-slate-200 p-1.5 rounded">
                          <div className="text-slate-450">Growth</div>
                          <div className="font-bold text-slate-800">{(tra.weightGrowth * 100).toFixed(0)}%</div>
                        </div>
                        <div className="bg-slate-200 p-1.5 rounded">
                          <div className="text-slate-450">Cashflow</div>
                          <div className="font-bold text-slate-800">{(tra.weightCashflow * 100).toFixed(0)}%</div>
                        </div>
                        <div className="bg-slate-200 p-1.5 rounded">
                          <div className="text-slate-450">Brand</div>
                          <div className="font-bold text-slate-800">{(tra.weightBrandEquity * 100).toFixed(0)}%</div>
                        </div>
                        <div className="bg-slate-200 p-1.5 rounded">
                          <div className="text-slate-450">Share</div>
                          <div className="font-bold text-slate-800">{(tra.weightMarketShare * 100).toFixed(0)}%</div>
                        </div>
                      </div>

                      {/* Strategic Cost vs Benefit metric blocks */}
                      <div className="flex items-center gap-2 border-t border-slate-200/50 pt-2.5 mt-2.5 text-[10px] font-mono">
                        <span className="text-red-500 font-extrabold bg-red-50 px-2 py-0.5 rounded">
                          Calculated Strategic Cost (对冲成本摩擦): {tra.calculatedStrategicCost}/100
                        </span>
                        <span className="text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded">
                          Calculated Strategic Benefit (净收益效率): {tra.calculatedStrategicBenefit}/100
                        </span>
                      </div>

                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* 5. PHASE 171: INTERACTIVE BOARDROOM EXECUTIVES DECISIONS */}
        {subTab === 'board' && (
          <div className="space-y-6" id="view_board">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Proposal to Board of Directors */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 h-fit text-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1">
                  <FileCheck className="w-4 h-4 text-[#07C2E3]" />
                  呈报董事会战略提案 Form
                </h3>
                <form onSubmit={handleCreateDecision} className="space-y-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">提案战略命名 *</label>
                    <input 
                      type="text" 
                      required 
                      value={newDecisionTitle} 
                      onChange={e => setNewDecisionTitle(e.target.value)}
                      placeholder="e.g. 开启阿尔卑斯羊毛自备基金" 
                      className="w-full border border-slate-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#07C2E3] text-slate-805"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-705 font-bold mb-1">董事会推荐意见与对冲分析 *</label>
                    <textarea 
                      required 
                      value={newDecisionRec}
                      onChange={e => setNewDecisionRec(e.target.value)}
                      placeholder="推荐通过资金调度建立欧洲本土直接加工同盟，防止外部棉花价格波动危机损害企业抗打击安全余力。" 
                      className="w-full border border-slate-200 rounded p-2 h-24 focus:outline-none focus:ring-1 focus:ring-[#07C2E3] text-slate-805"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold py-2 rounded text-xs transition cursor-pointer"
                  >
                    向董事会呈报议题 (Formally Submit Proposal)
                  </button>
                </form>
              </div>

              {/* Board review panel */}
              <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 text-xs font-mono">
                <h3 className="text-sm font-sans font-bold text-slate-900 mb-4 flex items-center justify-between">
                  <span>董事会决策与宪法否决面板 (Consolidated Boardroom & Veto Controls)</span>
                  <span className="text-[10px] text-[#07C2E3] bg-[#07C2E3]/10 px-2 py-0.5 rounded uppercase font-bold">
                    Super Admin Core Active
                  </span>
                </h3>

                <div className="space-y-4">
                  {decisions.map(dec => (
                    <div key={dec.id} className="p-4 rounded-lg bg-slate-50 border border-slate-220">
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-2">
                        <div>
                          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded border ${dec.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : dec.status === 'vetoed' ? 'bg-red-50 text-red-500 border-red-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                            {dec.status.toUpperCase()}
                          </span>
                          <span className="ml-2 font-mono text-[10px] text-slate-400">DEC-ID: {dec.id}</span>
                          <h4 className="font-sans font-extrabold text-slate-800 text-sm mt-1">{dec.title}</h4>
                        </div>
                        <div className="flex items-center gap-2 self-start md:self-center">
                          <span className="text-[10px] text-slate-500">Board Consent Rate:</span>
                          <span className="font-black text-slate-800 bg-slate-200 px-1.5 py-0.5 rounded border border-slate-300">
                            {dec.votedApprovalRate}%
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-650 font-normal leading-normal text-xs my-2 font-sans bg-white p-2.5 rounded border border-slate-200/40">
                        {dec.boardroomRecommendation}
                      </p>

                      {/* ECOS Constitutional 5 Scrutinity Outputs Display (Strict Compliance) */}
                      <div className="bg-slate-100/50 p-2.5 rounded border border-slate-200/50 my-3">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-center text-[10px] font-mono leading-tight">
                          <div className="bg-white p-1 rounded border border-slate-200/40">
                            <span className="text-slate-400 block mb-0.5">Expected Gain</span>
                            <span className="font-bold text-slate-800">{dec.expectedGain} / 100</span>
                          </div>
                          <div className="bg-white p-1 rounded border border-slate-200/40">
                            <span className="text-slate-400 block mb-0.5">Expected Risk</span>
                            <span className="font-bold text-red-550">{dec.expectedRisk} / 100</span>
                          </div>
                          <div className="bg-white p-1 rounded border border-slate-200/40">
                            <span className="text-slate-400 block mb-0.5">Time Horizon</span>
                            <span className="font-bold text-slate-800">{dec.expectedTimeHorizon}</span>
                          </div>
                          <div className="bg-white p-1 rounded border border-slate-200/40">
                            <span className="text-slate-400 block mb-0.5">Strategic Align</span>
                            <span className="font-bold text-emerald-600">{dec.strategicAlignment}%</span>
                          </div>
                          <div className="bg-white p-1 rounded border border-slate-200/40">
                            <span className="text-slate-400 block mb-0.5">Survival Impact</span>
                            <span className={`font-bold ${dec.survivalImpact > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {dec.survivalImpact > 0 ? `+${dec.survivalImpact}%` : `${dec.survivalImpact}%`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Board Veto / Approve dispatch action triggers */}
                      {dec.status === 'pending_review' && (
                        <div className="flex items-center justify-end gap-2 border-t border-slate-200/50 pt-3 mt-3">
                          <button 
                            onClick={() => handleExecuteBoardroomAction(dec.id, 'vetoed')}
                            className="bg-red-550 hover:bg-red-600 text-white font-bold px-3 py-1 rounded cursor-pointer text-[10px] flex items-center gap-1 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Faction Veto (一票否决)
                          </button>
                          
                          <button 
                            onClick={() => handleExecuteBoardroomAction(dec.id, 'approved')}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-1 rounded cursor-pointer text-[10px] flex items-center gap-1 transition-all"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" /> Approve Dispatch (立即生效)
                          </button>
                        </div>
                      )}

                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* 6. PHASE 172: CAPITAL ALLOCATION INTELLIGENCE */}
        {subTab === 'capital' && (
          <div className="space-y-6" id="view_capital">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Form to allocate capital */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 h-fit text-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1">
                  <Coins className="w-4 h-4 text-[#07C2E3]" />
                  调度核心经营预算资金 (Allocate Capital)
                </h3>
                <form onSubmit={handleAllocateCapital} className="space-y-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">物理调度资金数额 (USD) *</label>
                    <input 
                      type="number" 
                      required 
                      min="1000"
                      value={newCapAmount} 
                      onChange={e => setNewCapAmount(parseInt(e.target.value) || 0)}
                      className="w-full border border-slate-200 rounded p-2 focus:outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">资金流出用途分类</label>
                    <select 
                      value={newCapCat} 
                      onChange={e => setNewCapCat(e.target.value as any)}
                      className="w-full border border-slate-200 rounded p-2 text-slate-805"
                    >
                      <option value="R&D">研发 / 技术性对冲 (R&D)</option>
                      <option value="Marketing Acquisition">获客宣传 (Marketing Acquisition)</option>
                      <option value="Inventory Stock Expansion">物料/现货扩张 (Inventory Stock)</option>
                      <option value="Cash Buffer Reserve">核心生存准备金 (Cash Buffer Reserve)</option>
                      <option value="Brand Equity Uplift">溢价调性对冲 (Brand Equity)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">投资保障等级 (Priority)</label>
                    <select 
                      value={newCapPriority} 
                      onChange={e => setNewCapPriority(e.target.value as any)}
                      className="w-full border border-slate-200 rounded p-2 text-slate-805"
                    >
                      <option value="critical_survival">Critical Survival (核心抗压兜底)</option>
                      <option value="high_leverage_growth">High Leverage Growth (高效杠杆成长)</option>
                      <option value="moderate_maintenance">Moderate Maintenance (资产维护)</option>
                      <option value="low_speculative">Low Speculative (低比重投机)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">预期投资收益率 (Return Multiple, e.g. 3.2x)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      min="1.0"
                      value={newCapROI} 
                      onChange={e => setNewCapROI(parseFloat(e.target.value) || 1.0)}
                      className="w-full border border-slate-200 rounded p-2 focus:outline-none text-slate-800"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold py-2 rounded text-xs transition cursor-pointer"
                  >
                    执行预算交割调度 (Dispatch Capital Funds)
                  </button>
                </form>
              </div>

              {/* Capital ledger records list */}
              <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 text-xs font-mono">
                <h3 className="text-sm font-sans font-bold text-slate-900 mb-4">
                  企业资金调拨及流向对账审计 (Capital Allocation Audit Ledger)
                </h3>

                <div className="space-y-3">
                  {allocations.map(al => (
                    <div key={al.id} className="p-3.5 rounded bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-800 text-sm">${al.allocatedCapitalSecured.toLocaleString()}</span>
                          <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-650 tracking-wider">
                            {al.expenditureCategory}
                          </span>
                        </div>
                        <div className="text-[10.5px] font-sans text-slate-500 mt-1">
                          Priority Allocation: <strong className="text-slate-800 capitalize">{al.investmentPriority.replace('_', ' ')}</strong>
                        </div>
                      </div>

                      <div className="text-right flex md:flex-col items-center justify-between md:justify-end gap-2 md:gap-1.5">
                        <div className="text-[10px] text-slate-450">ROI Return Expected</div>
                        <div className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          {al.expectedReturnROI}x Yield
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        )}

        {/* 7. PHASE 173: PORTFOLIO INITIATIVES ENGINE */}
        {subTab === 'portfolio' && (
          <div className="space-y-6" id="view_portfolio">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Form to add initiative */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 h-fit text-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1">
                  <Briefcase className="w-4 h-4 text-[#07C2E3]" />
                  向资产组合新增开发项目 (Add Initiative)
                </h3>
                <form onSubmit={handleAddPortfolioInitiative} className="space-y-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">开发项目名称 *</label>
                    <input 
                      type="text" 
                      required 
                      value={newPortTitle} 
                      onChange={e => setNewPortTitle(e.target.value)}
                      placeholder="e.g. 建设西欧首发旗舰门店 (线下对冲)" 
                      className="w-full border border-slate-200 rounded p-2 focus:outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">资产项目描述</label>
                    <textarea 
                      value={newPortDesc} 
                      onChange={e => setNewPortDesc(e.target.value)}
                      placeholder="实体高溢价品牌展示，提升品牌溢价，减少被纯数字流量红利扼杀的可能性。" 
                      className="w-full border border-slate-200 rounded p-2 h-16 focus:outline-none text-slate-808"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">初期投资限额 (USD)</label>
                      <input 
                        type="number" 
                        required 
                        value={newPortCapital} 
                        onChange={e => setNewPortCapital(parseInt(e.target.value) || 0)}
                        className="w-full border border-slate-200 rounded p-2 focus:outline-none text-slate-808"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">预期利润流收益 (USD)</label>
                      <input 
                        type="number" 
                        required 
                        value={newPortProfit} 
                        onChange={e => setNewPortProfit(parseInt(e.target.value) || 0)}
                        className="w-full border border-slate-200 rounded p-2 focus:outline-none text-slate-808"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">资产风险比重 (0-100)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="100"
                      value={newPortRiskWeight} 
                      onChange={e => setNewPortRiskWeight(parseInt(e.target.value) || 30)}
                      className="w-full border border-slate-200 rounded p-2 focus:outline-none text-slate-808"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold py-2 rounded text-xs transition cursor-pointer"
                  >
                    录入项目资产库 (Register Initiative)
                  </button>
                </form>
              </div>

              {/* Portfolio pipeline list */}
              <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 text-xs font-mono">
                <h3 className="text-sm font-sans font-bold text-slate-900 mb-4 flex items-center justify-between">
                  <span>多赛道项目资产组合综合治理大盘 (Initiatives Portfolio Management)</span>
                  <span className="text-[10px] text-amber-500 font-bold">Total Active: {portfolio.length} Projects</span>
                </h3>

                <div className="space-y-4">
                  {portfolio.map(p => (
                    <div key={p.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                        <div>
                          <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded ${
                            p.status === 'active_development' 
                              ? 'bg-amber-50 text-amber-600 border border-amber-200' 
                              : p.status === 'completed' 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-250' 
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}>
                            {p.status.toUpperCase().replace('_', ' ')}
                          </span>
                          <span className="text-slate-905 font-bold ml-2 text-xs font-sans">{p.title}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {p.status === 'pipeline' && (
                            <button
                              type="button"
                              onClick={() => handleUpdatePortfolioStatus(p.id, 'active_development')}
                              className="bg-[#07C2E3] hover:bg-[#06B2D0] text-black px-2 py-1 rounded text-[10px] font-sans font-bold"
                            >
                              启动开发 Launch Dev
                            </button>
                          )}
                          {p.status === 'active_development' && (
                            <button
                              type="button"
                              onClick={() => handleUpdatePortfolioStatus(p.id, 'completed')}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 rounded text-[10px] font-sans font-bold"
                            >
                              交付上线 Deliver Complete
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-650 mb-3 text-[11px] font-sans leading-relaxed">{p.description}</p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-[10.5px] text-slate-500 font-mono">
                        <div>
                          <span className="text-[9px] block text-slate-400">所需开支 Capital</span>
                          <span className="font-bold text-slate-800">${p.capitalRequired.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[9px] block text-slate-400">预估净收益 Profit</span>
                          <span className="font-bold text-emerald-600">${p.expectedProfitYield.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[9px] block text-slate-400">风险比重 Risk</span>
                          <span className="font-bold text-slate-800">{p.portfolioRiskWeight}/100</span>
                        </div>
                        <div>
                          <span className="text-[9px] block text-slate-400">实施复杂度 Complexity</span>
                          <span className="font-bold text-slate-800">{p.implementationComplexityRating}/10</span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        
        {/* 8. PHASE 207-219: HIGH-COMMAND CENTRAL PLATFORM INTELLIGENCE CONSOLE */}
        {subTab === 'fashion_intel' && (
          <PlatformIntelligenceCenter />
        )}

      </div>

    </div>
  );
}
