import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Layers, 
  Users, 
  TrendingUp, 
  Activity, 
  Coins, 
  Compass, 
  Scale, 
  RefreshCcw, 
  Cpu, 
  Plus, 
  Trash2,
  FileCheck,
  CheckCircle,
  AlertTriangle,
  Play,
  Check,
  Building
} from 'lucide-react';
import { dbEngine } from '../../../db/dbEngine';
import { 
  MemoryConsolidationLayer,
  AgentGovernanceLayer,
  MarketSimulationLayer,
  StrategicCampaignsLayer,
  RiskIntelligenceLayer,
  OpportunityDiscoveryLayer,
  ExecutiveOsLayer,
  BusinessContextLayer,
  StoreReadinessLayer,
  ExternalIntelligenceLayer,
  MarketRadarLayer,
  CopilotCoreLayer,
  AgentRuntimeLayer,
  AgentCoordinationLayer,
  ExecutionGovernanceLayer,
  ContextEngineV2Layer,
  BrainFinalizationLayer
} from './EcosAdvancedLayers';
import { BusinessContextEngine } from '../../../services/brain/BusinessContextEngine';
import { 
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

export default function PlatformIntelligenceCenter() {
  const [intelLayer, setIntelLayer] = useState<
    | 'l10_ontology'
    | 'l11_consumers'
    | 'l12_trends'
    | 'l13_supply'
    | 'l14_pricing'
    | 'l15_dna'
    | 'l17_boardroom'
    | 'l18_world'
    | 'l19_self_evolution'
    | 'l20_demand_intelligence'
    | 'l21_business_navigator'
    | 'l22_memory_consolidation'
    | 'l23_agent_governance'
    | 'l24_market_simulation'
    | 'l25_strategic_campaigns'
    | 'l26_risk_intelligence'
    | 'l27_opportunity_discovery'
    | 'l28_executive_os'
    | 'l29_business_context'
    | 'l30_store_readiness'
    | 'l31_external_intelligence'
    | 'l32_market_radar'
    | 'l33_copilot_core'
    | 'l34_agent_runtime'
    | 'l35_agent_coordination'
    | 'l36_execution_governance'
    | 'l37_context_engine_v2'
    | 'l38_brain_finalization'
  >('l10_ontology');

  // Success Feedbacks state
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const triggerSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // State Tick for local updates and listeners
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const unsubscribe = dbEngine.subscribe('all', () => setTick(t => t + 1));
    return unsubscribe;
  }, []);

  // Phase 210: Ontology States
  const [ontologySubTab, setOntologySubTab] = useState<'taxonomy_relations' | 'dna_profiles' | 'style_genes' | 'materials' | 'semantic' | 'reasoning'>('taxonomy_relations');
  const [ontologyType, setOntologyType] = useState<FashionEntity['type']>('material');
  const [ontologyName, setOntologyName] = useState('');
  const [ontologyCode, setOntologyCode] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');

  // DNA Profile form states
  const [dnaProductId, setDnaProductId] = useState('p_cashmere_coat');
  const [dnaComposition, setDnaComposition] = useState('');
  const [dnaSeason, setDnaSeason] = useState<'Winter' | 'Summer' | 'Spring' | 'Autumn' | 'All_Season'>('Winter');
  const [dnaLuxuryCoeff, setDnaLuxuryCoeff] = useState(90);
  const [dnaPriceTier, setDnaPriceTier] = useState<'Low' | 'Medium' | 'High' | 'Ultra_Premium'>('High');
  const [dnaStyleType, setDnaStyleType] = useState('Quiet Luxury');

  // Style Gene form states
  const [geneName, setGeneName] = useState('');
  const [geneCode, setGeneCode] = useState('');
  const [genePopularity, setGenePopularity] = useState(85);

  // Material form states
  const [matName, setMatName] = useState('');
  const [matWarmth, setMatWarmth] = useState(80);
  const [matBreathable, setMatBreathable] = useState(85);
  const [matDurability, setMatDurability] = useState(75);

  // Semantic Tag form states
  const [semProductId, setSemProductId] = useState('p_cashmere_coat');
  const [semTagText, setSemTagText] = useState('');
  const [semTagConfidence, setSemTagConfidence] = useState(95);

  // Reasoning Simulation State
  const [reasoningWeatherFactor, setReasoningWeatherFactor] = useState<'Cold_Wave' | 'Mild_Winter' | 'Warm_Autumn'>('Cold_Wave');
  const [reasoningRegion, setReasoningRegion] = useState('France');
  const [reasoningIsRunning, setReasoningIsRunning] = useState(false);
  const [relationType, setRelationType] = useState<FashionRelation['relation_type']>('requires');

  // Phase 211: Consumer profile states
  const [selectedCityId, setSelectedCityId] = useState('cp_fr_paris');
  const [newSegCode, setNewSegCode] = useState('');
  const [newSegName, setNewSegName] = useState('');
  const [newSegShare, setNewSegShare] = useState(15);
  const [newSegVibe, setNewSegVibe] = useState('Quiet Luxury Elegance');

  // Phase 261-270: European Consumer Intelligence states
  const [consumerSubTab, setConsumerSubTab] = useState<'personas' | 'regional' | 'age_segments'>('personas');
  const [selectedPersonaId, setSelectedPersonaId] = useState('cp_fr_chic');
  
  // Personas Form
  const [newPersName, setNewPersName] = useState('');
  const [newPersCountry, setNewPersCountry] = useState('FR');
  const [newPersGender, setNewPersGender] = useState<'Female' | 'Male' | 'Unisex'>('Female');
  const [newPersAgeSegment, setNewPersAgeSegment] = useState<'18-24' | '25-34' | '35-50' | '50+'>('25-34');
  const [newPersCategory, setNewPersCategory] = useState<'Luxury' | 'Premium' | 'Pragmatic' | 'Casual'>('Luxury');
  const [newPersBudget, setNewPersBudget] = useState(250);
  const [newPersProb, setNewPersProb] = useState(65);

  // Motivator Form
  const [newMotivPrimary, setNewMotivPrimary] = useState('');
  const [newMotivSocial, setNewMotivSocial] = useState(70);
  const [newMotivQuality, setNewMotivQuality] = useState(80);
  const [newMotivPrice, setNewMotivPrice] = useState(50);
  const [newMotivSustain, setNewMotivSustain] = useState(60);

  // Price Sensitivity Form
  const [newPriceTolerance, setNewPriceTolerance] = useState(70);
  const [newPricePromo, setNewPricePromo] = useState(0);
  const [newPriceLuxury, setNewPriceLuxury] = useState(1.80);

  // Lifestyle Cluster Form
  const [newLifeCluster, setNewLifeCluster] = useState('');
  const [newLifeWork, setNewLifeWork] = useState(70);
  const [newLifeLoyalty, setNewLifeLoyalty] = useState(65);

  // Regional Preferences Form
  const [newRegCountry, setNewRegCountry] = useState('FR');
  const [newRegColor, setNewRegColor] = useState('');
  const [newRegSilhouette, setNewRegSilhouette] = useState('');
  const [newRegSize, setNewRegSize] = useState('');

  // Phase 271-280 Form States
  const [demandIntelSubTab, setDemandIntelSubTab] = useState<'signals' | 'forecasts' | 'trends' | 'inventory' | 'pricing_elasticity' | 'promotions' | 'risks' | 'opportunities' | 'boardroom'>('signals');
  const [newSignalSource, setNewSignalSource] = useState('dss_temp');
  const [newSignalType, setNewSignalType] = useState('');
  const [newSignalMagnitude, setNewSignalMagnitude] = useState(80);
  const [newSignalStatus, setNewSignalStatus] = useState<'Active' | 'Processed' | 'Suppressed'>('Active');

  const [newForecastCountry, setNewForecastCountry] = useState('FR');
  const [newForecastCategory, setNewForecastCategory] = useState('');
  const [newForecastHorizon, setNewForecastHorizon] = useState<'7d' | '30d' | '90d'>('30d');
  const [newForecastGrowth, setNewForecastGrowth] = useState(15);
  const [newForecastConfidence, setNewForecastConfidence] = useState(85);

  const [newAlertTitle, setNewAlertTitle] = useState('');
  const [newAlertSeverity, setNewAlertSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');

  const [newElasticityProductId, setNewElasticityProductId] = useState('sku_coat_cashmere');
  const [newElasticityCoeff, setNewElasticityCoeff] = useState(-1.5);
  const [newElasticityOptPrice, setNewElasticityOptPrice] = useState(450);
  const [newElasticityCurPrice, setNewElasticityCurPrice] = useState(420);

  const [newOpportunityTitle, setNewOpportunityTitle] = useState('');
  const [newOpportunityNiche, setNewOpportunityNiche] = useState('');
  const [newOpportunityCountry, setNewOpportunityCountry] = useState('FR');
  const [newOpportunityGrowth, setNewOpportunityGrowth] = useState(20);
  const [newOpportunityMargin, setNewOpportunityMargin] = useState(60);

  const [isSimulatingBoard, setIsSimulatingBoard] = useState(false);

  // Phase 212: Trend trajectory selector
  const [trajectoryFilter, setTrajectoryFilter] = useState<'All' | 'Trending' | 'Stable' | 'Declining' | 'Emerging'>('All');
  const [calibratingId, setCalibratingId] = useState<string | null>(null);

  // Phase 213: Supply Chain dispatcher states
  const [shippingActionLoading, setShippingActionLoading] = useState<string | null>(null);

  // Phase 214: Dynamic Price slider
  const [interactivePrice, setInteractivePrice] = useState(245);

  // Phase 215: Customer DNA pattern states
  const [exprText, setExprText] = useState('');
  const [actionText, setActionText] = useState('');

  // Phase 217: Presidential boardroom state
  const [focusedMeetingId, setFocusedMeetingId] = useState('mtg_2026_01');
  const [boardVotesSimulating, setBoardVotesSimulating] = useState(false);

  // Phase 218: World State dials
  const [economicIndicator, setEconomicIndicator] = useState(76);
  const [logisticsLevel, setLogisticsLevel] = useState<WorldState['logistics_congestion_status']>('Moderate');
  const [climateAlert, setClimateAlert] = useState('Cold_Wave_Coming');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');

  // Phase 321-360 Custom State Variables
  const [newMemPatName, setNewMemPatName] = useState('');
  const [newMemPatTags, setNewMemPatTags] = useState('France, Wool, Coat');
  const [newMemPatSuccess, setNewMemPatSuccess] = useState(85);

  const [newDebateTopic, setNewDebateTopic] = useState('');
  const [newDebateAgent, setNewDebateAgent] = useState('marketing_agent');
  const [newDebateContext, setNewDebateContext] = useState('');

  const [newSimName, setNewSimName] = useState('');
  const [newSimRegions, setNewSimRegions] = useState('Germany, France, Sweden');
  const [newSimStockParam, setNewSimStockParam] = useState('Aggressive early stocking');
  const [newSimAdParam, setNewSimAdParam] = useState('Vantage Weather SEO push');
  const [newSimLogisticsParam, setNewSimLogisticsParam] = useState('Direct air shipping route');
  const [newSimCashParam, setNewSimCashParam] = useState('30-day payout buffer');

  const [newCampName, setNewCampName] = useState('');
  const [newCampType, setNewCampType] = useState<'Winter' | 'BlackFriday' | 'Summer' | 'MarketExpansion'>('Winter');
  const [newCampGoal, setNewCampGoal] = useState('');
  const [newCampBudget, setNewCampBudget] = useState(150000);
  const [newCampTargetGmv, setNewCampTargetGmv] = useState(500000);
  const [newCampTargetRoi, setNewCampTargetRoi] = useState(6.5);

  // Multi-variable Causal Solver State
  const [solverCategory, setSolverCategory] = useState('Coat');
  const [solverMaterial, setSolverMaterial] = useState('Cashmere');
  const [solverCountry, setSolverCountry] = useState('France');
  const [solverTargetPrice, setSolverTargetPrice] = useState(399);
  const [solverResult, setSolverResult] = useState<any | null>(null);
  const [isSolverThinking, setIsSolverThinking] = useState(false);

  // Phase 219: Improvement plan simulation state
  const [enforcingId, setEnforcingId] = useState<string | null>(null);

  // --- QUERY DATABASE OBJECTS ---
  const entities = dbEngine.fashion_entities.getAll();
  const relations = dbEngine.fashion_relations.getAll();
  const taxonomies = dbEngine.fashion_taxonomy.getAll();
  const profiles = dbEngine.consumer_profiles.getAll();
  
  // Phase 261-270 Consumer Intelligence Variables
  const consumerPersonas = dbEngine.consumer_personas.getAll();
  const purchaseMotivations = dbEngine.purchase_motivations.getAll();
  const priceSensitivities = dbEngine.price_sensitivities.getAll();
  const lifestyleClusters = dbEngine.lifestyle_clusters.getAll();
  const regionalPreferences = dbEngine.regional_preferences.getAll();
  const ageSegmentBehaviors = dbEngine.age_segment_behaviors.getAll();
  const patterns = dbEngine.consumer_patterns.getAll();
  const segments = dbEngine.consumer_segments.getAll();
  const trends = dbEngine.trend_predictions.getAll();
  const confidenceLogs = dbEngine.trend_confidence.getAll();
  const warehouses = dbEngine.warehouse_nodes.getAll();
  const routes = dbEngine.shipping_routes.getAll();
  const pricingModelsList = dbEngine.pricing_models.getAll();
  const pricingDecisionsList = dbEngine.pricing_decisions.getAll();
  const pricingOutcomesList = dbEngine.pricing_outcomes.getAll();
  const dnas = dbEngine.business_dna.getAll();
  const experiences = dbEngine.business_experiences.getAll();
  const businessPatternsList = dbEngine.business_patterns.getAll();
  const meetings = dbEngine.board_meetings.getAll();
  const votes = dbEngine.board_votes.getAll();
  const boardDecisionsList = dbEngine.board_decisions.getAll();
  const curWorldState = dbEngine.world_state.get();
  const worldEvents = dbEngine.world_events.getAll();
  const worldPredictions = dbEngine.world_predictions.getAll();
  const selfEvaluations = dbEngine.self_evaluations.getAll();
  const improvementPlans = dbEngine.improvement_plans.getAll();
  const evolutionCycles = dbEngine.evolution_cycles.getAll();

  // Phase 271-280: Fashion Demand Intelligence collections
  const demandSignalSources = dbEngine.demand_signal_sources.getAll();
  const demandSignals = dbEngine.demand_signals.getAll();
  const demandSignalWeights = dbEngine.demand_signal_weights.getAll();
  const demandSignalHistory = dbEngine.demand_signal_history.getAll();
  const regionalForecastModels = dbEngine.regional_forecast_models.getAll();
  const regionalForecasts = dbEngine.regional_forecasts_v2.getAll();
  const regionalForecastResults = dbEngine.regional_forecast_results_v2.getAll();
  const trendSignals = dbEngine.trend_signals_v2.getAll();
  const trendPatterns = dbEngine.trend_patterns.getAll();
  const trendEvents = dbEngine.trend_events_v2.getAll();
  const trendAlerts = dbEngine.trend_alerts.getAll();
  const lifecycleStagesList = dbEngine.lifecycle_stages.getAll();
  const inventoryForecasts = dbEngine.inventory_forecasts_v2.getAll();
  const inventoryRecommendations = dbEngine.inventory_recommendations.getAll();
  const inventoryRiskAlerts = dbEngine.inventory_risk_alerts.getAll();
  const priceElasticityModels = dbEngine.price_elasticity_models.getAll();
  const elasticityObservations = dbEngine.elasticity_observations.getAll();
  const elasticityPredictions = dbEngine.elasticity_predictions.getAll();
  const promotionModels = dbEngine.promotion_models.getAll();
  const promotionEffectivenessList = dbEngine.promotion_effectiveness.getAll();
  const promotionPredictions = dbEngine.promotion_predictions.getAll();
  const demandRisks = dbEngine.demand_risks_v2.getAll();
  const marketRisksList = dbEngine.market_risks.getAll();
  const supplyRisks = dbEngine.supply_risks_v2.getAll();
  const opportunities = dbEngine.opportunities_v2.getAll();
  const opportunityScores = dbEngine.opportunity_scores_v2.getAll();
  const opportunityActions = dbEngine.opportunity_actions.getAll();
  const forecastBoardReports = dbEngine.forecast_board_reports.getAll();
  const forecastBoardDecisionsByL = dbEngine.forecast_board_decisions.getAll();
  const forecastBoardActionsList = dbEngine.forecast_board_actions.getAll();

  // --- HANDLERS CONTROLLERS ---

  // L10 Create Ontology Entity
  const handleCreateEntity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ontologyName || !ontologyCode) return;
    dbEngine.fashion_entities.create({
      type: ontologyType,
      name: ontologyName,
      code: ontologyCode.toUpperCase().replace(/\s+/g, '_')
    });
    setOntologyName('');
    setOntologyCode('');
    triggerSuccess(`Successfully registered entity "${ontologyName}" into taxonomy.`);
  };

  // L10 Delete Ontology Entity
  const handleDeleteEntity = (id: string) => {
    dbEngine.fashion_entities.delete(id);
    triggerSuccess("Taxonomy entity deleted successfully.");
  };

  // L10 Create Ontology Relation
  const handleCreateRelation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId) return;
    dbEngine.fashion_relations.create({
      source_id: sourceId,
      target_id: targetId,
      relation_type: relationType
    });
    triggerSuccess("Ontological constraint node relationship created.");
  };

  // Phase 251: Create DNA Profile
  const handleCreateDnaProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dnaComposition) return;
    const prof = dbEngine.fashion_dna_profiles.create({
      product_id: dnaProductId,
      material_composition: dnaComposition,
      season_affinity: dnaSeason,
      luxury_coefficient: Number(dnaLuxuryCoeff),
      price_tier: dnaPriceTier,
      style_type: dnaStyleType
    });
    
    dbEngine.fashion_dna_scores.create({
      dna_profile_id: prof.id,
      sustainability_index: Math.round(75 + Math.random() * 20),
      durability_rating: Math.round(7 + Math.random() * 3),
      margin_potential_score: Math.round(80 + Math.random() * 18)
    });
    
    setDnaComposition('');
    triggerSuccess("Product DNA Profile & Metric Scores calculated and written to DB.");
  };

  const handleDeleteDnaProfile = (id: string) => {
    // delete related dna profile scores
    const allScores = dbEngine.fashion_dna_scores.getAll();
    const relateds = allScores.filter(s => s.dna_profile_id === id);
    relateds.forEach(r => {
      // simulate score deletion if needed or just let it stay for audit
    });
    
    const list = dbEngine.fashion_dna_profiles.getAll();
    const idx = list.findIndex(x => x.id === id);
    if (idx !== -1) {
      list.splice(idx, 1);
      dbEngine['saveToStorage' as any]();
      dbEngine.subscribe('all', () => {})(); // force listener trigger
    }
    triggerSuccess("Successfully deleted Fashion DNA Profile.");
  };

  // Phase 252: Create Style Gene
  const handleCreateStyleGene = (e: React.FormEvent) => {
    e.preventDefault();
    if (!geneName || !geneCode) return;
    const gene = dbEngine.style_genes.create({
      gene_name: geneName,
      gene_code: geneCode.toUpperCase().replace(/\s+/g, '_'),
      historical_popularity_index: Number(genePopularity)
    });

    dbEngine.style_gene_patterns.create({
      gene_id: gene.id,
      pattern_signature: 'Bespoke design, limited drop signature, exquisite craft profiles',
      primary_color_families: ['camel', 'neutral', 'gray']
    });

    setGeneName('');
    setGeneCode('');
    triggerSuccess(`Style Gene "${geneName}" with signature registered.`);
  };

  const handleDeleteStyleGene = (id: string) => {
    const list = dbEngine.style_genes.getAll();
    const idx = list.findIndex(x => x.id === id);
    if (idx !== -1) {
      list.splice(idx, 1);
      dbEngine['saveToStorage' as any]();
    }
    triggerSuccess("Style Gene deleted successfully.");
  };

  // Phase 253: Create Material Knowledge
  const handleCreateMaterialKnowledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matName) return;
    const mk = dbEngine.material_knowledge.create({
      material_name: matName,
      warmth_index: Number(matWarmth),
      breathability_index: Number(matBreathable),
      durability_index: Number(matDurability)
    });

    dbEngine.material_ontology_performances.create({
      material_id: mk.id,
      average_return_rate_pct: Number((2 + Math.random() * 6).toFixed(1)),
      shrinkage_risk_probability_pct: Math.round(3 + Math.random() * 12)
    });

    setMatName('');
    triggerSuccess(`Registered material yarn "${matName}" into global Material Intelligence.`);
  };

  const handleDeleteMaterialKnowledge = (id: string) => {
    const list = dbEngine.material_knowledge.getAll();
    const idx = list.findIndex(x => x.id === id);
    if (idx !== -1) {
      list.splice(idx, 1);
      dbEngine['saveToStorage' as any]();
    }
    triggerSuccess("Material deleted from Material Intelligence.");
  };

  // Phase 255: Create Semantic Tag
  const handleCreateSemanticTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!semTagText) return;
    
    let semProd = dbEngine.semantic_products.getAll().find(s => s.product_id === semProductId);
    if (!semProd) {
      semProd = dbEngine.semantic_products.create({
        product_id: semProductId,
        semantic_title_context: 'Double-breasted luxurious outerwear designed for standard European climatic fluctuations',
        audience_archetype: 'Premium boutique collectors',
        perceived_value_eur: 380
      });
    }

    dbEngine.semantic_tags.create({
      semantic_product_id: semProd.id,
      tag_label: semTagText.toLowerCase(),
      relevance_confidence_pct: Number(semTagConfidence)
    });

    setSemTagText('');
    triggerSuccess(`Associated semantic DNA tag "${semTagText}" with Product.`);
  };

  // Phase 256-260: Trigger Reasoning Task
  const handleTriggerReasoning = () => {
    setReasoningIsRunning(true);
    setTimeout(() => {
      // 1. Create reasoning task
      const task = dbEngine.ontology_reasoning_tasks.create({
        task_name: `Causal Deduction: ${reasoningRegion} Weather Shift`,
        triggered_by: `weather_${reasoningWeatherFactor.toLowerCase()}`,
        status: 'completed',
        timestamp: new Date().toISOString()
      });

      // 2. Set logic sequence path
      const logicSeq = [
        `Detect climate signal: ${reasoningWeatherFactor} in ${reasoningRegion}`,
        `Query material performance database matching region ${reasoningRegion}`,
        `Find Cashmere & Wool indices: warmth index peak is 95%`,
        `Query style trend weights: Quiet Luxury (STY_QLUX) represents 95% weight on heavyweight SKU categories`,
        `Deduce outcome: localized supply constraints expected due to surge in consumer buying intention`
      ];

      dbEngine.ontology_reasoning_results.create({
        task_id: task.id,
        logic_deduction_sequence: logicSeq,
        confidence_score: Math.round(90 + Math.random() * 8)
      });

      // 3. Create insight
      let subj = `Heavy Outerwear in ${reasoningRegion}`;
      let explanation = `由于气象预测中的 ${reasoningWeatherFactor}，导致${reasoningRegion}气温偏离。调配 Loro Piana Cashmere 与高端羊毛的库存占比，配合高净值客群的购买情绪，实现利润最大化。`;
      let action = 'STR_REPLENISH_BOOST_30';
      let score = 92;

      if (reasoningWeatherFactor === 'Mild_Winter') {
        explanation = `预测 ${reasoningRegion} 气温偏暖，重度保暖面料大衣需求下行。建议向春季薄款针织、风衣偏转物流发货，对重度大衣进行轻量优惠去库。`;
        action = 'STR_PROMO_COUPON_10';
        score = 80;
      }

      dbEngine.ontology_insights.create({
        insight_type: reasoningWeatherFactor === 'Cold_Wave' ? 'Demand_Heuristics' : 'Pricing_Hedging',
        subject_entity: subj,
        rational_explanation: explanation,
        recommended_action_code: action,
        impact_rating_score: score,
        timestamp: new Date().toISOString()
      });

      setReasoningIsRunning(false);
      triggerSuccess("Deduction completed! Strategic Insights and Reasoning Sequence written to DB.");
    }, 1000);
  };

  // L11 Create Consumer Segment
  const handleCreateSegment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSegCode || !newSegName) return;
    dbEngine.consumer_segments.create({
      code: newSegCode.toUpperCase(),
      segment_name: newSegName,
      volume_share_pct: Number(newSegShare),
      target_vibe: newSegVibe
    });
    setNewSegCode('');
    setNewSegName('');
    triggerSuccess(`Added consumer profile segmentation "${newSegName}" to index.`);
  };

  // Phase 261-270: Create Persona
  const handleCreatePersona = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPersName) return;
    const item = dbEngine.consumer_personas.create({
      persona_name: newPersName,
      country: newPersCountry,
      gender: newPersGender,
      age_segment: newPersAgeSegment,
      market_category: newPersCategory,
      preferred_channels: ['Social Media', 'E-Store'],
      monthly_fashion_budget: Number(newPersBudget),
      conversion_probability: Number(newPersProb)
    });
    setNewPersName('');
    setSelectedPersonaId(item.id);
    triggerSuccess(`Successfully created customer persona: ${item.persona_name}`);
  };

  const handleDeletePersona = (id: string) => {
    dbEngine.consumer_personas.delete(id);
    // Auto-cascade to motivations, price sensitivities, lifestyle clusters
    const motivations = dbEngine.purchase_motivations.getAll().filter(x => x.persona_id === id);
    motivations.forEach(x => dbEngine.purchase_motivations.delete(x.id));
    const sensitivities = dbEngine.price_sensitivities.getAll().filter(x => x.persona_id === id);
    sensitivities.forEach(x => dbEngine.price_sensitivities.delete(x.id));
    const clusters = dbEngine.lifestyle_clusters.getAll().filter(x => x.persona_id === id);
    clusters.forEach(x => dbEngine.lifestyle_clusters.delete(x.id));

    // Fallback selection
    const all = dbEngine.consumer_personas.getAll();
    if (all.length > 0) {
      setSelectedPersonaId(all[0].id);
    }
    triggerSuccess("Persona demographic profile deleted successfully from node.");
  };

  // Create Purchase Motivation
  const handleCreateMotivation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMotivPrimary) return;
    dbEngine.purchase_motivations.create({
      persona_id: selectedPersonaId,
      primary_motivator: newMotivPrimary,
      social_proof_weight: Number(newMotivSocial),
      quality_importance: Number(newMotivQuality),
      price_weight: Number(newMotivPrice),
      sustainability_score: Number(newMotivSustain)
    });
    setNewMotivPrimary('');
    triggerSuccess("Consumer motivation values parsed and mapped.");
  };

  const handleDeleteMotivation = (id: string) => {
    dbEngine.purchase_motivations.delete(id);
    triggerSuccess("Deleted motivation weighting.");
  };

  // Create Price Sensitivity
  const handleCreatePriceSensitivity = (e: React.FormEvent) => {
    e.preventDefault();
    dbEngine.price_sensitivities.create({
      persona_id: selectedPersonaId,
      price_tolerance_index: Number(newPriceTolerance),
      promotion_buyer_flag: Number(newPricePromo),
      luxury_markup_acceptance_ratio: Number(newPriceLuxury)
    });
    triggerSuccess("Written price sensitivity threshold values.");
  };

  const handleDeletePriceSensitivity = (id: string) => {
    dbEngine.price_sensitivities.delete(id);
    triggerSuccess("Price tolerance bounds cleared.");
  };

  // Create Lifestyle Cluster mapping
  const handleCreateLifestyleCluster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLifeCluster) return;
    dbEngine.lifestyle_clusters.create({
      persona_id: selectedPersonaId,
      cluster_name: newLifeCluster,
      work_home_ratio: Number(newLifeWork),
      brand_loyalty_index: Number(newLifeLoyalty)
    });
    setNewLifeCluster('');
    triggerSuccess("Aesthetic lifestyle cohort mapped.");
  };

  const handleDeleteLifestyleCluster = (id: string) => {
    dbEngine.lifestyle_clusters.delete(id);
    triggerSuccess("Lifestyle cohort mappings removed.");
  };

  // Create Regional Preferences
  const handleCreateRegionalPreference = (e: React.FormEvent) => {
    e.preventDefault();
    dbEngine.regional_preferences.create({
      country: newRegCountry,
      color_preference: newRegColor || 'Neutral Monochromatic',
      silhouette_preference: newRegSilhouette || 'Standard Tailored',
      average_size_preference: newRegSize || 'M'
    });
    setNewRegColor('');
    setNewRegSilhouette('');
    setNewRegSize('');
    triggerSuccess(`Registered country styling preferences for ${newRegCountry}`);
  };

  const handleDeleteRegionalPreference = (id: string) => {
    dbEngine.regional_preferences.delete(id);
    triggerSuccess("Regional styling preference deleted.");
  };

  // L12 Calibrate Trend Direction and Evidence Point
  const handleRecalibrateTrend = (id: string) => {
    setCalibratingId(id);
    setTimeout(() => {
      const list = dbEngine.trend_predictions.getAll();
      const target = list.find(x => x.id === id);
      if (target) {
        const trajectories: TrendPrediction['trajectory'][] = ['Trending', 'Stable', 'Declining', 'Emerging'];
        const currentIdx = trajectories.indexOf(target.trajectory);
        const nextTraj = trajectories[(currentIdx + 1) % trajectories.length];
        target.trajectory = nextTraj;
        
        // Save using internal save engine
        dbEngine['saveToStorage' as any]();
        dbEngine.trend_confidence.create({
          trend_id: id,
          calibration_score: Math.round(85 + Math.random() * 14),
          assessed_date: new Date().toISOString().split('T')[0],
          proof_points: [
            `Sentiment re-analyzed using European World Model parameters.`,
            `Trajectory dynamically shifted toward: ${nextTraj}.`
          ]
        });
      }
      setCalibratingId(null);
      triggerSuccess("Calibrated market signals against verified confidence.");
    }, 700);
  };

  // L13 Emergency Cargo Bypass
  const handleRerouteShipping = (routeId: string) => {
    setShippingActionLoading(routeId);
    setTimeout(() => {
      dbEngine.shipping_routes.update(routeId, {
        transport_mode: 'Rail',
        current_risk_status: 'Low',
        delay_probability_pct: 2,
        lead_time_days: 2
      });
      setShippingActionLoading(null);
      triggerSuccess("Emergency protocol executed. Shipping mode bypassed to zero-congestion Alpine rail corridor.");
    }, 850);
  };

  // L14 Dynamic margin Sandbox commit
  const handleRegisterPricing = () => {
    const dec = dbEngine.pricing_decisions.create({
      product_id: 'prod_trench_coat',
      current_price: interactivePrice,
      competitor_price_reference: 269,
      simulated_margin_pct: Math.round(((interactivePrice - 65) / interactivePrice) * 100),
      action_output: interactivePrice > 269 ? 'Raise Price' : interactivePrice < 220 ? 'Reduce Price' : 'Keep Price',
      applied_at: new Date().toISOString().split('T')[0]
    });

    dbEngine.pricing_outcomes.create({
      decision_id: dec.id,
      conversion_rate_delta_pct: interactivePrice > 269 ? -1.2 : 2.5,
      realized_profit_yield: Math.round(interactivePrice * 14.5),
      validation_notes: `Price checkpoint dynamically optimized. Simulated margin is ${dec.simulated_margin_pct}%.`
    });

    triggerSuccess(`Dynamic target price updated to €${interactivePrice}. Mapped profit outcomes in DB.`);
  };

  // Run Multi-variable AI Causal Solver
  const handleRunSolver = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSolverThinking(true);
    setTimeout(() => {
      const outcome = dbEngine.evaluateMultivariateForecast('tenant_preset_01', {
        category: solverCategory,
        materialName: solverMaterial,
        country: solverCountry,
        targetPrice: Number(solverTargetPrice)
      });
      setSolverResult(outcome);
      setIsSolverThinking(false);
      triggerSuccess(`多变量智脑对冲求解成功！持久化因果链 (ID: ${outcome.chainId})、30天销量自愈预测与对应董事会决策会议均已持久化落库。`);
    }, 700);
  };

  // L15 Commit DNA Experience Rule
  const handleRegisterDnaPattern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exprText || !actionText) return;
    dbEngine.business_patterns.create({
      pattern_expression: exprText,
      context_triggers: ['Empirical Gross Margin Protection Plan', 'High Returns Countermeasure'],
      recommended_action_val: actionText
    });
    setExprText('');
    setActionText('');
    triggerSuccess("Strategical DNA pattern recorded into memory systems.");
  };

  // L17 Boardroom Automatic Votes Cast Simulation
  const handleSimulateBoardroom = () => {
    setBoardVotesSimulating(true);
    setTimeout(() => {
      const activeWorld = dbEngine.world_state.get();
      const meetingObj = meetings.find(m => m.id === focusedMeetingId);
      if (meetingObj) {
        dbEngine.board_votes.create({
          meeting_id: focusedMeetingId,
          board_member_role: 'CEO',
          vote_choice: activeWorld.europe_economic_index > 60 ? 'Approve' : 'Abstain',
          confidence_score: 95,
          reasoning: `CEO: Strategic direction aligns under current economic index: ${activeWorld.europe_economic_index}%`
        });

        dbEngine.board_votes.create({
          meeting_id: focusedMeetingId,
          board_member_role: 'CFO',
          vote_choice: activeWorld.consumer_confidence_score > 70 ? 'Approve' : 'Reject',
          confidence_score: 90,
          reasoning: `CFO: Capital buffer and pricing allocations are within acceptable risk margins.`
        });

        dbEngine.board_votes.create({
          meeting_id: focusedMeetingId,
          board_member_role: 'CRO',
          vote_choice: activeWorld.logistics_congestion_status === 'Fluid' ? 'Approve' : 'Reject',
          confidence_score: 88,
          reasoning: `CRO: Checked risk indicators. Logistics congestion status is currently ${activeWorld.logistics_congestion_status}.`
        });

        const activeMeetingVotes = dbEngine.board_votes.getAll().filter(v => v.meeting_id === focusedMeetingId);
        const approvals = activeMeetingVotes.filter(v => v.vote_choice === 'Approve');
        const finalStatus = approvals.length >= 2 ? 'passed' : 'rejected';

        dbEngine.board_decisions.create({
          meeting_id: focusedMeetingId,
          final_action_plan: meetingObj.agenda_items.map(item => `Deploy automatic strategy: ${item}`),
          vote_outcome: finalStatus,
          approved_by: approvals.map(v => v.board_member_role),
          enacted_at: new Date().toISOString()
        });

        dbEngine.board_meetings.update(focusedMeetingId, {
          status: 'governed'
        });
      }
      setBoardVotesSimulating(false);
      triggerSuccess("Board room votes simulated. Decisions recorded and enacted.");
    }, 1200);
  };

  // L18 Dial updates
  const handleDialEconomic = (val: number) => {
    setEconomicIndicator(val);
    dbEngine.world_state.update({ europe_economic_index: val });
  };
  const handleWorldLogistics = (status: WorldState['logistics_congestion_status']) => {
    setLogisticsLevel(status);
    dbEngine.world_state.update({ logistics_congestion_status: status });
  };
  const handleWorldClimate = (indicator: string) => {
    setClimateAlert(indicator);
    dbEngine.world_state.update({ weather_shift_indicator: indicator });
  };

  // L18 Register custom Event
  const handleCreateWorldEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle) return;
    dbEngine.world_events.create({
      title: newEventTitle,
      impact_sector: 'SaaS Supply and Import Surcharges',
      severity: 'critical',
      observed_date: new Date().toISOString().split('T')[0],
      description: newEventDesc || 'High impact structural shifts.'
    });
    setNewEventTitle('');
    setNewEventDesc('');
    triggerSuccess("Recorded unpredicted economic disruption to World Model.");
  };

  // L19 Self-Evolution implementation enforcer
  const handleEnforceStrategyPlan = (id: string) => {
    setEnforcingId(id);
    setTimeout(() => {
      dbEngine.improvement_plans.updateStatus(id, 'enforced');
      dbEngine.evolution_cycles.create({
        cycle_number: evolutionCycles.length + 1,
        initiated_at: new Date().toISOString(),
        gains_recorded_mrd_eur: Number((9.5 + Math.random() * 6).toFixed(1)),
        status: 'completed'
      });
      setEnforcingId(null);
      triggerSuccess("Strategy plan enforced across SaaS tenant database. New optimization evolution tracked.");
    }, 900);
  };

  // Phase 271-280: Interactive Mutation Handlers
  const handleCreateDemandSignal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSignalType) return;
    const signal = dbEngine.demand_signals.create({
      source_id: newSignalSource,
      signal_type: newSignalType,
      magnitude_score: Number(newSignalMagnitude),
      recorded_at: new Date().toISOString(),
      status: newSignalStatus
    });

    // Create history log
    dbEngine.demand_signal_history.create({
      signal_id: signal.id,
      date_logged: new Date().toISOString(),
      previous_value: 0,
      new_value: Number(newSignalMagnitude)
    });

    setNewSignalType('');
    setNewSignalMagnitude(80);
    triggerSuccess("Recorded new real-time Fashion Demand Signal source event.");
  };

  const handleCreateRegionalForecast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForecastCategory) return;
    const model = dbEngine.regional_forecast_models.getAll()[0];
    const modelId = model ? model.id : 'rfm_01';

    const forecast = dbEngine.regional_forecasts_v2.create({
      country: newForecastCountry,
      category_name: newForecastCategory,
      time_horizon: newForecastHorizon,
      forecasted_growth_pct: Number(newForecastGrowth),
      confidence_score: Number(newForecastConfidence),
      model_id: modelId,
      run_date: new Date().toISOString()
    });

    // Associated results
    dbEngine.regional_forecast_results_v2.create({
      forecast_id: forecast.id,
      trend_direction: Number(newForecastGrowth) >= 0 ? 'UP' : 'DOWN',
      upper_bound_pct: Number(newForecastGrowth) + 3.5,
      lower_bound_pct: Number(newForecastGrowth) - 3.5
    });

    setNewForecastCategory('');
    setNewForecastGrowth(15);
    triggerSuccess("Generated new GRU-Attention Regional Growth forecast projection model.");
  };

  const handleCreateTrendAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertTitle) return;
    dbEngine.trend_alerts.create({
      title: newAlertTitle,
      severity: newAlertSeverity,
      triggered_at: new Date().toISOString(),
      is_acknowledged: false
    });
    setNewAlertTitle('');
    triggerSuccess("Triggered critical Trend Anomaly gap check.");
  };

  const handleAcknowledgeAlert = (id: string) => {
    dbEngine.trend_alerts.update(id, { is_acknowledged: true });
    triggerSuccess("Trend Gap alert acknowledged.");
  };

  const handleCreateOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpportunityTitle || !newOpportunityNiche) return;

    const opt = dbEngine.opportunities_v2.create({
      opportunity_title: newOpportunityTitle,
      niche_tag: newOpportunityNiche,
      country: newOpportunityCountry,
      demand_growth_pct: Number(newOpportunityGrowth),
      competition_index: 35,
      profit_margin_space_pct: Number(newOpportunityMargin)
    });

    dbEngine.opportunity_scores_v2.create({
      opportunity_id: opt.id,
      viability_score: Math.round((Number(newOpportunityGrowth) + Number(newOpportunityMargin)) / 2) + 15,
      confidence_factor: 85
    });

    dbEngine.opportunity_actions.create({
      opportunity_id: opt.id,
      suggested_action: `Initiate algorithmic pre-purchase of local textile resources for tag ${newOpportunityNiche}`,
      action_status: 'Discovered'
    });

    setNewOpportunityTitle('');
    setNewOpportunityNiche('');
    triggerSuccess("Uncovered new high-margin fashion opportunity segment.");
  };

  const handleSimulateBoardDecision = (decisionId: string) => {
    setIsSimulatingBoard(true);
    setTimeout(() => {
      // Approve the decision
      dbEngine.forecast_board_decisions.update(decisionId, { status: 'Approved' });

      // Create action
      dbEngine.forecast_board_actions.create({
        decision_id: decisionId,
        task_executor_agent: 'LogisticsOrchestratorAgent & PriceOptimiserAgent',
        execution_log_summary: 'Decision approved by board. Operational directives dispatched to tenant nodes. Active routing priority re-allocated.',
        execution_status: 'Success'
      });

      setIsSimulatingBoard(false);
      triggerSuccess("Autonomous Board Decision approved! Directives transmitted to active micro-agents.");
    }, 1000);
  };

  const handleRejectBoardDecision = (decisionId: string) => {
    dbEngine.forecast_board_decisions.update(decisionId, { status: 'Rejected' });
    triggerSuccess("Board Decision rejected and suppressed.");
  };

  // Filtered lists
  const filteredTrends = trajectoryFilter === 'All' 
    ? trends 
    : trends.filter(t => t.trajectory === trajectoryFilter);

  const selectedProfile = profiles.find(p => p.id === selectedCityId) || profiles[0];

  return (
    <div className="space-y-6" id="high_command_intelligence_center">
      
      {/* Core Hero Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-lg border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-[10px] text-[#07C2E3] font-mono uppercase tracking-widest font-extrabold bg-[#07C2E3]/10 px-2 py-0.5 rounded border border-[#07C2E3]/20">
              Platform Admin • Operations Command
            </span>
            <h2 className="text-xl font-black font-sans mt-2 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#07C2E3] animate-pulse" />
              🧠 智能操作中心 (Intelligence Operation Center)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-4xl leading-relaxed">
              这里是多租户 SaaS 平台的全球大脑（Platform Admin）。本后台通过 <strong>全球服饰实体本体</strong>、<strong>国别消费者行为画像</strong>、<strong>干线供应链时空路由</strong>、<strong>动态多重弹性定价沙盘</strong>、<strong>自治董事会投票</strong> 及 <strong>自我进化闭环（World Model）</strong> 驱动整个平台的规则调度与战役控制。
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <span className="bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-[10px] font-mono px-3 py-1.5 rounded uppercase font-bold">
              Autonomous Operating Buffer: ON
            </span>
          </div>
        </div>
      </div>

      {/* Grid containing sidebar navigation layer and active display content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="intelligence_center_grid">
        
        {/* LEFT COMPONENT: 9 Navigation Layers */}
        <div className="lg:col-span-3 space-y-2">
          <div className="text-[10px] text-slate-505 font-mono px-2 uppercase tracking-slate uppercase font-extrabold mb-2 text-slate-500">
            SYSTEM BRAIN LEVEL - LAYERS 210-219
          </div>

          {[
            { id: 'l10_ontology', label: 'Layer 210: 全球时尚本体', status: 'ONTOLOGY', emoji: '🕸️' },
            { id: 'l11_consumers', label: 'Layer 211: 欧洲消费者画像', status: 'CONSUMERS', emoji: '👥' },
            { id: 'l12_trends', label: 'Layer 212: 趋势预测验证', status: 'TRENDS', emoji: '🔮' },
            { id: 'l13_supply', label: 'Layer 213: 供给与干线物流', status: 'LOGISTICS', emoji: '🛹' },
            { id: 'l14_pricing', label: 'Layer 214: 智能价格推演', status: 'PRICING', emoji: '🪙' },
            { id: 'l15_dna', label: 'Layer 215: 商业回忆DNA库', status: 'DNA_MEM', emoji: '📜' },
            { id: 'l17_boardroom', label: 'Layer 217: 智能董事决策', status: 'BOARD', emoji: '🏛️' },
            { id: 'l18_world', label: 'Layer 218: 宏观世界模型', status: 'WORLD_ST', emoji: '🌍' },
            { id: 'l19_self_evolution', label: 'Layer 219: 智脑自我进化', status: 'SELF_EVO', emoji: '🧬' },
            { id: 'l20_demand_intelligence', label: 'Layer 271-280: 流行需求智能', status: 'DEMAND_INTEL', emoji: '🧠' },
            { id: 'l21_business_navigator', label: 'Layer 281-320: 自主经营导航', status: 'NAVIGATOR', emoji: '🧭' },
            { id: 'l22_memory_consolidation', label: 'Layer 321-330: 经验经验固化脑', status: 'MEM_CONSOL', emoji: '💾' },
            { id: 'l23_agent_governance', label: 'Layer 331-340: 智能联邦自治理事', status: 'AG_COUNCIL', emoji: '🛡️' },
            { id: 'l24_market_simulation', label: 'Layer 341-350: 宏观大盘时序仿真', status: 'FORECASTS', emoji: '⏳' },
            { id: 'l25_strategic_campaigns', label: 'Layer 351-370: 全域战役自主操作系统', status: 'CAMP_OS', emoji: '🚀' },
            { id: 'l26_risk_intelligence', label: 'Layer 371-380: 企业风险情报引擎', status: 'RISK_INTEL', emoji: '🚨' },
            { id: 'l27_opportunity_discovery', label: 'Layer 381-390: 机会自主发现引擎', status: 'OPPORTUNITY', emoji: '🎯' },
            { id: 'l28_executive_os', label: 'Layer 391-400: 企业执行操作系统', status: 'EXEC_OS', emoji: '⚙️' },
            { id: 'l29_business_context', label: 'Layer 401-410: 商业上下文感知脑', status: 'CONTEXT', emoji: '👁️' },
            { id: 'l30_store_readiness', label: 'Layer 411-420: 店铺上线诊断引擎', status: 'READINESS', emoji: '📋' },
            { id: 'l31_external_intelligence', label: 'Layer 421-430: 外部实时情报感官', status: 'SIGNALS', emoji: '📡' },
            { id: 'l32_market_radar', label: 'Layer 431-450: 欧洲时尚大盘雷达', status: 'RADAR', emoji: '🎯' },
            { id: 'l33_copilot_core', label: 'Layer 451-470: Copilot 复杂链路感知核心', status: 'COPILOT', emoji: '🪁' },
            { id: 'l34_agent_runtime', label: 'Layer 471-480: Agent Workforce 运行时', status: 'WORKFORCE', emoji: '🤖' },
            { id: 'l35_agent_coordination', label: 'Layer 481-490: Agent 协同争议仲裁脑', status: 'DEBATES', emoji: '⚖️' },
            { id: 'l36_execution_governance', label: 'Layer 491-500: 自治执行安全治理层', status: 'GOVERNANCE', emoji: '🛡️' },
            { id: 'l37_context_engine_v2', label: 'Layer 501-520: 商业上下文 2.0 自动诊断', status: 'GATEWAY', emoji: '🔌' },
            { id: 'l38_brain_finalization', label: 'Layer 521-540: 企业大脑最终自治闭环', status: 'MUTUAL_OS', emoji: '🌌' }
          ].map((layer) => (
            <button
              key={layer.id}
              onClick={() => setIntelLayer(layer.id as any)}
              className={`w-full text-left p-3 rounded-lg border text-xs transition flex items-center justify-between font-sans ${
                intelLayer === layer.id
                  ? 'bg-slate-950 text-white border-slate-900 font-bold shadow-md'
                  : 'bg-white border-slate-205 text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{layer.emoji}</span>
                {layer.label}
              </span>
              <span className={`text-[9px] px-1 rounded font-mono ${intelLayer === layer.id ? 'bg-[#07C2E3] text-black font-extrabold' : 'bg-slate-150 text-slate-500 bg-slate-100'}`}>
                {layer.status}
              </span>
            </button>
          ))}
        </div>

        {/* RIGHT COMPONENT: Action Panel */}
        <div className="lg:col-span-9 bg-slate-50 p-5 rounded-lg border border-slate-200 min-h-[550px]">
          
          {/* Real-time Dynamic Success Message Toast */}
          {successToast && (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-lg text-xs font-sans font-extrabold flex items-center justify-between mb-4 shadow-sm">
              <span className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold text-sm">✓</span>
                {successToast}
              </span>
              <button onClick={() => setSuccessToast(null)} className="text-emerald-400 hover:text-emerald-600 font-bold px-1">&times;</button>
            </div>
          )}

          {/* LAYER 210: Global Fashion Ontology Engine */}
          {intelLayer === 'l10_ontology' && (
            <div className="space-y-6" id="layer_ontology_panel">
              <div className="border-b border-rose-200 pb-3 flex justify-between items-center bg-slate-900 p-4 rounded text-white shadow-sm">
                <div>
                  <h3 className="text-sm font-black font-sans text-white">🕸️ Layer 210: 全球时尚知识本体引擎 (Global Fashion Ontology Engine)</h3>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xl">
                    本知识库存储底层品类、纤维面料、季节契合及细分客群的网格连结构架，避免 AI 陷入一无所知的孤岛词汇。
                  </p>
                </div>
                <span className="text-[10px] bg-[#07C2E3] text-black px-2 py-1 rounded font-mono font-bold font-sans">ONTOLOGY_GRAPH</span>
              </div>

              {/* Horizontal Subtabs for Layer 210 */}
              <div className="flex flex-wrap gap-1 border-b pb-2 text-xs">
                <button
                  onClick={() => setOntologySubTab('taxonomy_relations')}
                  className={`px-3 py-1.5 rounded transition font-bold flex items-center gap-1 ${ontologySubTab === 'taxonomy_relations' ? 'bg-[#07C2E3] text-black shadow-xs' : 'bg-white border text-slate-700 hover:bg-slate-100'}`}
                >
                  <span>🕸️</span> 继承与连结分类法
                </button>
                <button
                  onClick={() => setOntologySubTab('dna_profiles')}
                  className={`px-3 py-1.5 rounded transition font-bold flex items-center gap-1 ${ontologySubTab === 'dna_profiles' ? 'bg-[#07C2E3] text-black shadow-xs' : 'bg-white border text-slate-700 hover:bg-slate-100'}`}
                >
                  <span>🧬</span> 核心时尚 DNA
                </button>
                <button
                  onClick={() => setOntologySubTab('style_genes')}
                  className={`px-3 py-1.5 rounded transition font-bold flex items-center gap-1 ${ontologySubTab === 'style_genes' ? 'bg-[#07C2E3] text-black shadow-xs' : 'bg-white border text-slate-700 hover:bg-slate-100'}`}
                >
                  <span>🎗️</span> 风格基因引擎
                </button>
                <button
                  onClick={() => setOntologySubTab('materials')}
                  className={`px-3 py-1.5 rounded transition font-bold flex items-center gap-1 ${ontologySubTab === 'materials' ? 'bg-[#07C2E3] text-black shadow-xs' : 'bg-white border text-slate-700 hover:bg-slate-100'}`}
                >
                  <span>🧶</span> 面料智学百科
                </button>
                <button
                  onClick={() => setOntologySubTab('semantic')}
                  className={`px-3 py-1.5 rounded transition font-bold flex items-center gap-1 ${ontologySubTab === 'semantic' ? 'bg-[#07C2E3] text-black shadow-xs' : 'bg-white border text-slate-700 hover:bg-slate-100'}`}
                >
                  <span>🏷️</span> 语义分类向量
                </button>
                <button
                  onClick={() => setOntologySubTab('reasoning')}
                  className={`px-3 py-1.5 rounded transition font-bold flex items-center gap-1 ${ontologySubTab === 'reasoning' ? 'bg-[#07C2E3] text-black shadow-xs' : 'bg-white border text-slate-700 hover:bg-slate-100'}`}
                >
                  <span>🧠</span> 因果本体推理
                </button>
              </div>

              {/* SUBTAB 1 : Taxonomy & Relations */}
              {ontologySubTab === 'taxonomy_relations' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Taxonomy list column */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3 shadow-xs">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-xs font-bold text-slate-800 font-sans">品类 & 色系本体节点 (Active Entities: {entities.length})</span>
                        <span className="text-[10px] font-mono text-slate-400">Taxonomy Nodes</span>
                      </div>
                      <div className="space-y-2 overflow-y-auto max-h-[220px]">
                        {entities.map(ent => (
                          <div key={ent.id} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded border border-slate-150 flex justify-between items-center">
                            <div>
                              <span className="text-[9px] bg-slate-200 text-slate-600 px-1 py-0.5 rounded font-mono uppercase font-bold">{ent.type}</span>
                              <span className="text-xs font-extrabold text-slate-800 ml-2 font-sans">{ent.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10.5px] font-mono text-slate-400">{ent.code}</span>
                              <button onClick={() => handleDeleteEntity(ent.id)} className="text-red-400 hover:text-red-600 p-1">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Create Raw Entity form */}
                      <form onSubmit={handleCreateEntity} className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-400 font-mono mb-1 uppercase">Node Type</label>
                            <select
                              className="w-full bg-slate-55 border border-slate-200 rounded p-1 text-xs text-slate-800 bg-white"
                              value={ontologyType}
                              onChange={e => setOntologyType(e.target.value as any)}
                            >
                              <option value="category">Category (品类)</option>
                              <option value="material">Material (面料)</option>
                              <option value="season">Season (季节)</option>
                              <option value="occasion">Occasion (场景)</option>
                              <option value="customer_segment">Segment (客群)</option>
                              <option value="style">Style (风格)</option>
                              <option value="color_family">Color (色系)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 font-mono mb-1 uppercase">Node Unique Code</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. SF_SILK"
                              value={ontologyCode}
                              onChange={e => setOntologyCode(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded p-1 text-xs text-slate-800 focus:outline-[#07C2E3]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 font-mono mb-1 uppercase">Entity Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Mulberry Silk Blends"
                            value={ontologyName}
                            onChange={e => setOntologyName(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded p-1 text-xs text-slate-800 focus:outline-[#07C2E3]"
                          />
                        </div>
                        <button type="submit" className="w-full bg-[#07C2E3] text-black font-extrabold py-1.5 rounded hover:bg-[#06B2D0] transition">
                          + 注入知识库实体
                        </button>
                      </form>
                    </div>

                    {/* Ontological link relations network column */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3 shadow-xs text-xs">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-xs font-bold text-slate-800 font-sans">网状关系映射图 (Active Relations: {relations.length})</span>
                        <span className="text-[10px] font-mono text-slate-400">Semantic Connections</span>
                      </div>

                      <div className="space-y-2 overflow-y-auto max-h-[190px]">
                        {relations.map(rel => {
                          const sourceNode = entities.find(x => x.id === rel.source_id);
                          const targetNode = entities.find(x => x.id === rel.target_id);
                          return (
                            <div key={rel.id} className="p-2 border border-dashed border-slate-200 bg-slate-50 rounded flex flex-col gap-1">
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-slate-700">{sourceNode?.name || rel.source_id}</span>
                                <span className="text-[10px] font-mono text-slate-400">({rel.relation_type})</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px] text-slate-500">
                                <span>└─ 指向: <strong>{targetNode?.name || rel.target_id}</strong></span>
                                <button onClick={() => dbEngine.fashion_relations.delete(rel.id)} className="text-red-400 hover:text-red-600 font-bold">
                                  &times; 剪断
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Establishes dynamic relationship */}
                      <form onSubmit={handleCreateRelation} className="pt-2 border-t border-slate-100 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-400 font-mono mb-1 uppercase">Source Entity</label>
                            <select
                              className="w-full bg-white border border-slate-200 rounded p-1 text-xs text-slate-800"
                              value={sourceId}
                              onChange={e => setSourceId(e.target.value)}
                            >
                              <option value="">-- Choose Node --</option>
                              {entities.map(e => (
                                <option key={e.id} value={e.id}>{e.name} ({e.code})</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 font-mono mb-1 uppercase">Target Entity</label>
                            <select
                              className="w-full bg-white border border-slate-200 rounded p-1 text-xs text-slate-800"
                              value={targetId}
                              onChange={e => setTargetId(e.target.value)}
                            >
                              <option value="">-- Choose Node --</option>
                              {entities.map(e => (
                                <option key={e.id} value={e.id}>{e.name} ({e.code})</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 font-mono mb-1 uppercase">Relation Tag</label>
                          <select
                            className="w-full bg-white border border-slate-200 rounded p-1 text-xs text-slate-800"
                            value={relationType}
                            onChange={e => setRelationType(e.target.value as any)}
                          >
                            <option value="requires">requires (强制依赖面料)</option>
                            <option value="pairs_with">pairs_with (设计款配对)</option>
                            <option value="popular_in">popular_in (主要消费国)</option>
                            <option value="season_fit">season_fit (季节性水线)</option>
                            <option value="segment_default">segment_default (目标核心客群)</option>
                          </select>
                        </div>
                        <button type="submit" disabled={!sourceId || !targetId} className="w-full bg-slate-900 text-white font-bold py-1.5 rounded hover:bg-slate-800 transition">
                          + 连结本体知识节点
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Taxonomy path view block */}
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold text-slate-800 block mb-2 font-sans">品类继承路径与标准化分类法 (Category Taxonomy Paths)</span>
                    <div className="space-y-1 font-mono text-xs">
                      {taxonomies.map(t => {
                        const ent = entities.find(e => e.id === t.entity_id);
                        return (
                          <div key={t.id} className="p-2 bg-slate-50 border border-slate-200 rounded flex justify-between items-center">
                            <span className="text-slate-700 font-extrabold">{ent?.name || 'Heavy Outerwear Collection'}</span>
                            <span className="text-slate-500">{t.taxonomy_tree_path} (Level: {t.level})</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 2 : Fashion DNA Profiles (Phase 251) */}
              {ontologySubTab === 'dna_profiles' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
                    
                    {/* Add DNA Profile Form */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4 shadow-xs">
                      <div className="border-b pb-2">
                        <span className="text-xs font-extrabold text-slate-800 block">🧬 注入商品DNA微元 (Product DNA Constructor)</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">为特定产品代码映射细粒度原料、风格和定位，建立可推理大脑的基础实体。</p>
                      </div>
                      
                      <form onSubmit={handleCreateDnaProfile} className="space-y-3">
                        <div>
                          <label className="block text-[10px] text-slate-400 font-mono mb-1 uppercase">Target Product Link</label>
                          <select
                            className="w-full bg-white border rounded p-1 text-xs text-slate-850"
                            value={dnaProductId}
                            onChange={e => setDnaProductId(e.target.value)}
                          >
                            <option value="p_cashmere_coat">Classic Tailored Trench Coat (p_cashmere_coat)</option>
                            <option value="p_silk_dress">Camel Wool Luxury Coat (p_silk_dress)</option>
                            <option value="p_unstructured_blazer">Premium Silk Blends Dress (p_unstructured_blazer)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 font-mono mb-1 uppercase">Material Composition (面料配方)</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 100% Mongolian Cashmere, 20% Silk"
                            value={dnaComposition}
                            onChange={e => setDnaComposition(e.target.value)}
                            className="w-full bg-white border rounded p-1 text-slate-800 focus:outline-[#07C2E3]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-400 font-mono mb-1">Season Affinity</label>
                            <select
                              className="w-full bg-white border rounded p-1"
                              value={dnaSeason}
                              onChange={e => setDnaSeason(e.target.value as any)}
                            >
                              <option value="Winter">Winter ( Alpine )</option>
                              <option value="Autumn">Autumn ( Transitional )</option>
                              <option value="Spring">Spring</option>
                              <option value="Summer">Summer</option>
                              <option value="All_Season">All Season</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 font-mono mb-1">Luxury Code Coefficient</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={dnaLuxuryCoeff}
                              onChange={e => setDnaLuxuryCoeff(Number(e.target.value))}
                              className="w-full bg-white border rounded p-1 text-slate-800"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-400 font-mono mb-1">Price Tier</label>
                            <select
                              className="w-full bg-white border rounded p-1"
                              value={dnaPriceTier}
                              onChange={e => setDnaPriceTier(e.target.value as any)}
                            >
                              <option value="Ultra_Premium">Ultra Premium (€€€€)</option>
                              <option value="High">High Premium (€€€)</option>
                              <option value="Medium">Medium Standard (€€)</option>
                              <option value="Low">Low Budget (€)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 font-mono mb-1">Style Segment</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Old Money Elegance"
                              value={dnaStyleType}
                              onChange={e => setDnaStyleType(e.target.value)}
                              className="w-full bg-white border rounded p-1 text-slate-800"
                            />
                          </div>
                        </div>

                        <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2 rounded transition">
                          + 注入并生成DNA载体
                        </button>
                      </form>
                    </div>

                    {/* DNA Profiles List */}
                    <div className="lg:col-span-2 space-y-3">
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-xs font-bold text-slate-800">数据库当前 DNA 载体主表 (Fashion DNA Registry: {dbEngine.fashion_dna_profiles.getAll().length})</span>
                        <span className="text-[10px] bg-slate-100 font-mono text-slate-600 px-1 py-0.5 rounded">MODA_DNA_MAIN</span>
                      </div>

                      <div className="space-y-3 overflow-y-auto max-h-[420px]">
                        {dbEngine.fashion_dna_profiles.getAll().map(prof => {
                          const score = dbEngine.fashion_dna_scores.getAll().find(s => s.dna_profile_id === prof.id);
                          const attrs = dbEngine.fashion_dna_attributes.getAll().filter(a => a.dna_profile_id === prof.id);
                          return (
                            <div key={prof.id} className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col gap-3 hover:translate-x-0.5 transition shadow-sm">
                              <div className="flex justify-between items-start border-b pb-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-slate-900">{prof.product_id}</span>
                                    <span className="text-[9px] bg-[#07C2E3]/15 text-slate-800 px-1.5 py-0.5 rounded font-mono font-bold">{prof.style_type}</span>
                                    <span className="text-[9px] bg-slate-150 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold bg-slate-100">{prof.season_affinity}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 mt-1">面料构成：<strong>{prof.material_composition}</strong></p>
                                </div>
                                <div className="text-right">
                                  <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded font-mono uppercase tracking-xs">{prof.price_tier}</span>
                                  <div className="text-[10px] text-slate-400 mt-1 font-mono">ID: {prof.id}</div>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2 py-1">
                                <div className="p-2 bg-emerald-50/50 rounded border border-emerald-100 text-center">
                                  <div className="text-[9px] text-emerald-600 uppercase font-bold">可循环指数</div>
                                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">{score ? `${score.sustainability_index}%` : '85%'}</div>
                                </div>
                                <div className="p-2 bg-indigo-50/50 rounded border border-indigo-100 text-center">
                                  <div className="text-[9px] text-indigo-600 uppercase font-bold">持久性评分</div>
                                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">{score ? `${score.durability_rating}/10` : '9/10'}</div>
                                </div>
                                <div className="p-2 bg-amber-50/50 rounded border border-amber-100 text-center">
                                  <div className="text-[9px] text-amber-600 uppercase font-bold">毛利预制评分</div>
                                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">{score ? `${score.margin_potential_score}%` : '92%'}</div>
                                </div>
                              </div>

                              {attrs.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
                                  {attrs.map(at => (
                                    <span key={at.id} className="text-[10.5px] font-sans text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-150">
                                      {at.attribute_key}: <strong className="text-slate-900">{at.attribute_val}</strong>
                                    </span>
                                  ))}
                                </div>
                              )}

                              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                                <span className="flex items-center gap-1">
                                  <span className="text-[#07C2E3]">💧</span> 脑神经分析系数：{prof.luxury_coefficient}% 奢侈级别契合。
                                </span>
                                <button onClick={() => handleDeleteDnaProfile(prof.id)} className="text-red-400 hover:text-red-600 font-extrabold">
                                  丢弃 DNA
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 3 : Style Genes Engine (Phase 252) */}
              {ontologySubTab === 'style_genes' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
                    
                    {/* Add Style Gene Form */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4 shadow-xs">
                      <div className="border-b pb-2">
                        <span className="text-xs font-extrabold text-slate-800 block">🎗️ 录入风格演化基因 (Style Gene Creator)</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">在此为特定的审美特征如 "Parisian Chic" 创建核心参数标识和比率。</p>
                      </div>

                      <form onSubmit={handleCreateStyleGene} className="space-y-2">
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">风格大类名称 (e.g. Quiet Luxury)</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Quiet Luxury"
                            value={geneName}
                            onChange={e => setGeneName(e.target.value)}
                            className="w-full bg-white border rounded p-1 text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">风格代码 (Gene Code)</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. STY_QLUX"
                            value={geneCode}
                            onChange={e => setGeneCode(e.target.value)}
                            className="w-full bg-white border rounded p-1 text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">历史流行周期权重 (0-100)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={genePopularity}
                            onChange={e => setGenePopularity(Number(e.target.value))}
                            className="w-full bg-white border rounded p-1 text-slate-800"
                          />
                        </div>
                        <button type="submit" className="w-full bg-[#07C2E3] text-black font-extrabold py-1.5 rounded hover:bg-[#06B2D0] transition">
                          + 归入智脑美学基因库
                        </button>
                      </form>
                    </div>

                    {/* Style Genes List */}
                    <div className="lg:col-span-2 space-y-3">
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-xs font-bold text-slate-800">智脑已锁定的美学基因主表 (Style Genes: {dbEngine.style_genes.getAll().length})</span>
                      </div>

                      <div className="space-y-2">
                        {dbEngine.style_genes.getAll().map(gene => {
                          const pattern = dbEngine.style_gene_patterns.getAll().find(p => p.gene_id === gene.id);
                          const weight = dbEngine.style_gene_weights.getAll().find(w => w.gene_id === gene.id);
                          return (
                            <div key={gene.id} className="bg-white p-4 rounded-lg border border-slate-200 hover:shadow-xs transition space-y-2">
                              <div className="flex justify-between items-center border-b pb-1.5">
                                <span className="font-extrabold text-slate-800">{gene.gene_name} <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1 py-0.5 rounded">[{gene.gene_code}]</span></span>
                                <div className="text-right">
                                  <span className="text-[10px] text-slate-500 font-mono">Popularity: <strong>{gene.historical_popularity_index}%</strong></span>
                                </div>
                              </div>
                              <p className="text-xs text-slate-600">
                                <strong>设计视觉特征签名：</strong> {pattern ? pattern.pattern_signature : 'Minimal branding, bespoke stitching, soft volume'}
                              </p>
                              {pattern && (
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                  <span>主要配合色系:</span>
                                  {pattern.primary_color_families.map((c, i) => (
                                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-150 font-mono text-slate-700 text-[10px]">
                                      {c}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="flex justify-between items-center text-[10.5px] border-t border-dashed pt-1.5 mt-1 border-slate-150">
                                <span className="text-slate-500 font-mono">
                                  Sku品类：Coat → 决策传导系数: <strong className="text-[#07C2E3] font-bold">{weight ? weight.weight_coefficient : 0.95}</strong>
                                </span>
                                <button onClick={() => handleDeleteStyleGene(gene.id)} className="text-red-400 hover:text-red-600">
                                  删除基因
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 4 : Material Intelligence (Phase 253) */}
              {ontologySubTab === 'materials' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
                    
                    {/* Add Material Knowledge */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4 shadow-xs">
                      <div className="border-b pb-2">
                        <span className="text-xs font-extrabold text-slate-800 block">🧶 纤维面料录入控制 (Yarn Constructor)</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">定义面料的热学指标、质地强度和商业物理学对冲系数。</p>
                      </div>

                      <form onSubmit={handleCreateMaterialKnowledge} className="space-y-3">
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">Material Name (面料全称)</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Fine Silk Linens"
                            value={matName}
                            onChange={e => setMatName(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded p-1"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-0.5">Warmth</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={matWarmth}
                              onChange={e => setMatWarmth(Number(e.target.value))}
                              className="w-full bg-white border rounded p-1 text-center"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-0.5">Breathable</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={matBreathable}
                              onChange={e => setMatBreathable(Number(e.target.value))}
                              className="w-full bg-white border rounded p-1 text-center"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-0.5">Durability</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={matDurability}
                              onChange={e => setMatDurability(Number(e.target.value))}
                              className="w-full bg-white border rounded p-1 text-center"
                            />
                          </div>
                        </div>

                        <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2 rounded transition">
                          + 存储至面料核心智库
                        </button>
                      </form>
                    </div>

                    {/* Materials List */}
                    <div className="lg:col-span-2 space-y-3">
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-xs font-bold text-slate-800">面料智物性质指标与物理表现 (Material Knolwedge Base: {dbEngine.material_knowledge.getAll().length})</span>
                      </div>

                      <div className="space-y-3 overflow-y-auto max-h-[420px]">
                        {dbEngine.material_knowledge.getAll().map(mk => {
                          const perf = dbEngine.material_ontology_performances.getAll().find(p => p.material_id === mk.id);
                          const mms = dbEngine.material_market_scores.getAll().filter(m => m.material_id === mk.id);
                          return (
                            <div key={mk.id} className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col gap-2 hover:shadow-xs transition">
                              <div className="flex justify-between items-center border-b pb-1.5">
                                <span className="font-extrabold text-slate-850 text-xs">{mk.material_name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">ID: {mk.id}</span>
                              </div>

                              <div className="grid grid-cols-3 gap-2 py-1 text-xs">
                                <div className="text-slate-600">保暖指数：<strong className="text-slate-900">{mk.warmth_index}%</strong></div>
                                <div className="text-slate-600">透气性能：<strong className="text-slate-900">{mk.breathability_index}%</strong></div>
                                <div className="text-slate-600">耐久强韧度：<strong className="text-slate-900">{mk.durability_index}%</strong></div>
                              </div>

                              <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 border border-slate-150 rounded">
                                <div className="text-xs font-mono text-slate-600">
                                  平均客退率: <strong className="text-rose-600 font-extrabold">{perf ? `${perf.average_return_rate_pct}%` : '4.2%'}</strong>
                                </div>
                                <div className="text-xs font-mono text-slate-600">
                                  冷水洗缩水概率: <strong className="text-amber-600 font-extrabold">{perf ? `${perf.shrinkage_risk_probability_pct}%` : '5%'}</strong>
                                </div>
                              </div>

                              {mms.length > 0 && (
                                <div className="flex items-center gap-2 pt-1">
                                  <span className="text-[10px] text-slate-400">大区溢价偏好：</span>
                                  {mms.map(sc => (
                                    <span key={sc.id} className="text-[10px] font-mono font-bold text-slate-705 bg-[#07C2E3]/15 text-slate-800 px-1.5 py-0.5 rounded bg-[#07C2E3]/10">
                                      {sc.country_code}: {sc.premium_desirability_score}分 Desirability
                                    </span>
                                  ))}
                                </div>
                              )}

                              <div className="flex justify-end pt-1 mt-1 border-t border-dashed border-slate-150">
                                <button onClick={() => handleDeleteMaterialKnowledge(mk.id)} className="text-red-400 hover:text-red-600 text-[10px]">
                                  删除面料物理指标
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 5 : Semantic Understanding & Graph (Phases 254 & 255) */}
              {ontologySubTab === 'semantic' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
                    
                    {/* Add Semantic Tag */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4 shadow-xs">
                      <div className="border-b pb-2">
                        <span className="text-xs font-extrabold text-slate-800 block">🏷️ 语义标签附加器 (Semantic DNA Tagging)</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">在此手动将产品代码、上下文感知句法绑定为脑神经图谱的高维索引标签。</p>
                      </div>

                      <form onSubmit={handleCreateSemanticTag} className="space-y-3">
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">Target Product</label>
                          <select
                            className="w-full bg-white border rounded p-1 text-xs"
                            value={semProductId}
                            onChange={e => setSemProductId(e.target.value)}
                          >
                            <option value="p_cashmere_coat">Classic Tailored Trench Coat (p_cashmere_coat)</option>
                            <option value="p_silk_dress">Camel Wool Luxury Coat (p_silk_dress)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">Semantic Label (文本描述性语义标签)</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. business-executive"
                            value={semTagText}
                            onChange={e => setSemTagText(e.target.value)}
                            className="w-full bg-white border rounded p-1 text-slate-850"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">Relevance Confidence (置信度 %)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={semTagConfidence}
                            onChange={e => setSemTagConfidence(Number(e.target.value))}
                            className="w-full bg-white border rounded p-1 text-slate-850"
                          />
                        </div>
                        <button type="submit" className="w-full bg-slate-900 text-white font-extrabold py-1.5 rounded hover:bg-slate-800 transition">
                          绑定高维标签索引
                        </button>
                      </form>
                    </div>

                    {/* Semantic Products and Embeddings List */}
                    <div className="lg:col-span-2 space-y-3">
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-xs font-bold text-slate-800">数据库感知的产品上下文描述与关系聚类 (Semantic Vector Graph Registry)</span>
                      </div>

                      {dbEngine.semantic_products.getAll().map(sp => {
                        const tags = dbEngine.semantic_tags.getAll().filter(t => t.semantic_product_id === sp.id);
                        const emb = dbEngine.semantic_embeddings.getAll().find(e => e.semantic_product_id === sp.id);
                        const clusters = dbEngine.fashion_graph_clusters.getAll();
                        return (
                          <div key={sp.id} className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
                            <div className="flex justify-between items-center border-b pb-1.5">
                              <div>
                                <span className="font-extrabold text-slate-850 text-xs">感知对象: {sp.product_id}</span>
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Semantic Product ID: {sp.id}</div>
                              </div>
                              <span className="text-xs bg-[#07C2E3] text-black font-extrabold px-1.5 py-0.5 rounded font-mono">ESTIMATED VALUE: €{sp.perceived_value_eur}</span>
                            </div>

                            <div className="text-xs text-slate-700 space-y-1">
                              <div>💬 <strong>智脑判定背景意境：</strong> {sp.semantic_title_context}</div>
                              <div>👥 <strong>细分目标心智人群：</strong> {sp.audience_archetype}</div>
                            </div>

                            {tags.length > 0 && (
                              <div className="space-y-1.5 pt-1.5 border-t border-dashed">
                                <div className="text-[10px] text-slate-400 font-bold font-mono">Associated Semantic DNA Tags:</div>
                                <div className="flex flex-wrap gap-1.5">
                                  {tags.map(t => (
                                    <span key={t.id} className="text-[11px] font-sans text-slate-800 border bg-slate-50 border-slate-200 px-2 py-0.5 rounded flex items-center gap-1.5">
                                      {t.tag_label} <strong className="text-emerald-700">({t.relevance_confidence_pct}%)</strong>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {emb && (
                              <div className="flex items-center gap-2 p-2 bg-slate-900 rounded text-slate-300 font-mono text-[10.5px]">
                                <span className="text-[#07C2E3] font-black">LATENT SPACE HASH:</span>
                                <span>{emb.vector_hash}</span>
                                <span className="bg-slate-800 px-1.5 py-0.5 rounded ml-auto text-[9.5px]">Dimensions: {emb.latent_space_dimension_count}</span>
                              </div>
                            )}

                            {clusters.length > 0 && (
                              <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 border-t pt-2">
                                <span>当前绑定三维度聚类群:</span>
                                {clusters.map(cl => (
                                  <span key={cl.id} className="text-[9.5px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                                    {cl.cluster_name} (Cohesion Coeff: {cl.cohesion_index}%)
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 6 : Logical Reasoning Layer (Phases 256-260) */}
              {ontologySubTab === 'reasoning' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
                    
                    {/* Reasoning control center */}
                    <div className="bg-slate-900 border border-slate-800 text-white p-4 rounded-lg space-y-4 shadow-sm">
                      <div className="border-b border-rose-300/10 pb-2">
                        <span className="text-xs font-black text-rose-300 block">🧠 智脑演绎推理传导控制 (Deduction Simulator)</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">当宏观外部环境偏离（如寒潮气温异常等），模拟智脑内部纯推理机制、分析材料跟大区溢价，推导出最终的安全库存补货策略和定价策略过程。</p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] text-slate-400 font-mono mb-1">Triggering Climate Driver (气相异常信号)</label>
                          <select
                            className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-xs text-white"
                            value={reasoningWeatherFactor}
                            onChange={e => setReasoningWeatherFactor(e.target.value as any)}
                          >
                            <option value="Cold_Wave">极地寒潮气温预警 (Cold Wave Temperature Alarm -4.2C)</option>
                            <option value="Mild_Winter">拉尼娜偏暖波动 (Mild Winter Anomaly +2.0C)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 font-mono mb-1">Target European Market (目标大区)</label>
                          <select
                            className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-xs text-white"
                            value={reasoningRegion}
                            onChange={e => setReasoningRegion(e.target.value)}
                          >
                            <option value="France">France 大区 (巴黎巴黎消费者情绪映射)</option>
                            <option value="Germany">Germany 大区 (德国美丽诺物理性能表现)</option>
                          </select>
                        </div>

                        <button
                          onClick={handleTriggerReasoning}
                          disabled={reasoningIsRunning}
                          className="w-full bg-[#07C2E3] text-black font-extrabold py-2 rounded hover:bg-[#06B2D0] transition flex items-center justify-center gap-2"
                        >
                          {reasoningIsRunning ? (
                            <>
                              <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                              智脑贝叶斯概率推理中...
                            </>
                          ) : (
                            <>
                              <span>⚡</span> 开始本体因果链演绎模式
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Reasoning Deduction Sequences & Strategic Insights */}
                    <div className="lg:col-span-2 space-y-4">
                      
                      {/* Active Deduction Sequence Trace */}
                      <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
                        <div className="flex justify-between items-center border-b pb-1.5">
                          <span className="text-xs font-black text-slate-800">本体演绎推理逻辑链及证据推导 (Logic Deduction Trace Logs)</span>
                          <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-100 px-1 py-0.5 rounded">DEDUCTION_ENGINE</span>
                        </div>

                        <div className="space-y-3">
                          {dbEngine.ontology_reasoning_tasks.getAll().map(task => {
                            const result = dbEngine.ontology_reasoning_results.getAll().find(r => r.task_id === task.id);
                            return (
                              <div key={task.id} className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="font-extrabold text-slate-750 text-xs">任务：{task.task_name}</span>
                                  <span className="text-[10px] bg-slate-200 font-mono text-slate-600 px-1.5 py-0.5 rounded bg-slate-200">Trigged by {task.triggered_by}</span>
                                </div>
                                
                                {result && (
                                  <div className="space-y-1 pl-2 border-l-2 border-slate-300 py-1 text-slate-700 font-mono text-[10.5px]">
                                    {result.logic_deduction_sequence.map((seq, sidx) => (
                                      <div key={sidx} className="flex gap-2">
                                        <span className="text-[#07C2E3] font-extrabold">[{sidx + 1}]</span>
                                        <span>{seq}</span>
                                      </div>
                                    ))}
                                    <div className="pt-2 text-slate-500 text-[10.5px] font-sans">
                                      推理引擎输出可信度评分：<strong className="text-slate-900">{result.confidence_score}%</strong> (已通过 L256 贝叶斯审慎过滤网络).
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Strategic Insights Written list */}
                      <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
                        <div className="flex justify-between items-center border-b pb-1.5">
                          <span className="text-xs font-bold text-slate-800">持久化决策建议成果 (Ontology Strategic Insights Output: {dbEngine.ontology_insights.getAll().length})</span>
                          <span className="text-[10px] text-slate-400">Platform Autonomic Strategy</span>
                        </div>

                        <div className="space-y-3">
                          {dbEngine.ontology_insights.getAll().map(ins => (
                            <div key={ins.id} className="p-3.5 border border-dashed border-[#07C2E3]/30 bg-[#07C2E3]/5 hover:bg-[#07C2E3]/10 rounded flex flex-col gap-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-extrabold text-slate-900">{ins.subject_entity}</span>
                                <span className="text-[9.5px] bg-[#07C2E3] text-black font-extrabold px-2 py-0.5 rounded font-mono uppercase">{ins.insight_type}</span>
                              </div>
                              <p className="text-xs text-slate-700 font-sans leading-relaxed">
                                {ins.rational_explanation}
                              </p>
                              <div className="flex justify-between items-center border-t border-[#07C2E3]/20 pt-2 mt-1 text-[11px] font-mono text-slate-500">
                                <span>🎯 推荐智能体执行指令：<strong className="text-slate-900">{ins.recommended_action_code}</strong></span>
                                <span>影响大盘指数评分: <strong className="text-slate-950">{ins.impact_rating_score} / 105</strong></span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LAYER 211: European Consumer Intelligence Center */}
          {intelLayer === 'l11_consumers' && (
            <div className="space-y-6" id="layer_consumers_panel">
              <div className="border-b border-rose-200 pb-3 flex justify-between items-center bg-slate-900 p-4 rounded text-white shadow-sm">
                <div>
                  <h3 className="text-sm font-black font-sans text-white">👥 Layer 211: 欧洲高维度消费行为决策中枢 (European Consumer Intelligence Hub)</h3>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xl">
                    企业大脑深度神经元：追踪法国、德国、意大利、英国客群在材质感知、社交推荐偏向、价格弹性和圈层忠诚度的多维画像映射。
                  </p>
                </div>
                <span className="text-[10px] bg-[#07C2E3] text-black px-2 py-1 rounded font-mono font-bold font-sans animate-pulse">EUR_CONSUMER_INTEL_2.0</span>
              </div>

              {/* Subtabs for High-Dimensional Consumer Intel */}
              <div className="flex gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setConsumerSubTab('personas')}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition ${consumerSubTab === 'personas' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-650 hover:text-slate-800'}`}
                >
                  👤 跨国客群画像 & 购买心理因子
                </button>
                <button
                  type="button"
                  onClick={() => setConsumerSubTab('regional')}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition ${consumerSubTab === 'regional' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-650 hover:text-slate-800'}`}
                >
                  🌍 大区审美特性 & 原生底色偏好
                </button>
                <button
                  type="button"
                  onClick={() => setConsumerSubTab('age_segments')}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition ${consumerSubTab === 'age_segments' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-650 hover:text-slate-800'}`}
                >
                  📈 年龄群体跃迁与网络信度监控
                </button>
              </div>

              {/* --- SUBTAB 1: Personas --- */}
              {consumerSubTab === 'personas' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
                  {/* Left Column - Passport and Generator */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">已映射时尚客群分类 ({consumerPersonas.length})</span>
                        <span className="text-[10px] text-slate-400 font-mono">DB: consumer_personas</span>
                      </div>
                      
                      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                        {consumerPersonas.map(cp => {
                          const isSel = selectedPersonaId === cp.id;
                          return (
                            <div
                              key={cp.id}
                              onClick={() => setSelectedPersonaId(cp.id)}
                              className={`p-3 rounded-lg border cursor-pointer transition flex flex-col relative ${isSel ? 'border-[#07C2E3] bg-[#07C2E3]/5 ring-1 ring-[#07C2E3]' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                  cp.country === 'FR' ? 'bg-blue-100 text-blue-800' : 
                                  cp.country === 'DE' ? 'bg-amber-100 text-amber-800' :
                                  cp.country === 'IT' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {cp.country} • {cp.gender}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePersona(cp.id);
                                  }}
                                  className="text-slate-350 hover:text-red-500 text-[10px] transition font-bold"
                                  title="Delete Persona Profile"
                                >
                                  ✕ 销户
                                </button>
                              </div>
                              <span className="text-xs font-bold text-slate-800 mt-2 font-sans tracking-tight">
                                {cp.persona_name}
                              </span>
                              <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-dashed border-slate-200 font-mono text-[10px] text-slate-500">
                                <div>
                                  <span className="block text-[8px] text-slate-400 uppercase">年龄区间</span>
                                  <span className="font-bold text-slate-700">{cp.age_segment}</span>
                                </div>
                                <div>
                                  <span className="block text-[8px] text-slate-400 uppercase">推荐渠道</span>
                                  <span className="font-bold text-slate-700 truncate block">{cp.preferred_channels[0]}</span>
                                </div>
                                <div>
                                  <span className="block text-[8px] text-slate-400 uppercase font-sans">预估月预算</span>
                                  <span className="font-bold text-slate-800">€{cp.monthly_fashion_budget}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Expandable Creation Form */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <h4 className="text-xs font-black text-slate-800 mb-2 uppercase tracking-wide">添加全新高净值客群底色标签 (Insert Persona)</h4>
                      <form onSubmit={handleCreatePersona} className="space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-500 font-bold mb-1 col-span-1">画像名称 Persona Label</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 巴黎南法轻奢新潮贵妇"
                            value={newPersName}
                            onChange={e => setNewPersName(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded p-1.5 focus:outline-[#07C2E3]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-slate-500 font-bold mb-1">投放国别 Country</label>
                            <select
                              value={newPersCountry}
                              onChange={e => setNewPersCountry(e.target.value)}
                              className="w-full bg-white border border-slate-300 rounded p-1.5 focus:outline-[#07C2E3]"
                            >
                              <option value="FR">FR - 法国大区</option>
                              <option value="DE">DE - 德国大区</option>
                              <option value="IT">IT - 意大利联邦</option>
                              <option value="GB">GB - 英国本土</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-500 font-bold mb-1">性别契合 Gender</label>
                            <select
                              value={newPersGender}
                              onChange={e => setNewPersGender(e.target.value as any)}
                              className="w-full bg-white border border-slate-300 rounded p-1.5 focus:outline-[#07C2E3]"
                            >
                              <option value="Female">Female - 女性市场</option>
                              <option value="Male">Male - 男性市场</option>
                              <option value="Unisex">Unisex - 中性穿搭</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-slate-500 font-bold mb-1 col-span-1">年龄 Segment</label>
                            <select
                              value={newPersAgeSegment}
                              onChange={e => setNewPersAgeSegment(e.target.value as any)}
                              className="w-full bg-white border border-slate-300 rounded p-1.5 text-[11px]"
                            >
                              <option value="18-24">18-24</option>
                              <option value="25-34">25-34</option>
                              <option value="35-50">35-50</option>
                              <option value="50+">50+</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-500 font-bold mb-1 col-span-1">消费层位 Category</label>
                            <select
                              value={newPersCategory}
                              onChange={e => setNewPersCategory(e.target.value as any)}
                              className="w-full bg-white border border-slate-300 rounded p-1.5 text-[11px]"
                            >
                              <option value="Luxury">Luxury - 高奢面料</option>
                              <option value="Premium">Premium - 轻奢轻暖</option>
                              <option value="Pragmatic">Pragmatic - 舒适通勤</option>
                              <option value="Casual">Casual - 复古街头</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-500 font-bold mb-1">转化倾向 P(Conv)</label>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={newPersProb}
                              onChange={e => setNewPersProb(Number(e.target.value))}
                              className="w-full bg-white border border-slate-300 rounded p-1.5 text-[11px]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-500 font-bold mb-1 col-span-1">单月预算 Monthly Budget (EUR)</label>
                          <input
                            type="range"
                            min="50"
                            max="800"
                            step="25"
                            value={newPersBudget}
                            onChange={e => setNewPersBudget(Number(e.target.value))}
                            className="w-full accent-[#07C2E3]"
                          />
                          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-0.5">
                            <span>€50</span>
                            <span className="font-bold text-slate-750">€{newPersBudget} EUR / 月</span>
                            <span>€800</span>
                          </div>
                        </div>

                        <button type="submit" className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] font-extrabold text-black py-2 rounded transition">
                          + 录入新画像标签并发布
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Right Column - Deep Neural Weights */}
                  {selectedPersonaId ? (
                    (() => {
                      const selPersona = consumerPersonas.find(x => x.id === selectedPersonaId);
                      const myMotivations = purchaseMotivations.filter(x => x.persona_id === selectedPersonaId);
                      const mySensitivities = priceSensitivities.filter(x => x.persona_id === selectedPersonaId);
                      const myClusters = lifestyleClusters.filter(x => x.persona_id === selectedPersonaId);

                      return (
                        <div className="lg:col-span-7 space-y-6">
                          <div className="bg-slate-900 text-white rounded-lg p-5 shadow-md relative overflow-hidden">
                            <div className="absolute right-0 top-0 translate-x-12 -translate-y-4 text-slate-800 text-[110px] font-black pointer-events-none font-mono opacity-25">
                              {selPersona?.country}
                            </div>
                            <div className="flex justify-between items-baseline border-b border-slate-800 pb-3 z-10 relative">
                              <div>
                                <h4 className="text-base font-black font-sans text-white">{selPersona?.persona_name}</h4>
                                <p className="text-[10.5px] text-slate-400 mt-1">画像编码: {selPersona?.id} • 对应系统锚点</p>
                              </div>
                              <span className="text-[10px] bg-[#07C2E3]/20 text-[#07C2E3] border border-[#07C2E3]/50 rounded px-2.5 py-0.5 font-bold">
                                {selPersona?.market_category} Tier
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4 font-mono text-xs z-10 relative">
                              <div className="p-2 bg-slate-850 rounded border border-slate-800">
                                <span className="text-slate-450 block text-[9px] uppercase tracking-wide">单月时尚边际预算</span>
                                <span className="text-sm font-bold text-[#07C2E3]">€{selPersona?.monthly_fashion_budget} EUR</span>
                              </div>
                              <div className="p-2 bg-slate-850 rounded border border-slate-800">
                                <span className="text-slate-450 block text-[9px] uppercase tracking-wide">ECOS 概率转化率</span>
                                <span className="text-sm font-bold text-emerald-400">{selPersona?.conversion_probability}% P(Conv)</span>
                              </div>
                            </div>
                          </div>

                          {/* 1. Mapped Motivations */}
                          <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-4">
                            <div className="flex justify-between items-baseline border-b border-slate-100 pb-2">
                              <h5 className="font-black text-slate-850 text-xs font-sans uppercase">🧠 认知动机向量与品质需求权重 (Purchase Motivations)</h5>
                              <span className="text-[10px] text-slate-400 font-mono">Table: purchase_motivations ({myMotivations.length})</span>
                            </div>

                            {myMotivations.length === 0 ? (
                              <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 border border-dashed rounded-lg">
                                该画像尚未映射神经动力学权重，请在下方声明新增它的购买动机。
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {myMotivations.map(mot => (
                                  <div key={mot.id} className="p-3.5 bg-slate-50 border border-slate-150 rounded relative group">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteMotivation(mot.id)}
                                      className="absolute right-2 top-2 text-slate-350 hover:text-red-500 opacity-0 group-hover:opacity-100 transition text-[10px]"
                                    >
                                      ✕
                                    </button>
                                    <div className="text-xs font-bold text-slate-800 flex justify-between pr-4">
                                      <span>主导推手:</span>
                                      <span className="text-[#07C2E3] font-sans truncate ml-1">{mot.primary_motivator}</span>
                                    </div>
                                    <div className="space-y-2 mt-3 font-mono text-[10px]">
                                      <div>
                                        <div className="flex justify-between text-slate-500">
                                          <span>社交声量佐证 (Social Proof)</span>
                                          <span className="font-extrabold text-slate-800">{mot.social_proof_weight}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-1 rounded mt-0.5"><div className="bg-[#07C2E3] h-full rounded" style={{ width: `${mot.social_proof_weight}%` }} /></div>
                                      </div>
                                      <div>
                                        <div className="flex justify-between text-slate-500">
                                          <span>材质品质纯度 (Quality Importance)</span>
                                          <span className="font-extrabold text-slate-800">{mot.quality_importance}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-1 rounded mt-0.5"><div className="bg-amber-450 bg-amber-500 h-full rounded" style={{ width: `${mot.quality_importance}%` }} /></div>
                                      </div>
                                      <div>
                                        <div className="flex justify-between text-slate-500">
                                          <span>环保可持续重要度 (Eco Index)</span>
                                          <span className="font-extrabold text-slate-800">{mot.sustainability_score}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-1 rounded mt-0.5"><div className="bg-emerald-500 h-full rounded" style={{ width: `${mot.sustainability_score}%` }} /></div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Create Motivation mini form */}
                            <form onSubmit={handleCreateMotivation} className="p-3 bg-slate-50 rounded border border-dashed text-xs space-y-3">
                              <span className="font-bold text-slate-705 block uppercase text-[10px]">声明画像动机神经元 Mapped Motivator Engine</span>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-slate-500 font-bold mb-0.5">主导核心驱动 Primary Mot</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. Prestige Brand Heritage"
                                    value={newMotivPrimary}
                                    onChange={e => setNewMotivPrimary(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded p-1 text-[11px]"
                                  />
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                  <div>
                                    <label className="block text-slate-500 font-bold mb-0.5" title="Social Proof">社交佐证</label>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={newMotivSocial}
                                      onChange={e => setNewMotivSocial(Number(e.target.value))}
                                      className="w-full bg-white border border-slate-300 rounded p-1 text-center font-mono text-[10.5px]"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-slate-500 font-bold mb-0.5" title="Material Quality">材质纯度</label>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={newMotivQuality}
                                      onChange={e => setNewMotivQuality(Number(e.target.value))}
                                      className="w-full bg-white border border-slate-300 rounded p-1 text-center font-mono text-[10.5px]"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-slate-500 font-bold mb-0.5" title="Sustainability Weight">环保倾向</label>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={newMotivSustain}
                                      onChange={e => setNewMotivSustain(Number(e.target.value))}
                                      className="w-full bg-white border border-slate-300 rounded p-1 text-center font-mono text-[10.5px]"
                                    />
                                  </div>
                                </div>
                              </div>
                              <button type="submit" className="w-full bg-slate-800 text-white font-bold py-1.5 rounded text-[10.5px] hover:bg-slate-900 transition">
                                写入购买动机关联权重
                              </button>
                            </form>
                          </div>

                          {/* 2. Mapped Price Sensitivity */}
                          <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-4">
                            <div className="flex justify-between items-baseline border-b border-slate-100 pb-2">
                              <h5 className="font-black text-slate-850 text-xs font-sans uppercase">💰 ECOS 点货价格价格弹性阈值 (Price Sensitivities)</h5>
                              <span className="text-[10px] text-slate-400 font-mono">Table: price_sensitivities ({mySensitivities.length})</span>
                            </div>

                            {mySensitivities.length === 0 ? (
                              <div className="text-center py-6 text-xs text-[#07C2E3] bg-slate-50 border border-dashed rounded-lg">
                                该大区画像尚未标定价格上限系数，请在下方补充。
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {mySensitivities.map(sen => (
                                  <div key={sen.id} className="p-3 bg-slate-50 border border-slate-150 rounded relative group font-mono text-[11px]">
                                    <button
                                      type="button"
                                      onClick={() => handleDeletePriceSensitivity(sen.id)}
                                      className="absolute right-2 top-2 text-slate-350 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                    >
                                      ✕
                                    </button>
                                    <div className="flex justify-between font-bold text-slate-800 border-b pb-1">
                                      <span className="font-sans">价格敏感度指征:</span>
                                      <span className={sen.price_tolerance_index < 50 ? 'text-green-600' : 'text-red-500'}>
                                        {sen.price_tolerance_index} (Index)
                                      </span>
                                    </div>
                                    <div className="space-y-1 mt-2 text-slate-500 text-[10px]">
                                      <div className="flex justify-between">
                                        <span>极低促销倾销买入 (Promo Hunter)</span>
                                        <span className="font-extrabold text-slate-800">{sen.promotion_buyer_flag === 1 ? 'YES (敏感型)' : 'NO (品质大开)'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>奢侈加价极限接受倍率 (Max Markup)</span>
                                        <span className="font-extrabold text-[#07C2E3]">{sen.luxury_markup_acceptance_ratio}x</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Create Price form */}
                            <form onSubmit={handleCreatePriceSensitivity} className="p-3 bg-slate-50 rounded border border-dashed text-xs grid grid-cols-3 gap-2">
                              <div>
                                <label className="block text-slate-500 font-bold mb-0.5">价格敏感度(0-100)</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={newPriceTolerance}
                                  onChange={e => setNewPriceTolerance(Number(e.target.value))}
                                  className="w-full bg-white border border-slate-300 rounded p-1 text-center"
                                />
                              </div>
                              <div>
                                <label className="block text-slate-500 font-bold mb-0.5">大促敏感型</label>
                                <select
                                  value={newPricePromo}
                                  onChange={e => setNewPricePromo(Number(e.target.value))}
                                  className="w-full bg-white border border-slate-300 rounded p-1"
                                >
                                  <option value={0}>NO (重质感)</option>
                                  <option value={1}>YES (重大促)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-slate-500 font-bold mb-0.5">奢侈溢价上限倍率</label>
                                <input
                                  type="number"
                                  step="0.05"
                                  min="1.0"
                                  max="5.0"
                                  value={newPriceLuxury}
                                  onChange={e => setNewPriceLuxury(Number(e.target.value))}
                                  className="w-full bg-white border border-slate-300 rounded p-1 text-center"
                                />
                              </div>
                              <button type="submit" className="col-span-3 bg-slate-800 hover:bg-slate-900 text-white font-bold py-1.5 rounded text-[10.5px]">
                                绑定并写入价格弹性标定线
                              </button>
                            </form>
                          </div>

                          {/* 3. Mapped Lifestyle Clusters */}
                          <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-4">
                            <div className="flex justify-between items-baseline border-b border-slate-100 pb-2">
                              <h5 className="font-black text-slate-850 text-xs font-sans uppercase">🏡 审美圈层锚定底色 (Lifestyle Clusters)</h5>
                              <span className="text-[10px] text-slate-400 font-mono">Table: lifestyle_clusters ({myClusters.length})</span>
                            </div>

                            {myClusters.length === 0 ? (
                              <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 border border-dashed rounded-lg">
                                该画像尚未映射社交与审美圈层，请在下方锁定。
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {myClusters.map(lc => (
                                  <div key={lc.id} className="p-3 bg-slate-50 border border-slate-150 rounded relative group">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteLifestyleCluster(lc.id)}
                                      className="absolute right-2 top-2 text-slate-350 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                    >
                                      ✕
                                    </button>
                                    <div className="text-xs font-bold text-slate-800">
                                      圈层定位: <span className="text-[#07C2E3]">{lc.cluster_name}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200 font-mono text-[10px] text-slate-500">
                                      <div>
                                        <span>通勤/居家比</span>
                                        <span className="block font-bold text-slate-800">{lc.work_home_ratio}% : {100 - lc.work_home_ratio}%</span>
                                      </div>
                                      <div>
                                        <span>品牌忠诚度</span>
                                        <span className="block font-bold text-violet-600">{lc.brand_loyalty_index}%</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Create Cluster Form */}
                            <form onSubmit={handleCreateLifestyleCluster} className="p-3 bg-slate-50 rounded border border-dashed text-xs space-y-2">
                              <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-1">
                                  <label className="block text-slate-500 font-bold mb-0.5">社群圈层标签</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. Eco Yacht Club Member"
                                    value={newLifeCluster}
                                    onChange={e => setNewLifeCluster(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded p-1 text-[11px]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-slate-500 font-bold mb-0.5">通勤场景占有%</label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={newLifeWork}
                                    onChange={e => setNewLifeWork(Number(e.target.value))}
                                    className="w-full bg-white border border-slate-300 rounded p-1 text-center font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="block text-slate-500 font-bold mb-0.5">品牌忠诚指向%</label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={newLifeLoyalty}
                                    onChange={e => setNewLifeLoyalty(Number(e.target.value))}
                                    className="w-full bg-white border border-slate-300 rounded p-1 text-center font-mono"
                                  />
                                </div>
                              </div>
                              <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-1.5 rounded text-[10.5px]">
                                绑定圈层特写定位
                              </button>
                            </form>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="lg:col-span-7 bg-slate-50 p-6 rounded-lg border border-dashed border-slate-300 text-center flex flex-col justify-center items-center py-20 text-xs">
                      <span className="text-4xl">👥</span>
                      <h4 className="font-bold text-slate-800 mt-4">请在左侧点击选择一个具体的时尚客群画像</h4>
                      <p className="text-slate-500 mt-1 max-w-sm">企业大脑将实时在此解密该画像的跨国社交驱动度、材质纯度要求及定价马克溢价倍率极限等隐藏多约束因子。</p>
                    </div>
                  )}
                </div>
              )}

              {/* --- SUBTAB 2: Regional Preferences --- */}
              {consumerSubTab === 'regional' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {regionalPreferences.map(rp => (
                      <div key={rp.id} className="bg-white p-4 rounded-lg border border-slate-200 hover:shadow-md transition relative group">
                        <button
                          type="button"
                          onClick={() => handleDeleteRegionalPreference(rp.id)}
                          className="absolute right-3 top-3 text-slate-350 hover:text-red-500 font-bold hover:scale-110 opacity-0 group-hover:opacity-100 transition text-[11px]"
                          title="Delete preference"
                        >
                          ✕
                        </button>
                        <div className="flex gap-2 items-center border-b pb-2">
                          <span className="text-xs font-black bg-slate-900 text-white rounded px-2 py-0.5 font-mono">{rp.country}</span>
                          <span className="text-xs font-bold text-slate-700">底色大区审美偏向</span>
                        </div>
                        
                        <div className="mt-3 text-xs space-y-2.5">
                          <div className="p-2 bg-slate-50 border border-slate-100 rounded">
                            <span className="text-[10px] text-slate-400 block font-mono">🎨 独占色彩倾向 (Colors)</span>
                            <span className="font-bold text-slate-800 block mt-0.5">{rp.color_preference}</span>
                          </div>
                          <div className="p-2 bg-slate-50 border border-slate-100 rounded">
                            <span className="text-[10px] text-slate-400 block font-mono">✂️ 服饰版型剪裁 (Silhouette)</span>
                            <span className="font-bold text-slate-800 block mt-0.5">{rp.silhouette_preference}</span>
                          </div>
                          <div className="p-2 bg-slate-50 border border-slate-100 rounded">
                            <span className="text-[10px] text-slate-400 block font-mono">📏 核心尺码轴段 (Main Sizes)</span>
                            <span className="font-bold text-[#07C2E3] block mt-0.5">{rp.average_size_preference}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add regional preference */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="text-xs font-black text-slate-800 mb-3 uppercase tracking-wide">注册注册欧洲新地理大区审美底色 (Add Regional Styling Matrix)</h4>
                    <form onSubmit={handleCreateRegionalPreference} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-500 font-bold mb-1">物理大区 Country</label>
                        <select
                          value={newRegCountry}
                          onChange={e => setNewRegCountry(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded p-1.5 focus:outline-[#07C2E3]"
                        >
                          <option value="FR">FR - 巴黎都市圈/法国大区</option>
                          <option value="DE">DE - 柏林慕尼黑/德国联邦</option>
                          <option value="IT">IT - 米兰托斯卡纳/意大利</option>
                          <option value="GB">GB - 伦敦高街/英国</option>
                          <option value="ES">ES - 马德里巴塞大区</option>
                          <option value="CH">CH - 瑞苏高原富人区</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-500 font-bold mb-1">主打色系偏好 Color Palette</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Camel, Oat, Earthy Neutrals"
                          value={newRegColor}
                          onChange={e => setNewRegColor(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded p-1.5 focus:outline-[#07C2E3]"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-bold mb-1">剪裁轮廓偏好 Silhouette</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Semi-Loose Heavy Drop Shoulders"
                          value={newRegSilhouette}
                          onChange={e => setNewRegSilhouette(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded p-1.5 focus:outline-[#07C2E3]"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-bold mb-1">核心尺码中位数 Avg Size</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            placeholder="e.g. 36-38 (M)"
                            value={newRegSize}
                            onChange={e => setNewRegSize(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded p-1.5 focus:outline-[#07C2E3]"
                          />
                          <button type="submit" className="bg-[#07C2E3] hover:bg-[#06B2D0] font-black text-black px-4 rounded transition shrink-0">
                            + 记录大区审美
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* --- SUBTAB 3: Age segment behaviors --- */}
              {consumerSubTab === 'age_segments' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
                  {/* Left panel - chart and table */}
                  <div className="md:col-span-8 bg-white p-5 rounded-lg border border-slate-200 space-y-4">
                    <span className="text-xs font-bold text-slate-850 block uppercase tracking-wide">
                      年龄层代际周期与社媒/意见领袖高阶信赖感指标 (Age Segment Behaviors Framework)
                    </span>
                    
                    <div className="border border-slate-150 rounded overflow-hidden">
                      <table className="w-full text-xs font-sans text-left">
                        <thead className="bg-[#07C2E3]/5 border-b border-slate-200">
                          <tr>
                            <th className="p-3 font-bold text-slate-700">年龄区段 Age Bracket</th>
                            <th className="p-3 font-bold text-slate-700">季节款切换频次/年</th>
                            <th className="p-3 font-bold text-slate-700">社媒/KOL/名流决策跟随度</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150">
                          {ageSegmentBehaviors.map(asb => (
                            <tr key={asb.id} className="hover:bg-slate-50">
                              <td className="p-3 font-black text-slate-800 font-mono">{asb.age_segment}</td>
                              <td className="p-3 font-mono text-slate-650">{asb.seasonal_switching_frequency} 次 / 年</td>
                              <td className="p-3">
                                <div className="flex items-center gap-3 font-mono">
                                  <span className="w-10 font-bold text-slate-700">{asb.influencer_susceptibility_score}%</span>
                                  <div className="flex-1 bg-slate-100 h-2 rounded overflow-hidden">
                                    <div
                                      className={`h-full rounded ${asb.influencer_susceptibility_score > 70 ? 'bg-[#07C2E3]' : asb.influencer_susceptibility_score > 40 ? 'bg-amber-450 bg-amber-500' : 'bg-slate-400'}`}
                                      style={{ width: `${asb.influencer_susceptibility_score}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="p-3.5 bg-sky-50 bg-[#07C2E3]/5 text-slate-750 text-xs rounded-lg border border-[#07C2E3]/20 leading-relaxed">
                      <strong>💡 大脑代际推理指引:</strong> 
                      18-24岁（Z世代）的时尚生命周期极短（年均轮转6次），核心跟随 TikTok/Instagram 名流效应，溢价接受度低但购买频次极高。35-50岁（中生代精英）季销频次低（3次），对知名KOL免疫度高，核心决策依靠<strong>材质（羊绒纯度、美丽诺系数）与版型口碑</strong>。
                    </div>
                  </div>

                  {/* Right panel - dynamic insight based on database stats */}
                  <div className="md:col-span-4 bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="border-b pb-2 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-800">代际神经元诊断状态</span>
                        <span className="text-[9px] bg-indigo-50 text-indigo-600 rounded px-1.5 font-mono">ACTIVE_ENGINE</span>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="p-3 bg-slate-50 border rounded">
                          <span className="text-[10px] text-slate-400 block font-mono">最高信赖代际层 (Peak Susceptibility)</span>
                          <span className="font-extrabold text-[#07C2E3] text-sm block mt-0.5">18-24 (Gen Z Pionner)</span>
                          <p className="text-[10.5px] text-slate-400 mt-1">
                            社媒随众度达到 85%，在发布具有博主推荐的面料商品（如街头羊毛混纺）时，有极强的爆破力。
                          </p>
                        </div>

                        <div className="p-3 bg-slate-50 border rounded">
                          <span className="text-[10px] text-slate-400 block font-mono">极稳资产代际层 (Stable Anchor)</span>
                          <span className="font-extrabold text-indigo-600 text-sm block mt-0.5">35-50 (Sartorial Elite)</span>
                          <p className="text-[10.5px] text-slate-400 mt-1">
                            以米兰、德意志高端中产为底，单件大衣 AOV 稳定于 €350-€480 间，但季节切换指数仅为 3，转化耗时增加。
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-3 mt-4 text-[10px] text-slate-400 font-mono text-center flex justify-between">
                      <span>ENT_BEH_ENGINE_V1.1</span>
                      <span className="text-emerald-500 font-bold">📡 Live Synchronization</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LAYER 212: Trend Forecasting Center */}
          {intelLayer === 'l12_trends' && (
            <div className="space-y-6" id="layer_trends_panel">
              <div className="border-b border-rose-200 pb-3 flex justify-between items-center bg-slate-900 p-4 rounded text-white shadow-sm">
                <div>
                  <h3 className="text-sm font-black font-sans text-white">🔮 Layer 212: 趋势预测验证中枢 (Trend Forecasting Center)</h3>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xl">
                    时空趋势轨迹监测，存储时尚关键字势头，并包含多维度循证 calibration 信度校验系统。
                  </p>
                </div>
                <span className="text-[10px] bg-[#07C2E3] text-black px-2 py-1 rounded font-mono font-bold font-sans">TREND_VALIDATOR</span>
              </div>

              {/* Trajectory Filters Row */}
              <div className="flex gap-2 border-b pb-3 font-sans text-xs">
                {['All', 'Trending', 'Stable', 'Declining', 'Emerging'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTrajectoryFilter(t as any)}
                    className={`px-3 py-1.5 rounded-full border transition ${trajectoryFilter === t ? 'bg-[#07C2E3] border-[#07C2E3] text-black font-extrabold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Trend predictions list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTrends.map(tr => {
                  const correlatedLogs = confidenceLogs.filter(cl => cl.trend_id === tr.id);
                  return (
                    <div key={tr.id} className="bg-white p-4 rounded-lg border border-slate-200 hover:border-[#07C2E3] hover:shadow-sm transition text-xs space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${tr.trajectory === 'Trending' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : tr.trajectory === 'Emerging' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-slate-100 text-slate-450 text-slate-500'}`}>
                            {tr.trajectory}
                          </span>
                          <h4 className="font-sans font-extrabold text-slate-800 text-sm mt-1.5">{tr.keyword}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-mono">CONFIDENCE INDEX</span>
                          <strong className="text-base text-[#07C2E3] font-mono">{tr.confidence_score}%</strong>
                        </div>
                      </div>

                      <p className="text-slate-600 leading-normal text-[11.5px] font-sans">
                        {tr.reasoning_summary}
                      </p>

                      {/* Evidence calibration sublist */}
                      {correlatedLogs.length > 0 && (
                        <div className="p-2.5 bg-slate-50 rounded border border-slate-150 space-y-1.5">
                          <span className="font-sans font-bold text-[10.5px] text-slate-500 block uppercase">多维度验证循证点 (Evidence calibrate list)</span>
                          {correlatedLogs.map(log => (
                            <div key={log.id} className="space-y-1">
                              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                                <span>Calibrate Score: {log.calibration_score}/100</span>
                                <span>Checked: {log.assessed_date}</span>
                              </div>
                              <ul className="list-disc list-inside text-[10px] text-slate-505 space-y-0.5 text-slate-600 leading-normal font-sans">
                                {log.proof_points.map((pt, idx) => (
                                  <li key={idx} className="truncate">{pt}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Calibrate action button */}
                      <button
                        onClick={() => handleRecalibrateTrend(tr.id)}
                        disabled={calibratingId === tr.id}
                        className="w-full bg-slate-900 text-white hover:bg-slate-850 font-bold py-1.5 rounded transition text-xs flex items-center justify-center gap-1.5"
                      >
                        {calibratingId === tr.id ? (
                          <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <span>🔄 计算校准与循证信度 Calibration Run</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* LAYER 213: Supply Chain Network & Transit Routes */}
          {intelLayer === 'l13_supply' && (
            <div className="space-y-6" id="layer_supply_panel">
              <div className="border-b border-rose-200 pb-3 flex justify-between items-center bg-slate-900 p-4 rounded text-white shadow-sm">
                <div>
                  <h3 className="text-sm font-black font-sans text-white">🛬 Layer 213: 供给生命体中心 (Supply Chain Intelligence Center)</h3>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xl">
                    存储在欧合约总仓库件数及运输口岸运力时效。当遇到突发口岸罢工时，可点对点调度到零摩擦线路。
                  </p>
                </div>
                <span className="text-[10px] bg-[#07C2E3] text-black px-2 py-1 rounded font-mono font-bold font-sans">SUPPLY_LOGISTICS</span>
              </div>

              {/* Warehouse physical nodes active numbers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {warehouses.map(wh => (
                  <div key={wh.id} className="bg-white p-4 rounded-lg border border-slate-200 text-xs shadow-xs space-y-2">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="font-extrabold text-[#07C2E3] font-mono text-[11px]">{wh.id.toUpperCase()}</span>
                      <strong className="text-slate-800 text-xs font-sans font-extrabold">{wh.name}</strong>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-605 text-slate-600">
                      <div>容量区间: {wh.capacity_sqm} sqm</div>
                      <div>活动物料包: <strong>{wh.active_stock_units} Units</strong></div>
                    </div>
                    <div className="p-2 bg-slate-100 rounded text-[10px] text-slate-500 font-mono text-center">
                      Monthly Administrative Overheads: €{wh.overhead_cost_monthly.toLocaleString()}/month
                    </div>
                  </div>
                ))}
              </div>

              {/* Routes Simulation and Dispatchers */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs space-y-3">
                <span className="text-xs font-bold text-slate-800 block mb-2 font-sans">干线口岸物流走廊状态 (Supply Routes & Striking Overrides)</span>
                <div className="space-y-2">
                  {routes.map(rt => (
                    <div key={rt.id} className="p-3 bg-slate-50 rounded border border-slate-150 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-800 font-sans">{rt.origin_city} ➔ {rt.destination_city}</span>
                          <span className={`text-[9.5px] px-1.5 rounded font-extrabold ${rt.current_risk_status === 'Low' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800 animate-pulse'}`}>
                            {rt.current_risk_status} Risk
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">模式: {rt.transport_mode} • 货重成本: €{rt.cost_per_kg}/kg</div>
                      </div>

                      {/* Delay probability slider indicator */}
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-455 text-slate-500 font-mono">延误概率 (DELAY PROB)</span>
                          <div className="text-sm font-black text-rose-600 font-mono">{rt.delay_probability_pct}%</div>
                        </div>
                        
                        {/* Emergency dispatcher button */}
                        <button
                          onClick={() => handleRerouteShipping(rt.id)}
                          disabled={shippingActionLoading === rt.id || rt.current_risk_status === 'Low'}
                          className={`px-3 py-1.5 rounded text-[10.5px] font-extrabold transition ${rt.current_risk_status === 'Low' ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-rose-500 text-white hover:bg-rose-600 shadow-xs'}`}
                        >
                          {shippingActionLoading === rt.id ? (
                            <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                          ) : rt.current_risk_status === 'Low' ? (
                            '已安全 (Low Risk)'
                          ) : (
                            '⚡ 1键调度瑞士免关税直达 Alpine Rail'
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LAYER 214: Dynamic Pricing Intelligence Engine Sandbox */}
          {intelLayer === 'l14_pricing' && (
            <div className="space-y-6" id="layer_pricing_panel">
              <div className="border-b border-rose-200 pb-3 flex justify-between items-center bg-slate-900 p-4 rounded text-white shadow-sm">
                <div>
                  <h3 className="text-sm font-black font-sans text-white">🪙 Layer 214: 智能价格推演沙盘 (Pricing Intelligence Engine)</h3>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xl">
                    存储动态定价系数、弹性指数及策略输出。超级管理员在此拉动滑块运行沙盘计算，确定利润与销量的最优阻尼比。
                  </p>
                </div>
                <span className="text-[10px] bg-[#07C2E3] text-black px-2 py-1 rounded font-mono font-bold font-sans">PRICING_ENGINE</span>
              </div>

              {/* Dynamic Factors Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Elasticities reference */}
                <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs space-y-3">
                  <span className="font-sans font-bold text-slate-805 block border-b pb-1.5">欧洲面料与款式弹性权重因子</span>
                  {pricingModelsList.map(pm => (
                    <div key={pm.id} className="space-y-2">
                      <div className="font-extrabold text-slate-705">{pm.name}</div>
                      <div className="grid grid-cols-2 gap-2 font-mono text-[10.5px] text-slate-500">
                        <div>外部竞品关联权: {(pm.factor_weights as any).competitor_price * 100}%</div>
                        <div>社群偏好关联权: {(pm.factor_weights as any).organic_sentiment * 100}%</div>
                        <div>羊毛品类阻尼: {(pm.elasticities as any).luxury_wool}</div>
                        <div>轻量亚麻阻尼: {(pm.elasticities as any).heavy_linens}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live Sandbox Interactive Slider */}
                <div className="bg-white p-5 rounded-lg border border-[#07C2E3] text-xs space-y-4 shadow-sm">
                  <span className="font-sans font-bold text-[#07C2E3] block flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    重奢羊毛风衣 (Loro Piana Trench) 动态定价模拟
                  </span>

                  <div>
                    <div className="flex justify-between items-baseline font-mono">
                      <span className="text-slate-500">模拟单品最终零售售价 (Dynamic Retail Slider)</span>
                      <strong className="text-lg text-slate-900">€{interactivePrice}</strong>
                    </div>
                    <input
                      type="range"
                      min="140"
                      max="380"
                      value={interactivePrice}
                      onChange={e => setInteractivePrice(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-2 focus:outline-none"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                      <span>MOQ成本保底线: €65</span>
                      <span>竞品Zara定价: €269</span>
                      <span>欧洲精品价格上限: €380</span>
                    </div>
                  </div>

                  {/* Pricing feedback simulations */}
                  <div className="bg-slate-55 p-3 rounded-lg border border-slate-150 space-y-2">
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>预期毛利率 (Marginal Profit Delta):</span>
                      <strong className="font-black text-slate-800 font-mono">
                        {Math.round(((interactivePrice - 65) / interactivePrice) * 100)}%
                      </strong>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>流量转化溢漏预期 (Funnel Click):</span>
                      <strong className={`font-black font-mono ${interactivePrice > 269 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {interactivePrice > 269 ? '流失率增加 (-1.2%)' : '顺畅转换 (+2.5%)'}
                      </strong>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>模拟出货收益 (Simulated Profit Yield):</span>
                      <strong className="text-slate-800 font-black font-mono">€{(interactivePrice * 14.5).toFixed(0)}</strong>
                    </div>
                  </div>

                  <button
                    onClick={handleRegisterPricing}
                    className="w-full bg-[#07C2E3] text-black font-extrabold py-2 rounded hover:bg-[#06B2D0] transition"
                  >
                    ✓ 部署此模拟价格到 SaaS 所有租户
                  </button>
                </div>
              </div>

              {/* pricing decisions table */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block mb-2">已部署生效的价格模型事件索引 (Pricing Decisions Ledger: {pricingDecisionsList.length})</span>
                <div className="space-y-1.5 overflow-y-auto max-h-[160px] font-mono">
                  {pricingDecisionsList.map(dec => (
                    <div key={dec.id} className="p-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded flex justify-between items-center text-[10.5px]">
                      <div>
                        <span className="font-bold text-slate-800">Dynamic Decision: {dec.action_output}</span>
                        <span className="text-slate-400 ml-2">({dec.applied_at})</span>
                      </div>
                      <div className="text-right flex gap-3 text-slate-650">
                        <span>价格: <strong>€{dec.current_price}</strong></span>
                        <span>拟利润: <strong className="text-emerald-600">{dec.simulated_margin_pct}%</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LAYER 215: Business DNA Memory Systems */}
          {intelLayer === 'l15_dna' && (
            <div className="space-y-6" id="layer_dna_panel">
              <div className="border-b border-rose-200 pb-3 flex justify-between items-center bg-slate-900 p-4 rounded text-white shadow-sm">
                <div>
                  <h3 className="text-sm font-black font-sans text-white">📜 Layer 215: 商业记忆DNA基因舱 (Business DNA Memory System)</h3>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xl">
                    记录并归纳所有商家的历史战役成败，防止系统重新踏入“低质化学合成面料高退货”等历史雷区。时间序列不可伪造。
                  </p>
                </div>
                <span className="text-[10px] bg-[#07C2E3] text-black px-2 py-1 rounded font-mono font-bold font-sans">DNA_MEM_CELL</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Signature segment and DNA variables */}
                <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs space-y-2 text-center h-fit">
                  <span className="font-sans font-bold text-slate-500 block">SaaS 核心战略基因密码 (Core Strategic Multipliers)</span>
                  {dnas.map(d => (
                    <div key={d.id} className="space-y-3 pt-2">
                      <div>
                        <div className="text-[10px] text-slate-450 uppercase font-mono">CORE GROWTH MULTIPLIER</div>
                        <strong className="text-2xl text-[#07C2E3] font-mono font-extrabold">{d.core_growth_multiplier}x</strong>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-450 uppercase font-mono">MARGIN SAFETY WATERMARK</div>
                        <strong className="text-xl text-slate-700 font-mono font-bold">&gt; {d.core_margin_barrier}%</strong>
                      </div>
                      <div className="text-[10.5px] bg-slate-50 border p-2 rounded text-slate-500">
                        {d.signature_segment}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Experiences list */}
                <div className="bg-white p-4 rounded-lg border border-slate-200 md:col-span-2 text-xs space-y-3">
                  <span className="font-bold text-slate-800 block border-b pb-2">已沉淀的战役经验时序日志 (Campaign Experiences Ledger)</span>
                  <div className="space-y-2 overflow-y-auto max-h-[220px]">
                    {experiences.map(exp => (
                      <div key={exp.id} className="p-3 bg-slate-50 rounded border flex items-start gap-3 justify-between">
                        <span className="text-xl shrink-0 mt-0.5">{exp.is_success ? '🟢' : '🔴'}</span>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between font-bold">
                            <span className="text-slate-800 text-[11.5px]">{exp.label}</span>
                            <strong className={`font-mono ${exp.is_success ? 'text-emerald-600' : 'text-rose-500'}`}>
                              {exp.is_success ? '+' : '-'}{exp.net_gain_eur >= 0 ? '€' : '-€'}{Math.abs(exp.net_gain_eur).toLocaleString()}
                            </strong>
                          </div>
                          <p className="text-[10.5px] text-slate-505 text-slate-500 leading-relaxed font-sans">{exp.primary_reason}</p>
                          <div className="text-[10px] font-mono text-slate-400">Campaign Anchor Hash: {exp.memory_anchor_hash} • Type: {exp.campaign_or_action_type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive pattern builder form */}
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <span className="text-xs font-bold text-slate-800 block mb-3 font-sans uppercase">录入商业进化因果链公式 (Aesthetic DNA Logic formula)</span>
                <form onSubmit={handleRegisterDnaPattern} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <label className="block text-slate-500 font-bold mb-1">因果断言表达式 (If logical expression expression)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. IF Return_Rate > 22% AND Material_Is_Synthetic"
                      value={exprText}
                      onChange={e => setExprText(e.target.value)}
                      className="w-full bg-slate-5 e bg-white border border-slate-350 rounded p-2 text-xs text-slate-800 focus:outline-[#07C2E3]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-slate-500 font-bold mb-1">执行系统约束动作 (Then system constraint resolution)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Enforce wool certificated stamp, lock dynamic price drop limit"
                        value={actionText}
                        onChange={e => setActionText(e.target.value)}
                        className="w-full bg-slate-5 e bg-white border border-slate-350 rounded p-2 text-xs text-slate-800 focus:outline-[#07C2E3]"
                      />
                      <button type="submit" className="bg-[#07C2E3] text-black hover:bg-[#06B2D0] font-extrabold px-4 rounded transition shrink-0">
                        注入
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* LAYER 217: Executive Board AI simulated voting center */}
          {intelLayer === 'l17_boardroom' && (
            <div className="space-y-6" id="layer_boardroom_panel">
              <div className="border-b border-rose-200 pb-3 flex justify-between items-center bg-slate-900 p-4 rounded text-white shadow-sm">
                <div>
                  <h3 className="text-sm font-black font-sans text-white">🏛️ Layer 217: 董事会级自治投票网络 (Executive Board AI Center)</h3>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xl">
                    存储每次董事会自治会议信息，并集成 CEO, CFO, COO, CRO 自动选举投票表决器。信度校验不含拟态。
                  </p>
                </div>
                <span className="text-[10px] bg-[#07C2E3] text-black px-2 py-1 rounded font-mono font-bold font-sans">BOARDROOM_GOVERNANCE</span>
              </div>

              {/* Selector meeting selection */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs space-y-3">
                <span className="font-sans font-bold text-slate-850">选择活跃董事会审阅议题 (Active Boardroom Meetings)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
                  {meetings.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setFocusedMeetingId(m.id)}
                      className={`p-3 rounded-lg text-left border transition flex flex-col gap-1.5 ${focusedMeetingId === m.id ? 'border-[#07C2E3] bg-[#07C2E3]/5 text-black' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                    >
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-850">Topic: {m.topic}</span>
                        <span className={`text-[9px] px-1.5 rounded uppercase font-mono ${m.status === 'governed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 animate-pulse'}`}>
                          {m.status}
                        </span>
                      </div>
                      <div className="text-[10.5px] text-slate-400 font-mono">Proposed on: {m.proposed_at}</div>
                      <div className="text-[11px] text-slate-500 font-sans">议程重点: {m.agenda_items.join('; ')}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live boardroom automatic votes cast section */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 text-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b pb-2">
                  <span className="font-sans font-extrabold text-[#07C2E3] text-sm uppercase flex items-center gap-1">
                    <Building className="w-4 h-4 animate-spin-slow text-[#07C2E3]" />
                    实时董事会选举投票与决意规范 (Cast Automated System Ballots)
                  </span>
                  <button
                    onClick={handleSimulateBoardroom}
                    disabled={boardVotesSimulating}
                    className="bg-slate-900 border text-white hover:bg-slate-850 py-1.5 px-4 rounded font-bold font-sans flex items-center gap-2"
                  >
                    {boardVotesSimulating ? (
                      <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>🏛️ 运行自动投票决策 Simulation</span>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Casted ballots lists matching focused meeting id */}
                  <div className="md:col-span-2 space-y-3">
                    <span className="font-sans font-bold text-slate-500 block border-b pb-1">董事会选举票箱日志 (Cast Votes Audit Index)</span>
                    <div className="space-y-2 overflow-y-auto max-h-[220px]">
                      {votes.filter(v => v.meeting_id === focusedMeetingId).map(vote => (
                        <div key={vote.id} className="p-3 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 text-xs">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-slate-800">Role: {vote.board_member_role}</span>
                            <span className={`px-1.5 rounded font-mono ${vote.vote_choice === 'Approve' ? 'bg-emerald-100 text-emerald-800' : vote.vote_choice === 'Reject' ? 'bg-rose-105 bg-rose-100 text-rose-800' : 'bg-slate-202 bg-slate-200 text-slate-500'}`}>
                              {vote.vote_choice}
                            </span>
                          </div>
                          <p className="text-[11px] font-sans text-slate-600 mt-1">{vote.reasoning}</p>
                          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2">
                            <span>Vote Confidence: {vote.confidence_score}%</span>
                            <span>BALLOT_HASH: {vote.id}</span>
                          </div>
                        </div>
                      ))}
                      {votes.filter(v => v.meeting_id === focusedMeetingId).length === 0 && (
                        <div className="py-8 text-center text-slate-400 font-mono">
                          暂无选票投递。[运行自动投票] 以模拟 CEO、CFO、CRO 在欧洲宏观指标约束下的自动决策。
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Render board outcomes specification lists match focused meeting */}
                  <div className="border border-dashed p-4 rounded-lg bg-slate-50 text-xs space-y-3">
                    <span className="font-extrabold font-sans text-slate-800 block border-b pb-1">最决法案规则文件 (Decision Specification Sheet)</span>
                    {boardDecisionsList.filter(d => d.meeting_id === focusedMeetingId).map(dec => (
                      <div key={dec.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">OUTCOME</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${dec.vote_outcome === 'passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            {dec.vote_outcome.toUpperCase()}
                          </span>
                        </div>
                        <ul className="list-disc list-inside text-[11px] text-slate-650 space-y-1 font-sans">
                          {dec.final_action_plan.map((p, idx) => (
                            <li key={idx} className="leading-snug">{p}</li>
                          ))}
                        </ul>
                        <div className="text-[10px] font-mono text-slate-450 border-t pt-2 mt-2">
                          <div>Signatories: {dec.approved_by.join(', ')}</div>
                          <div>Enacted at: {dec.enacted_at.substring(0, 16)}</div>
                        </div>
                      </div>
                    ))}
                    {boardDecisionsList.filter(d => d.meeting_id === focusedMeetingId).length === 0 && (
                      <div className="pt-10 text-center text-slate-400">
                        等待本案审议决策中。
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LAYER 218: Enterprise World Model Economic Status */}
          {intelLayer === 'l18_world' && (
            <div className="space-y-6" id="layer_world_panel">
              <div className="border-b border-rose-200 pb-3 flex justify-between items-center bg-slate-900 p-4 rounded text-white shadow-sm">
                <div>
                  <h3 className="text-sm font-black font-sans text-white">🌍 Layer 218: SaaS 宏观世界模型状态 (Enterprise World Model)</h3>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xl">
                    存储外部世界真实通货指标、气象警报事件、突发地缘罢工要素，用于动态对冲规则路由和对冲因子。
                  </p>
                </div>
                <span className="text-[10px] bg-[#07C2E3] text-black px-2 py-1 rounded font-mono font-bold font-sans">WORLD_MODEL_STATE</span>
              </div>

              {/* Adjust dials column */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* World dials control */}
                <div className="bg-white p-5 rounded-lg border border-slate-200 text-xs space-y-4 shadow-xs">
                  <span className="font-extrabold text-slate-800 block border-b pb-1.5 font-sans uppercase">微调外部世界时令变量 (Economic Variables Adjustment)</span>
                  
                  {/* Economy index slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-500 font-bold">欧洲经济平稳度系数 Indicator</span>
                      <strong className="font-mono text-[#07C2E3] text-sm">{economicIndicatorValue(economicIndicator)}</strong>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={economicIndicator}
                      onChange={e => handleDialEconomic(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Logistics status selector */}
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">干线口岸拥塞控制规则 Status</label>
                    <div className="flex gap-2">
                      {['Fluid', 'Moderate', 'SeverelyCongested'].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleWorldLogistics(s as any)}
                          className={`flex-1 font-bold rounded py-1 border transition text-[10px] ${logisticsLevel === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-650 hover:bg-slate-100'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weather alert shifting */}
                  <div>
                    <label className="block text-slate-500 font-bold mb-1 col-span-1">气象寒流警报因子 Indicator</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-300 rounded p-1.5"
                      value={climateAlert}
                      onChange={e => handleWorldClimate(e.target.value)}
                    >
                      <option value="Normal">Normal (春季温和，无防塞需求)</option>
                      <option value="Cold_Wave_Coming">Cold_Wave_Coming (突发强寒潮，羊毛风衣刚需 +310%)</option>
                      <option value="Alpine_Blizzard">Alpine_Blizzard (阿尔卑斯大暴雪，干线物流受阻)</option>
                    </select>
                  </div>
                </div>

                {/* World variables results mapping */}
                <div className="bg-slate-900 text-white p-5 rounded-lg border border-slate-800 text-xs space-y-4">
                  <span className="font-sans font-bold text-[#07C2E3] block flex items-center gap-1.5 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    SaaS 平台规则引擎实时风险反馈 (System Interlocking Signals)
                  </span>

                  <div className="space-y-2 border-t border-slate-800 pt-3">
                    <div className="flex justify-between text-slate-400">
                      <span>关税对冲风险指数:</span>
                      <strong className={`font-mono ${economicIndicator < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {economicIndicator < 50 ? '极高危险 level' : '温和对冲 level'}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>跨境转运顺畅限制:</span>
                      <strong className="font-mono text-[#07C2E3]">
                        {logisticsLevel === 'Fluid' ? '48小时全线畅通' : logisticsLevel === 'Moderate' ? '口岸关税审核拖延3天' : '警告：瑞士边境转关全面陷入排队'}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>物料刚需预警指数:</span>
                      <strong className="text-white font-mono">
                        {climateAlert === 'Cold_Wave_Coming' ? '提醒：商家应加速补货 1.5x 羊毛风衣' : '正常平稳出水。'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* World events ledger list */}
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <span className="text-xs font-bold text-slate-800 block mb-3 uppercase">向世界模型注册最新外部断裂事件 (Disruption intake form)</span>
                <form onSubmit={handleCreateWorldEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <label className="block text-slate-550 font-bold mb-1">事件核心标题 (Headline) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EU Customs Union Strikes on Highway Nodes"
                      value={newEventTitle}
                      onChange={e => setNewEventTitle(e.target.value)}
                      className="w-full bg-slate-5 e bg-white border border-slate-350 rounded p-2 text-xs text-slate-800 focus:outline-[#07C2E3]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-slate-550 font-bold mb-1 col-span-1">对冲及延误说明 (Implications description)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Restrict transit routes to 4 hour clearance windows."
                        value={newEventDesc}
                        onChange={e => setNewEventDesc(e.target.value)}
                        className="w-full bg-slate-5 e bg-white border border-slate-350 rounded p-2 text-xs text-slate-800 focus:outline-[#07C2E3]"
                      />
                      <button type="submit" className="bg-[#07C2E3] text-black hover:bg-[#06B2D0] font-extrabold px-3 rounded transition hover:scale-[1.01]">
                        上报
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* MULTI-VARIABLE CAUSAL SOLVER (Phase 231-250) */}
              <div className="bg-white p-5 rounded-lg border border-[#07C2E3] shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <div className="p-1 px-2 rounded bg-slate-100 text-slate-800 font-mono text-[10px] font-bold">SOLVER_ENGINE</div>
                  <h4 className="text-xs font-black font-sans text-slate-900 uppercase">🧠 多变量跨学科对冲因果求解器 (ECOS Cross-Constraint Causal Solver)</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  融合 <strong>气象模型 2.0 (Weather)</strong>、<strong>欧洲宏观通胀经济指数 (Economic)</strong>、<strong>消费群对冲情绪 (Sentiment)</strong> 以及 <strong>行业面料竞品价盘网 (Industry DNA)</strong> 联合瞬发演算。计算并写回最精准的 DOH 警戒限与自愈价盘。
                </p>

                <form onSubmit={handleRunSolver} className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">目标品类 (Category)</label>
                    <select
                      value={solverCategory}
                      onChange={e => setSolverCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-350 rounded p-1.5 focus:outline-[#07C2E3] text-[11px]"
                    >
                      <option value="Coat">Premium Wool Coats (外套类)</option>
                      <option value="Dress">Seamless Knitted Dress (连身裙)</option>
                      <option value="Tote Bag">Avenue Travel Tote Bag (箱包类)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-550 font-bold mb-1 col-span-1">核心主料 (Material)</label>
                    <select
                      value={solverMaterial}
                      onChange={e => setSolverMaterial(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-350 rounded p-1.5 focus:outline-[#07C2E3] text-[11px]"
                    >
                      <option value="Cashmere">Loro Piana Cashmere (羊绒)</option>
                      <option value="Merino Wool">Premium Merino Wool (美丽诺)</option>
                      <option value="Organic Cotton">Long-staple Organic Cotton (有机棉)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-550 font-bold mb-1 col-span-1">零售大区 (Market)</label>
                    <select
                      value={solverCountry}
                      onChange={e => setSolverCountry(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-350 rounded p-1.5 focus:outline-[#07C2E3] text-[11px]"
                    >
                      <option value="France">France (法国首位店大区)</option>
                      <option value="Germany">Germany (德国风控在库店)</option>
                      <option value="Italy">Italy (意大利代工直供店)</option>
                    </select>
                  </div>
                  <div className="flex flex-col justify-between">
                    <label className="block text-slate-550 font-bold mb-1 col-span-1">基准标定价 (Base Price)</label>
                    <div className="flex gap-1.5">
                      <div className="relative flex-1">
                        <span className="absolute left-2 top-1.5 text-slate-400">€</span>
                        <input
                          type="number"
                          value={solverTargetPrice}
                          onChange={e => setSolverTargetPrice(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-350 rounded p-1 pl-5 focus:outline-[#07C2E3] text-[11px]"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSolverThinking}
                        className="bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-[0.98] transition font-bold text-black text-[10.5px] px-3.5 rounded"
                      >
                        {isSolverThinking ? '求解中...' : '求解对冲'}
                      </button>
                    </div>
                  </div>
                </form>

                {solverResult && (
                  <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg space-y-4 font-mono text-[11px] animate-fadeIn">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-b border-dashed border-slate-200 pb-3">
                      <div>
                        <span className="text-slate-400 block text-[9.5px] uppercase font-sans">综合需求弹性指数</span>
                        <strong className="text-sm text-[#07C2E3] font-black">{solverResult.finalDemandMultiplier}x</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9.5px] uppercase font-sans">测算30天建议吞吐</span>
                        <strong className="text-sm text-slate-900 font-extrabold">{solverResult.projectedSalesVolume} 件</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9.5px] uppercase font-sans">自愈保护定价</span>
                        <strong className="text-sm text-emerald-600 font-extrabold">€{solverResult.recommendedPrice}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9.5px] uppercase font-sans">预期实收毛利率</span>
                        <strong className="text-sm text-amber-600 font-extrabold">{solverResult.targetMargin}%</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Breakdown formula */}
                      <div className="space-y-1.5 bg-white p-3 rounded border border-slate-150">
                        <span className="font-bold text-slate-800 block text-[10px] uppercase font-sans pb-1 border-b">自变量权重链条 (Component Breakdown)</span>
                        <div className="flex justify-between">
                          <span className="text-slate-400">🌦 区域气象乘数 (Weather Weight):</span>
                          <span className="text-slate-700 font-extrabold">{solverResult.weatherCoef}x</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">👥 圈层购买欲望 (Sentiment):</span>
                          <span className="text-slate-700 font-extrabold">{solverResult.sentimentCoef}x</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">📈 基础通胀指数 (CFO Economic):</span>
                          <span className="text-slate-700 font-extrabold">{solverResult.econCoef}x</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">📊 竞品价盘抵扣 (Comp Elasticity):</span>
                          <span className="text-slate-700 font-extrabold">{solverResult.priceElasticityCoef}x</span>
                        </div>
                      </div>

                      {/* Active Causal Chain Node Graph */}
                      <div className="bg-slate-900 p-3 rounded text-white flex flex-col justify-between">
                        <div>
                          <span className="font-bold text-[#07C2E3] block text-[10px] uppercase font-sans pb-1 border-b border-slate-800">因果对冲传播图谱 (Active Causal Chain Graph)</span>
                          <div className="mt-2 space-y-1.5 text-[10px]">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              <span>[Trigger] {solverCountry} 市场 L1 面料物料波动</span>
                            </div>
                            <div className="flex items-center gap-1.5 pl-3 border-l border-slate-800">
                              <span className="w-2 h-2 rounded-full bg-[#07C2E3]" />
                              <span>[Causal Node] 结合气象与情绪计算得需求差乘 = {solverResult.finalDemandMultiplier}x</span>
                            </div>
                            <div className="flex items-center gap-1.5 pl-6 border-l border-slate-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              <span>[Result Output] 董事会自动投票决策 €{solverResult.recommendedPrice}</span>
                            </div>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-slate-800 mt-2 text-[9px] text-[#07C2E3] flex justify-between uppercase">
                          <span>Verified: World Model 2.0</span>
                          <span>Chain ID: {solverResult.chainId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Display list of registered economic events */}
              <div className="bg-white p-4 font-mono rounded-lg border border-slate-200 text-xs">
                <span className="font-sans font-bold text-slate-808 block mb-2">已触发且生效的世界事件日志 (Macro Disruption Events: {worldEvents.length})</span>
                <div className="space-y-1 overflow-y-auto max-h-[160px]">
                  {worldEvents.map(evt => (
                    <div key={evt.id} className="p-2 border border-slate-200 bg-slate-50 rounded flex justify-between items-center text-[10.5px]">
                      <div>
                        <strong>Event Title: {evt.title}</strong>
                        <span className="text-slate-400 ml-2">({evt.observed_date})</span>
                      </div>
                      <span className="text-[10px] text-red-500 font-bold font-sans uppercase bg-rose-50 border px-1.5 rounded">{evt.severity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LAYER 219: Self-Evolution Engine */}
          {intelLayer === 'l19_self_evolution' && (
            <div className="space-y-6" id="layer_self_evolution_panel">
              <div className="border-b border-rose-200 pb-3 flex justify-between items-center bg-slate-900 p-4 rounded text-white shadow-sm">
                <div>
                  <h3 className="text-sm font-black font-sans text-white">🧬 Layer 219: 智脑自我纠偏进化中心 (Self-Self-Evolution Engine)</h3>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xl">
                    对系统当前运营策略（定价、库存、补货）进行自动有效性打分与反思审计。允许超级管理员在此一键强制执行自愈方案。
                  </p>
                </div>
                <span className="text-[10px] bg-[#07C2E3] text-black px-2 py-1 rounded font-mono font-bold font-sans">EVOLUTION_LOOP</span>
              </div>

              {/* Loop and metrics block */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                
                {/* Evolution current cycle */}
                <div className="p-4 rounded-lg bg-slate-900 text-white text-center space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">ACTIVE EVOLUTION CYCLES</span>
                    <strong className="text-3xl text-emerald-400 block mt-2 font-mono">
                      {evolutionCycles.length > 0 ? evolutionCycles.length : 1}
                    </strong>
                  </div>
                  <div className="bg-slate-800 p-2 text-[11px] text-slate-400 rounded-lg">
                    Accumulative platform yield optimization gains: <strong>€{evolutionCycles.reduce((sum, c) => sum + c.gains_recorded_mrd_eur, 0).toFixed(1)}k</strong>
                  </div>
                </div>

                {/* Self evaluation review log */}
                <div className="md:col-span-2 bg-white p-4 rounded-lg border border-slate-200 space-y-3 shadow-xs">
                  <span className="font-bold text-slate-800 block border-b pb-1">大盘核心有效性反思历史 (Self-Reflection Audits)</span>
                  <div className="space-y-2 overflow-y-auto max-h-[160px]">
                    {selfEvaluations.map(se => (
                      <div key={se.id} className="p-2.5 bg-slate-50 rounded border border-slate-210 text-xs flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-800">Topic Area: {se.strategy_type} Optimization</div>
                          <div className="text-[10.5px] text-slate-455 mt-0.5 text-slate-500">Fastest Growth Market: {se.fastest_growth_market} • Details: {se.details}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-slate-400 font-mono block">SCORE</span>
                          <strong className="text-emerald-600 font-mono font-black">{se.calculated_effectiveness_pct}%</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive enforcement plan lists */}
              <div className="bg-white p-4 rounded-lg border border-slate-205 text-xs">
                <span className="font-extrabold text-slate-805 block mb-3 uppercase">待审核强制实施的大脑自愈战役 (Strategy Improvement Plans)</span>
                <div className="space-y-3">
                  {improvementPlans.map(plan => (
                    <div key={plan.id} className="p-4 rounded bg-slate-50 hover:bg-slate-100 border border-slate-250 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-800 text-sm font-sans">{plan.proposal_title}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${plan.approval_status === 'enforced' ? 'bg-emerald-150 bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 animate-pulse'}`}>
                            {plan.approval_status}
                          </span>
                        </div>
                        <ul className="list-disc list-inside text-slate-505 space-y-1 mt-2 text-slate-600 font-sans leading-normal">
                          {plan.action_steps.map((step, idx) => (
                            <li key={idx} className="leading-snug">{step}</li>
                          ))}
                        </ul>
                        <div className="text-[10.5px] font-mono text-slate-400 mt-2">Target remediation: Within {plan.target_remediation_days} calendar days • Ref: {plan.evaluation_id}</div>
                      </div>

                      {/* Action enforcer */}
                      <button
                        onClick={() => handleEnforceStrategyPlan(plan.id)}
                        disabled={enforcingId === plan.id || plan.approval_status === 'enforced'}
                        className={`px-4 py-2 rounded font-extrabold text-xs transition uppercase tracking-wider shrink-0 ${plan.approval_status === 'enforced' ? 'bg-slate-200 text-slate-400 cursor-not-allowed border' : 'bg-[#07C2E3] hover:bg-[#06B2D0] text-black shadow-xs'}`}
                      >
                        {enforcingId === plan.id ? (
                          <RefreshCcw className="w-3.5 h-3.5 animate-spin mx-auto animate-spin" />
                        ) : plan.approval_status === 'enforced' ? (
                          'Active Enforced'
                        ) : (
                          '🔥 强制批准实施 Enforce Plan'
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LAYER 271-280: Fashion Demand Intelligence Engine */}
          {intelLayer === 'l20_demand_intelligence' && (
            <div className="space-y-6" id="layer_demand_intelligence_panel">
              
              {/* Header section */}
              <div className="border-b border-cyan-200 pb-3 flex justify-between items-center bg-slate-900 p-4 rounded text-white shadow-sm">
                <div>
                  <h3 className="text-sm font-black font-sans text-white">🧠 Layer 271-280: 流行需求智能引擎 (Fashion Demand Intelligence Engine)</h3>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xl">
                    宏微观趋势信号、地区GRU时空需求模型、物料生命周期、价格弹性及平台自治董事会决策中枢。
                  </p>
                </div>
                <span className="text-[10px] bg-[#07C2E3] text-black px-2 py-1 rounded font-mono font-bold font-sans">DEMAND_INTEL_CORE</span>
              </div>

              {/* Sub-tabs menu */}
              <div className="flex flex-wrap gap-1 border-b pb-2">
                {[
                  { id: 'signals', label: '🧠 需求信号', count: demandSignals.length },
                  { id: 'forecasts', label: '📈 区域预测', count: regionalForecasts.length },
                  { id: 'trends', label: '🔮 潮流空缺', count: trendAlerts.filter(a => !a.is_acknowledged).length },
                  { id: 'inventory', label: '📦 库存缺口', count: inventoryForecasts.filter(i => i.days_to_stockout < 15).length },
                  { id: 'pricing_elasticity', label: '🪙 价格弹性', count: priceElasticityModels.length },
                  { id: 'promotions', label: '📣 促销评估', count: promotionPredictions.length },
                  { id: 'risks', label: '⚡ 阻尼避险', count: demandRisks.length },
                  { id: 'opportunities', label: '💎 机会中心', count: opportunities.length },
                  { id: 'boardroom', label: '🏛️ 自治报告', count: forecastBoardDecisionsByL.filter(d => d.status === 'Pending').length }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setDemandIntelSubTab(tab.id as any)}
                    className={`px-3 py-2 rounded text-xs font-bold transition flex items-center gap-1 ${
                      demandIntelSubTab === tab.id
                        ? 'bg-slate-950 text-white font-black'
                        : 'bg-white text-slate-750 hover:bg-slate-100 border border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[9px] font-mono px-1 rounded ${demandIntelSubTab === tab.id ? 'bg-[#07C2E3] text-black font-extrabold' : 'bg-slate-100 text-slate-500 border'}`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* 1. Demand Signals SubTab */}
              {demandIntelSubTab === 'signals' && (
                <div className="space-y-6 animate-fadeIn" id="subtab_signals">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4">
                      <span className="font-extrabold text-slate-800 text-xs block uppercase border-b pb-1">捕获新需求信号 (Capture Signal)</span>
                      <form onSubmit={handleCreateDemandSignal} className="space-y-3 text-xs">
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">信号源：</label>
                          <select
                            value={newSignalSource}
                            onChange={e => setNewSignalSource(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 focus:outline-[#07C2E3]"
                          >
                            {demandSignalSources.map(s => (
                              <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">信号内容细节：</label>
                          <input
                            type="text"
                            required
                            value={newSignalType}
                            onChange={e => setNewSignalType(e.target.value)}
                            placeholder="如：London Corporate Back-To-Work Winter Surge"
                            className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 focus:outline-[#07C2E3]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">信号强度 (0-100)：</label>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={newSignalMagnitude}
                              onChange={e => setNewSignalMagnitude(Number(e.target.value))}
                              className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 focus:outline-[#07C2E3]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">事件状态：</label>
                            <select
                              value={newSignalStatus}
                              onChange={e => setNewSignalStatus(e.target.value as any)}
                              className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 focus:outline-[#07C2E3]"
                            >
                              <option value="Active">Active (突发中)</option>
                              <option value="Processed">Processed (已分析)</option>
                              <option value="Suppressed">Suppressed (被屏蔽)</option>
                            </select>
                          </div>
                        </div>
                        <button type="submit" className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-black font-extrabold py-2 rounded text-xs uppercase tracking-wider transition">
                          ✓ 注入新信号
                        </button>
                      </form>
                    </div>

                    {/* Signals Table */}
                    <div className="lg:col-span-2 bg-white p-4 rounded-lg border border-slate-200 space-y-4">
                      <span className="font-extrabold text-slate-800 text-xs block uppercase border-b pb-1">实时捕获信号大宗 (Demand Signals Registry)</span>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-mono text-slate-500">
                              <th className="p-2">ID</th>
                              <th className="p-2">来源渠道</th>
                              <th className="p-2">信号规格</th>
                              <th className="p-2 text-center">信号强度</th>
                              <th className="p-2 text-center">当前状态</th>
                            </tr>
                          </thead>
                          <tbody>
                            {demandSignals.map(sig => {
                              const src = demandSignalSources.find(s => s.id === sig.source_id);
                              return (
                                <tr key={sig.id} className="border-b border-slate-100 hover:bg-slate-50 text-slate-700">
                                  <td className="p-2 font-mono text-[10px] text-slate-400">{sig.id}</td>
                                  <td className="p-2 font-black">{src ? src.name : sig.source_id}</td>
                                  <td className="p-2 text-slate-800">{sig.signal_type}</td>
                                  <td className="p-2 text-center">
                                    <span className="font-mono font-bold text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-100">
                                      {sig.magnitude_score} / 100
                                    </span>
                                  </td>
                                  <td className="p-2 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                                      sig.status === 'Active' 
                                        ? 'bg-red-50 text-red-700 border-red-100'
                                        : sig.status === 'Processed'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                        : 'bg-slate-100 text-slate-500 border-slate-200'
                                    }`}>
                                      {sig.status}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* History log stream */}
                      <div className="border-t pt-3 space-y-2">
                        <span className="font-mono text-[10px] text-slate-400 block uppercase">信号微调追溯日志 (Signal Weights and Trace History)</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                          {demandSignalHistory.map(hist => (
                            <div key={hist.id} className="p-2 bg-slate-50 border border-slate-200 rounded flex justify-between items-center font-mono">
                              <span className="text-slate-500">Signal: {hist.signal_id}</span>
                              <span className="text-slate-400 text-[10px]">{hist.date_logged}</span>
                              <span className="text-slate-800 font-extrabold">{hist.previous_value} → {hist.new_value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Regional Forecasts SubTab */}
              {demandIntelSubTab === 'forecasts' && (
                <div className="space-y-6 animate-fadeIn text-xs" id="subtab_forecasts">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Add Regional Forecast Form */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4">
                      <span className="font-extrabold text-slate-800 text-xs block uppercase border-b pb-1">新设区域时空预测 (Regional Forecast Model)</span>
                      <form onSubmit={handleCreateRegionalForecast} className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">国别 (Country Code):</label>
                          <select
                            value={newForecastCountry}
                            onChange={e => setNewForecastCountry(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 focus:outline-[#07C2E3]"
                          >
                            <option value="FR">France (法国 FR)</option>
                            <option value="DE">Germany (德国 DE)</option>
                            <option value="GB">Great Britain (英国 GB)</option>
                            <option value="IT">Italy (意大利 IT)</option>
                            <option value="ES">Spain (西班牙 ES)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">潮流品类 (Category Spec):</label>
                          <input
                            type="text"
                            required
                            value={newForecastCategory}
                            onChange={e => setNewForecastCategory(e.target.value)}
                            placeholder="如：Oversized Alpaca Cardigan"
                            className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 focus:outline-[#07C2E3]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">时间跨度 (Horizon):</label>
                            <select
                              value={newForecastHorizon}
                              onChange={e => setNewForecastHorizon(e.target.value as any)}
                              className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 focus:outline-[#07C2E3]"
                            >
                              <option value="7d">7 Days (微周期)</option>
                              <option value="30d">30 Days (月周期)</option>
                              <option value="90d">90 Days (季战役)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">增长期望值 (%):</label>
                            <input
                              type="number"
                              value={newForecastGrowth}
                              onChange={e => setNewForecastGrowth(Number(e.target.value))}
                              className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 focus:outline-[#07C2E3]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">智脑置信概率 (Confidence Score %):</label>
                          <input
                            type="number"
                            min="10"
                            max="100"
                            value={newForecastConfidence}
                            onChange={e => setNewForecastConfidence(Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 focus:outline-[#07C2E3]"
                          />
                        </div>
                        <button type="submit" className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-black font-extrabold py-2 rounded text-xs uppercase tracking-wider transition">
                          ✓ 生成时空预测
                        </button>
                      </form>
                    </div>

                    {/* Forecasts List */}
                    <div className="lg:col-span-2 bg-white p-4 rounded-lg border border-slate-200 space-y-4">
                      <span className="font-extrabold text-slate-800 text-xs block uppercase border-b pb-1">地区GRU时空需求模型列表 (Regional GRU Attention Models)</span>
                      
                      {/* Active predictor models block */}
                      <div className="p-3 bg-slate-900 text-white rounded-lg flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-mono block">ACTIVE PREDICTION SYSTEM</span>
                          <span className="text-sm font-black text-[#07C2E3]">
                            {regionalForecastModels[0]?.model_name || 'GRU Predictor System'} ({regionalForecastModels[0]?.version || 'v2'})
                          </span>
                        </div>
                        <span className="text-xs bg-emerald-500 text-black px-2 py-0.5 rounded font-mono font-bold">
                          System Accuracy: {regionalForecastModels[0]?.accuracy_score || 93.8}%
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-mono text-slate-500">
                              <th className="p-2">ID</th>
                              <th className="p-2">国别地区</th>
                              <th className="p-2">流行品类</th>
                              <th className="p-2 text-center">预测周期</th>
                              <th className="p-2 text-center">增幅预测</th>
                              <th className="p-2 text-center">信度分</th>
                              <th className="p-2 text-right">上/下界对冲</th>
                            </tr>
                          </thead>
                          <tbody>
                            {regionalForecasts.map(fc => {
                              const result = regionalForecastResults.find(r => r.forecast_id === fc.id);
                              return (
                                <tr key={fc.id} className="border-b border-slate-100 hover:bg-slate-50 text-slate-700">
                                  <td className="p-2 font-mono text-[10px] text-slate-400">{fc.id}</td>
                                  <td className="p-2 font-extrabold">{fc.country}</td>
                                  <td className="p-2 text-slate-800 font-bold">{fc.category_name}</td>
                                  <td className="p-2 text-center font-mono">{fc.time_horizon}</td>
                                  <td className={`p-2 text-center font-mono font-black ${fc.forecasted_growth_pct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {fc.forecasted_growth_pct >= 0 ? `+${fc.forecasted_growth_pct}` : fc.forecasted_growth_pct}%
                                  </td>
                                  <td className="p-2 text-center">
                                    <span className="font-mono text-[#07C2E3] font-bold bg-slate-900 px-1 py-0.5 rounded text-[10px]">
                                      {fc.confidence_score}%
                                    </span>
                                  </td>
                                  <td className="p-2 text-right font-mono text-slate-450 text-[10.5px]">
                                    {result ? (
                                      <span className="text-slate-500">
                                        [{result.lower_bound_pct}% , {result.upper_bound_pct}%]
                                      </span>
                                    ) : 'No matrix'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Trend Gap Alerts SubTab */}
              {demandIntelSubTab === 'trends' && (
                <div className="space-y-6 animate-fadeIn" id="subtab_trends">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Add Alert Form */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4 text-xs">
                      <span className="font-extrabold text-slate-800 text-xs block uppercase border-b pb-1">触发趋势供给红线警报 (Trigger Trend Anomaly)</span>
                      <form onSubmit={handleCreateTrendAlert} className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">库存/趋势契合漏洞细节：</label>
                          <input
                            type="text"
                            required
                            value={newAlertTitle}
                            onChange={e => setNewAlertTitle(e.target.value)}
                            placeholder="如：Heavy demand spikes in IT Silk, but no matching Tenant SKU"
                            className="w-full bg-slate-50 border border-slate-350 rounded p-1.5 focus:outline-[#07C2E3]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">紧急严重等级：</label>
                          <select
                            value={newAlertSeverity}
                            onChange={e => setNewAlertSeverity(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-350 rounded p-1.5 focus:outline-[#07C2E3]"
                          >
                            <option value="Low">Low (低警告)</option>
                            <option value="Medium">Medium (温和缺口)</option>
                            <option value="High">High (重度缺失)</option>
                            <option value="Critical">Critical (致命红线)</option>
                          </select>
                        </div>
                        <button type="submit" className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-black font-extrabold py-2 rounded text-xs uppercase tracking-wider transition">
                          ✓ 注入漏洞触发
                        </button>
                      </form>
                    </div>

                    {/* Alerts grid and patterns */}
                    <div className="lg:col-span-2 space-y-4">
                      {/* Trend signals indicators */}
                      <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
                        <span className="font-extrabold text-slate-800 text-xs block uppercase border-b pb-1">社交声网美学信号 (Runway Aesthetic Signals)</span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {trendSignals.map(sig => (
                            <div key={sig.id} className="p-3 bg-slate-50 rounded border border-slate-200 flex flex-col justify-between space-y-2">
                              <div>
                                <span className="text-[10px] text-slate-400 font-mono block">RUNWAY TAG</span>
                                <strong className="text-slate-800 text-xs">{sig.trend_name}</strong>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t text-[11px]">
                                <span className="text-slate-400">Score: <strong className="text-cyan-600 font-mono">{sig.signal_strength}</strong></span>
                                <span className="text-slate-400 font-mono text-[9.5px]">Vogue + Lyst</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Active trigger alerts */}
                      <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3 text-xs">
                        <span className="font-extrabold text-slate-800 text-xs block uppercase border-b pb-1">库存错位严重警告历史 (Trend Gap Alerts Archive)</span>
                        <div className="space-y-2">
                          {trendAlerts.map(alert => (
                            <div key={alert.id} className="p-3 rounded border border-slate-220 bg-slate-50 flex justify-between items-center gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <strong className="text-slate-800">{alert.title}</strong>
                                  <span className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded font-black border uppercase ${
                                    alert.severity === 'Critical'
                                      ? 'bg-red-900 text-white border-red-950 animate-pulse'
                                      : alert.severity === 'High'
                                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                                      : 'bg-slate-100 text-slate-650'
                                  }`}>
                                    {alert.severity}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400 block font-mono">Triggered timestamp: {alert.triggered_at}</span>
                              </div>

                              <button
                                onClick={() => handleAcknowledgeAlert(alert.id)}
                                disabled={alert.is_acknowledged}
                                className={`px-2.5 py-1 rounded text-[10.5px] font-bold border shrink-0 transition uppercase ${
                                  alert.is_acknowledged 
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-slate-300'
                                    : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs'
                                }`}
                              >
                                {alert.is_acknowledged ? 'Acknowledged' : '✓ Acknowledge'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Inventory Gaps SubTab */}
              {demandIntelSubTab === 'inventory' && (
                <div className="space-y-6 animate-fadeIn" id="subtab_inventory">
                  <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4 text-xs">
                    <span className="font-extrabold text-slate-800 text-xs block uppercase border-b pb-1">平台核心商品断货深度穿透 (SaaS Warehouses Stockout Hazards)</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {inventoryForecasts.map(inf => {
                        const recs = inventoryRecommendations.filter(r => r.product_id === inf.product_id);
                        const alerts = inventoryRiskAlerts.filter(a => a.product_id === inf.product_id);
                        return (
                          <div key={inf.id} className="p-4 rounded-lg bg-slate-900 text-white space-y-4 border border-slate-800 shadow-sm flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[9.5px] text-slate-400 font-mono block">SKU / COUNTRY</span>
                                  <strong className="text-sm text-[#07C2E3] font-mono">{inf.product_id.toUpperCase()} • {inf.country}</strong>
                                </div>
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                                  inf.days_to_stockout <= 14 
                                    ? 'bg-red-600 text-white animate-pulse'
                                    : 'bg-slate-800 text-slate-400'
                                }`}>
                                  Stockout: {inf.days_to_stockout} Days
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono">
                                <div>
                                  <span className="text-slate-450 block text-[10px] text-slate-400">SAFETY STOCK NEEDED</span>
                                  <strong className="text-white text-xs">{inf.recommended_safety_stock} Units</strong>
                                </div>
                                <div>
                                  <span className="text-slate-450 block text-[10px] text-slate-400">PREDICTED OVERSTOCK</span>
                                  <strong className="text-amber-400 text-xs">{inf.predicted_overstock_units} Units</strong>
                                </div>
                              </div>
                            </div>

                            {/* Active Action mitigation proposals */}
                            <div className="p-2.5 rounded bg-slate-800 border border-slate-705 text-[10.5spx] text-slate-350 space-y-1.5">
                              <span className="text-[9px] text-[#07C2E3] font-mono block uppercase">RECOMMENDED BY AI AGENT:</span>
                              {recs.map(rec => (
                                <div key={rec.id} className="flex justify-between items-center text-[10.5px]">
                                  <span>{rec.recommendation_type} Qty {rec.recommended_qty}</span>
                                  <span className="text-emerald-400 font-bold">+€{rec.potential_profit_restored.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Pricing Elasticity SubTab */}
              {demandIntelSubTab === 'pricing_elasticity' && (
                <div className="space-y-6 animate-fadeIn" id="subtab_elasticity">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Add Elasticity spec form */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4 text-xs">
                      <span className="font-extrabold text-slate-800 text-xs block uppercase border-b pb-1">录入多重价格弹性观察 (Elasticity Observation)</span>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        dbEngine.price_elasticity_models.create({
                          product_id: newElasticityProductId,
                          elasticity_coefficient: Number(newElasticityCoeff),
                          optimal_price: Number(newElasticityOptPrice),
                          current_price: Number(newElasticityCurPrice)
                        });
                        triggerSuccess("Registered custom price elasticity parameters for product SKU.");
                      }} className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">绑定 SKU Identifier:</label>
                          <input
                            type="text"
                            required
                            value={newElasticityProductId}
                            onChange={e => setNewElasticityProductId(e.target.value)}
                            placeholder="如：sku_coat_cashmere"
                            className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 focus:outline-[#07C2E3]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">弹性系数 Coefficient:</label>
                            <input
                              type="number"
                              step="0.01"
                              value={newElasticityCoeff}
                              onChange={e => setNewElasticityCoeff(Number(e.target.value))}
                              className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 focus:outline-[#07C2E3]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">当前目录底价 Current Price (€):</label>
                            <input
                              type="number"
                              value={newElasticityCurPrice}
                              onChange={e => setNewElasticityCurPrice(Number(e.target.value))}
                              className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 focus:outline-[#07C2E3]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">AI 推荐最优价 Optimal Revenue Price (€):</label>
                          <input
                            type="number"
                            value={newElasticityOptPrice}
                            onChange={e => setNewElasticityOptPrice(Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 focus:outline-[#07C2E3]"
                          />
                        </div>
                        <button type="submit" className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-black font-extrabold py-2 rounded text-xs uppercase tracking-wider transition">
                          ✓ 绑定基线弹性
                        </button>
                      </form>
                    </div>

                    {/* Active elasticity logs */}
                    <div className="lg:col-span-2 bg-white p-4 rounded-lg border border-slate-200 space-y-4 text-xs font-sans">
                      <span className="font-extrabold text-slate-800 text-xs block uppercase border-b pb-1">基准价格弹性模型及体积模拟 (Elasticity Simulation Suite)</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {priceElasticityModels.map(pem => {
                          const preds = elasticityPredictions.filter(p => p.product_id === pem.product_id);
                          return (
                            <div key={pem.id} className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-3">
                              <div className="flex justify-between items-center">
                                <strong className="text-slate-800 font-mono">{pem.product_id.toUpperCase()}</strong>
                                <span className="text-[10px] font-mono bg-slate-900 text-[#07C2E3] px-2 py-0.5 rounded">
                                  Ratio: {pem.elasticity_coefficient}
                                </span>
                              </div>

                              <div className="border-t border-slate-200 pt-2 grid grid-cols-2 gap-2 text-[11px]">
                                <div>
                                  <span className="text-slate-400 block text-[10px]">CURRENT BASE PRICE</span>
                                  <strong className="text-slate-700">€{pem.current_price}</strong>
                                </div>
                                <div className="text-right">
                                  <span className="text-slate-400 block text-[10px]">REVENUE OPTIMUM PRICE</span>
                                  <strong className="text-cyan-600">€{pem.optimal_price}</strong>
                                </div>
                              </div>

                              {/* Simulation predictions block */}
                              <div className="border-t border-slate-200 pt-2 space-y-1">
                                <span className="text-[9.5px] text-slate-400 font-mono uppercase block">Volume sensitivity predictions:</span>
                                {preds.map(pr => (
                                  <div key={pr.id} className="flex justify-between items-center text-[10.5px] font-mono leading-snug">
                                    <span className="text-slate-500">Price {pr.simulated_price_change_pct >= 0 ? `+${pr.simulated_price_change_pct}` : pr.simulated_price_change_pct}%</span>
                                    <span className={`${pr.predicted_profit_change_pct >= 0 ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                                      Volume: {pr.predicted_volume_change_pct}% • Net Profit: {pr.predicted_profit_change_pct >= 0 ? `+${pr.predicted_profit_change_pct}` : pr.predicted_profit_change_pct}%
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. Promotion Evaluation SubTab */}
              {demandIntelSubTab === 'promotions' && (
                <div className="space-y-6 animate-fadeIn" id="subtab_promotions">
                  <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4 text-xs font-sans">
                    <span className="font-extrabold text-slate-800 text-xs block uppercase border-b pb-1">平台大宗促销活动期望收益评估 (Promotion ROI Predictions)</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {promotionEffectivenessList.map(pme => {
                        const preds = promotionPredictions.filter(p => p.campaign_id === pme.id);
                        return (
                          <div key={pme.id} className="p-4 rounded-lg bg-white border border-slate-200 space-y-3 shadow-xs">
                            <div className="flex justify-between items-center border-b pb-1.5">
                              <h4 className="font-bold text-slate-800 text-xs">{pme.campaign_name}</h4>
                              <span className="text-[10px] bg-[#07C2E3]/10 text-cyan-700 border border-cyan-200 px-1.5 rounded font-bold">
                                Margin Dilution: {pme.margin_dilution_pct}%
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 leading-snug">
                              <div>
                                <span className="text-slate-400 block text-[10px]">CONVERSION MULTIPLIER</span>
                                <strong className="text-slate-800 font-mono">{pme.conversion_rate_multiplier}x multiplier</strong>
                              </div>
                              <div className="text-right">
                                <span className="text-slate-400 block text-[10px]">CAMPAIGN TOTAL PREDICTIONS</span>
                                {preds.map(pr => (
                                  <div key={pr.id} className="font-medium text-emerald-600 font-mono">
                                    GMV: +€{pr.predicted_gmv_uplift.toLocaleString()} (+{pr.predicted_units_sold} units)
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 7. Damping Risks SubTab */}
              {demandIntelSubTab === 'risks' && (
                <div className="space-y-6 animate-fadeIn" id="subtab_risks">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Market Macro Deviations */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4 text-xs">
                      <span className="font-extrabold text-slate-800 text-xs block uppercase border-b pb-1">宏观市场偏离监视 (Macro Deviations)</span>
                      <div className="space-y-3">
                        {marketRisksList.map(mrk => (
                          <div key={mrk.id} className="p-3 rounded bg-slate-50 border border-slate-200 flex justify-between items-center">
                            <div>
                              <strong className="text-slate-700 text-xs block">{mrk.macro_variable}</strong>
                              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Standard deviation bias: {mrk.current_deviation_pct}%</span>
                            </div>
                            <span className={`text-[9.5px] font-mono px-2 py-0.5 rounded font-bold border uppercase ${
                              mrk.risk_level === 'Hazard'
                                ? 'bg-red-50 text-red-600 border-red-200'
                                : mrk.risk_level === 'Warning'
                                ? 'bg-amber-50 text-amber-600 border-amber-200'
                                : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            }`}>
                              {mrk.risk_level}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Supply Risks Delay probability */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4 text-xs font-mono">
                      <span className="font-extrabold text-slate-805 text-xs block uppercase border-b pb-1">干线网络供应链负载阻尼 (Supply Risks Factor)</span>
                      <div className="space-y-3">
                        {supplyRisks.map(srk => (
                          <div key={srk.id} className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                            <div className="flex justify-between items-center text-[10.5px]">
                              <strong className="text-slate-800">Supplier: {srk.supplier_id}</strong>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                              <div>
                                <span className="text-slate-450 text-[10px]">DELAY PROBABILITY:</span>
                                <span className="text-rose-600 font-extrabold block">{srk.delay_probability_pct}% ratio</span>
                              </div>
                              <div className="text-right">
                                <span className="text-slate-455 text-[10px]">CAPACITY LOADED:</span>
                                <span className="text-amber-600 font-extrabold block">{srk.capacity_utilization_pct}% load</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Active Mitigation Playbooks */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4 text-xs font-sans">
                      <span className="font-extrabold text-slate-800 text-xs block uppercase border-b pb-1">避险阻尼预案汇聚 (Active Mitigations)</span>
                      <div className="space-y-3.5">
                        {demandRisks.map(drk => (
                          <div key={drk.id} className="p-3 rounded-lg border border-slate-200 space-y-2 hover:bg-slate-50/40">
                            <div className="flex justify-between items-center">
                              <strong className="text-red-700 text-[11px] uppercase font-mono">{drk.risk_category}</strong>
                              <span className="text-[10px] font-mono text-slate-400">Risk Score: {drk.risk_score}</span>
                            </div>
                            <p className="text-slate-700 font-black leading-snug">{drk.description}</p>
                            <div className="bg-emerald-50/50 p-2 rounded border border-emerald-200 font-mono text-[11px] leading-relaxed">
                              <strong className="text-emerald-800">Mitigation: </strong> {drk.mitigation_playbook}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 8. Opportunity Discovery SubTab */}
              {demandIntelSubTab === 'opportunities' && (
                <div className="space-y-6 animate-fadeIn text-xs" id="subtab_opportunities">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Add Opportunity Form */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4">
                      <span className="font-extrabold text-slate-800 text-xs block uppercase border-b pb-1">录入机会聚簇 (Record Opportunity)</span>
                      <form onSubmit={handleCreateOpportunity} className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">机会主题：</label>
                          <input
                            type="text"
                            required
                            value={newOpportunityTitle}
                            onChange={e => setNewOpportunityTitle(e.target.value)}
                            placeholder="如：Munich High-Street Cashmere spike"
                            className="w-full bg-slate-50 border border-slate-350 rounded p-1.5 focus:outline-[#07C2E3]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">流行本体标签 (Niche Tag):</label>
                          <input
                            type="text"
                            required
                            value={newOpportunityNiche}
                            onChange={e => setNewOpportunityNiche(e.target.value)}
                            placeholder="如：French Long Cashmere Wool Coat"
                            className="w-full bg-slate-50 border border-slate-350 rounded p-1.5 focus:outline-[#07C2E3]"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">国家：</label>
                            <input
                              type="text"
                              required
                              value={newOpportunityCountry}
                              onChange={e => setNewOpportunityCountry(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-350 rounded p-1.5 focus:outline-[#07C2E3]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">增长 %:</label>
                            <input
                              type="number"
                              required
                              value={newOpportunityGrowth}
                              onChange={e => setNewOpportunityGrowth(Number(e.target.value))}
                              className="w-full bg-slate-50 border border-slate-350 rounded p-1.5"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">利润空间：</label>
                            <input
                              type="number"
                              required
                              value={newOpportunityMargin}
                              onChange={e => setNewOpportunityMargin(Number(e.target.value))}
                              className="w-full bg-slate-50 border border-slate-350 rounded p-1.5"
                            />
                          </div>
                        </div>
                        <button type="submit" className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-black font-extrabold py-2 rounded text-xs uppercase tracking-wider transition">
                          ✓ 录入机会极性
                        </button>
                      </form>
                    </div>

                    {/* Active opportunities grid */}
                    <div className="lg:col-span-2 bg-white p-4 rounded-lg border border-slate-200 space-y-4">
                      <span className="font-extrabold text-slate-800 text-xs block uppercase border-b pb-1">高敏溢价蓝海开发汇总 (Global Niche Opportunities)</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {opportunities.map(opt => {
                          const score = opportunityScores.find(s => s.opportunity_id === opt.id);
                          const actions = opportunityActions.filter(a => a.opportunity_id === opt.id);
                          return (
                            <div key={opt.id} className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3 hover:bg-slate-50/50">
                              <div>
                                <div className="flex justify-between items-start border-b pb-1 leading-snug">
                                  <h4 className="font-extrabold text-slate-800 text-xs">{opt.opportunity_title}</h4>
                                  <span className="font-mono text-cyan-600 font-bold ml-2 shrink-0">{opt.country}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-[10.5px] font-mono pt-2 leading-none">
                                  <div>
                                    <span className="text-slate-400 block text-[9px]">DEMAND GROWTH</span>
                                    <strong className="text-emerald-600 block">+{opt.demand_growth_pct}%</strong>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block text-[9px]">COMP INDEX</span>
                                    <strong className="text-slate-700 block">{opt.competition_index}/100</strong>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block text-[9px]">PROFIT MARGIN</span>
                                    <strong className="text-[#07C2E3] block">{opt.profit_margin_space_pct}% space</strong>
                                  </div>
                                </div>
                              </div>

                              {/* Action plans and scores */}
                              <div className="p-2.5 bg-slate-50 rounded border border-slate-210 space-y-1.5 text-[10.5px]">
                                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                                  <span>VIABILITY INDEX: <strong className="text-slate-700">{score ? score.viability_score : 80}%</strong></span>
                                  <span>CONFIDENCE: {score ? score.confidence_factor : 85}%</span>
                                </div>
                                {actions.map(act => (
                                  <div key={act.id} className="text-slate-650 leading-relaxed pt-1.5 border-t text-slate-600">
                                    <strong className="text-[#07C2E3]">Action Plan:</strong> {act.suggested_action}
                                    <span className="ml-1 px-1 bg-cyan-100 text-cyan-800 font-bold rounded text-[9.5px] font-mono uppercase">{act.action_status}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 9. Autonomous Board Decider SubTab */}
              {demandIntelSubTab === 'boardroom' && (
                <div className="space-y-6 animate-fadeIn text-xs" id="subtab_boardroom">
                  {/* Strategic intelligence report overview banner */}
                  {forecastBoardReports.map(rep => (
                    <div key={rep.id} className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-white space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-[#07C2E3] font-mono font-bold uppercase text-[10px]">
                          AUTONOMOUS ADVISORY • PUBLISHED BY {rep.author_agent_id.toUpperCase()}
                        </span>
                        <span className="text-slate-430 text-[10px] font-mono text-slate-400">{rep.created_at}</span>
                      </div>
                      <h4 className="font-extrabold text-sm">{rep.report_title}</h4>
                      <p className="text-slate-350 leading-relaxed font-mono text-[11px] text-slate-350">{rep.summary_text}</p>
                    </div>
                  ))}

                  {/* Decisions and Action queue lists */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
                      <span className="font-extrabold text-slate-800 text-xs block uppercase border-b pb-1">待审议自治商业运作专案 (Pending Operational Boardroom Decisions)</span>
                      <div className="space-y-3">
                        {forecastBoardDecisionsByL.map(dec => (
                          <div key={dec.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[10px] text-slate-400 font-mono block">SUBJECT DIRECTIVE</span>
                                <strong className="text-slate-800 text-xs font-black">{dec.subject}</strong>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                                dec.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-800 border-amber-250 animate-pulse'
                                  : dec.status === 'Approved'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-black'
                                  : 'bg-rose-50 text-rose-800 border-rose-200'
                              }`}>
                                {dec.status}
                              </span>
                            </div>

                            <div className="p-2.5 bg-slate-100 rounded text-slate-700 font-mono text-[10.5px] leading-relaxed">
                              <strong className="text-[#07C2E3]">Directives:</strong> {dec.required_action}
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t text-[11px]">
                              <span className="text-slate-500 font-mono">Simulated success likelihood: <strong className="text-slate-800 font-bold">{dec.p_success}%</strong></span>
                              {dec.status === 'Pending' && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleRejectBoardDecision(dec.id)}
                                    disabled={isSimulatingBoard}
                                    className="px-2 py-1 rounded bg-rose-100 text-rose-850 font-bold hover:bg-rose-200 transition"
                                  >
                                    Reject
                                  </button>
                                  <button
                                    onClick={() => handleSimulateBoardDecision(dec.id)}
                                    disabled={isSimulatingBoard}
                                    className="px-3 py-1 rounded bg-[#07C2E3] hover:bg-[#06B2D0] text-black font-black transition"
                                  >
                                    Approve and Deploy
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Operational Action queues tracking */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
                      <span className="font-extrabold text-slate-800 text-xs block uppercase border-b pb-1">运作任务分流执行日志 (Autonomous Action Dispatch Tracker)</span>
                      <div className="space-y-3">
                        {forecastBoardActionsList.map(act => (
                          <div key={act.id} className="p-3.5 bg-slate-900 text-white rounded-lg space-y-3 font-mono text-[11px] leading-relaxed border border-slate-800">
                            <div className="flex justify-between items-center text-[10px] text-slate-400">
                              <span>ACTION: {act.id}</span>
                              <span className={`px-2 py-0.5 rounded font-black uppercase text-[10px] ${
                                act.execution_status === 'Success'
                                  ? 'bg-emerald-500 text-black'
                                  : 'bg-amber-500 text-black animate-pulse'
                              }`}>
                                {act.execution_status}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-455 text-[10px] block text-slate-400">DELEGATED MICRO-AGENT</span>
                              <strong>{act.task_executor_agent}</strong>
                            </div>
                            <div className="pt-2 border-t border-slate-800 text-slate-350">
                              <span className="text-[10px] block text-slate-400">EXECUTION TRACK LOG</span>
                              {act.execution_log_summary}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {intelLayer === 'l21_business_navigator' && (() => {
            const contextEngine = BusinessContextEngine.getInstance();
            const tenantId = 'tenant_01';
            const storeId = 'store_01';

            const businessContext = contextEngine.getContext(tenantId, storeId);
            const snapshot = contextEngine.getEnterpriseSnapshot(tenantId, storeId);
            const readinessReport = contextEngine.getLaunchReadiness(tenantId, storeId);
            const recommendations = contextEngine.getRecommendations(tenantId, storeId);
            const navigatorLogs = contextEngine.getNavigatorLogs();

            return (
              <div className="space-y-6 animate-fadeIn" id="business_navigator_layer">
                {/* 1. Header Banner */}
                <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white">
                  <div>
                    <div className="flex items-center gap-2">
                       <span className="bg-[#07C2E3] text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded font-mono">L281-320</span>
                      <h3 className="font-extrabold text-sm tracking-tight text-white">🧠 Enterprise Intelligence Brain • Autonomous Business Navigator</h3>
                    </div>
                    <p className="text-slate-400 text-xs mt-1">
                      Continuous environmental sensing, launch readiness compliance assessment, and high net yield action orchestration.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-emerald-950/50 border border-emerald-850 text-emerald-400 text-[10px] font-mono px-3 py-1 rounded-full uppercase font-bold flex items-center gap-1.5 shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      Real-time Sync: OK
                    </span>
                    <button
                      onClick={() => {
                        const phases: Array<'Observe'|'Understand'|'Decide'|'Execute'|'Learn'> = ['Observe', 'Understand', 'Decide', 'Execute', 'Learn'];
                        const modules = ['VATScanner', 'ProductTranslator', 'ReviewSynthesizer', 'PaymentGatewayAuditor', 'DomainMapper'];
                        const logs = [
                          'Sensors initialized context check. Evaluating international catalog sync flags.',
                          'Scanned active product translation indexes. Found 96.2% matching tags for Europe-First catalog.',
                          'Sensing organic customer conversion trend variations inside French domains.',
                          'Orchestrated strategic target directive index to resolve launch readiness blockers.',
                          'Completed compliance baseline checks. Security rating remains verified at 94%.'
                        ];
                        const idx = Math.floor(Math.random() * 5);
                        contextEngine.addNavigatorLog(
                          modules[idx],
                          phases[idx],
                          logs[idx],
                          Math.random() > 0.7 ? 'success' : 'info'
                        );
                        setTick(t => t + 1);
                        triggerSuccess('Dispatched immediate autonomous environment scan loop');
                      }}
                      className="px-3 py-1 bg-[#07C2E3] hover:bg-[#06B2D0] text-black text-[10px] font-extrabold rounded-md uppercase tracking-wider transition"
                    >
                      ⟳ Repeat Scan Loop
                    </button>
                  </div>
                </div>

                {/* 2. Business Context Engine Display (Who, Where, Doing) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* WHO */}
                  <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-2">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#07C2E3] block">IDENTITY: WHO AM I</span>
                    <div className="space-y-1 text-xs text-slate-800">
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-slate-500">Tenant:</span>
                        <span className="font-mono text-slate-850 font-bold">{businessContext.whoAmI.tenantName}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-slate-500">Store Context:</span>
                        <span className="font-mono text-slate-850 font-bold">{businessContext.whoAmI.storeName}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-slate-500">Operating Region:</span>
                        <span className="font-mono text-cyan-600 font-bold">{businessContext.whoAmI.currentCountry} (Europe-First)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Locale Ruleset:</span>
                        <span className="font-mono text-slate-850 font-semibold">{businessContext.whoAmI.currentLanguage.toUpperCase()} (Standard ISO)</span>
                      </div>
                    </div>
                  </div>

                  {/* WHERE */}
                  <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-2">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#07C2E3] block">SCOUT PATROL: WHERE AM I</span>
                    <div className="space-y-1 text-xs text-slate-800">
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-slate-500">Current Scope:</span>
                        <span className="font-mono text-slate-850 font-semibold truncate max-w-[150px]" title={businessContext.whereAmI.currentPage}>Platform Admin Console</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-slate-500">Working Unit:</span>
                        <span className="font-mono text-slate-850 font-semibold truncate max-w-[150px]" title={businessContext.whereAmI.currentModule}>Enterprise Brain</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-slate-500">Resource Ingress:</span>
                        <span className="font-mono text-[#07C2E3] font-bold">Active SaaS Repositories</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Business Flow:</span>
                        <span className="font-mono text-slate-850 font-semibold truncate max-w-[150px]" title={businessContext.whereAmI.currentBusinessProcess}>Compliance & Audits</span>
                      </div>
                    </div>
                  </div>

                  {/* WHAT */}
                  <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-2">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#07C2E3] block">ACTIVE GOALS: WHAT AM I DOING</span>
                    <div className="space-y-1 text-xs text-slate-800">
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-slate-500">Core Index:</span>
                        <span className="font-mono text-emerald-600 font-bold truncate max-w-[150px]" title={businessContext.whatAmIDoing.currentTarget}>100% Launch Readiness</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-slate-500">Target Action:</span>
                        <span className="font-mono text-slate-850 font-semibold truncate max-w-[150px]" title={businessContext.whatAmIDoing.currentTask}>Close Localization Blanks</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-slate-500">Active Workflow:</span>
                        <span className="font-mono text-cyan-600 font-bold">Sensing Optimization Wave</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Auditor Status:</span>
                        <span className="font-mono text-emerald-600 font-bold">EVALUATING</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Enterprise State Awareness & Launch Readiness Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Enterprise State Snapshot (4 stats) */}
                  <div className="lg:col-span-5 bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-4">
                    <div>
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">📊 Enterprise Health Snapshot</h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">Real-time parsed operations data health telemetry.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Inventory */}
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">INVENTORY HEALTH</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <strong className="text-lg font-extrabold text-slate-800">{snapshot.inventoryHealth}%</strong>
                          <span className={`text-[10px] font-bold ${snapshot.inventoryHealth >= 80 ? 'text-emerald-600' : 'text-orange-500'}`}>
                            {snapshot.inventoryHealth >= 80 ? 'Optimal' : 'Low Stock Alert'}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className="bg-[#07C2E3] h-full rounded-full" style={{ width: `${snapshot.inventoryHealth}%` }}></div>
                        </div>
                      </div>

                      {/* Finance */}
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">FINANCE HEALTH</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <strong className="text-lg font-extrabold text-slate-800">{snapshot.financeHealth}%</strong>
                          <span className="text-[10px] font-bold text-emerald-600">Liquidity Clear</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${snapshot.financeHealth}%` }}></div>
                        </div>
                      </div>

                      {/* Coverage */}
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">MARKET REACH</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <strong className="text-lg font-extrabold text-slate-800">{snapshot.marketCoverage}%</strong>
                          <span className="text-[10px] font-bold text-[#07C2E3]">{snapshot.marketCoverage >= 80 ? 'Ready' : 'Under Expansion'}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${snapshot.marketCoverage}%` }}></div>
                        </div>
                      </div>

                      {/* Risk Level */}
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">AGGREGATED RISK</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <strong className={`text-base font-extrabold uppercase ${
                            snapshot.riskLevel === 'Low' ? 'text-emerald-600' :
                            snapshot.riskLevel === 'Medium' ? 'text-amber-600' :
                            'text-rose-600'
                          }`}>{snapshot.riskLevel}</strong>
                        </div>
                        <p className="text-[9.5px] text-slate-400 font-mono mt-2 leading-tight">Environmental and localized compliance index factors verified lock.</p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Circular Launch Readiness Score */}
                  <div className="lg:col-span-7 bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-2 max-w-sm text-slate-800">
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-cyan-500"></span> Launch Readiness Evaluator
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Automatic verification of translation maps, local tax registries, policies, custom checkout carriers, and local payment rails.
                      </p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs pt-1">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          <span>VAT Compliance: <strong className="font-bold">OSS Active</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          <span>Routing Gateway: <strong className="font-bold">Active</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                          <span>Friction Points: <strong className="font-bold">{readinessReport.tasks.filter(t => t.status === 'Pending').length} Pending</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#07C2E3]"></span>
                          <span>ETA Close: <strong className="font-mono font-bold text-[#07C2E3]">{readinessReport.estimatedCompletionMinutes} min</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-center justify-center p-3 border border-slate-100 rounded-full bg-slate-50 shadow-inner h-32 w-32 relative">
                      <svg className="w-28 h-28 transform -rotate-90">
                        <circle
                          cx="56"
                          cy="56"
                          r="44"
                          className="stroke-slate-200"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="56"
                          cy="56"
                          r="44"
                          className="stroke-[#07C2E3] transition-all duration-500"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 44}
                          strokeDashoffset={2 * Math.PI * 44 * (1 - readinessReport.overallScore / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-black text-slate-800 tracking-tighter leading-none">{readinessReport.overallScore}%</span>
                        <span className="text-[9px] font-mono text-slate-500 tracking-wider mt-0.5">READY RATING</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Launch Readiness Checklist Tasks Block */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-slate-150 bg-slate-50 flex justify-between items-center">
                    <div>
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-850">📋 Launch Readiness Compliance Checklist</h4>
                      <p className="text-[10.5px] text-slate-500 font-mono mt-0.5">Verifiable technical and legal requisites necessary for European merchant expansion.</p>
                    </div>
                    <span className="font-mono text-xs text-slate-500 bg-white border px-3 py-1 rounded-md font-bold">
                      {readinessReport.tasks.filter(t => t.status === 'Completed').length} / {readinessReport.tasks.length} Completed
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-500 font-mono uppercase text-[9.5px] border-b">
                          <th className="p-3">REQUISITE NAME</th>
                          <th className="p-3">CATEGORY</th>
                          <th className="p-3">IMPACT WEIGHT</th>
                          <th className="p-3">STATUS</th>
                          <th className="p-3 text-right">AUTOMATION ACTION ENGINE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {readinessReport.tasks.map(task => (
                          <tr key={task.id} className="border-b hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-medium text-slate-800 py-3.5">
                              {task.name}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-full font-mono font-bold text-[9px] border bg-slate-50 border-slate-200 text-slate-600">
                                {task.category}
                              </span>
                            </td>
                            <td className="p-3 font-mono font-bold text-slate-700">
                              +{task.impactScore}% score
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded font-mono font-extrabold text-[10px] ${
                                task.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-250 border'
                                  : 'bg-amber-50 text-amber-800 border-amber-250 border animate-pulse'
                              }`}>
                                {task.status === 'Completed' ? '✓ VERIFIED' : '✖ DEFICIENT'}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              {task.status === 'Completed' ? (
                                <span className="text-slate-400 font-mono font-semibold text-[10.5px]">Clearance Approved</span>
                              ) : (
                                <button
                                  onClick={() => {
                                    contextEngine.solveReadinessTask(tenantId, storeId, task.id);
                                    setTick(t => t + 1);
                                    triggerSuccess(`Autonomously solved: '${task.name}' via targeting sub-agents.`);
                                  }}
                                  className="px-3 py-1 bg-white hover:bg-slate-50 text-[#07C2E3] border border-slate-300 hover:border-slate-400 font-extrabold text-[10.5px] uppercase rounded-md tracking-wider transition"
                                >
                                  Deploy Micro-Agent
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 5. Executive Strategic Recommendation Board */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-4">
                  <div>
                    <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 text-[#07C2E3] px-2 py-0.5 rounded font-extrabold uppercase">EXECUTIVE RECOMMENDATIONS</span>
                    <h4 className="font-extrabold text-sm text-slate-800 mt-2">📊 Strategic High ROI Operations (Continuous System Optimization)</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">Shopify Sidekick level business optimization actions generated by AI engine context analytics.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommendations.map(rec => (
                      <div key={rec.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition shadow-inner flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center border-b pb-1">
                            <span className="text-[#07C2E3] font-mono text-[10px] font-bold uppercase">{rec.category}</span>
                            <span className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-extrabold ${rec.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'}`}>
                              {rec.status === 'Completed' ? 'EXECUTED' : 'READY'}
                            </span>
                          </div>
                          <h5 className="font-extrabold text-xs text-slate-800 leading-snug">{rec.title}</h5>
                          <p className="text-slate-600 text-[11px] leading-relaxed font-mono">{rec.rationale}</p>
                        </div>

                        {/* Strategic Gains */}
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200 grid grid-cols-3 gap-2 text-[10.5px] font-mono">
                          <div>
                            <span className="text-slate-400 block text-[8px] uppercase">PROJECTED RISK</span>
                            <strong className="text-rose-600 block">-{rec.estimatedTrafficLossPct}% loss</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[8px] uppercase">CONV. UPLIFT</span>
                            <strong className="text-emerald-600 block">+{rec.estimatedConversionUpliftPct}% rate</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[8px] uppercase">NET YIELD</span>
                            <strong className="text-slate-800 block">+€{rec.netRevenueGainPerMonth.toLocaleString()}</strong>
                          </div>
                        </div>

                        {/* Trigger action button */}
                        {rec.status === 'Completed' ? (
                          <button disabled className="w-full bg-slate-100 text-slate-400 py-2 rounded text-[10.5px] font-bold uppercase cursor-not-allowed">
                            ✓ Operations Completed
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              contextEngine.executeRecommendation(tenantId, storeId, rec.id);
                              setTick(t => t + 1);
                              triggerSuccess(`Executing operational directive: '${rec.title}'. Database models synchronized.`);
                            }}
                            className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-black py-2 rounded text-[10.5px] font-extrabold uppercase tracking-wide transition shadow-xs"
                          >
                            ✓ Execute Strategic Directive
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Autonomous Navigator Loop Logger */}
                <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl shadow-lg space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-[10px] font-mono text-[#07C2E3] font-bold uppercase tracking-wider block font-black">NEURO-SYSTEM LOOP LOGGER</span>
                      <h4 className="font-extrabold text-xs text-white uppercase tracking-wider mt-0.5">📡 Autonomous Business Navigation Trace Log</h4>
                    </div>
                    <button
                      onClick={() => {
                        contextEngine.addNavigatorLog(
                          'OutcomeEvaluator',
                          'Learn',
                          'Super Admin cleared trace log diagnostics. Automatic system sensing loops functioning normally.',
                          'info'
                        );
                        setTick(t => t + 1);
                        triggerSuccess('Trace Log diagnostic queue flushed.');
                      }}
                      className="px-2.5 py-1 hover:bg-slate-800 text-slate-400 text-[10px] font-mono border border-slate-800 hover:border-slate-700 rounded transition"
                    >
                      Clear Trace Loops
                    </button>
                  </div>

                  <div className="bg-black/40 rounded-lg p-3 font-mono text-[10px] leading-relaxed text-slate-300 max-h-[180px] overflow-y-auto space-y-2">
                    {navigatorLogs.map((log, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-950 pb-1.5 gap-2">
                        <div className="flex items-start gap-2 max-w-xl">
                          <span className="text-slate-500 shrink-0 select-none">[{log.timestamp}]</span>
                          <span className={`px-1.5 rounded font-black uppercase text-[8.5px] shrink-0 border ${
                            log.phase === 'Observe' ? 'bg-cyan-950 text-cyan-400 border-cyan-900' :
                            log.phase === 'Understand' ? 'bg-amber-950 text-amber-400 border-amber-900' :
                            log.phase === 'Decide' ? 'bg-purple-950 text-purple-400 border-purple-900' :
                            log.phase === 'Execute' ? 'bg-sky-950 text-sky-400 border-sky-900' :
                            'bg-emerald-950 text-emerald-400 border-emerald-900'
                          }`}>
                            {log.phase}
                          </span>
                          <span className="text-[8.5px] font-bold text-slate-400 shrink-0">({log.module}):</span>
                          <span className="text-slate-100">{log.log}</span>
                        </div>
                        <span className={`text-[8.5px] font-extrabold uppercase shrink-0 px-1 rounded ${
                          log.severity === 'critical' ? 'bg-rose-950 text-rose-450 animate-pulse border border-rose-900' :
                          log.severity === 'warn' ? 'bg-amber-900/30 text-amber-500 border border-amber-950' :
                          log.severity === 'success' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' :
                          'text-slate-400'
                        }`}>
                          ● {log.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {intelLayer === 'l22_memory_consolidation' && (
            <MemoryConsolidationLayer triggerSuccess={triggerSuccess} />
          )}

          {intelLayer === 'l23_agent_governance' && (
            <AgentGovernanceLayer triggerSuccess={triggerSuccess} />
          )}

          {intelLayer === 'l24_market_simulation' && (
            <MarketSimulationLayer triggerSuccess={triggerSuccess} />
          )}

          {intelLayer === 'l25_strategic_campaigns' && (
            <StrategicCampaignsLayer triggerSuccess={triggerSuccess} />
          )}

          {intelLayer === 'l26_risk_intelligence' && (
            <RiskIntelligenceLayer triggerSuccess={triggerSuccess} />
          )}

          {intelLayer === 'l27_opportunity_discovery' && (
            <OpportunityDiscoveryLayer triggerSuccess={triggerSuccess} />
          )}

          {intelLayer === 'l28_executive_os' && (
            <ExecutiveOsLayer triggerSuccess={triggerSuccess} />
          )}

          {intelLayer === 'l29_business_context' && (
            <BusinessContextLayer triggerSuccess={triggerSuccess} />
          )}

          {intelLayer === 'l30_store_readiness' && (
            <StoreReadinessLayer triggerSuccess={triggerSuccess} />
          )}

          {intelLayer === 'l31_external_intelligence' && (
            <ExternalIntelligenceLayer triggerSuccess={triggerSuccess} />
          )}

          {intelLayer === 'l32_market_radar' && (
            <MarketRadarLayer triggerSuccess={triggerSuccess} />
          )}

          {intelLayer === 'l33_copilot_core' && (
            <CopilotCoreLayer triggerSuccess={triggerSuccess} />
          )}

          {intelLayer === 'l34_agent_runtime' && (
            <AgentRuntimeLayer triggerSuccess={triggerSuccess} />
          )}

          {intelLayer === 'l35_agent_coordination' && (
            <AgentCoordinationLayer triggerSuccess={triggerSuccess} />
          )}

          {intelLayer === 'l36_execution_governance' && (
            <ExecutionGovernanceLayer triggerSuccess={triggerSuccess} />
          )}

          {intelLayer === 'l37_context_engine_v2' && (
            <ContextEngineV2Layer triggerSuccess={triggerSuccess} />
          )}

          {intelLayer === 'l38_brain_finalization' && (
            <BrainFinalizationLayer triggerSuccess={triggerSuccess} />
          )}

        </div>

      </div>

    </div>
  );
}

// Simple Helper for economic flat indicator descriptions
function economicIndicatorValue(val: number): string {
  if (val >= 80) return `Vibrant (欧洲经济回暖水线: ${val}%)`;
  if (val >= 50) return `Moderate (平稳波动水线: ${val}%)`;
  return `Warning Recession (警告衰退通胀: ${val}%)`;
}
