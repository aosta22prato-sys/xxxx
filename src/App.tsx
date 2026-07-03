import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Brain, 
  Play, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  AlertTriangle, 
  Activity, 
  Database, 
  Cpu, 
  BookOpen, 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  Plus, 
  Settings, 
  Check, 
  ExternalLink, 
  Lock, 
  RefreshCw, 
  Sliders, 
  HelpCircle, 
  Send, 
  Terminal, 
  User, 
  BarChart3,
  X,
  CreditCard,
  Shuffle,
  Scale,
  PackagePlus,
  GitBranch,
  Layers,
  ArrowRight,
  Home,
  ShoppingCart,
  Users,
  Megaphone,
  Percent,
  FileText,
  Store,
  Coins,
  Bot,
  Globe,
  Truck,
  Mail,
  Compass
} from 'lucide-react';
import { IndustryType, TenantConfig, ProductItem, OrderItem, AIEmployee, Workflow, WorkflowNode, KnowledgeDoc, McpTool, AppMarketItem, CollaborationLog, SourcingRecommendation, CustomerItem, AIContext } from './types';
import { dbEngine } from './db/dbEngine';
import { INDUSTRY_PRESETS, COMMON_MCP_TOOLS, APP_MARK_PRESETS, PLATFORM_STATS } from './data';
import { DOCTREE_DATA, DocTreeNode } from './doctreeData';
import DocTreeViewer from './components/DocTreeViewer';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ConfigPage from './components/ConfigPage';
import IndustryPage from './components/IndustryPage';
import ProvisioningPage from './components/ProvisioningPage';
import AICommandCenter from './components/AICommandCenter';
import SaaSMerchantWorkbench from './components/merchant_client/SaaSMerchantWorkbench';
import SalesCenter from './components/merchant_client/SalesCenter';
import ProductCenter from './components/merchant_client/ProductCenter';
import OrderCenter from './components/merchant_client/OrderCenter';
import LogisticsCenter from './components/merchant_client/LogisticsCenter';
import CustomerCenter from './components/merchant_client/CustomerCenter';
import MarketingCenter from './components/merchant_client/MarketingCenter';
import FinanceCenter from './components/merchant_client/FinanceCenter';
import PaymentCenter from './components/merchant_client/PaymentCenter';
import OnlineStore from './components/merchant_client/OnlineStore';
import AIEmployeeCenter from './components/merchant_client/AIEmployeeCenter';
import EmployeeCenter from './components/merchant_client/EmployeeCenter';
import RolesCenter from './components/merchant_client/RolesCenter';
import EnterpriseSettings from './components/merchant_client/EnterpriseSettings';
import ShopifyDocsFinder from './components/ShopifyDocsFinder';
import PoliciesManagement from './components/merchant_client/PoliciesManagement';
import SuperAdminCenter from './components/super_admin/SuperAdminCenter';
import CodeExplorer from './components/CodeExplorer';
import MerchantAdminLayout from './shopify_merchant/layouts/AdminLayout';
import EcosPerformanceOptimizer from './components/super_admin/ai-brain-center/EcosPerformanceOptimizer';
import EcosStrategicIntelligence from './components/super_admin/ai-brain-center/EcosStrategicIntelligence';
import EcosCognitiveGovernance from './components/super_admin/ai-brain-center/EcosCognitiveGovernance';
import EcosEnterpriseNervousSystem from './components/super_admin/ai-brain-center/EcosEnterpriseNervousSystem';
import AINavigationCenter from './components/AINavigationCenter';
import { 
  runtimeContextManager, 
  mapIndustry, 
  mapPage, 
  getCountryForIndustry, 
  getTenantInfo,
  ReactAIContextProvider
} from './context/AIContextProvider';
import { aiRuntimeStore } from './store/aiRuntimeStore';
import { PageAwarenessSDK } from './services/brain/runtime/PageAwarenessSDK';
import { AIContextService } from './services/AIContextService';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { currentUser, logout, updateProfile, verifyEmail, refreshToken, quickBypassLogin } = useAuth();
  
  // Profile menu overlay states
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [editProfileName, setEditProfileName] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Active states
  const [viewMode, setViewMode] = useState<'landing' | 'register' | 'login' | 'industry' | 'config' | 'provisioning' | 'app'>('landing');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };
  const [companyName, setCompanyName] = useState<string>('极光数字科技有限公司');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType>('retail');
  const [activeTab, setActiveTab ] = useState<string>('command');
  const [adminMode, setAdminMode] = useState<'merchant' | 'super_admin'>(() => {
    try {
      return (localStorage.getItem('ecos_admin_mode') as 'merchant' | 'super_admin') || 'merchant';
    } catch (e) {
      console.warn("localStorage is disabled or sandboxed, falling back to merchant mode:", e);
      return 'merchant';
    }
  });
  const [globalDefaultModel, setGlobalDefaultModel] = useState<string>('gemini-2.5-flash');
  const [tenants, setTenants] = useState<TenantConfig[]>([
    { id: 't_retail', companyName: '米兰风尚服装批发集团', industry: 'retail', storeName: '米兰风尚女装批发店', status: 'active', aiBudget: 500, aiSpent: 124.5, createdAt: '2026-01-12' },
    { id: 't_food', companyName: '慕尼黑中餐连锁配送柜', industry: 'food', storeName: '慕尼黑私房菜配送店', status: 'active', aiBudget: 200, aiSpent: 18.2, createdAt: '2026-02-18' },
    { id: 't_manufacturing', companyName: '柏林智慧电器百货商行', industry: 'manufacturing', storeName: '智慧电器多门店直销店', status: 'active', aiBudget: 1000, aiSpent: 418.2, createdAt: '2026-03-01' },
    { id: 't_healthcare', companyName: '巴黎名品商场POS收银柜部', industry: 'healthcare', storeName: '巴黎高端香水POS快速结算端', status: 'active', aiBudget: 1500, aiSpent: 890.0, createdAt: '2026-03-24' },
    { id: 't_service', companyName: '罗马皇家女子美容Spa会所', industry: 'service', storeName: '罗马会所美容线上预订端', status: 'active', aiBudget: 400, aiSpent: 122.5, createdAt: '2026-04-10' },
    { id: 't_education', companyName: '奥地利跨境网店直销部', industry: 'education', storeName: '382跨境3C出海站', status: 'active', aiBudget: 600, aiSpent: 210.0, createdAt: '2026-05-02' }
  ]);
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(true);
  const [isOnlineStoreOpen, setIsOnlineStoreOpen] = useState(false);
  const [discountDrafts, setDiscountDrafts] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [agentRuns, setAgentRuns] = useState<any[]>([]);
  const [agentTasks, setAgentTasks] = useState<any[]>([]);
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);

  // Helper method to write state to disk
  const persistDatabaseState = async (
    updatedTenants = tenants,
    updatedTenantDB = tenantDB,
    updatedMcpTools = mcpTools,
    updatedMarketItems = marketItems,
    updatedActiveAgents = activeAgents,
    updatedDiscountDrafts = discountDrafts,
    updatedAuditLogs = auditLogs,
    updatedAgentRuns = agentRuns,
    updatedAgentTasks = agentTasks
  ) => {
    try {
      const payload = {
        tenants: updatedTenants,
        tenantDB: updatedTenantDB,
        mcpTools: updatedMcpTools,
        marketItems: updatedMarketItems,
        activeAgents: updatedActiveAgents,
        discountDrafts: updatedDiscountDrafts,
        auditLogs: updatedAuditLogs,
        agentRuns: updatedAgentRuns,
        agentTasks: updatedAgentTasks
      };
      await fetch('/api/db/save-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("Failed to persist SaaS database:", err);
    }
  };
  
  // Localized Tenant Database (to reflect live updates without losing edits when shifting contexts)
  const [tenantDB, setTenantDB] = useState<Record<IndustryType, {
    products: ProductItem[];
    orders: OrderItem[];
    customers: CustomerItem[];
    workflows: Workflow[];
    knowledge: KnowledgeDoc[];
    metrics: any[];
    relational?: any;
  }>>(() => {
    // Deep clone presets
    const db: any = {};
    (Object.keys(INDUSTRY_PRESETS) as IndustryType[]).forEach(ind => {
      db[ind] = JSON.parse(JSON.stringify(INDUSTRY_PRESETS[ind]));
    });
    return db;
  });

  const [mcpTools, setMcpTools] = useState<McpTool[]>(COMMON_MCP_TOOLS);
  const [marketItems, setMarketItems] = useState<AppMarketItem[]>(APP_MARK_PRESETS);
  const [activeAgents, setActiveAgents] = useState<AIEmployee[]>(() => {
    // Deep clone active preset agents initially
    const initialAgents: AIEmployee[] = [];
    (Object.keys(INDUSTRY_PRESETS) as IndustryType[]).forEach(ind => {
      INDUSTRY_PRESETS[ind].agents.forEach(agent => {
        initialAgents.push({ ...agent });
      });
      // Append a dedicated Analytics Agent for every industry
      initialAgents.push({
        id: `${ind}_analytics`,
        name: 'Analytics Agent',
        title: 'BI & Yield Analysis Specialist',
        role: 'Evaluates daily cohort trends, customer retention, churn parameters, inventory turnover, and sales forecast patterns using responsive Recharts.',
        status: 'Idle',
        emoji: '📊',
        description: 'Specialized business analytics agent using Recharts engine to deliver real-time enterprise metrics and optimization graphs.',
        capabilities: ['Daily Sales Mapping', 'Customer Churn Tracker', 'Inventory Turnover Trends', 'Predictive Forecast Modelling'],
        systemPrompt: 'You are the Analytics Agent. You analyze daily revenue metrics, customer cohort churn, and stock velocity turnover. Always verify database state entries and provide precise graphical reports with Recharts line and bar graphs.',
        model: 'gemini-3.5-pro',
        tasksCompleted: 156
      });
    });
    return initialAgents;
  });

  // Collaboration logs
  const [collaborationLogs, setCollaborationLogs] = useState<CollaborationLog[]>([]);

  // Selected chat model dialogs
  const [chatAgent, setChatAgent] = useState<AIEmployee | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Record<string, { role: 'user' | 'assistant', content: string }[]>>({});
  const [chatLoading, setChatLoading] = useState(false);

  // Active executing workflows
  const [runningWorkflowId, setRunningWorkflowId] = useState<string | null>(null);
  const [currentNodeIndex, setCurrentNodeIndex] = useState<number>(-1);
  const [workflowLogs, setWorkflowLogs] = useState<string[]>([]);

  // Simulation settings
  const [isApiKeyConnected, setIsApiKeyConnected] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);

  // SaaS Super Admin helper handlers
  const handleToggleTenantStatus = (tenantId: string) => {
    setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, status: t.status === 'active' ? 'suspended' : 'active' } : t));
    const target = tenants.find(t => t.id === tenantId);
    if (target) {
      addLog('SaaS Platform Center', '租户状态变更', `租户「${target.companyName}」的状态已切换。`, 'warning');
    }
  };

  const handleUpdateTenantValueLimit = (tenantId: string, limit: number) => {
    setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, aiBudget: limit } : t));
    const target = tenants.find(t => t.id === tenantId);
    if (target) {
      addLog('SaaS Platform Center', '租户自动化调度增配', `租户「${target.companyName}」的智能开店自动化运行预算调整为 ${limit} USD.`, 'success');
    }
  };

  // Forms / additions inputs
  const [newTitle, setNewTitle] = useState('');
  const [newSKU, setNewSKU] = useState('');
  const [newStock, setNewStock] = useState(50);
  const [newThreshold, setNewThreshold] = useState(10);
  const [newPrice, setNewPrice] = useState(29.99);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [showAddDoc, setShowAddDoc] = useState(false);

  // Sourcing Module states
  const [sourcingRecommendations, setSourcingRecommendations] = useState<SourcingRecommendation[]>([]);
  const [sourcingLoading, setSourcingLoading] = useState(false);

  // Visual Workflow Creator state
  const [visualNodes, setVisualNodes] = useState<WorkflowNode[]>([
    { id: 'v1', type: 'trigger', title: 'Order Placed', status: 'idle', details: 'Triggers when a new customer checkout succeeds.' },
    { id: 'v2', type: 'ai_decision', title: 'Verify Inventory Levels', status: 'idle', details: 'Fulfillment agent maps stock allocations.' },
    { id: 'v3', type: 'condition', title: 'Is High Risk Fraud?', status: 'idle', details: 'Analyze credit and spatial parameters.' },
    { id: 'v4', type: 'action', title: 'Acknowledge Logistic Courier', status: 'idle', details: 'Trigger shipping label creation via DHL.' }
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('v1');
  const [visualWorkflowLogs, setVisualWorkflowLogs] = useState<string[]>([]);
  const [isVisualRunning, setIsVisualRunning] = useState(false);
  const [currentVisualIndex, setCurrentVisualIndex] = useState(-1);

  // Real-time server and Gemini connection statuses
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [geminiStatus, setGeminiStatus] = useState<'connected' | 'no_key' | 'failed' | 'checking'>('checking');
  const [geminiStatusMessage, setGeminiStatusMessage] = useState<string>('正在对接入智能核中...');
  const [lastCheckTime, setLastCheckTime] = useState<string>('');
  const [showStatusPopover, setShowStatusPopover] = useState(false);
  const [statusLatency, setStatusLatency] = useState<number | null>(null);

  const handleRefreshStatus = async () => {
    setServerStatus('checking');
    setGeminiStatus('checking');
    setGeminiStatusMessage('正在发起实时校验...');
    const startTime = Date.now();
    try {
      const res = await fetch('/api/ai/status');
      const delay = Date.now() - startTime;
      setStatusLatency(delay);
      
      if (res.ok) {
        const data = await res.json();
        setServerStatus('online');
        setGeminiStatus(data.gemini?.status || 'failed');
        setGeminiStatusMessage(data.gemini?.message || '未知状态');
        setLastCheckTime(data.gemini?.lastChecked || new Date().toISOString());
      } else {
        setServerStatus('offline');
        setGeminiStatus('failed');
        setGeminiStatusMessage(`后端接口失效 ` + res.status);
      }
    } catch (err: any) {
      setServerStatus('offline');
      setGeminiStatus('failed');
      setGeminiStatusMessage(`无网络物理联通: ` + (err?.message || String(err)));
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      const startTime = Date.now();
      try {
        const res = await fetch('/api/ai/status');
        const delay = Date.now() - startTime;
        setStatusLatency(delay);
        
        if (res.ok) {
          const data = await res.json();
          setServerStatus('online');
          setGeminiStatus(data.gemini?.status || 'failed');
          setGeminiStatusMessage(data.gemini?.message || '未知状态');
          setLastCheckTime(data.gemini?.lastChecked || new Date().toISOString());
        } else {
          setServerStatus('offline');
          setGeminiStatus('failed');
          setGeminiStatusMessage(`后端接口失效: ` + res.status);
        }
      } catch (err: any) {
        setServerStatus('offline');
        setGeminiStatus('failed');
        setGeminiStatusMessage(`无网络物理联通: ` + (err?.message || String(err)));
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Poll status every 30s
    return () => clearInterval(interval);
  }, []);

  // Scrolling anchor for chat
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Dynamic system simulation is disabled

  // Watch key changes or load state
  useEffect(() => {
    // Check if API key is populated in workspace ENV or if user logged it
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        console.log("SaaS Server Connection established:", data);
      } catch (err) {
        console.error("Express backend inactive in background", err);
      }
    };
    
    const loadDB = async () => {
      try {
        const res = await fetch('/api/db/get-all');
        if (res.ok) {
          const dbData = await res.json();
          if (dbData && dbData.tenantDB) {
            if (dbData.tenants) setTenants(dbData.tenants);
            setTenantDB(dbData.tenantDB);
            if (dbData.mcpTools) setMcpTools(dbData.mcpTools);
            if (dbData.marketItems) setMarketItems(dbData.marketItems);
            if (dbData.activeAgents) {
              const loadedAgents = [...dbData.activeAgents];
              const industries = ['retail', 'food', 'manufacturing', 'healthcare', 'service', 'education'];
              industries.forEach(ind => {
                const hasAnalytics = loadedAgents.some(a => a.id === `${ind}_analytics`);
                if (!hasAnalytics) {
                  loadedAgents.push({
                    id: `${ind}_analytics`,
                    name: 'Analytics Agent',
                    title: 'BI & Yield Analysis Specialist',
                    role: 'Evaluates daily cohort trends, customer retention, churn parameters, inventory turnover, and sales forecast patterns using responsive Recharts.',
                    status: 'Idle',
                    emoji: '📊',
                    description: 'Specialized business analytics agent using Recharts engine to deliver real-time enterprise metrics and optimization graphs.',
                    capabilities: ['Daily Sales Mapping', 'Customer Churn Tracker', 'Inventory Turnover Trends', 'Predictive Forecast Modelling'],
                    systemPrompt: 'You are the Analytics Agent. You analyze daily revenue metrics, customer cohort churn, and stock velocity turnover. Always verify database state entries and provide precise graphical reports with Recharts line and bar graphs.',
                    model: 'gemini-3.5-pro',
                    tasksCompleted: 156
                  });
                }
              });
              setActiveAgents(loadedAgents);
            }
            if (dbData.discountDrafts) setDiscountDrafts(dbData.discountDrafts);
            if (dbData.auditLogs) setAuditLogs(dbData.auditLogs);
            if (dbData.agentRuns) setAgentRuns(dbData.agentRuns);
            if (dbData.agentTasks) setAgentTasks(dbData.agentTasks);
            console.log("SaaS Persistent DB successfully synchronized from server disk! Tenants count:", dbData.tenants?.length);
          }
        }
      } catch (err) {
        console.error("Failed to load SaaS state from DB on mount, falling back gracefully:", err);
      } finally {
        setIsDbLoaded(true);
      }
    };

    checkHealth();
    loadDB();
  }, []);

  // Register the global ECOS Unified Nav Registry callback on window
  useEffect(() => {
    (window as any).ECOS_NAVIGATE = (targetRoute: string, aiCentralTabId?: string) => {
      console.log("[ECOS Navigation Engine] Navigating to target route:", targetRoute, "aiCentralTabId:", aiCentralTabId);
      
      const adminRoutes = ['ai_dashboard', 'ai_execution', 'ai_discovery', 'system_map', 'system_registry', 'shopify_docs'];
      
      if (adminRoutes.includes(targetRoute) || targetRoute.startsWith('admin_') || targetRoute === 'admin_ai_ops') {
        setAdminMode('super_admin');
        const mappedTab = targetRoute.startsWith('admin_') ? targetRoute : 'admin_ai_ops';
        setActiveTab(mappedTab);
        
        // Map abstract targets to real aiCentral tab IDs
        let centralTab = aiCentralTabId;
        if (!centralTab) {
          const mapping: Record<string, string> = {
            'ai_dashboard': 'dashboard',
            'ai_execution': 'execution_center',
            'ai_discovery': 'discovery',
            'system_map': 'system_map',
            'system_registry': 'system_registry',
            'shopify_docs': 'shopify_docs'
          };
          centralTab = mapping[targetRoute];
        }
        
        if (centralTab) {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('ECOS_SET_AI_CENTRAL_TAB', { detail: centralTab }));
          }, 30);
        }
      } else {
        setAdminMode('merchant');
        setActiveTab(targetRoute);
      }
    };
  }, [setAdminMode, setActiveTab]);

  useEffect(() => {
    const handleToggle = () => {
      setAdminMode(prev => {
        const nextMode = prev === 'merchant' ? 'super_admin' : 'merchant';
        try {
          localStorage.setItem('ecos_admin_mode', nextMode);
        } catch (e) {
          console.warn("localStorage.setItem is blocked or sandboxed:", e);
        }
        setActiveTab(nextMode === 'merchant' ? 'command' : 'admin_stats');
        window.dispatchEvent(new CustomEvent('ECOS_ADMIN_MODE_CHANGED', { detail: nextMode }));
        setTimeout(() => {
          addLog('Developer Decoupler', '沙盒环境无缝穿越', `开发人员穿越：已从 [${prev === 'merchant' ? '商家端' : '总控端'}] 安全热跳至 [${nextMode === 'merchant' ? '商家端' : '总控端'}]`, 'warning');
        }, 50);
        return nextMode;
      });
    };

    (window as any).ECOS_TOGGLE_ADMIN_MODE = handleToggle;
    window.addEventListener('ECOS_TOGGLE_ADMIN_MODE_TRIGGER', handleToggle);

    return () => {
      delete (window as any).ECOS_TOGGLE_ADMIN_MODE;
      window.removeEventListener('ECOS_TOGGLE_ADMIN_MODE_TRIGGER', handleToggle);
    };
  }, [setAdminMode, setActiveTab]);

  // Synchronously seed missing indices if they are not already in Database
  useEffect(() => {
    if (!isDbLoaded) return;
    try {
      const currentNavs = dbEngine.navigation_registry.getAll();
      const defaultNavsSeeded = [
        { id: 'pos', name: 'POS 渠道收银', aliases: ['pos', '收银', '收银柜', '线下店'], route: 'pos', component: 'POSCenter', parent: 'operations', status: 'LIVE' as const, permissions: ['Admin', 'Merchant'] },
        { id: 'shopify_docs', name: 'Shopify 开发者文档', aliases: ['开发文档', '协议说明', 'api规格', 'shopify api', 'docs'], route: 'shopify-docs', component: 'ShopifyDocsFinder', parent: 'developer', status: 'LIVE' as const, permissions: ['Admin', 'Developer'] },
        { id: 'ai_execution', name: 'AI 执行控制中心', aliases: ['执行控制', '审批控制', '自愈验证', '任务审批', 'ai执行'], route: 'ai_execution', component: 'AIExecutionControlCenter', parent: 'ai', status: 'LIVE' as const, permissions: ['Admin'] },
        { id: 'system_map', name: '系统地图', aliases: ['架构图', '系统地图拓扑', '大盘地图', '系统拓扑'], route: 'system_map', component: 'EcosMasterDirectory', parent: 'developer', status: 'LIVE' as const, permissions: ['Admin', 'Developer'] },
        { id: 'system_registry', name: '主注册中心', aliases: ['注册中心', '三大注册中心', '系统注册表', '模块登记', '事实库'], route: 'system_registry', component: 'EcosMasterDirectory', parent: 'developer', status: 'LIVE' as const, permissions: ['Admin', 'Developer'] }
      ];
      
      let addedAny = false;
      defaultNavsSeeded.forEach(nav => {
        if (!currentNavs.some(n => n.id === nav.id)) {
          dbEngine.navigation_registry.create({
            name: nav.name,
            aliases: nav.aliases,
            route: nav.route,
            component: nav.component,
            parent: nav.parent,
            status: nav.status,
            permissions: nav.permissions
          });
          addedAny = true;
        }
      });
      if (addedAny) {
        console.log("[ECOS Navigation Engine] Seeded missing navigation assets into DB!");
      }
    } catch (e) {
      console.error("[ECOS Navigation Engine] Seeding failed:", e);
    }
  }, [isDbLoaded]);

  // Save changes back to server-side persistent JSON DB automatically when states change (debounced)
  useEffect(() => {
    if (!isDbLoaded) return;
    const saveDatabaseTimeout = setTimeout(() => {
      persistDatabaseState(tenants, tenantDB, mcpTools, marketItems, activeAgents, discountDrafts, auditLogs, agentRuns, agentTasks);
    }, 850);
    return () => clearTimeout(saveDatabaseTimeout);
  }, [tenants, tenantDB, mcpTools, marketItems, activeAgents, discountDrafts, auditLogs, agentRuns, agentTasks, isDbLoaded]);

  // User Session Management & Secure Routing Guard
  useEffect(() => {
    if (!currentUser) {
      if (viewMode !== 'landing') {
        setViewMode('register');
      }
    } else {
      setEditProfileName(currentUser.displayName);
      if ((viewMode === 'register' || viewMode === 'landing') && !isOnboarding) {
        setViewMode('app');
      }
    }
  }, [currentUser, viewMode, isOnboarding]);

  // Watch system routing navigation changes for our Page Awareness SDK
  useEffect(() => {
    if (!isDbLoaded) return;
    
    const tenantId = `t_${selectedIndustry}`;
    const storeId = `store_${selectedIndustry}`;
    
    // 1. Report locally using PageAwarenessSDK to synchronize client-side Brain Runtime
    PageAwarenessSDK.trackPageNavigation(activeTab, tenantId, storeId);
    
    // 2. Transmit page-focus state to server-side context engine API
    fetch('/api/brain/page-focus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: activeTab, tenantId, storeId })
    }).catch(err => console.error("Could not sync page navigation to backend server:", err));
    
  }, [activeTab, selectedIndustry, isDbLoaded]);

  // --- AI Runtime Context Engine Automatic Synchronization ---
  useEffect(() => {
    const currentIndustryData = tenantDB[selectedIndustry] || { products: [], orders: [], customers: [] };
    const currentStoreCtx = aiRuntimeStore.getContext();
    
    AIContextService.gatherContext({
      industry: selectedIndustry,
      activeTab: activeTab,
      products: currentIndustryData.products || [],
      orders: currentIndustryData.orders || [],
      customers: currentIndustryData.customers || [],
      selectedProductId: currentStoreCtx.ui?.productId,
      selectedOrderId: currentStoreCtx.ui?.orderId,
      selectedCustomerId: currentStoreCtx.ui?.customerId
    });

    if (currentIndustryData && currentIndustryData.relational && typeof window !== "undefined") {
      (window as any).AIContext = {
        ...((window as any).AIContext || {}),
        relational: currentIndustryData.relational
      };
    }
  }, [selectedIndustry, activeTab, tenantDB]);

  const addLog = (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool' = 'info') => {
    const time = new Date().toTimeString().split(' ')[0];
    setCollaborationLogs(prev => [
      { id: Date.now().toString(), timestamp: time, agent, action, details, type },
      ...prev.slice(0, 49) // hold last 50
    ]);
  };

  const handleIndustryChange = (industry: IndustryType) => {
    setSelectedIndustry(industry);
    setChatAgent(null); // clear chat focus
    addLog(
      'System Operator',
      'Tenant Industry Shifted',
      `Auto-loaded enterprise DB blueprints, schemas, and AI roles for [${industry.toUpperCase()}] track.`,
      'info'
    );
  };

  const renderWithAICenterLayout = (content: React.ReactNode) => {
    return (
      <div id="ai-center-grid-layout" className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-fadeIn">
        {/* Left side AI Center menu */}
        <div className="lg:col-span-3 space-y-2 shrink-0">
          <div className="bg-[#121314] text-white rounded-xl p-4 border border-[#2d2e30] mb-3 select-none shadow-md">
            <h3 className="text-xs font-black uppercase tracking-wider text-indigo-400 font-display flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-slate-300 animate-pulse" /> AI 智能中枢
            </h3>
            <p className="text-[10px] text-slate-300 mt-1.5 leading-relaxed font-normal">
              统一调度零售 SaaS 系统的 AI 员工，对齐向量 FAQ 地图知识库与条件执行触发链。
            </p>
          </div>
          
          {[
            { id: 'agents', name: '🤖 AI 员工集群管理', desc: '设定 AI 员工基础 Prompt 与模型配置' },
            { id: 'knowledge', name: '📁 Grounding 知识向量库', desc: '录入/校准向量化 FAQ 本地知识资产' },
            { id: 'visual-workflow', name: '⚙️ 自动业务工作流', desc: '编排触发器、无代码流转以及状态判定' },
            { id: 'ecos-optimizer', name: '⚡ ECOS 算法核准与优化', desc: '企业认知底座八维验证与四维性能优化循环' },
            { id: 'ecos-strategic', name: '🧭 ECOS 企业战略大脑 (OS)', desc: '长期存续红线推演、董事会级一票否决与预算精密资金交割' },
            { id: 'ecos-cognitive', name: '🧠 ECOS 认知治理中枢', desc: '决策冲突裁决、可信度校准与认知状态宪法审查' },
            { id: 'ecos-nervous', name: '⚡ ECOS 主动神经系统', desc: '基于事件、状态、目标驱动的实时商业异常自愈与自主预警' }
          ].map(item => {
            const isSubActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  addLog('Navigation', 'AI中枢跳转', `视图切换到「${item.name}」`, 'info');
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col space-y-1 select-none cursor-pointer group ${
                  isSubActive 
                    ? 'bg-[#07C2E3] border-[#07C2E3] text-[#0b1329] shadow-md font-bold animate-fadeIn' 
                    : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className={`text-xs font-bold leading-none ${isSubActive ? 'text-slate-950 font-black' : 'text-slate-800 group-hover:text-black'}`}>{item.name}</span>
                <span className={`text-[10px] leading-snug font-normal ${isSubActive ? 'text-slate-900/80 font-medium' : 'text-slate-400'}`}>
                  {item.desc}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Right side contents rendering area */}
        <div className="lg:col-span-9 space-y-6">
          {content}
        </div>
      </div>
    );
  };

  const renderWithDeveloperCenterLayout = (content: React.ReactNode) => {
    return (
      <div id="dev-center-grid-layout" className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-fadeIn">
        {/* Left side Developer Center menu */}
        <div className="lg:col-span-3 space-y-2 shrink-0">
          <div className="bg-[#121314] text-white rounded-xl p-4 border border-[#2d2e30] mb-3 select-none shadow-md">
            <h3 className="text-xs font-black uppercase tracking-wider text-teal-400 font-display flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-slate-300" /> 开发者生态接口
            </h3>
            <p className="text-[10px] text-slate-300 mt-1.5 leading-relaxed font-normal">
              管理 API Webhook、连接外部工具代理（MCP）及检索 Shopify 开发指南。
            </p>
          </div>
          
          {[
            { id: 'shopify-docs', name: '🔍 Shopify 开发指南', desc: '检索 Shopify 标准 REST/GraphQL 规格定义' },
            { id: 'doctree', name: '📄 规格设计文档', desc: '追踪多租户零售 SaaS 系统核心设计规格树' },
            { id: 'mcp', name: '🔌 MCP 外部代理数据', desc: '配置中继服务器模型及第三方外部协议网关' },
            { id: 'code-explorer', name: '💻 源码文件管理器', desc: '浏览并排查当前 SaaS 开发分支的实际运行源码' }
          ].map(item => {
            const isSubActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  addLog('Navigation', '开发者中枢跳转', `视图切换到「${item.name}」`, 'info');
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col space-y-1 select-none cursor-pointer group ${
                  isSubActive 
                    ? 'bg-[#0f766e] border-[#0f766e] text-white shadow-md font-bold' 
                    : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className={`text-xs font-bold leading-none ${isSubActive ? 'text-white' : 'text-slate-800 group-hover:text-black'}`}>{item.name}</span>
                <span className={`text-[10px] leading-snug font-normal ${isSubActive ? 'text-teal-100 font-medium' : 'text-slate-400'}`}>
                  {item.desc}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Right side contents rendering area */}
        <div className="lg:col-span-9 space-y-6">
          {content}
        </div>
      </div>
    );
  };

  const renderWithSettingsCenterLayout = (content: React.ReactNode) => {
    return (
      <div id="settings-center-grid-layout" className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-fadeIn">
        {/* Left side Settings Center menu */}
        <div className="lg:col-span-3 space-y-2 shrink-0">
          <div className="bg-[#121314] text-white rounded-xl p-4 border border-[#2d2e30] mb-3 select-none shadow-md">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-display flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-slate-300 animate-spin" style={{ animationDuration: '6s' }} /> 系统参数设置
            </h3>
            <p className="text-[10px] text-slate-300 mt-1.5 leading-relaxed font-normal">
              管理本位币汇率，设置全局主体属性、员工现场出勤考勤，并设定账户矩阵准入限制。
            </p>
          </div>
          
          {[
            { id: 'settings', name: '🏢 常规与常规设置 (Generali & Piano)', desc: '店铺主体属性、欧元预设、当前订阅与账单划扣' },
            { id: 'payments', name: '💳 统一支付与网关 (Pagamenti)', desc: '连接 Stripe, PayPal, Apple Pay, Base USDC 支付网关' },
            { id: 'logistics', name: '🚚 配送与物流后勤 (Spedizione)', desc: '欧盟直发运费、配送区域划分与订单履约跟踪' },
            { id: 'employees', name: '👥 执勤物理员工管理 (Utenti)', desc: '物理门店指纹/面部打卡考勤与实时出勤值班' },
            { id: 'roles', name: '🔐 安全准入与权限 (Permessi)', desc: '各业务模块及多商家租户数据隔离安全配置' },
            { id: 'policies', name: '🛡 欧盟政策与合规 (Informative)', desc: '多国语种选取、GDPR Cookie 拦截与退款服务条款预设' }
          ].map(item => {
            const isSubActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  addLog('Navigation', '系统设置中枢跳转', `设置中枢视图切换至「${item.name}」`, 'info');
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col space-y-1 select-none cursor-pointer group ${
                  isSubActive 
                    ? 'bg-slate-800 border-slate-800 text-white shadow-md font-bold' 
                    : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className={`text-xs font-bold leading-none ${isSubActive ? 'text-white' : 'text-slate-800 group-hover:text-black'}`}>{item.name}</span>
                <span className={`text-[10px] leading-snug font-normal ${isSubActive ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                  {item.desc}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Right side contents rendering area */}
        <div className="lg:col-span-9 space-y-6">
          {content}
        </div>
      </div>
    );
  };

  // Helper lists for the selected industry
  const currentIndustryData = tenantDB[selectedIndustry] || { products: [], orders: [], customers: [], workflows: [], knowledge: [], metrics: [] };
  const industryStats = currentIndustryData.metrics || [];
  const currentIndustryAgents = activeAgents.filter(a => a.id.startsWith(selectedIndustry[0]) || a.id.includes('ceo'));

  // Handler to submit high key
  const saveApiKey = () => {
    if (customApiKey.trim()) {
      setIsApiKeyConnected(true);
      setShowKeyModal(false);
      addLog('System Operator', 'Gemini SDK Key Injected', 'Connected real-time Gemini AI capabilities securely.', 'success');
    }
  };

  // Chat logic with specific AI Agent
  const openChatWithAgent = (agent: AIEmployee) => {
    setChatAgent(agent);
    setActiveTab('agents');
    if (!chatMessages[agent.id]) {
      setChatMessages(prev => ({
        ...prev,
        [agent.id]: [
          { role: 'assistant', content: `Hello! I am **${agent.name}**, your connected **${agent.title}**. ${agent.role}\n\nHow can I help you coordinate our **${selectedIndustry}** operations today?` }
        ]
      }));
    }
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !chatAgent) return;

    const userMsg = chatInput;
    setChatInput('');

    // Append user message
    const thread = [...(chatMessages[chatAgent.id] || []), { role: 'user' as const, content: userMsg }];
    setChatMessages(prev => ({
      ...prev,
      [chatAgent.id]: thread
    }));

    setChatLoading(true);
    addLog('User Command', `Query to ${chatAgent.name}`, userMsg, 'info');

    // Smooth scroll
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 80);

    try {
      const currentStoreCtx = aiRuntimeStore.getContext();
      const liveContext = AIContextService.gatherContext({
        industry: selectedIndustry,
        activeTab: activeTab,
        products: currentIndustryData.products,
        orders: currentIndustryData.orders,
        customers: currentIndustryData.customers,
        selectedProductId: currentStoreCtx.ui?.productId,
        selectedOrderId: currentStoreCtx.ui?.orderId,
        selectedCustomerId: currentStoreCtx.ui?.customerId
      });

      const response = await fetch('/api/gemini/agent-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          agent: chatAgent,
          industry: selectedIndustry,
          products: currentIndustryData.products,
          orders: currentIndustryData.orders,
          metrics: currentIndustryData.metrics,
          aiContext: liveContext,
          messages: thread
        })
      });

      if (!response.ok) {
        throw new Error('Server returned error status');
      }

      const resData = await response.json();
      
      setChatMessages(prev => ({
        ...prev,
        [chatAgent.id]: [...thread, { role: 'assistant', content: resData.text }]
      }));

      // Increment agent metrics counts
      setActiveAgents(prev => prev.map(a => a.id === chatAgent.id ? { ...a, tasksCompleted: a.tasksCompleted + 1 } : a));
      
      addLog(
        chatAgent.name, 
        'Active Response Generated', 
        resData.simulated ? 'Generated simulated advisory (GEMINI_API_KEY pending)' : 'Live Model generation completed.', 
        'success'
      );

    } catch (err: any) {
      console.error(err);
      setChatMessages(prev => ({
        ...prev,
        [chatAgent.id]: [
          ...thread,
          { role: 'assistant', content: `⚠️ **Operational Alert:** I encountered a problem communicating with the SaaS API network core. Please configure the **GEMINI_API_KEY** environment variable in your Secrets panel or provide it in settings.` }
        ]
      }));
      addLog('System Monitor', 'Agent Chat Failed', err.message || 'Network Timeout', 'error');
    } finally {
      setChatLoading(false);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Reorder Item via AI Oliver Procurement Trigger
  const triggerReorderSKU = (sku: string) => {
    const data = tenantDB[selectedIndustry] || { products: [] };
    const item = data.products?.find(p => p.sku === sku);
    if (!item) return;

    addLog('System Action', 'Trigger SKU Reorder', `Sending automatic Materials Request for ${sku}`, 'tool');
    
    // Simulate active agent working on it
    setTimeout(() => {
      // update state
      setTenantDB(prev => {
        const indData = prev[selectedIndustry] || { products: [] };
        const updatedProducts = (indData.products || []).map(p => {
          if (p.sku === sku) {
            return { ...p, stock: p.stock + 60, status: 'In Stock' as const };
          }
          return p;
        });
        return {
          ...prev,
          [selectedIndustry]: {
            ...indData,
            products: updatedProducts
          }
        };
      });

      addLog(
        selectedIndustry === 'retail' || selectedIndustry === 'manufacturing' ? 'Oliver' : 'Stuart', 
        'WMS Stock Replenished', 
        `Triggered supplier webhook. Standard invoice generated. +60 units uploaded to SKU: ${sku}`, 
        'success'
      );
    }, 1200);
  };

  // --- INJECTING AI PRODUCT SOURCING LOGIC ---
  const handleTriggerSourcing = async () => {
    setSourcingLoading(true);
    addLog('System Operator', 'Initiated AI Product Sourcing', `Analyzing market sales and competitor catalog parameters for the ${selectedIndustry} industry.`, 'info');
    
    try {
      const response = await fetch('/api/gemini/source-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          industry: selectedIndustry,
          products: currentIndustryData.products
        })
      });

      if (!response.ok) {
        throw new Error('Failed to capture sourcing advisory');
      }

      const resData = await response.json();
      setSourcingRecommendations(resData.recommendations || []);
      addLog('AI Command Center', 'Market Sourcing Analysis Live', `Retrieved ${resData.recommendations?.length || 0} tailored SKU suggestions using Gemini real-time competitor intelligence.`, 'success');
    } catch (err: any) {
      console.error(err);
      addLog('System Monitor', 'Sourcing API Fault', err.message || 'Server timeout, using simulated catalog intelligence.', 'error');
    } finally {
      setSourcingLoading(false);
    }
  };

  const syncSourcedProduct = (reco: SourcingRecommendation) => {
    // Generate new store SKU item using high fidelity structures
    const newSkuItem: ProductItem = {
      id: 'sourced_' + Date.now(),
      name: reco.name,
      sku: reco.sku,
      stock: 50,
      minStockThreshold: 10,
      price: reco.price,
      sales: 0,
      status: 'In Stock'
    };

    setTenantDB(prev => {
      const indData = prev[selectedIndustry];
      // check duplicate SKU to prevent duplication errors
      if (indData.products.some(p => p.sku === reco.sku)) {
        return prev;
      }
      return {
        ...prev,
        [selectedIndustry]: {
          ...indData,
          products: [newSkuItem, ...indData.products]
        }
      };
    });

    // Mark as synced locally
    setSourcingRecommendations(prev => prev.map(item => item.sku === reco.sku ? { ...item, synced: true } : item));

    addLog(
      'AI Command Center',
      'Catalog SKU Synced',
      `Product "${reco.name}" (${reco.sku}) successfully live-published to active Shopify-style SaaS store at MSRP $${reco.price}.`,
      'success'
    );
  };

  // --- INJECTING VISUAL WORKFLOW CREATOR SIMULATOR ---
  const runVisualWorkflowSimulator = () => {
    if (isVisualRunning) return;

    setIsVisualRunning(true);
    setCurrentVisualIndex(0);
    setVisualWorkflowLogs([`[INIT] Booting visual sandbox workflow-instance-sim.`, `[INIT] Validating connections to ${visualNodes.length} active process nodes.`]);
    addLog('Workflow Engine 2.0', 'Sandbox Simulation Initiated', 'Running interactive flowchart dry run.', 'tool');

    const executeVisualStep = (index: number) => {
      if (index >= visualNodes.length) {
        setTimeout(() => {
          setIsVisualRunning(false);
          setCurrentVisualIndex(-1);
          setVisualWorkflowLogs(prev => [...prev, `[SUCCESS] Visual workflow pipeline compiled with 0 errors. Trigger events registered. Hot-deployed to Shopify SaaS tier successfully.`]);
          addLog('Workflow Engine 2.0', 'Simulator Sandbox Stable', 'Finished dry run cleanly. All event webhooks verified.', 'success');
        }, 1200);
        return;
      }

      setCurrentVisualIndex(index);
      const currentNode = visualNodes[index];
      
      const detailsMap: Record<string, string> = {
        'trigger': `[Captured Workflow Trigger] Customer frontend emitted event '${currentNode.title}'. Spawning automated AI representative task chain.`,
        'ai_decision': `[AI Employee Decision] AI verified database state. Dispatched automated agent to optimize carrier routing and evaluate parcel shipping weight.`,
        'condition': `[Fulfillment Guard Criteria] Evaluating conditions for step '${currentNode.title}'. Status: PASSED. Executing subsequent actions.`,
        'action': `[MCP Webhook Fired] Firing client notification webhook. Sent automated email update to user coordinate. DHL parcel label created.`
      };

      const customDetail = detailsMap[currentNode.type] || `[Executing Node] Complete step logic: "${currentNode.title}" - ${currentNode.details}`;

      setVisualWorkflowLogs(prev => [
        ...prev,
        `[Node ${index + 1}: ${currentNode.title}] ${customDetail}`
      ]);

      setTimeout(() => {
        executeVisualStep(index + 1);
      }, 1500); 
    };

    executeVisualStep(0);
  };

  const addVisualNode = (type: 'trigger' | 'ai_decision' | 'condition' | 'action') => {
    const typesMap = {
      trigger: { title: 'Event Trigger Node', details: 'Fires automatically on predefined storefront conditions.' },
      ai_decision: { title: 'AI Assistant Reasoning Node', details: 'AI processes context using the Gemini API.' },
      condition: { title: 'Conditional Branch Criteria', details: 'SaaS router condition rules (e.g. Risk check limits).' },
      action: { title: 'MCP Webhook Action Dispatcher', details: 'Triggers connected Restful tools and API webhooks.' }
    };
    const newNode: WorkflowNode = {
      id: 'v_' + Date.now(),
      type,
      title: typesMap[type].title,
      status: 'idle',
      details: typesMap[type].details
    };
    setVisualNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    addLog('System Operator', 'Workflow Node Appended', `Added custom ${type.toUpperCase()} node to sandbox designer canvas.`, 'info');
  };

  const deleteVisualNode = (id: string) => {
    if (visualNodes.length <= 1) return;
    setVisualNodes(prev => {
      const remaining = prev.filter(n => n.id !== id);
      setSelectedNodeId(remaining[remaining.length - 1]?.id || null);
      return remaining;
    });
    addLog('System Operator', 'Workflow Node Removed', `Deleted node id: ${id} from sequence.`, 'warning');
  };

  const updateVisualNode = (id: string, fields: Partial<WorkflowNode>) => {
    setVisualNodes(prev => prev.map(n => n.id === id ? { ...n, ...fields } : n));
  };

  const loadPresetWorkflow = (presetName: string) => {
    if (presetName === 'triage') {
      setVisualNodes([
        { id: 'p_1', type: 'trigger', status: 'idle', title: 'Customer Return Requested', details: 'Fires when client requests refunds.' },
        { id: 'p_2', type: 'ai_decision', status: 'idle', title: 'Evaluate Threat and Risk Status', details: 'AI maps fraud risk score heuristics.' },
        { id: 'p_3', type: 'condition', status: 'idle', title: 'If Risk Score < 35%', details: 'Auto routing gate depending on calculated risk.' },
        { id: 'p_4', type: 'action', status: 'idle', title: 'Approve & Create Back-to-stock Label', details: 'Dispatches DHL transit coordinates to client.' }
      ]);
      setSelectedNodeId('p_1');
      addLog('Workflow Engine 2.0', 'Triage Preset Loaded', 'Loaded Return Triage workflow structure into visual canvas.', 'success');
    } else {
      setVisualNodes([
        { id: 'p_a', type: 'trigger', status: 'idle', title: 'Low Inventory Alert Trigger', details: 'Fires when SKU units <= threshold limit.' },
        { id: 'p_b', type: 'ai_decision', status: 'idle', title: 'Determine Distributor Allocation', details: 'Gemini optimizes procurement price quotes.' },
        { id: 'p_c', type: 'condition', status: 'idle', title: 'If Margin Tier > 40%', details: 'Ensures target threshold margins are fully safe.' },
        { id: 'p_d', type: 'action', status: 'idle', title: 'Submit PO Webhook To Supplier', details: 'Fires automatic webhook restock request.' }
      ]);
      setSelectedNodeId('p_a');
      addLog('Workflow Engine 2.0', 'Restock Preset Loaded', 'Loaded Restock & Fulfillment workflow structure into visual canvas.', 'success');
    }
  };

  // Custom visual workflow run execution
  const triggerWorkflowRun = (wf: Workflow) => {
    if (runningWorkflowId) return; // wait till finish

    setRunningWorkflowId(wf.id);
    setCurrentNodeIndex(0);
    setWorkflowLogs([`[21:40] INIT: Starting workflow execution [${wf.name}]...`]);
    addLog('Workflow Engine2.0', 'Sequence Initiated', `Fired flow [${wf.name}]`, 'tool');

    // Chain node steps visual delays
    const executeNode = (index: number) => {
      if (index >= wf.nodes.length) {
        // finished
        setTimeout(() => {
          setRunningWorkflowId(null);
          setCurrentNodeIndex(-1);
          setWorkflowLogs(prev => [...prev, `[21:42] COMPLETED: Flow successfully automated. Core metrics updated.`]);
          
          // Complete business mutation on completion!
          if (wf.id === 'wf_r1') { // Low stock auto procurement
            setTenantDB(prev => {
              const indData = prev.retail;
              const updatedPr = indData.products.map(p => {
                if (p.sku === 'SKU-R189') {
                  return { ...p, stock: 72, status: 'In Stock' as const };
                }
                return p;
              });
              return {
                ...prev,
                retail: { ...indData, products: updatedPr }
              };
            });
            addLog('AI Ops Node', 'Automated PO Dispatched', 'Procured 60 units of SKU-R189 at 35% margin tier.', 'success');
          } else if (wf.id === 'wf_r2') { // Refund threats check
            setTenantDB(prev => {
              const indData = prev.retail;
              const updatedOrders = indData.orders.map(o => {
                if (o.id === '#ORD-9839') {
                  return { ...o, status: 'AI Confirmed' as const, riskScore: 12 }; // mitigated
                }
                return o;
              });
              return {
                ...prev,
                retail: { ...indData, orders: updatedOrders }
              };
            });
            addLog('Customer Care AI', 'Fraud Shield Terminated', 'Verified third-party shipping stamps. Released partial compensation.', 'success');
          } else if (wf.id === 'wf_f1') { // food freshness bundle promoter
            setTenantDB(prev => {
              const indData = prev.food;
              const updatedPr = indData.products.map(p => {
                if (p.sku === 'SKU-F203') { // beef burger
                  return { ...p, price: 18.50, name: 'Premium Wagyu Set (20% Flash discount!)' };
                }
                return p;
              });
              return {
                ...prev,
                food: { ...indData, products: updatedPr }
              };
            });
            addLog('Marketing Automation', 'Campaign Live', 'Injected 20% discount coupon fast-track tags on client app catalog.', 'success');
          } else {
            // General multi-industry template flow completed
            addLog('Automation Engine', 'Workflow Complete', `Execution index logged. Connected MCP APIs safe.`, 'success');
          }
        }, 1000);
        return;
      }

      setCurrentNodeIndex(index);
      const node = wf.nodes[index];
      
      setWorkflowLogs(prev => [
        ...prev,
        `[21:41] EXECUTE [${node.title}]: ${node.details}`
      ]);

      setTimeout(() => {
        executeNode(index + 1);
      }, 1500); // 1.5s per step visualizer
    };

    executeNode(0);
  };

  // Add Product custom
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSKU.trim()) return;

    const newItem: ProductItem = {
      id: 'p_custom_' + Date.now(),
      name: newTitle,
      sku: newSKU.toUpperCase(),
      stock: Number(newStock),
      minStockThreshold: Number(newThreshold),
      price: Number(newPrice),
      sales: 0,
      status: Number(newStock) === 0 ? 'Out of Stock' : (Number(newStock) <= Number(newThreshold) ? 'Low Stock' : 'In Stock')
    };

    setTenantDB(prev => {
      const indData = prev[selectedIndustry];
      return {
        ...prev,
        [selectedIndustry]: {
          ...indData,
          products: [newItem, ...indData.products]
        }
      };
    });

    setNewTitle('');
    setNewSKU('');
    setNewStock(50);
    setNewThreshold(10);
    setNewPrice(29.99);
    setShowAddProduct(false);

    addLog('Tenant ERP System', 'New SKU Created', `Successfully synchronized item ${newItem.sku} with catalog databases.`, 'success');
  };

  const handleBulkRestockComp = (sku: string, amount: number) => {
    setTenantDB(prev => {
      const indData = prev[selectedIndustry];
      const updatedProducts = indData.products.map(p => {
        if (p.sku === sku) {
          const nextStock = p.stock + amount;
          return { 
            ...p, 
            stock: nextStock, 
            status: nextStock === 0 ? 'Out of Stock' as const : (nextStock <= p.minStockThreshold ? 'Low Stock' as const : 'In Stock' as const)
          };
        }
        return p;
      });
      const nextDB = {
        ...prev,
        [selectedIndustry]: {
          ...indData,
          products: updatedProducts
        }
      };
      
      // Update dbEngine local database too for double-binding integrity
      try {
        const localProds = dbEngine.products.getAll();
        const pMatch = localProds.find(p => p.sku === sku);
        if (pMatch) {
          const nextInventory = (pMatch.inventory || 0) + amount;
          dbEngine.products.update(pMatch.id, {
            inventory: nextInventory
          });
        }
      } catch (dbErr) {
        console.warn("dbEngine sync warning inside handler:", dbErr);
      }

      // Closure Loop: Physical persistent save to Node backend
      persistDatabaseState(tenants, nextDB);
      return nextDB;
    });
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: any) => {
    setTenantDB(prev => {
      const indData = prev[selectedIndustry];
      const updatedOrders = indData.orders.map(o => {
        if (o.id === orderId) {
          return { ...o, status: newStatus };
        }
        return o;
      });
      const nextDB = {
        ...prev,
        [selectedIndustry]: {
          ...indData,
          orders: updatedOrders
        }
      };

      try {
        dbEngine.orders.updateStatus(orderId, newStatus, newStatus === 'Paid' ? 'Paid' : 'Unpaid');
      } catch (dbErr) {
        console.warn("dbEngine order sync warning inside handler:", dbErr);
      }

      // Closure Loop: Physical persistent save to Node backend
      persistDatabaseState(tenants, nextDB);
      return nextDB;
    });
  };

  const handleAddNewProductComp = (name: string, sku: string, price: number, stock: number) => {
    const newProduct: ProductItem = {
      id: 'prod_' + Date.now(),
      name,
      sku: sku.toUpperCase(),
      stock,
      minStockThreshold: 10,
      price,
      sales: 0,
      status: stock === 0 ? 'Out of Stock' as const : (stock <= 10 ? 'Low Stock' as const : 'In Stock' as const)
    };
    setTenantDB(prev => {
      const indData = prev[selectedIndustry];
      const nextDB = {
        ...prev,
        [selectedIndustry]: {
          ...indData,
          products: [newProduct, ...indData.products]
        }
      };

      try {
        dbEngine.products.create({
          storeId: 'store_' + selectedIndustry,
          name,
          description: '',
          price,
          inventory: stock,
          sku: sku.toUpperCase()
        });
      } catch (dbErr) {
        console.warn("dbEngine product create sync warning inside handler:", dbErr);
      }

      // Closure Loop: Physical persistent save to Node backend
      persistDatabaseState(tenants, nextDB);
      return nextDB;
    });
  };

  // Create Knowledge Core Base Document
  const handleAddKnowledgeDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim() || !newDocContent.trim()) return;

    const newDoc: KnowledgeDoc = {
      id: 'kd_custom_' + Date.now(),
      title: newDocTitle,
      category: newDocCategory || 'General',
      content: newDocContent,
      size: `${(newDocContent.length / 1024).toFixed(1)} KB`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setTenantDB(prev => {
      const indData = prev[selectedIndustry];
      return {
        ...prev,
        [selectedIndustry]: {
          ...indData,
          knowledge: [newDoc, ...indData.knowledge]
        }
      };
    });

    setNewDocTitle('');
    setNewDocCategory('');
    setNewDocContent('');
    setShowAddDoc(false);

    addLog('RAG Knowledge Core', 'Document Indexed', `Parsed: ${newDoc.title}. Encoded 15 chunks under RAG database indexing schema.`, 'success');
  };

  // Admin Manual Audit Action on high-risk refunds
  const triggerOrderAudit = (orderId: string) => {
    addLog('AI Audit Coordinator', 'Order Inspection Fired', `Performing active SLA audit with parcel courier for Order ${orderId}`, 'info');
    
    // Simulate active agent auditing couriers
    setTimeout(() => {
      setTenantDB(prev => {
        const indData = prev[selectedIndustry];
        const updatedOrders = indData.orders.map(o => {
          if (o.id === orderId) {
            return { ...o, status: 'AI Confirmed' as const, riskScore: 5 }; // audited and safe
          }
          return o;
        });
        return {
          ...prev,
          [selectedIndustry]: {
            ...indData,
            orders: updatedOrders
          }
        };
      });
      addLog('AI Risk Core', 'Refund Claim Approved', `Courier digital coordinate matched customer zip. Verified risk clear. Issued order status update.`, 'success');
    }, 1500);
  };

  // MCP Connected Toggles
  const toggleMcpTool = (id: string) => {
    setMcpTools(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'connected' ? 'disconnected' : 'connected';
        addLog(
          'MCP Registry', 
          nextStatus === 'connected' ? 'Tool Connected' : 'Tool Suspended', 
          `Registered system API capability: [${t.name}]`, 
          nextStatus === 'connected' ? 'success' : 'warning'
        );
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  // App Marketplace: Install new extension
  const installMarketpack = (item: AppMarketItem) => {
    setMarketItems(prev => prev.map(m => m.id === item.id ? { ...m, installed: true } : m));
    
    // Create new corresponding AI Agent employee context inside active pool!
    const emojiMap: Record<string, string> = { Sparkles: '🧙‍♂️', Shuffle: '🚀', Scale: '⚖️', BookOpen: '📚', Workflow: '🔄' };
    const customAgent: AIEmployee = {
      id: `${selectedIndustry}_custom_${item.id}`,
      name: item.name.split(' ').slice(0, 2).join(' '),
      title: item.name,
      role: item.description,
      status: 'Idle',
      emoji: emojiMap[item.icon] || '🧩',
      description: item.description,
      capabilities: ['Dynamic marketplace tasking', 'Extension context override'],
      systemPrompt: `You are the specialized extension agent: ${item.name}. Adopt an elite advisory style for SaaS platforms. Prioritize profitability.`,
      model: 'gemini-3.5-flash',
      tasksCompleted: 4
    };

    setActiveAgents(prev => [...prev, customAgent]);
    addLog('App Marketplace', 'Enterprise Component Deployed', `Successfully provisioned ${item.name} into Tenant workspace. Active agent fleet scaled.`, 'success');
  };

  // Trigger quick decision suggestions by AI CEO
  const executeStrategicDecision = (scenario: string) => {
    addLog('AI Command Center', 'Execute Strategic Recommendation', `Applying dynamic operational adjustments for: ${scenario}`, 'tool');
    
    setTimeout(() => {
      if (scenario.includes('TikTok') || scenario.includes('Ads')) {
        // Boost metrics
        setTenantDB(prev => {
          const indData = prev[selectedIndustry];
          const updatedM = indData.metrics.map(m => {
            if (m.name.includes('GMV') || m.name.includes('Revenue')) {
              return { ...m, value: '$14,840.00', change: '+22.4% Dynamic Boost!' };
            }
            return m;
          });
          return {
            ...prev,
            [selectedIndustry]: { ...indData, metrics: updatedM }
          };
        });
        addLog('Marketing Automation', 'Ad Budget Scaled', 'Scaled Meta CPC bidding threshold matching our high-ROI time interval.', 'success');
      } else if (scenario.includes('TikTok') || scenario.includes('Wagyu') || scenario.includes('fries') || scenario.includes('Promo')) {
        // Boost burger sales
        setTenantDB(prev => {
          const indData = prev.food;
          const updatedP = indData.products.map(p => {
            if (p.sku === 'SKU-F203') {
              return { ...p, stock: p.stock - 22, sales: p.sales + 42 }; // simulated sales spike
            }
            return p;
          });
          return {
            ...prev,
            food: { ...indData, products: updatedP }
          };
        });
        addLog('AI Sales Booster', 'Bundle Offer Deployed', 'Dormant subscriber channels cleared. Sold 22 expiring Wagyu premium sets.', 'success');
      } else {
        // Generic reorder SKU auto
        const data = tenantDB[selectedIndustry] || { products: [] };
        const lowStock = (data.products || []).find(p => p.stock <= p.minStockThreshold);
        if (lowStock) {
          triggerReorderSKU(lowStock.sku);
        } else {
          addLog('AI Automation Node', 'Task Delegated', 'Core database healthy. Continued standard SLA metrics monitoring.', 'info');
        }
      }
    }, 1200);
  };

  const handleStorefrontPurchase = (productId: string) => {
    setTenantDB(prev => {
      const currentData = prev[selectedIndustry] || { products: [], orders: [] };
      const product = (currentData.products || []).find(p => p.id === productId);
      if (!product || product.stock <= 0) return prev;

      const updatedProducts = (currentData.products || []).map(p => {
        if (p.id === productId) {
          const newStock = p.stock - 1;
          const status = newStock <= 0 ? 'Out of Stock' : (newStock <= p.minStockThreshold ? 'Low Stock' : 'In Stock');
          return { ...p, stock: newStock, sales: p.sales + 1, status };
        }
        return p;
      });

      const customerNames = ["王丽静", "张晨星", "李佳豪", "陈佳莹", "孙志远", "赵雨婷", "Alex Johnson", "Sarah Connor"];
      const customerContacts = ["138****9928", "139****8502", "150****3310", "186****7721", "alex@johnson.dev", "sarah@connor.io"];
      const randomName = customerNames[Math.floor(Math.random() * customerNames.length)];
      const randomContact = customerContacts[Math.floor(Math.random() * customerContacts.length)];
      const orderId = `ORD-${Date.now().toString().slice(-4)}`;

      const newOrder: OrderItem = {
        id: orderId,
        customerName: randomName,
        contact: randomContact,
        total: product.price,
        status: 'Pending',
        createdAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        riskScore: Math.floor(Math.random() * 30) + 5
      };

      const updatedOrders = [newOrder, ...(currentData.orders || [])];

      setTimeout(() => {
        addLog(
          'AI Operations', 
          '在线商店新订单', 
          `在线零售商店接收新订单 ${orderId}，用户 [${randomName}] 成功支付了 ${product.name} $${product.price}，扣减本地库存1件，现存 ${product.stock - 1}件。AI 审计风控中。`, 
          'success'
        );
      }, 300);

      return {
        ...prev,
        [selectedIndustry]: {
          ...currentData,
          products: updatedProducts,
          orders: updatedOrders
        }
      };
    });
  };

  const renderMainContent = () => {
    if (viewMode === 'landing') {
      return (
        <HomePage 
          onNavigate={(page) => {
            if (page === 'home') setViewMode('landing');
            else if (page === 'register') setViewMode('register');
            else if (page === 'login') setViewMode('login');
          }}
          onQuickBypass={async (targetMode: 'merchant' | 'super_admin') => {
            try {
              const user = await quickBypassLogin();
              setAdminMode(targetMode);
              setViewMode('app');
              showToast(`开发免签通道已开启：已作为测试管理员进入${targetMode === 'merchant' ? '【商家端后台】' : '【平台总后台】'}`, 'success');
            } catch (err: any) {
              showToast(`快捷穿梭失败: ${err.message || err}`, 'error');
            }
          }}
        />
      );
    }

    if (viewMode === 'register') {
      return (
        <RegisterPage 
          onNavigate={(page) => {
            if (page === 'home') setViewMode('landing');
            else if (page === 'register') setViewMode('register');
            else if (page === 'login') setViewMode('login');
          }}
          onShowToast={showToast}
        />
      );
    }

    if (viewMode === 'login') {
      return (
        <LoginPage 
          onNavigate={(page) => {
            if (page === 'home') setViewMode('landing');
            else if (page === 'register') setViewMode('register');
            else if (page === 'login') setViewMode('login');
          }}
          onShowToast={showToast}
        />
      );
    }

    if (viewMode === 'industry') {
      return (
        <IndustryPage 
          onBack={() => setViewMode('register')}
          onSelect={(ind) => {
            setSelectedIndustry(ind);
            setViewMode('config');
            addLog(
              'AI Command Center',
              'Industry Selected',
              `User selected industry track: [${ind.toUpperCase()}]. Loading customized industry-specific schemas & workspace templates.`,
              'info'
            );
          }}
        />
      );
    }

    if (viewMode === 'config') {
      return (
        <ConfigPage 
          onBack={() => setViewMode('industry')}
          onComplete={(data) => {
            setCompanyName(data.workspaceName);
            if (data.customIndustry) {
              setSelectedIndustry(data.customIndustry);
              
              setTenantDB(prev => {
                const ind = data.customIndustry!;
                return {
                  ...prev,
                  [ind]: {
                    ...prev[ind],
                    products: data.negotiatedProducts || prev[ind].products,
                    metrics: data.customMetrics || prev[ind].metrics,
                    knowledge: data.customKnowledge || prev[ind].knowledge
                  }
                };
              });

              setTenants(prev => {
                return prev.map(t => {
                  if (t.id === `t_${data.customIndustry}`) {
                    return {
                      ...t,
                      companyName: data.workspaceName,
                      storeName: `${data.workspaceName}总店`,
                      aiBudget: data.customBudget || t.aiBudget
                    };
                  }
                  return t;
                });
              });

              setAuditLogs(prev => [
                {
                  id: `AL_AUTO_${Date.now()}`,
                  tenantId: `t_${data.customIndustry}`,
                  userId: 'System Orchestrator',
                  action: 'ONE_SENTENCE_MAS_PROVISION',
                  resourceType: 'workspace',
                  resourceId: data.workspaceName,
                  beforeJson: '{"status": "none"}',
                  afterJson: JSON.stringify({ name: data.workspaceName, productsCount: data.negotiatedProducts?.length || 0 }),
                  createdAt: new Date().toISOString()
                },
                ...prev
              ]);
            }

            setViewMode('provisioning');
            addLog(
              'AI Command Center',
              'Workspace Configured',
              `Saved configurations for and initiated container workspace "${data.workspaceName}" for channels: [${data.channels.join(', ')}].`,
              'success'
            );
          }}
        />
      );
    }

    if (viewMode === 'provisioning') {
      const industryLabels: Record<IndustryType, string> = {
        retail: '新零售门店',
        food: '餐饮服务',
        manufacturing: '制造加工',
        service: '生活服务',
        education: '在线教育',
        healthcare: '医疗健康',
        fashion_wholesale: '服装设计批发系统',
        restaurant_takeout: '餐馆外卖系统',
        general_merch_electronics: '百货电器系统',
        beauty_booking: '美容预约系统',
        ecommerce_store: '电商网店系统',
        pos_retail: 'POS门店系统'
      };
      return (
        <ProvisioningPage 
          workspaceName={companyName}
          industryName={industryLabels[selectedIndustry] || selectedIndustry}
          onFinished={() => {
            setIsOnboarding(false);
            setViewMode('app');
          }}
        />
      );
    }

    if (adminMode === 'super_admin') {
      return (
        <div id="saas-platform-root" className="flex h-screen w-full bg-[#030303] text-slate-200 overflow-hidden font-sans">
          
          <aside id="saas-sidebar" className="w-64 bg-[#09090b] text-[#f4f4f5] flex flex-col border-r border-zinc-800/80 shrink-0 select-none">
            
            <div id="sidebar-header" className="p-4 flex items-center justify-between border-b border-zinc-800/80 bg-[#020202]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#07C2E3] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(7,194,227,0.3)] font-bold text-slate-950 text-sm">A</div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold tracking-tight text-white text-sm leading-none font-display">SaaS Admin</span>
                    <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 bg-[#07C2E3]/20 text-[#07C2E3] rounded border border-[#07C2E3]/35 leading-none">Super</span>
                  </div>
                  <span className="text-[9px] text-[#a4a4ab] font-semibold uppercase tracking-wider mt-0.5">Enterprise Brain</span>
                </div>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded leading-none bg-[#07C2E3]/15 text-[#07C2E3] border border-[#07C2E3]/25">
                总后台中心
              </span>
            </div>

            <nav id="sidebar-nav" className="flex-1 p-2 space-y-1 overflow-y-auto">
              <div className="px-3 py-1.5 text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                Core Platform Domains
              </div>
              {[
                { id: 'admin_stats', name: '📊 平台控制中心', icon: BarChart3 },
                { id: 'admin_tenants', name: '👥 租户中心', icon: Users },
                { id: 'admin_query', name: '🔍 数据查询中心', icon: Search },
                { id: 'admin_gateways', name: '💳 支付中心', icon: CreditCard },
                { id: 'admin_ai_ops', name: '🧠 AI大脑中心', icon: Bot },
                { id: 'admin_roles', name: '🔐 权限中心', icon: Scale },
                { id: 'admin_system', name: '📜 审计中心', icon: FileText },
                { id: 'admin_diagnostics', name: '🩺 系统诊断中心', icon: Activity },
                { id: 'admin_settings', name: '⚙️ 平台设置中心', icon: Settings },
              ].map((menu) => {
                const IconComponent = menu.icon;
                const isActive = activeTab === menu.id;

                return (
                  <button
                    key={menu.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(menu.id);
                      addLog('Platform Admin Center', '切换视图', `切换至总后台「${menu.name}」控制面板`, 'info');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-xs font-medium h-9 transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-zinc-900 border border-zinc-800 text-[#07C2E3] font-bold shadow-inner' 
                        : 'hover:bg-zinc-900/60 hover:text-zinc-100 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-left font-sans">
                      <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-[#07C2E3]' : 'text-zinc-500'}`} />
                      <span>{menu.name}</span>
                    </div>
                  </button>
                );
              })}
            </nav>

            <div id="sidebar-bottom" className="p-3 border-t border-zinc-800 bg-[#020202]/80 space-y-1 text-[10px] font-mono text-zinc-500">
              <div className="flex items-center justify-between">
                <span>Cluster State</span>
                <span className="text-emerald-400">● Online</span>
              </div>
              <div className="flex items-center justify-between text-[9px] text-zinc-600">
                <span>ECOS Kernel</span>
                <span>v8.4.12-pro</span>
              </div>
            </div>
          </aside>

          <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#0c0c0e]">
            
            <header className="h-16 bg-[#040406]/95 border-b border-zinc-800 flex items-center justify-between px-8 relative z-10 shrink-0">
              <div className="flex items-center gap-3">
                <span className="p-1 px-2 rounded bg-zinc-900 text-[#07C2E3] text-[10px] font-mono font-bold uppercase tracking-wider border border-zinc-800">
                  Secure Terminal
                </span>
                <h1 className="text-sm font-black text-white font-display uppercase tracking-wider">
                  🦾 平台公有超级大脑控制台 / Super Admin Center
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs bg-zinc-900 border border-zinc-800 p-1.5 px-3 rounded-lg text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Super Admin:</span>
                  <span className="font-mono text-white text-[10px] font-bold">{currentUser?.displayName || 'Admin'}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('ECOS_TOGGLE_ADMIN_MODE_TRIGGER'));
                  }}
                  className="bg-[#07C2E3]/15 hover:bg-[#07C2E3]/30 text-[#07C2E3] border border-[#07C2E3]/40 text-[10px] font-bold px-3.5 py-1.5 rounded-md cursor-pointer transition-all active:scale-95 font-sans flex items-center gap-1.5 shadow-[0_0_10px_rgba(7,194,227,0.1)]"
                >
                  <span className="text-[12px]">👕</span>
                  <span>切到商家工作台</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    addLog('Platform Admin Center', 'Session Closed', '管理员已安全退出。', 'info');
                  }}
                  className="bg-rose-950/40 hover:bg-rose-900/60 text-rose-450 border border-rose-900/30 text-[10px] font-bold px-3 py-1.5 rounded-md cursor-pointer transition-all active:scale-95 font-sans"
                >
                  安全注销登出
                </button>
              </div>
            </header>

            <div id="saas-workspace" className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 bg-[#030305] text-slate-100 font-sans">
              <SuperAdminCenter
                tenantDB={tenantDB}
                activeSubTab={(() => {
                  switch (activeTab) {
                    case 'admin_stats': return 'stats';
                    case 'admin_tenants': return 'tenants';
                    case 'admin_query': return 'query';
                    case 'admin_gateways': return 'gateways';
                    case 'admin_ai_ops': return 'ai-ops';
                    case 'admin_roles': return 'roles';
                    case 'admin_system': return 'logs';
                    case 'admin_diagnostics': return 'diagnostics';
                    case 'admin_settings': return 'settings';
                    default: return 'stats';
                  }
                })()}
                tenants={tenants}
                onUpdateTenantStatus={(tenantId, status) => {
                  setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, status } : t));
                  addLog('Platform Admin Center', '租户状态更新', `更新租户ID: ${tenantId} 的状态为 ${status === 'active' ? '激活' : '冻结'}`, 'warning');
                }}
                onUpdateTenantAiBudget={(tenantId, budget) => {
                  setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, aiBudget: budget } : t));
                  addLog('Platform Admin Center', '租户自动化额度调配', `更新租户ID: ${tenantId} 的最大自动调度预算上限为 $${budget}`, 'success');
                }}
                marketItems={marketItems}
                onAddMarketItem={(newItem) => {
                  setMarketItems(prev => [newItem, ...prev]);
                }}
                globalDefaultModel={globalDefaultModel}
                onChangeGlobalModel={(model) => {
                  setGlobalDefaultModel(model);
                }}
                onChangeSubTab={(subTab) => {
                  const tabMapping: Record<string, string> = {
                    'stats': 'admin_stats',
                    'tenants': 'admin_tenants',
                    'query': 'admin_query',
                    'gateways': 'admin_gateways',
                    'ai-ops': 'admin_ai_ops',
                    'roles': 'admin_roles',
                    'logs': 'admin_system',
                    'diagnostics': 'admin_diagnostics',
                    'settings': 'admin_settings'
                  };
                  const targetTab = tabMapping[subTab];
                  if (targetTab) {
                    setActiveTab(targetTab);
                  }
                }}
                onAddSystemLog={(module, action, details, type) => addLog(`[Admin] ${module}`, action, details, type)} 
                activeAgents={activeAgents} 
                onUpdateAgents={setActiveAgents}
                auditLogs={auditLogs}
                setAuditLogs={setAuditLogs}
                agentRuns={agentRuns}
                setAgentRuns={setAgentRuns}
                agentTasks={agentTasks}
                setAgentTasks={setAgentTasks}
                onSwitchTab={(tabId) => {
                  if (tabId.startsWith('admin_')) {
                    setActiveTab(tabId);
                  } else {
                    setAdminMode('merchant');
                    setActiveTab(tabId);
                    addLog('System Teleportation', 'Seamless Routing Executed', `Switched workspace mode to merchant and teleported to "${tabId}" view successfully.`, 'success');
                  }
                }}
              />
            </div>
          </main>

        </div>
      );
    }

    return (
      <MerchantAdminLayout 
        onToggleAdminMode={() => {
          setAdminMode(prev => {
            const nextMode = prev === 'merchant' ? 'super_admin' : 'merchant';
            try {
              localStorage.setItem('ecos_admin_mode', nextMode);
            } catch (e) {
              console.warn("localStorage.setItem is blocked or sandboxed:", e);
            }
            setActiveTab(nextMode === 'merchant' ? 'command' : 'admin_stats');
            window.dispatchEvent(new CustomEvent('ECOS_ADMIN_MODE_CHANGED', { detail: nextMode }));
            setTimeout(() => {
              addLog('Developer Decoupler', '沙盒环境无缝穿越', `开发人员穿越：已从 [${prev === 'merchant' ? '商家端' : '总控端'}] 安全热跳至 [${nextMode === 'merchant' ? '商家端' : '总控端'}]`, 'warning');
            }, 50);
            return nextMode;
          });
        }} 
      />
    );
  };

  return (
    <>
      {renderMainContent()}

      {/* Unified Global Dev Mode Environment Bridge - Secure Sandbox Teleportation Tunnel */}
      <div className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2 bg-slate-950/95 hover:bg-slate-900 text-white text-[11px] px-3.5 py-2.5 rounded-full border border-cyan-500/40 shadow-2xl backdrop-blur-md transition-all select-none font-sans">
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
        <span className="font-mono text-zinc-500">Dev Bridge:</span>
        <span className="font-black text-white tracking-tight">
          {viewMode !== 'app' ? '系统尚未就绪 (请登入)' : (adminMode === 'merchant' ? 'SaaS 商家工作台 👕' : 'SaaS 平台总后台 🦾')}
        </span>
        <div className="w-px h-3 bg-zinc-800 mx-1" />
        <button
          type="button"
          onClick={async () => {
            // If they are not logged in/onboarded, bypass first!
            if (!currentUser || viewMode !== 'app') {
              try {
                await quickBypassLogin();
              } catch (e) {}
              setViewMode('app');
            }
            window.dispatchEvent(new CustomEvent('ECOS_TOGGLE_ADMIN_MODE_TRIGGER'));
          }}
          className="px-2.5 py-1.5 bg-[#07C2E3]/20 hover:bg-[#07C2E3] hover:text-slate-950 text-[#07C2E3] font-extrabold rounded-full transition-all duration-200 active:scale-95 leading-none text-[10px] cursor-pointer"
        >
          双向闪切系统 ⚡
        </button>
      </div>

      {toast && (
        <div id="toast-notification" className={`fixed top-4 right-4 z-[99999] px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fadeIn border text-xs font-semibold ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-250' :
          toast.type === 'error' ? 'bg-rose-50 text-rose-850 border-rose-200' :
          'bg-blue-50 text-slate-800 border-slate-200'
        }`}>
          <span>{toast.message}</span>
        </div>
      )}
    </>
  );
}
