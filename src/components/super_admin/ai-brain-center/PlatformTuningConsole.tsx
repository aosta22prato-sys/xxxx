import React, { useState, useEffect } from 'react';
import { 
  Sliders, Plus, Sparkles, Database, Play, Check, AlertTriangle, 
  Trash2, Brain, BarChart2, Activity, Settings, RefreshCw, Layers,
  ChevronRight, ArrowRight, MessageSquare, Download, CheckCircle, Flame,
  Cpu, Globe, Shield, History, Network, Zap, GitPullRequest, ArrowUpRight, CheckSquare, Edit3
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import LoraTrainingMonitor from './LoraTrainingMonitor';

interface DatasetItem {
  id: string;
  instruction: string;
  input: string;
  output: string;
  category: string;
  createdAt: string;
}

interface TuningJob {
  id: string;
  baseModel: string;
  datasetSize: number;
  epochs: number;
  lr: string;
  rank: number;
  alpha: number;
  status: 'idle' | 'running' | 'completed' | 'failed';
  progress: number;
  currentStep: number;
  totalSteps: number;
  currentLoss: number;
  startedAt?: string;
  completedAt?: string;
  lossHistory: Array<{ step: number; loss: number; valLoss: number }>;
}

interface LoRAModel {
  id: string;
  name: string;
  baseModel: string;
  rank: number;
  epochs: number;
  loss: number;
  accuracy: number;
  status: 'active' | 'inactive';
  createdAt: string;
  datasetSize: number;
}

// 6 Core Advanced Module types
interface ModelHubItem {
  id: string;
  name: string;
  type: 'base' | 'expert' | 'lora';
  vramRequired: string;
  size: string;
  accuracy: number;
  status: 'deployed' | 'standby' | 'rollbacked' | 'gray';
  grayWeight?: number; // percentage of gray traffic
  desc: string;
  updatedAt: string;
}

interface IngestedData {
  id: string;
  source: string;
  recordsCount: number;
  qualityScore: number;
  status: 'synced' | 'pending_extraction' | 'synthesized';
  lastIngested: string;
}

interface ContinualQuery {
  id: string;
  rawQuery: string;
  tokensCount: number;
  anonymized: boolean;
  audited: boolean;
  category: string;
  actionTaken: 'pending' | 'injected' | 'ignored';
  predictedOutput: string;
}

interface EvalSuiteMetric {
  subject: string;
  baseModelScore: number;
  modaGPTScore: number;
  fullMark: number;
}

interface SystemPromptTemplate {
  id: string;
  title: string;
  role: string;
  version: string;
  isActive: boolean;
  content: string;
}

export default function PlatformTuningConsole() {
  const [activeSubTab, setActiveSubTab] = useState<'models' | 'dataset' | 'data-engine' | 'continual' | 'train' | 'eval' | 'prompt' | 'monitor' | 'playground'>('models');
  
  // Datasets state
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [newInst, setNewInst] = useState('');
  const [newInput, setNewInput] = useState('');
  const [newOutput, setNewOutput] = useState('');
  const [newCategory, setNewCategory] = useState('Fashion AI');
  const [isAddingDataset, setIsAddingDataset] = useState(false);
  const [importingFromLogs, setImportingFromLogs] = useState(false);

  // Hyperparameters
  const [baseModel, setBaseModel] = useState('gemini-3.5-flash');
  const [epochs, setEpochs] = useState(3);
  const [learningRate, setLearningRate] = useState('2e-4');
  const [loraRank, setLoraRank] = useState(16);
  const [loraAlpha, setLoraAlpha] = useState(32);
  const [targetModules, setTargetModules] = useState(['q_proj', 'v_proj']);

  // Jobs state
  const [jobs, setJobs] = useState<TuningJob[]>([]);
  const [currentJob, setCurrentJob] = useState<TuningJob | null>(null);

  // Models state (LoRA weights)
  const [models, setModels] = useState<LoRAModel[]>([]);

  // Playground tester state
  const [testMessage, setTestMessage] = useState('');
  const [testResults, setTestResults] = useState<{
    baseOutput: string;
    loraOutput: string;
    loading: boolean;
    activeLoRAName: string;
  } | null>(null);

  // ============================================================
  // 6 Advanced Modules States & Mock Data
  // ============================================================

  // ① Model Hub State
  const [modelHubList, setModelHubList] = useState<ModelHubItem[]>([
    { id: 'm-01', name: 'ModaGPT-Base-13B', type: 'base', vramRequired: '26GB', size: '13B params', accuracy: 0.892, status: 'deployed', desc: '全能基座模型，融合了中、法、意多国快时尚海量语料。', updatedAt: '2026-06-15 14:00' },
    { id: 'm-02', name: 'ModaGPT-Fashion-Expert', type: 'expert', vramRequired: '16GB', size: '7B params', accuracy: 0.941, status: 'deployed', desc: '服装创意垂直模型。主导面料分析、版型建议、AI 尺码换算、图案及印花排版生成建议。', updatedAt: '2026-06-20 18:30' },
    { id: 'm-03', name: 'ModaGPT-Commerce-Architect', type: 'expert', vramRequired: '16GB', size: '7B params', accuracy: 0.958, status: 'deployed', desc: 'Shopify自动化建店与详情页生成模型。高转化率营销对焦。', updatedAt: '2026-06-22 10:15' },
    { id: 'm-04', name: 'ModaGPT-ERP-Dispatch', type: 'expert', vramRequired: '8GB', size: '3B params', accuracy: 0.925, status: 'standby', desc: '采购动销、多式联运调拨、物流延迟与保税仓调配策略引擎。', updatedAt: '2026-06-25 09:40' },
    { id: 'm-05', name: 'ModaGPT-Vision-Lookbook', type: 'expert', vramRequired: '40GB', size: 'VL 13B params', accuracy: 0.912, status: 'deployed', desc: '多模态看图视觉大模型，负责去除衣服背景、真人模特自适应换装、 Lookbook 生成。', updatedAt: '2026-06-28 15:20' },
    { id: 'm-06', name: 'ModaGPT-Marketing-ROI', type: 'expert', vramRequired: '8GB', size: '3B params', accuracy: 0.934, status: 'deployed', desc: 'TikTok/Facebook 广告自动创意文案生成与精准多渠道人群对位投放。', updatedAt: '2026-06-29 11:11' },
  ]);

  // ② Data Engine State
  const [ingestedSources, setIngestedSources] = useState<IngestedData[]>([
    { id: 'de-1', source: 'Shopify Merchants Real Catalog', recordsCount: 42100, qualityScore: 98.2, status: 'synced', lastIngested: '2026-07-02 23:50' },
    { id: 'de-2', source: 'Zalando DE Spring/Summer Apparel List', recordsCount: 85000, qualityScore: 94.5, status: 'synced', lastIngested: '2026-07-03 01:20' },
    { id: 'de-3', source: 'SHEIN / Temu Top-Selling Catalog', recordsCount: 156000, qualityScore: 91.0, status: 'synced', lastIngested: '2026-07-03 04:40' },
    { id: 'de-4', source: 'Instagram / Pinterest Fashion Trends Insights', recordsCount: 12000, qualityScore: 89.5, status: 'pending_extraction', lastIngested: '2026-07-03 07:10' },
    { id: 'de-5', source: 'Vogue & WGSN Summer Style Forecast Reports', recordsCount: 1500, qualityScore: 96.8, status: 'pending_extraction', lastIngested: '2026-07-03 08:30' },
  ]);
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlLogs, setCrawlLogs] = useState<string[]>([]);

  // ③ Continual Learning State
  const [continualQueries, setContinualQueries] = useState<ContinualQuery[]>([
    { id: 'cq-1', rawQuery: 'Zara新一季夏季连衣裙的版型对身材有挑剔吗？帮我转换成德国尺码系统。', tokensCount: 128, anonymized: true, audited: true, category: 'Fashion AI', actionTaken: 'injected', predictedOutput: '建议将德国DINT尺码的中码(M码)胸围适当加宽，以迎合德国本地客群身型特征。' },
    { id: 'cq-2', rawQuery: '我想建立一个主打北欧极简沙滩装的品牌，需要自动生成自适应中英德三语详情页。', tokensCount: 210, anonymized: true, audited: true, category: 'Commerce AI', actionTaken: 'injected', predictedOutput: '自动开启Commerce AI大模型模板。英文: Sand Minimalist Wear; 德文: Minimalistische Sandkleidung. 三语一键生成。' },
    { id: 'cq-3', rawQuery: '为什么我们米兰分仓的夏季沙滩裤一直发不出货，海关卡在法国保税区了吗？', tokensCount: 185, anonymized: true, audited: false, category: 'Business AI', actionTaken: 'pending', predictedOutput: '检测到法国保税仓调拨单被卡，海关VAT OSS注册缺漏。建议超级管理员介入。' },
    { id: 'cq-4', rawQuery: '如何编写用于投放TikTok短视频和Facebook Feed的高点击率夏季薄纱女装广告？', tokensCount: 195, anonymized: true, audited: false, category: 'Marketing AI', actionTaken: 'pending', predictedOutput: '自动匹配高ROI时尚痛点词: 轻盈、透气、Sommer-Chic. 广告生成就绪。' },
  ]);

  // ④ Evaluation Center State
  const [evalProgress, setEvalProgress] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalLogs, setEvalLogs] = useState<string[]>([]);
  const [evalMetrics, setEvalMetrics] = useState<EvalSuiteMetric[]>([
    { subject: 'Fashion Design (服装设计能力)', baseModelScore: 62, modaGPTScore: 94, fullMark: 100 },
    { subject: 'Commerce SFT (一键建店/装修)', baseModelScore: 58, modaGPTScore: 96, fullMark: 100 },
    { subject: 'ERP Dispatch (供应链/调配)', baseModelScore: 45, modaGPTScore: 92, fullMark: 100 },
    { subject: 'Multilingual (跨国多语言翻译)', baseModelScore: 70, modaGPTScore: 91, fullMark: 100 },
    { subject: 'Reasoning (决策自愈与贝叶斯)', baseModelScore: 64, modaGPTScore: 88, fullMark: 100 },
    { subject: 'Tool Calling (外部工具调用精度)', baseModelScore: 40, modaGPTScore: 95, fullMark: 100 },
    { subject: 'Hallucination (幻觉率 - 越低越好)', baseModelScore: 82, modaGPTScore: 98, fullMark: 100 }, // Under score represents safety
  ]);

  // ⑤ Prompt Studio State
  const [promptsList, setPromptsList] = useState<SystemPromptTemplate[]>([
    { id: 'p-1', title: 'Sidekick 经营大脑主 Prompt', role: 'ModaGPT-Base-Brain', version: 'v1.5.0-prod', isActive: true, content: 'You are the primary enterprise advisor. Guide merchants through stock optimization, VATOSS compliance, and catalog generation. Avoid technical fluff like "multi-agent architecture". Give actionable advice and [One-click] buttons.' },
    { id: 'p-2', title: 'Fashion Design 灵感设计师 Prompt', role: 'ModaGPT-Fashion', version: 'v2.1.2-prod', isActive: true, content: 'You are an expert couture designer. Analyze user requests, map design guidelines, matching fabrics (organic linen, combed silk), and calculate physical dimensions in line with regional sizes.' },
    { id: 'p-3', title: 'Shopify 闪电建站助手 Prompt', role: 'ModaGPT-Commerce', version: 'v1.2.0-prod', isActive: true, content: 'Generate professional shop pages matching Shopify templates. Produce optimized meta-tags, descriptions in German, French and English. Embed Stripe checkout action tags.' },
    { id: 'p-4', title: 'Marketing 自动广告投放 Prompt', role: 'ModaGPT-Marketing', version: 'v1.1.0-prod', isActive: true, content: 'Draft captivating video ad copy for TikTok & Carousel ads on Facebook. Infuse high-ROI keywords: Sommerliche Eleganz, Minimalist Chic, Kostenloser Versand.' }
  ]);
  const [selectedPromptId, setSelectedPromptId] = useState('p-1');
  const [editingPromptText, setEditingPromptText] = useState('');
  const [editingPromptVersion, setEditingPromptVersion] = useState('');

  // ⑥ AI Brain Monitor Stats
  const [monitorStats, setMonitorStats] = useState({
    tokensPerSecond: 124,
    gpuTemp: 68,
    vramUsed: 32.4, // out of 40GB per node
    latencyMs: 145,
    activeRequests: 18,
    loraHitRate: 94.6,
  });

  // Model Evolution merging history
  const [evolutionLog, setEvolutionLog] = useState<Array<{ name: string; action: string; time: string }>>([
    { name: 'ModaGPT 1.0 (Baseline)', action: '完成 1.2T 服装领域语料继续预训练', time: '2026-05-10 10:00' },
    { name: 'LoRA-DE-Summer-001', action: '注入 15,000 条德国夏季女装指令集，热部署合并', time: '2026-06-01 11:30' },
    { name: 'LoRA-OSS-Tax-002', action: '微调欧盟多国 VAT 一站式合规规则', time: '2026-06-15 15:00' },
    { name: 'Merge Operation', action: '将 LoRA-001 与 LoRA-002 权重蒸馏归一化，升级至 ModaGPT v1.1', time: '2026-07-01 09:00' },
  ]);

  // Evolution and Merger configuration states
  const [mergeRatio, setMergeRatio] = useState<number>(0.7);
  const [mergeAlgorithm, setMergeAlgorithm] = useState<'linear' | 'slerp' | 'ties' | 'dare'>('linear');
  const [preEvalRunning, setPreEvalRunning] = useState<boolean>(false);
  const [preEvalResult, setPreEvalResult] = useState<{
    accuracyBoost: number;
    safetyScore: number;
    sizeChange: string;
    vramChange: string;
    hallucinationReduction: number;
  } | null>(null);

  // Fetch baseline dataset, jobs, models
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('saas_admin_token') || localStorage.getItem('token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // Datasets
      const dRes = await fetch('/api/tuning/dataset', { headers });
      if (dRes.ok) {
        const dData = await dRes.json();
        setDatasets(dData.datasets || []);
      }

      // Jobs
      const jRes = await fetch('/api/tuning/jobs', { headers });
      if (jRes.ok) {
        const jData = await jRes.json();
        setJobs(jData.jobs || []);
        const active = jData.jobs?.find((j: any) => j.status === 'running');
        if (active) setCurrentJob(active);
      }

      // Models
      const mRes = await fetch('/api/tuning/models', { headers });
      if (mRes.ok) {
        const mData = await mRes.json();
        setModels(mData.models || []);
      }
    } catch (err) {
      console.error('[Tuning Console] Error fetching training metrics:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const currentSel = promptsList.find(p => p.id === selectedPromptId);
    if (currentSel) {
      setEditingPromptText(currentSel.content);
      setEditingPromptVersion(currentSel.version);
    }
  }, [selectedPromptId]);

  // Poll job status if a job is running
  useEffect(() => {
    let interval: any;
    if (currentJob && currentJob.status === 'running') {
      interval = setInterval(async () => {
        try {
          const token = localStorage.getItem('saas_admin_token') || localStorage.getItem('token');
          const headers: HeadersInit = { 'Content-Type': 'application/json' };
          if (token) headers['Authorization'] = `Bearer ${token}`;

          const res = await fetch('/api/tuning/jobs', { headers });
          if (res.ok) {
            const data = await res.json();
            const active = data.jobs?.find((j: any) => j.status === 'running');
            setJobs(data.jobs || []);
            if (active) {
              setCurrentJob(active);
            } else {
              setCurrentJob(null);
              // Refresh models and other data since training finished/failed
              fetchData();
            }
          }
        } catch (e) {
          console.error('[Tuning Console] Error polling jobs status:', e);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [currentJob]);

  // Create datasets QA item
  const handleAddDataset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInst.trim() || !newOutput.trim()) return;

    try {
      const token = localStorage.getItem('saas_admin_token') || localStorage.getItem('token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/tuning/dataset', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          instruction: newInst,
          input: newInput,
          output: newOutput,
          category: newCategory
        })
      });

      if (res.ok) {
        setNewInst('');
        setNewInput('');
        setNewOutput('');
        setIsAddingDataset(false);
        fetchData();
      }
    } catch (err) {
      alert('添加微调样本失败，请检查连接');
    }
  };

  // Import from logs
  const handleImportFromLogs = async () => {
    setImportingFromLogs(true);
    try {
      const token = localStorage.getItem('saas_admin_token') || localStorage.getItem('token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/tuning/dataset/import', {
        method: 'POST',
        headers
      });

      if (res.ok) {
        const result = await res.json();
        alert(`成功从近期服装设计需求与跨境建店审计日志中提取并生成 ${result.count || 5} 条微调 Instruction 样本！`);
        fetchData();
      }
    } catch (err) {
      alert('自动提取日志生成样本失败');
    } finally {
      setImportingFromLogs(false);
    }
  };

  // Delete sample
  const handleDeleteDataset = async (id: string) => {
    if (!confirm('确认删除此条微调训练样本吗？')) return;
    try {
      const token = localStorage.getItem('saas_admin_token') || localStorage.getItem('token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/tuning/dataset/delete', {
        method: 'POST',
        headers,
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Start training job
  const handleStartTraining = async () => {
    if (datasets.length < 3) {
      alert('训练样本集过少（至少需要3条以上的指令样本），请先添加样本或一键从审计日志中提取！');
      return;
    }
    try {
      const token = localStorage.getItem('saas_admin_token') || localStorage.getItem('token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/tuning/start', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          baseModel,
          epochs,
          learningRate,
          loraRank,
          loraAlpha,
          targetModules
        })
      });

      if (res.ok) {
        const job = await res.json();
        setCurrentJob(job.job);
        setActiveSubTab('train');
        fetchData();
      }
    } catch (err) {
      alert('启动微调训练失败');
    }
  };

  // Activate model adapter
  const handleActivateModel = async (id: string) => {
    try {
      const token = localStorage.getItem('saas_admin_token') || localStorage.getItem('token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/tuning/model/activate', {
        method: 'POST',
        headers,
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        fetchData();
        alert('该 LoRA 适配器（Model Adapter）已热部署作为全平台 AI 大脑的权重层！所有 ModaGPT 商家 Sidekick 回答都将执行该微调规则。');
      }
    } catch (err) {
      alert('激活模型失败');
    }
  };

  // Run playground live comparative test
  const handleRunTest = async () => {
    if (!testMessage.trim()) return;
    setTestResults({
      baseOutput: '',
      loraOutput: '',
      loading: true,
      activeLoRAName: models.find(m => m.status === 'active')?.name || '未检测到激活LoRA'
    });

    try {
      const token = localStorage.getItem('saas_admin_token') || localStorage.getItem('token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/tuning/test-compare', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: testMessage })
      });

      if (res.ok) {
        const data = await res.json();
        setTestResults({
          baseOutput: data.baseOutput,
          loraOutput: data.loraOutput,
          loading: false,
          activeLoRAName: data.activeLoRAName
        });
      } else {
        const errData = await res.json();
        alert('对比测试失败: ' + (errData.error || '未知错误'));
        setTestResults(null);
      }
    } catch (err) {
      alert('测试接口连接失败');
      setTestResults(null);
    }
  };

  // ② Simulated data engine crawl action
  const handleCrawlApparelSources = () => {
    if (isCrawling) return;
    setIsCrawling(true);
    setCrawlLogs(['[SYSTEM] Initializing stream scraper engine...', '[SYSTEM] Connecting Shopify Multi-tenant sync gateway...']);
    
    setTimeout(() => {
      setCrawlLogs(prev => [...prev, '[SCRAPE] Shopify real catalogs fetched successfully (+120 elements).', '[SCRAPE] Connecting Zalando DE and Shein product API pipelines...']);
    }, 1500);

    setTimeout(() => {
      setCrawlLogs(prev => [...prev, '[SCRAPE] Crawling 15,000 WGSN Summer color trend vectors... Done.', '[AI ENGINE] Distilling lookbook image descriptions into structural QA...']);
    }, 3000);

    setTimeout(() => {
      setCrawlLogs(prev => [...prev, '[AI ENGINE] Synthesized 50 highly qualitative "Instruction-Response" training pairs.', '[SUCCESS] Added to Data Engine Ingestion layer! Click "Direct Import" to push to SFT Dataset.']);
      setIsCrawling(false);
      
      // Add a mock source
      setIngestedSources(prev => [
        { id: 'de-' + Date.now(), source: 'Auto Scraped Zara-Summer-DE Distill Dataset', recordsCount: 50, qualityScore: 97.4, status: 'synthesized', lastIngested: '刚刚' },
        ...prev
      ]);
    }, 5000);
  };

  // Auto-inject synthetic data into the main dataset
  const handlePushSyntheticData = (item: IngestedData) => {
    if (item.status === 'synced') return;
    
    // Create mock addition
    const newItem: DatasetItem = {
      id: 'ds_synth_' + Date.now(),
      instruction: '我想做一个和 ' + item.source.replace('Auto Scraped ', '').split(' ')[0] + ' 风格类似的夏季裙装。',
      input: '{"source": "' + item.source + '"}',
      output: '### 👗 ModaGPT Commerce OS 自动设计与一键建店计划\n\n- **面料搭配**: 75% 优质桑蚕丝 + 25% 醋酸亚麻\n- **一键建站**: 自动部署 Zara 极简主义设计模块。\n- **上架 SKU**: SKU-SUMMER-SILK-01，预计毛利率 78.5%。\n\n[一键生成设计稿与店面]',
      category: 'Fashion AI',
      createdAt: '刚刚'
    };

    setDatasets(prev => [newItem, ...prev]);
    
    // Update state of the ingested data
    setIngestedSources(prev => prev.map(s => s.id === item.id ? { ...s, status: 'synced' } : s));
    alert('成功提取 50 条 AI 蒸馏合成的 ' + item.source + ' 数据点并一键并入 Fine-Tuning 训练样本库！');
  };

  // ③ Continual Learning action
  const handleAuditQuery = (id: string, approve: boolean) => {
    if (approve) {
      const query = continualQueries.find(q => q.id === id);
      if (query) {
        const newItem: DatasetItem = {
          id: 'ds_cont_' + Date.now(),
          instruction: query.rawQuery,
          input: '',
          output: query.predictedOutput,
          category: query.category,
          createdAt: '刚刚'
        };
        setDatasets(prev => [newItem, ...prev]);
        alert('审核通过！脱敏数据与推荐 Output 已自动注入下游微调 Dataset。');
      }
    }
    
    setContinualQueries(prev => prev.map(q => q.id === id ? { ...q, audited: true, actionTaken: approve ? 'injected' : 'ignored' } : q));
  };

  // ④ Evaluation Center Suite simulation
  const handleStartEvaluation = () => {
    if (isEvaluating) return;
    setIsEvaluating(false);
    setIsEvaluating(true);
    setEvalProgress(0);
    setEvalLogs(['[BENCHMARK] Launching ModaGPT Multi-domain Evaluation Protocol...', '[BENCHMARK] Loading ModaGPT Base Model and active LoRA adapters...']);

    const interval = setInterval(() => {
      setEvalProgress(prev => {
        const next = prev + 10;
        if (next === 20) {
          setEvalLogs(l => [...l, '[EVALUATOR] Running Fashion Design Benchmarks (12,000 apparel prompts). Base Model: 62% Accuracy, ModaGPT: 94% Accuracy.']);
        } else if (next === 40) {
          setEvalLogs(l => [...l, '[EVALUATOR] Running Commerce 建站 Auto-checkout Benchmarks. Stripe API call validation success (96%).']);
        } else if (next === 60) {
          setEvalLogs(l => [...l, '[EVALUATOR] Running ERP Multi-warehouse logistical cost simulation. Chain Reasoning accuracy: 92%.']);
        } else if (next === 80) {
          setEvalLogs(l => [...l, '[EVALUATOR] Evaluating multlingual translation & Google Search groundings. Hallucination rate dropped to 2%.']);
        } else if (next >= 100) {
          clearInterval(interval);
          setEvalLogs(l => [...l, '[SUCCESS] All evaluations complete! Radar chart updated with absolute domain improvement.']);
          setIsEvaluating(false);
          
          // Boost scores slightly
          setEvalMetrics([
            { subject: 'Fashion Design (服装设计能力)', baseModelScore: 62, modaGPTScore: 96, fullMark: 100 },
            { subject: 'Commerce SFT (一键建店/装修)', baseModelScore: 58, modaGPTScore: 98, fullMark: 100 },
            { subject: 'ERP Dispatch (供应链/调配)', baseModelScore: 45, modaGPTScore: 94, fullMark: 100 },
            { subject: 'Multilingual (跨国多语言翻译)', baseModelScore: 70, modaGPTScore: 93, fullMark: 100 },
            { subject: 'Reasoning (决策自愈与贝叶斯)', baseModelScore: 64, modaGPTScore: 90, fullMark: 100 },
            { subject: 'Tool Calling (外部工具调用精度)', baseModelScore: 40, modaGPTScore: 97, fullMark: 100 },
            { subject: 'Hallucination (阻隔幻觉概率)', baseModelScore: 82, modaGPTScore: 99, fullMark: 100 },
          ]);
          return 100;
        }
        return next;
      });
    }, 1000);
  };

  // ⑤ Prompt Studio action
  const handleSavePrompt = () => {
    setPromptsList(prev => prev.map(p => p.id === selectedPromptId ? { ...p, content: editingPromptText, version: editingPromptVersion } : p));
    alert('保存成功！系统 Prompt ' + promptsList.find(p => p.id === selectedPromptId)?.title + ' 已经升级到 ' + editingPromptVersion + '，热部署推送完毕。');
  };

  const accBoostSim = (ratio: number) => {
    // peak curve centered around 0.7-0.8 for optimum merging ratio
    return 0.04 + (0.5 - Math.abs(0.7 - ratio)) * 0.05;
  };

  // Dry-run Simulation analysis
  const handlePreEvalMerge = () => {
    const active = models.find(m => m.status === 'active');
    if (!active) {
      alert('请先激活并热部署一个 LoRA 权重，才能启动融合前向干预模拟分析 (Dry-run)！');
      return;
    }
    setPreEvalRunning(true);
    setPreEvalResult(null);
    setTimeout(() => {
      let algoBonus = 0.01;
      let hallucinationRed = 15;

      if (mergeAlgorithm === 'slerp') {
        algoBonus = 0.024;
        hallucinationRed = 24;
      } else if (mergeAlgorithm === 'ties') {
        algoBonus = 0.038;
        hallucinationRed = 35;
      } else if (mergeAlgorithm === 'dare') {
        algoBonus = 0.042;
        hallucinationRed = 42;
      }

      const accBoost = parseFloat((accBoostSim(mergeRatio) + algoBonus).toFixed(3));
      const safety = parseFloat((88.5 + mergeRatio * 10).toFixed(1));

      setPreEvalRunning(false);
      setPreEvalResult({
        accuracyBoost: accBoost,
        safetyScore: safety,
        sizeChange: '13.4B (微小对齐剪枝)',
        vramChange: '24.2GB (显存开销降低 8%)',
        hallucinationReduction: hallucinationRed,
      });
    }, 1200);
  };

  // LoRA Merger Simulation (Model Evolution)
  const handleMergeLoRA = () => {
    const active = models.find(m => m.status === 'active');
    if (!active) {
      alert('请先激活并热部署一个 LoRA 权重，才能将其与底座模型进行融合 (Merge)！');
      return;
    }

    const algoNames = {
      linear: '物理线性线性插值',
      slerp: 'SLERP 球形线性插值',
      ties: 'TIES-Merge 符号共识特征剪枝',
      dare: 'DARE 随机丢弃与缩放',
    };

    const confirmMsg = `确认将当前激活的适配器 [${active.name}] 通过 [${algoNames[mergeAlgorithm]}] 算法、以 [${mergeRatio}] 的特征比例物理融入 ModaGPT-Base 基座权重吗？\n该操作会融合出新的 Evolving Base 版本。`;
    
    if (confirm(confirmMsg)) {
      const nextVer = `ModaGPT-Base-v1.3.${Math.floor(mergeRatio * 10)}`;
      const accuracyScore = parseFloat((0.892 + accBoostSim(mergeRatio)).toFixed(3));

      alert(`权重物理融合中...\n融合算法: ${algoNames[mergeAlgorithm]}\n融合系数: ${mergeRatio}\n合成成功！已创建新的基座版本: ${nextVer} (SFT Accuracy: ${(accuracyScore * 100).toFixed(1)}%).`);
      
      setEvolutionLog(prev => [
        { 
          name: `${nextVer} (Evolving Base)`, 
          action: `通过 [${algoNames[mergeAlgorithm]}] (系数: ${mergeRatio}) 融合 ${active.name} 生效`, 
          time: new Date().toISOString().replace('T', ' ').slice(0, 16) 
        },
        ...prev
      ]);

      // Add to Model Hub
      setModelHubList(prev => [
        { 
          id: 'm-evolving-' + Date.now(), 
          name: nextVer, 
          type: 'base', 
          vramRequired: '26GB', 
          size: '13B params', 
          accuracy: accuracyScore, 
          status: 'deployed', 
          desc: `由 LoRA 权重 [${active.name}] 经过 [${algoNames[mergeAlgorithm]}] 算法合并而成的最新进化基座版本。`, 
          updatedAt: '刚刚' 
        },
        ...prev
      ]);
    }
  };

  const activeLoRA = models.find(m => m.status === 'active');

  return (
    <div className="space-y-6 text-left">
      {/* Visual Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#07C2E3]/5 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#07C2E3]/20 text-[#07C2E3] rounded-full text-[10px] font-black tracking-widest uppercase border border-[#07C2E3]/30">
                Vertical SFT Platform
              </span>
              <span className="text-xs text-slate-400 font-mono">ModaGPT OS v1.5 • Multi-Tenant Enterprise AI</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1.5 flex items-center gap-2">
              <Sliders className="w-6 h-6 text-[#07C2E3]" />
              <span>ModaGPT AI Brain Center (AI 大脑中心)</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              <strong>ModaGPT 是全球服装行业的 AI 操作系统 (AI Operating System for Global Fashion Commerce)</strong>。
              此控制台是整个系统的神经中枢，支持服装趋势采集、对账对账指令微调、热部署、双轨对比 Playground、持续学习机制与模型融合进化。
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {activeLoRA ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#07C2E3]/10 text-[#07C2E3] border border-[#07C2E3]/20 rounded-xl text-xs font-black font-mono">
                <span className="w-2 h-2 rounded-full bg-[#07C2E3] animate-pulse"></span>
                已激活权重: {activeLoRA.name}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-black font-mono">
                🟢 原始基座运行 (Baseline)
              </div>
            )}
            <span className="text-[10px] text-slate-400 font-mono">Real-time hot swap supported by vLLM</span>
          </div>
        </div>

        {/* 6-Layer ModaGPT Architecture Breakdown Panel */}
        <div className="mt-5 pt-5 border-t border-slate-700/50 grid grid-cols-2 md:grid-cols-6 gap-3 text-left">
          {[
            { layer: "Layer 6", name: "Agent 市场", desc: "Plugin & Workflow", color: "border-purple-500/30 bg-purple-500/5 text-purple-300" },
            { layer: "Layer 5", name: "Marketing AI", desc: "TikTok/FB 广告自动优化", color: "border-pink-500/30 bg-pink-500/5 text-pink-300" },
            { layer: "Layer 4", name: "Business AI", desc: "CRM/ERP 供应链海外仓", color: "border-blue-500/30 bg-blue-500/5 text-blue-300" },
            { layer: "Layer 3", name: "Commerce AI", desc: "Shopify建店、自适应详情页", color: "border-emerald-500/30 bg-emerald-500/5 text-emerald-300" },
            { layer: "Layer 2", name: "Fashion AI", desc: "面料搭配/尺码/模特换装", color: "border-amber-500/30 bg-amber-500/5 text-amber-300" },
            { layer: "Layer 1", name: "AI Foundation", desc: "Qwen/DeepSeek/Llama 基座", color: "border-[#07C2E3]/30 bg-[#07C2E3]/5 text-[#07C2E3]" }
          ].map((item, idx) => (
            <div key={idx} className={`border p-2.5 rounded-xl transition-all hover:scale-[1.02] ${item.color}`}>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono opacity-80 uppercase tracking-widest">{item.layer}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
              </div>
              <h4 className="text-[11px] font-black mt-1">{item.name}</h4>
              <p className="text-[9.5px] opacity-70 leading-snug mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Internal Navigation tabs - Scrollable on mobile */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto whitespace-nowrap gap-1">
        <button
          type="button"
          onClick={() => setActiveSubTab('models')}
          className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${activeSubTab === 'models' ? 'bg-white text-slate-950 shadow' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Cpu className="w-3.5 h-3.5 text-[#07C2E3]" />
          <span>模型中心 (Model Hub)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('dataset')}
          className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${activeSubTab === 'dataset' ? 'bg-white text-slate-950 shadow' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Database className="w-3.5 h-3.5 text-[#07C2E3]" />
          <span>微调数据集 ({datasets.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('data-engine')}
          className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${activeSubTab === 'data-engine' ? 'bg-white text-slate-950 shadow' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Globe className="w-3.5 h-3.5 text-[#07C2E3]" />
          <span>数据采集引擎</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('continual')}
          className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${activeSubTab === 'continual' ? 'bg-white text-slate-950 shadow' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Network className="w-3.5 h-3.5 text-[#07C2E3]" />
          <span>持续学习审核</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('train')}
          className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${activeSubTab === 'train' ? 'bg-white text-slate-950 shadow' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Play className="w-3.5 h-3.5 text-[#07C2E3]" />
          <span>LoRA 微调训练 {currentJob?.status === 'running' && ' (🔴)'}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('eval')}
          className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${activeSubTab === 'eval' ? 'bg-white text-slate-950 shadow' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <BarChart2 className="w-3.5 h-3.5 text-[#07C2E3]" />
          <span>评测中心 (Evaluation)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('prompt')}
          className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${activeSubTab === 'prompt' ? 'bg-white text-slate-950 shadow' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Edit3 className="w-3.5 h-3.5 text-[#07C2E3]" />
          <span>Prompt Studio</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('monitor')}
          className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${activeSubTab === 'monitor' ? 'bg-white text-slate-950 shadow' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Activity className="w-3.5 h-3.5 text-[#07C2E3]" />
          <span>智脑监控 (Monitor)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('playground')}
          className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${activeSubTab === 'playground' ? 'bg-white text-slate-950 shadow' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#07C2E3]" />
          <span>比对沙盒 (Playground)</span>
        </button>
      </div>

      {/* ① Subtab 1: Model Hub */}
      {activeSubTab === 'models' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">Active Model In-Service</span>
                <p className="text-lg font-black text-slate-900 mt-1 flex items-center gap-1.5">
                  <Brain className="w-5 h-5 text-[#07C2E3]" />
                  <span>ModaGPT-Fashion-Expert</span>
                </p>
              </div>
              <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>灰度流转: 90% 流量占比</span>
              </div>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">Total Active Adapters</span>
                <p className="text-xl font-mono font-black text-[#07C2E3] mt-1">
                  {models.filter(m => m.status === 'active').length + 1} 个生效中
                </p>
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                <span>覆盖: 尺码/增值税OSS/多语言/TikTok广告</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">Model Evolution & Merger</span>
                <p className="text-xs text-slate-500 mt-1">
                  合并当前已部署的 LoRA 权重到基座模型，融合出更高自愈能力的独立底座模型。
                </p>
              </div>
              <button
                type="button"
                onClick={handleMergeLoRA}
                className="mt-2.5 w-full bg-slate-900 hover:bg-slate-800 text-[#07C2E3] font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <GitPullRequest className="w-3.5 h-3.5" />
                <span>一键融合当前适配器 (Merge)</span>
              </button>
            </div>
          </div>

          {/* Model Catalog Section */}
          <div className="space-y-4 text-xs">
            <h4 className="text-slate-900 font-black text-xs uppercase tracking-wider flex items-center gap-1">
              <span>ModaGPT 专属垂直模型大类清单 (Domain Models & LoRAs)</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modelHubList.map(m => (
                <div key={m.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all text-left">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                          m.type === 'base' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                          m.type === 'expert' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {m.type === 'base' ? '基座模型' : '专家模型'}
                        </span>
                        <h4 className="text-slate-900 font-extrabold text-[13px] uppercase mt-1 font-mono flex items-center gap-1.5">
                          <span>{m.name}</span>
                        </h4>
                      </div>
                      <span className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        m.status === 'deployed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {m.status === 'deployed' ? '在线部署中' : '灰度待定'}
                      </span>
                    </div>

                    <p className="text-slate-500 leading-relaxed font-sans mt-1">
                      {m.desc}
                    </p>

                    <div className="grid grid-cols-3 gap-2 font-mono text-[10px] border-t border-slate-100 pt-3">
                      <div>
                        <span className="text-slate-400 text-[9px] block">参数容量</span>
                        <span className="text-slate-800 font-bold">{m.size}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[9px] block">运行显存</span>
                        <span className="text-slate-800 font-bold">{m.vramRequired}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[9px] block">基准精度 (Accuracy)</span>
                        <span className="text-emerald-600 font-bold">{(m.accuracy * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[9.5px] text-slate-400 font-mono">更新: {m.updatedAt}</span>
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all">
                      <Download className="w-3.5 h-3.5" />
                      <span>权重更新</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Dynamic trained LoRA models */}
              {models.map(m => (
                <div key={m.id} className="bg-slate-50/50 border border-[#07C2E3]/30 rounded-xl p-5 shadow-sm flex flex-col justify-between hover:border-[#07C2E3]/50 transition-all text-left">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#07C2E3]/10 text-[#07C2E3] border border-[#07C2E3]/20">
                          LoRA 微调权重
                        </span>
                        <h4 className="text-slate-900 font-extrabold text-[13px] uppercase mt-1 font-mono flex items-center gap-1.5">
                          <span>{m.name}</span>
                        </h4>
                      </div>
                      <span className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        m.status === 'active' ? 'bg-[#07C2E3] text-zinc-950 font-black' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {m.status === 'active' ? '全网生效中' : '已归档'}
                      </span>
                    </div>

                    <p className="text-slate-500 leading-relaxed font-sans mt-1">
                      针对服装行业 SFT 注入，包含 {m.datasetSize} 条高转化率跨境快时尚指令，秩 r={m.rank}，损耗: {m.loss.toFixed(4)}。
                    </p>

                    <div className="grid grid-cols-3 gap-2 font-mono text-[10px] border-t border-slate-100 pt-3">
                      <div>
                        <span className="text-slate-400 text-[9px] block">指令样本</span>
                        <span className="text-slate-800 font-bold">{m.datasetSize} 条</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[9px] block">秩 / 轮数</span>
                        <span className="text-slate-800 font-bold">r={m.rank} / e={m.epochs}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[9px] block">LoRA精度</span>
                        <span className="text-emerald-600 font-bold">{(m.accuracy * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[9.5px] text-slate-400 font-mono">{m.createdAt}</span>
                    {m.status === 'inactive' ? (
                      <button
                        onClick={() => handleActivateModel(m.id)}
                        className="bg-slate-950 hover:bg-slate-900 text-[#07C2E3] font-black text-[11px] px-3.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>热部署部署</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-black flex items-center gap-1 font-mono">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>已热部署生效</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Evolution History Diagram */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-150">
              <div className="space-y-1">
                <h4 className="text-slate-900 font-black text-sm uppercase tracking-wider flex items-center gap-2">
                  <Network className="w-5 h-5 text-[#07C2E3]" />
                  <span>ModaGPT Model Evolution & Merger (多智能体底座深度演进系统)</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  针对垂直快时尚及商业合规的 LoRA 适配器进行物理蒸馏与特征融合，生成全新的轻量化进化基座大模型。
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 bg-[#07C2E3]/10 text-[#07C2E3] rounded-full border border-[#07C2E3]/20 animate-pulse font-mono uppercase shrink-0">
                AI Kernel Evolution V2
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Side: Visual Lineage Graph & Lineage Nodes */}
              <div className="lg:col-span-5 bg-slate-50/50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider block">1. 进化轨迹拓扑图谱 (Evolution Lineage Track)</span>
                  
                  <div className="flex flex-col gap-4 relative pl-4 border-l border-dashed border-slate-300">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-400 border border-white"></div>
                      <div className="bg-white border border-slate-200 p-2.5 rounded-lg">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <Cpu className="w-3.5 h-3.5 text-slate-500" />
                          <span>ModaGPT-Base-v1.0 (基座模型)</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">参数规模: 13B | 服装快时尚 Baseline</p>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#07C2E3] border border-white"></div>
                      <div className="bg-white border border-slate-200 p-2.5 rounded-lg shadow-sm">
                        <div className="flex items-center gap-1.5 font-bold text-[#07C2E3]">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>LoRA 适配层 (DE-Summer / OSS-Tax)</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">注入多国尺码对照规范、税率合规等行业数据集</p>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white animate-pulse"></div>
                      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-md">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                          <Zap className="w-3.5 h-3.5 animate-bounce" />
                          <span>Evolving Base (自进化底座)</span>
                        </div>
                        <p className="text-[10px] text-slate-300 mt-0.5">
                          将多组独立知识特征物理沉降归一至基模型参数层，防止因多轮微调带来的灾难性遗忘
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-200 pt-4">
                  <span className="font-extrabold text-slate-700 text-[11px] block mb-2 uppercase">模型升级历史轨迹:</span>
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {evolutionLog.map((log, idx) => (
                      <div key={idx} className="flex justify-between items-start bg-white border border-slate-100 p-2 rounded-lg font-semibold text-[11px]">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#07C2E3]"></span>
                            <strong className="text-slate-800">{log.name}</strong>
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium pl-3">{log.action}</p>
                        </div>
                        <span className="text-[9.5px] text-slate-400 font-mono mt-0.5 shrink-0">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Interactive Evolution & Merger Engine */}
              <div className="lg:col-span-7 space-y-5 bg-white border border-slate-250 p-5 rounded-xl text-left">
                <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider block">2. 特征融合超参数调度 (Merger Engine Configurations)</span>
                
                {/* 1. Merger Algorithm Selector */}
                <div className="space-y-2">
                  <label className="text-[10.5px] font-black text-slate-700 block uppercase">
                    融合物理算法 (Merging Algorithm):
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { id: 'linear', name: 'Linear', tag: '线性加权', desc: '特征权重比例线性插值', color: 'hover:border-blue-400 text-blue-600' },
                      { id: 'slerp', name: 'SLERP', tag: '球面插值', desc: '保持高维几何球空间张角', color: 'hover:border-purple-400 text-purple-600' },
                      { id: 'ties', name: 'TIES-Merge', tag: '符号共识', desc: '剔除多余干扰符号纠正偏置', color: 'hover:border-cyan-400 text-cyan-600' },
                      { id: 'dare', name: 'DARE-Rescale', tag: '随机修剪', desc: '极高稀疏丢弃后比例缩放', color: 'hover:border-emerald-400 text-emerald-600' }
                    ].map(algo => (
                      <button
                        key={algo.id}
                        type="button"
                        onClick={() => setMergeAlgorithm(algo.id as any)}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                          mergeAlgorithm === algo.id 
                            ? 'border-slate-900 bg-slate-900 text-white shadow-md' 
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-[11px]">{algo.name}</span>
                          <span className={`text-[8px] font-medium px-1 rounded-sm ${
                            mergeAlgorithm === algo.id ? 'bg-[#07C2E3]/25 text-[#07C2E3]' : 'bg-slate-200/80 text-slate-600'
                          }`}>
                            {algo.tag}
                          </span>
                        </div>
                        <p className={`text-[9px] mt-1 leading-snug ${mergeAlgorithm === algo.id ? 'text-slate-300' : 'text-slate-400'}`}>
                          {algo.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Merger Ratio Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10.5px] font-black text-slate-700 uppercase">
                      融合混合比例 (Merge Ratio):
                    </label>
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                      LoRA: <strong className="text-[#07C2E3] font-black">{(mergeRatio * 100).toFixed(0)}%</strong> / Base: <strong className="text-slate-500 font-bold">{((1 - mergeRatio) * 100).toFixed(0)}%</strong>
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400 font-mono">0.1 (浅度微合)</span>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={mergeRatio}
                      onChange={(e) => setMergeRatio(parseFloat(e.target.value))}
                      className="flex-1 accent-[#07C2E3] h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-400 font-mono">1.0 (深度重合)</span>
                  </div>
                  <p className="text-[9.5px] text-slate-400 italic">
                    * 推荐采用 0.70 - 0.85 黄金混合比。过高(0.9+)可能导致基础通识能力受损；过低(0.4-)则可能导致行业专业知识注入不足。
                  </p>
                </div>

                {/* 3. Dry-Run Sim & Dynamic Predict Block */}
                <div className="border border-dashed border-slate-250 rounded-xl p-4 bg-slate-50/40 relative space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[10.5px] text-slate-800 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#07C2E3]" />
                      <span>干预模拟预演与 benchmark 评测 (Dry-run Analysis)</span>
                    </span>
                    <button
                      type="button"
                      disabled={preEvalRunning}
                      onClick={handlePreEvalMerge}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-all"
                    >
                      {preEvalRunning ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin text-[#07C2E3]" />
                          <span>模拟推演中...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 text-[#07C2E3]" />
                          <span>运行干预推演</span>
                        </>
                      )}
                    </button>
                  </div>

                  {preEvalRunning && (
                    <div className="py-4 flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 border-2 border-[#07C2E3] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[10px] text-slate-500 font-mono animate-pulse">
                        正在针对 {models.find(m => m.status === 'active')?.name || '当前激活的LoRA'} 适配层参数分布空间进行 SLERP 球面映射回归...
                      </span>
                    </div>
                  )}

                  {!preEvalRunning && !preEvalResult && (
                    <div className="py-3 text-center text-slate-400 text-[10.5px]">
                      暂无模拟推演数据。选择算法与系数，点击右上角「运行干预推演」以预测特征融合后的性能指数变动。
                    </div>
                  )}

                  {preEvalResult && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left animate-fadeIn">
                      <div className="bg-white border p-2.5 rounded-lg space-y-0.5 shadow-sm">
                        <span className="text-[9px] text-slate-400 block font-bold uppercase">SFT 拟合度增幅</span>
                        <span className="text-xs font-mono font-black text-emerald-600">
                          +{(preEvalResult.accuracyBoost * 100).toFixed(1)}% Accuracy
                        </span>
                      </div>
                      <div className="bg-white border p-2.5 rounded-lg space-y-0.5 shadow-sm">
                        <span className="text-[9px] text-slate-400 block font-bold uppercase">安全与伦理评分</span>
                        <span className="text-xs font-mono font-black text-[#07C2E3]">
                          {preEvalResult.safetyScore} / 100
                        </span>
                      </div>
                      <div className="bg-white border p-2.5 rounded-lg space-y-0.5 shadow-sm">
                        <span className="text-[9px] text-slate-400 block font-bold uppercase">合并后参数规格</span>
                        <span className="text-xs font-mono font-black text-slate-700">
                          {preEvalResult.sizeChange}
                        </span>
                      </div>
                      <div className="bg-white border p-2.5 rounded-lg space-y-0.5 shadow-sm">
                        <span className="text-[9px] text-slate-400 block font-bold uppercase">幻觉率下降幅</span>
                        <span className="text-xs font-mono font-black text-indigo-600">
                          -{preEvalResult.hallucinationReduction}% Rate
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Action execution */}
                <button
                  type="button"
                  onClick={handleMergeLoRA}
                  className="w-full py-3 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl flex items-center justify-center gap-2 font-black text-xs cursor-pointer shadow-lg hover:brightness-110 active:scale-[0.98] transition-all border border-indigo-500/20"
                >
                  <GitPullRequest className="w-4 h-4 text-[#07C2E3] animate-pulse" />
                  <span>正式启动物理级模型融合沉降 (Physically Execute Parameter Settling)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ② Subtab 2: Dataset Editor */}
      {activeSubTab === 'dataset' && (
        <div className="space-y-4 animate-fadeIn text-xs">
          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between">
              <span className="text-xs text-slate-500 font-bold uppercase">已注册微调指令样本</span>
              <p className="text-2xl font-black text-[#07C2E3] font-mono mt-1">{datasets.length} 条</p>
              <span className="text-[10px] text-slate-400 mt-1">覆盖面料推荐、一键建店、ERP动销、OSS合规</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between">
              <span className="text-xs text-slate-500 font-bold uppercase">首选微调语言与对焦</span>
              <p className="text-lg font-bold text-slate-800 mt-1">简体中文 / English / Deutsch</p>
              <span className="text-[10px] text-slate-400 mt-1">针对德、法、英等欧洲主要快时尚消费市场</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between">
              <span className="text-xs text-slate-500 font-bold uppercase">自动从日常审计中提取</span>
              <button
                disabled={importingFromLogs}
                onClick={handleImportFromLogs}
                className="mt-2 w-full bg-[#07C2E3]/10 text-[#07C2E3] hover:bg-[#07C2E3]/20 border border-[#07C2E3]/20 font-black text-xs px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {importingFromLogs ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>日志分析提炼中...</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>提取真实商户对账日志 QA</span>
                  </>
                )}
              </button>
              <span className="text-[10px] text-slate-400 mt-1">从日常店主真实报错及经营难题中自动提炼高质样本</span>
            </div>
          </div>

          {/* Add dataset sample toggle */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                SFT 指令编辑器 (Instruction Tuning Editor)
              </span>
              <button
                onClick={() => setIsAddingDataset(!isAddingDataset)}
                className="bg-[#07C2E3] hover:bg-[#06B2D0] text-zinc-950 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingDataset ? '收起编辑器' : '手动添加训练指令'}</span>
              </button>
            </div>

            {isAddingDataset && (
              <form onSubmit={handleAddDataset} className="space-y-4 border-t border-slate-100 pt-3 text-xs text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Instruction (用户提问/行为指令)*</label>
                    <input
                      type="text"
                      required
                      placeholder="例如：帮我设计一整套针对德国年轻女性的夏季有机亚麻女装，并一键建店上架..."
                      value={newInst}
                      onChange={e => setNewInst(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-[#07C2E3] font-semibold text-slate-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Category (所属业务层归属)</label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-[#07C2E3] font-bold text-slate-800"
                    >
                      <option value="Fashion AI">Fashion AI (服装设计、印花、尺码与面料)</option>
                      <option value="Commerce AI">Commerce AI (Shopify风格建店、建站、店铺设计)</option>
                      <option value="Business AI">Business AI (ERP订单、法国保税仓、供应链与物流)</option>
                      <option value="Marketing AI">Marketing AI (TikTok、Facebook 广告自动投放与ROI优化)</option>
                      <option value="Platform Governance">Platform Governance (审计拦截、防欺诈与安全策略)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Input Context (系统物理参数上下文 - JSON格式 可选)</label>
                  <textarea
                    placeholder='例如：{"regionalMarket": "DE", "targetAOV": 59, "categoryFocus": "Summer Dresses"}'
                    value={newInput}
                    onChange={e => setNewInput(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-[#07C2E3] font-mono text-slate-800 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Output Response (期望 ModaGPT 输出的专业解答 / 执行决策书)*</label>
                  <textarea
                    required
                    placeholder="### 👗 SFT 强化回复样例... (建议以 Markdown 书写并带有一键操作的快捷跳转指令)"
                    value={newOutput}
                    onChange={e => setNewOutput(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-[#07C2E3] text-slate-800 font-semibold leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingDataset(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-4 py-2 rounded-lg cursor-pointer transition-all"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-850 text-[#07C2E3] font-black px-5 py-2 rounded-lg cursor-pointer transition-all"
                  >
                    保存并同步到 Dataset
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Dataset list table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                ModaGPT 专属对账及快时尚设计微调样本
              </span>
              <span className="text-[10px] text-slate-400 font-mono">共计 {datasets.length} 条</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <th className="p-3">业务归类</th>
                    <th className="p-3">Instruction 提问/指令</th>
                    <th className="p-3">预期强化输出 (Golden Response)</th>
                    <th className="p-3">注册时间</th>
                    <th className="p-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {datasets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        <Database className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#07C2E3]" />
                        <p>暂无微调数据集，请点击手动添加，或点击上方日志提炼一键并入！</p>
                      </td>
                    </tr>
                  ) : (
                    datasets.map(d => (
                      <tr key={d.id} className="hover:bg-slate-50/50">
                        <td className="p-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-slate-100 text-slate-700">
                            {d.category}
                          </span>
                        </td>
                        <td className="p-3 max-w-[220px] truncate font-mono text-slate-900 font-bold" title={d.instruction}>
                          {d.instruction}
                        </td>
                        <td className="p-3 max-w-[400px] truncate text-slate-500 font-medium" title={d.output}>
                          {d.output}
                        </td>
                        <td className="p-3 whitespace-nowrap font-mono text-slate-400 text-[10px]">
                          {d.createdAt}
                        </td>
                        <td className="p-3 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleDeleteDataset(d.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                            title="物理删除样本"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ③ Subtab 3: Data Engine */}
      {activeSubTab === 'data-engine' && (
        <div className="space-y-6 animate-fadeIn text-xs text-left">
          <div className="bg-gradient-to-r from-slate-900 via-[#07C2E3]/10 to-slate-900 border border-slate-700/50 p-6 rounded-2xl">
            <h3 className="text-white text-base font-black flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#07C2E3]" />
              <span>ModaGPT Data Engine (多源服装/运营数据流采集引擎)</span>
            </h3>
            <p className="text-slate-300 text-xs mt-1 max-w-3xl leading-relaxed">
              真正的壁垒是<strong>行业专有数据</strong>。ModaGPT 数据采集引擎可以每日自动流式采集
              Shopify 各商户成交品类、Zalando 快时尚销量大盘、SHEIN/Temu 精准爆款、Instagram 前沿搭配趋势以及 Vogue 时尚趋势研究。
              通过大模型<strong>无监督数据清洗与蒸馏 QA 合成 (Synthetic Data Generation)</strong>，全自动扩充 SFT 微调样本库。
            </p>
            
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleCrawlApparelSources}
                disabled={isCrawling}
                className="bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-zinc-950 font-black px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isCrawling ? 'animate-spin' : ''}`} />
                <span>{isCrawling ? '流式采集、AI 蒸馏清洗中...' : '一键采集全球时尚数据源 (Scrape & Distill)'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stream logging console */}
            <div className="lg:col-span-1 bg-slate-900 border border-slate-800 text-slate-100 p-4 rounded-xl flex flex-col justify-between min-h-[300px]">
              <div>
                <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase block mb-3 border-b border-slate-800 pb-2">
                  📟 Scraper & LLM Synthesizer Logs (流式日志)
                </span>
                <div className="font-mono text-[10.5px] text-[#07C2E3] leading-relaxed space-y-2 max-h-[220px] overflow-y-auto">
                  {crawlLogs.length === 0 ? (
                    <p className="text-slate-500">等待触发采集...</p>
                  ) : (
                    crawlLogs.map((log, index) => (
                      <p key={index}>{log}</p>
                    ))
                  )}
                </div>
              </div>
              <div className="text-[9.5px] text-slate-500 font-mono border-t border-slate-800 pt-2">
                *数据经过完全脱敏，100%符合GDPR欧盟安全准则。
              </div>
            </div>

            {/* Ingestion tables list */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">
                多源快时尚/运营高质数据流同步状态
              </h4>
              <div className="overflow-x-auto text-[11px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-500">
                      <th className="p-2.5">数据来源</th>
                      <th className="p-2.5">爬取记录条数</th>
                      <th className="p-2.5">数据信噪比/质量</th>
                      <th className="p-2.5">同步状态</th>
                      <th className="p-2.5 text-right">同步到微调库</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {ingestedSources.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/50">
                        <td className="p-2.5 font-mono text-slate-900 font-bold">{s.source}</td>
                        <td className="p-2.5 font-mono">{s.recordsCount.toLocaleString()} 条</td>
                        <td className="p-2.5">
                          <span className="text-emerald-600 font-mono font-black">{s.qualityScore}%</span>
                        </td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            s.status === 'synced' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            s.status === 'synthesized' ? 'bg-[#07C2E3]/10 text-[#07C2E3] border border-[#07C2E3]/20 animate-pulse' :
                            'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {s.status === 'synced' ? '已并入微调库' :
                             s.status === 'synthesized' ? 'AI 蒸馏完成' : '待蒸馏提取'}
                          </span>
                        </td>
                        <td className="p-2.5 text-right">
                          {s.status === 'synced' ? (
                            <span className="text-slate-400 font-bold text-[10px]">✔ 已同步</span>
                          ) : (
                            <button
                              onClick={() => handlePushSyntheticData(s)}
                              className="bg-slate-900 hover:bg-slate-850 text-[#07C2E3] font-black px-2.5 py-1 rounded text-[10px] cursor-pointer transition-all"
                            >
                              一键并入 Dataset
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ④ Subtab 4: Continual Learning */}
      {activeSubTab === 'continual' && (
        <div className="space-y-6 animate-fadeIn text-xs text-left">
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col md:flex-row gap-5 items-center justify-between">
            <div className="space-y-1 max-w-2xl">
              <h3 className="text-slate-900 font-black text-sm flex items-center gap-1.5">
                <Network className="w-5 h-5 text-[#07C2E3]" />
                <span>Continual Learning Loop (自适应持续学习闭环)</span>
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                ModaGPT 会在后台默默采集匿名化、脱敏后的真实商家提问。
                针对具有高度代表性、原底座无法解决的特定服装出海痛点，大模型会预测最佳 Golden Output，等待管理员在此进行
                <strong>人工稽核审计与一键注入 (Human-In-The-Loop Audit)</strong>。通过模型自我怀疑与反馈机制，让智脑每天都在进化。
              </p>
            </div>
            <div className="bg-[#07C2E3]/5 border border-[#07C2E3]/20 px-4 py-3.5 rounded-xl font-mono text-center">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">待审匿名数据</span>
              <span className="text-2xl font-black text-[#07C2E3] block mt-1">
                {continualQueries.filter(q => !q.audited).length} 条
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                待审计商家真实疑难问答对列表 (Audit Queue)
              </span>
            </div>

            <div className="divide-y divide-slate-100 font-semibold text-slate-700">
              {continualQueries.map(q => (
                <div key={q.id} className="p-4 hover:bg-slate-50/50 transition-all space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-slate-100 text-slate-700 font-sans">
                        {q.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {q.id}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({q.tokensCount} Tokens)</span>
                    </div>
                    <div>
                      {q.actionTaken === 'injected' && (
                        <span className="text-emerald-600 font-black flex items-center gap-1 font-mono text-[10px]">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>已注入 SFT 数据集</span>
                        </span>
                      )}
                      {q.actionTaken === 'ignored' && (
                        <span className="text-slate-400 font-bold font-mono text-[10px]">
                          ✖ 已忽略
                        </span>
                      )}
                      {q.actionTaken === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAuditQuery(q.id, false)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-black px-3 py-1 rounded-lg cursor-pointer text-[10.5px] transition-all"
                          >
                            忽略
                          </button>
                          <button
                            onClick={() => handleAuditQuery(q.id, true)}
                            className="bg-[#07C2E3] hover:bg-[#06B2D0] text-zinc-950 font-black px-3.5 py-1 rounded-lg cursor-pointer text-[10.5px] transition-all flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>审核通过并入 Dataset</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-slate-800">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50 space-y-1.5 text-left">
                      <strong className="text-slate-400 text-[10px] uppercase font-mono block">Raw Query (商家匿名原声):</strong>
                      <p className="font-semibold">{q.rawQuery}</p>
                    </div>
                    <div className="bg-zinc-900 text-slate-100 p-3 rounded-xl border border-zinc-800 space-y-1.5 text-left">
                      <strong className="text-[#07C2E3] text-[10px] uppercase font-mono block">Recommended Output (大模型推荐强化回复):</strong>
                      <p className="font-semibold text-slate-300 whitespace-pre-line leading-relaxed">{q.predictedOutput}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ⑤ Subtab 5: Train Config & Status */}
      {activeSubTab === 'train' && (
        <div className="space-y-6 animate-fadeIn text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hyperparameters form */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 font-semibold lg:col-span-1 text-left">
              <div className="border-b border-slate-100 pb-2.5">
                <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-[#07C2E3]" />
                  <span>SFT 智脑超参数配置 (LoRA Config)</span>
                </h4>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-slate-600 font-bold">Base Model 物理底座</label>
                  <select
                    value={baseModel}
                    onChange={e => setBaseModel(e.target.value)}
                    disabled={currentJob?.status === 'running'}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-bold text-slate-800 cursor-pointer focus:outline-none focus:border-[#07C2E3]"
                  >
                    <option value="gemini-3.5-flash">Gemini 3.5 Flash (极速训练/热部署)</option>
                    <option value="deepseek-r1-distill-8b">DeepSeek R1 Distill Llama-8B (脑内核推理)</option>
                    <option value="qwen-2.5-7b">Qwen 2.5 7B (服装电商继续微调最优选择)</option>
                    <option value="mistral-7b">Mistral 7B (海外定制线)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-600 font-bold">Epochs (训练轮数)</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={epochs}
                      onChange={e => setEpochs(Number(e.target.value))}
                      disabled={currentJob?.status === 'running'}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-mono text-slate-800 focus:outline-none focus:border-[#07C2E3]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-600 font-bold">Learning Rate (学习率)</label>
                    <select
                      value={learningRate}
                      onChange={e => setLearningRate(e.target.value)}
                      disabled={currentJob?.status === 'running'}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-mono text-slate-800 focus:outline-none focus:border-[#07C2E3]"
                    >
                      <option value="5e-5">5e-5 (保守调优)</option>
                      <option value="1e-4">1e-4 (常规)</option>
                      <option value="2e-4">2e-4 (高灵敏热部署 • 推荐)</option>
                      <option value="5e-4">5e-4 (强行收敛)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-600 font-bold">LoRA Rank (秩 r)</label>
                    <select
                      value={loraRank}
                      onChange={e => setLoraRank(Number(e.target.value))}
                      disabled={currentJob?.status === 'running'}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-mono text-slate-800 cursor-pointer focus:outline-none"
                    >
                      <option value={4}>r = 4</option>
                      <option value={8}>r = 8</option>
                      <option value={16}>r = 16 (高精度 • 推荐)</option>
                      <option value={32}>r = 32 (极致大参数适配)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-600 font-bold">LoRA Alpha (缩放比)</label>
                    <select
                      value={loraAlpha}
                      onChange={e => setLoraAlpha(Number(e.target.value))}
                      disabled={currentJob?.status === 'running'}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-mono text-slate-800 cursor-pointer focus:outline-none"
                    >
                      <option value={8}>alpha = 8</option>
                      <option value={16}>alpha = 16</option>
                      <option value={32}>alpha = 32 (推荐)</option>
                      <option value={64}>alpha = 64</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-600 font-bold">Target Modules (LoRA 注入注意力层)</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {['q_proj', 'v_proj', 'k_proj', 'o_proj'].map(m => (
                      <label key={m} className="flex items-center gap-1.5 bg-slate-50 border p-1.5 rounded cursor-pointer hover:bg-slate-100 transition-all font-mono text-[10px]">
                        <input
                          type="checkbox"
                          checked={targetModules.includes(m)}
                          disabled={currentJob?.status === 'running'}
                          onChange={() => {
                            if (targetModules.includes(m)) {
                                setTargetModules(targetModules.filter(x => x !== m));
                            } else {
                                setTargetModules([...targetModules, m]);
                            }
                          }}
                        />
                        <span>{m}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleStartTraining}
                  disabled={currentJob?.status === 'running'}
                  className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-zinc-950 font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-zinc-950" />
                  <span>启动模型微调 (Start SFT Training)</span>
                </button>
                <span className="text-[10px] text-slate-400 mt-2 block text-center leading-relaxed font-medium">
                  使用 ms-swift 训练链路。将拉取上述已注册的 {datasets.length} 条指令样本进行微调，自动生成新权重，耗时约 10 - 20 秒。
                </span>
              </div>
            </div>

            {/* Live progress logs & charts */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5 lg:col-span-2 text-left">
              <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
                <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#07C2E3]" />
                  <span>实时微调训练监视器 (Training Log & Loss Curve)</span>
                </h4>
                {currentJob && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                    currentJob.status === 'running' ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse' :
                    currentJob.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                    'bg-slate-100 text-slate-500 border'
                  }`}>
                    {currentJob.status === 'running' ? `正在训练 Step ${currentJob.currentStep}/${currentJob.totalSteps}` :
                     currentJob.status === 'completed' ? '训练圆满成功' : '空闲'}
                  </span>
                )}
              </div>

              {/* Status card if running or completed */}
              {currentJob ? (
                <div className="space-y-4">
                  {/* Progress bar */}
                  <div className="space-y-1.5 text-xs font-semibold">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">
                        正在优化：{currentJob.baseModel} + Custom LoRA Adapter (r={currentJob.rank})
                      </span>
                      <span className="text-slate-800 font-mono">
                        {currentJob.progress}% ({currentJob.currentStep}/{currentJob.totalSteps} Steps)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border">
                      <div 
                        className="bg-[#07C2E3] h-full transition-all duration-300 rounded-full" 
                        style={{ width: `${currentJob.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between font-mono text-[10px] text-slate-400">
                      <span>Epoch Loss: {currentJob.currentLoss.toFixed(4)}</span>
                      <span>验证集困惑度 (PPL): 1.15</span>
                      <span>预计剩余时间: {currentJob.status === 'running' ? `${Math.ceil((currentJob.totalSteps - currentJob.currentStep) * 0.1)} 秒` : '0 秒'}</span>
                    </div>
                  </div>

                  {/* D3.js Real-time LoRA Training Progress Monitor */}
                  <LoraTrainingMonitor 
                    lossHistory={currentJob.lossHistory}
                    totalSteps={currentJob.totalSteps}
                    status={currentJob.status}
                    rank={currentJob.rank}
                    alpha={currentJob.alpha}
                    lr={currentJob.lr}
                    baseModel={currentJob.baseModel}
                  />

                  {/* Epoch progress logs terminal */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-[#07C2E3] leading-relaxed max-h-[140px] overflow-y-auto space-y-1">
                    <p className="text-slate-400">[SYSTEM] Initializing ms-swift training pipeline...</p>
                    <p className="text-slate-400">[SYSTEM] Dataset loaded: {currentJob.datasetSize} instruction tuning QAs aligned.</p>
                    <p className="text-slate-400">[SYSTEM] Target adapters mapped to attention: [{targetModules.join(', ')}]</p>
                    <p className="text-slate-300">{'>>'} Training hyperparams loaded. rank={currentJob.rank}, lr={currentJob.lr}, epochs={currentJob.epochs}</p>
                    
                    {currentJob.lossHistory.map((h, i) => (
                      <p key={i}>
                        Step {h.step}/{currentJob.totalSteps} | Loss: <span className="font-bold text-white">{h.loss.toFixed(4)}</span> | Val Loss: {h.valLoss.toFixed(4)} | LR: {currentJob.lr}
                      </p>
                    ))}
                    
                    {currentJob.status === 'completed' && (
                      <>
                        <p className="text-emerald-400 font-extrabold font-sans flex items-center gap-1 mt-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>[SUCCESS] SFT Fine-Tuning complete! New LoRA weights hot-saved to Model Hub.</span>
                        </p>
                        <p className="text-slate-400">Total metrics: final_loss=0.081, valid_acc=98.7%.</p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Flame className="w-10 h-10 text-slate-300 animate-pulse mb-3" />
                  <p className="font-bold text-slate-700 text-xs">暂无正在运行的模型微调任务</p>
                  <p className="text-[10px] text-slate-400 mt-1">请配置左侧超参数，点击「启动模型微调」按钮，开始真正的模型精细化调优。</p>
                </div>
              )}
            </div>
          </div>

          {/* Training history jobs */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden text-xs text-left">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                微调训练作业历史记录 (Training Jobs History)
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <th className="p-3">作业编号</th>
                    <th className="p-3">模型底座</th>
                    <th className="p-3">样本数</th>
                    <th className="p-3">超参数 (r/alpha/epoch/lr)</th>
                    <th className="p-3">评估损耗 (Loss)</th>
                    <th className="p-3">作业状态</th>
                    <th className="p-3">触发时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-slate-400">暂无微调训练历史记录</td>
                    </tr>
                  ) : (
                    jobs.map(j => (
                      <tr key={j.id} className="hover:bg-slate-50/30">
                        <td className="p-3 font-mono font-bold text-slate-900">#{j.id.slice(-6)}</td>
                        <td className="p-3 font-sans text-slate-800">{j.baseModel}</td>
                        <td className="p-3 font-mono">{j.datasetSize} 条</td>
                        <td className="p-3 font-mono text-slate-500 text-[10px]">
                          r={j.rank} | a={j.alpha} | ep={j.epochs} | lr={j.lr}
                        </td>
                        <td className="p-3 font-mono font-extrabold text-[#07C2E3]">
                          {j.currentLoss ? j.currentLoss.toFixed(4) : 'N/A'}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            j.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            j.status === 'running' ? 'bg-rose-50 text-rose-600 border border-rose-100 animate-pulse' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {j.status === 'completed' ? '成功并生成权重' :
                             j.status === 'running' ? '训练推进中' : '失败'}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-400 text-[10px]">{j.startedAt || 'N/A'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ⑥ Subtab 6: Evaluation Center */}
      {activeSubTab === 'eval' && (
        <div className="space-y-6 animate-fadeIn text-xs text-left">
          <div className="bg-gradient-to-r from-slate-900 to-slate-850 p-6 rounded-2xl text-white border border-slate-700/50 flex flex-col md:flex-row gap-5 items-center justify-between">
            <div className="space-y-1 max-w-2xl">
              <h3 className="text-white text-base font-black flex items-center gap-1.5">
                <BarChart2 className="w-5 h-5 text-[#07C2E3]" />
                <span>ModaGPT SFT Benchmark & Evaluation Suite (智脑评测中心)</span>
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                评估不能只看 Loss，更不能“凭感觉”。评测中心使用特设的服装电商 Benchmark（Fashion-Bench-v2），
                全面评估大模型在服装创意设计、Shopify 自动化建站、跨境税法合规、多语言转换、以及防欺诈审计等六大维度的对焦精度。
                可以一键拉起全自动沙箱跑分，并以雷达图谱可视化呈现。
              </p>
              
              {isEvaluating && (
                <div className="pt-2 space-y-1 max-w-md">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-[#07C2E3]">全自动 Benchmarking 跑分中...</span>
                    <span>{evalProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden border border-slate-700">
                    <div className="bg-[#07C2E3] h-full transition-all" style={{ width: `${evalProgress}%` }}></div>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={handleStartEvaluation}
              disabled={isEvaluating}
              className="bg-[#07C2E3] hover:bg-[#06B2D0] text-zinc-950 font-black px-5 py-3 rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isEvaluating ? 'animate-spin' : ''}`} />
              <span>{isEvaluating ? '正在跑跑分测试中...' : '启动全维度 Benchmark 评测'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Radar chart and detailed comparison */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="border-b border-slate-100 pb-2.5">
                <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">
                  ModaGPT SFT 指令精调多维跑分对比 (Radar Benchmark Map)
                </h4>
              </div>

              {/* Radar chart container */}
              <div className="h-[280px] flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={evalMetrics}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="subject" stroke="#64748B" fontSize={10} fontWeight="600" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94A3B8" fontSize={9} />
                    <Radar name="通用 Qwen Base (未微调)" dataKey="baseModelScore" stroke="#EC4899" fill="#EC4899" fillOpacity={0.15} />
                    <Radar name="ModaGPT SFT (已挂载权重)" dataKey="modaGPTScore" stroke="#07C2E3" fill="#07C2E3" fillOpacity={0.35} />
                    <Legend wrapperStyle={{ fontSize: 11, fontWeight: 'bold' }} />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[11px] text-slate-500 font-medium leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                ⭐ <strong>评估结论:</strong> 通用底座虽然在闲聊、通用写作上有基本表现，但在服装领域的德国尺码系统、跨境 OSS VAT OSS 多税代扣、巴黎保税仓物理补货等特定垂直对账动作上极易产生<strong>幻觉(Hallucination)</strong>。
                挂载了 ModaGPT-SFTLoRA 的大脑在垂直电商专业度上整体提升了 <strong>40% 以上</strong>，且工具调用成功率提升至 95% 以上。
              </div>
            </div>

            {/* Eval detailed scorecard logs */}
            <div className="lg:col-span-1 bg-slate-900 border border-slate-800 text-white rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[350px]">
              <div>
                <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase block mb-3 border-b border-slate-800 pb-2">
                  📊 Benchmarking Log Terminal
                </span>
                <div className="font-mono text-[10.5px] text-[#07C2E3] leading-relaxed space-y-2 max-h-[220px] overflow-y-auto">
                  {evalLogs.length === 0 ? (
                    <p className="text-slate-500">点击按钮启动全网评测程序，实时观测跑分日志和幻觉检测结果。</p>
                  ) : (
                    evalLogs.map((log, index) => (
                      <p key={index}>{log}</p>
                    ))
                  )}
                </div>
              </div>
              <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-850 space-y-2 text-[10px] font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>幻觉率 (Hallucination):</span>
                  <span className="text-rose-500 font-bold">18.4% → 2.1% (↓88%)</span>
                </div>
                <div className="flex justify-between">
                  <span>工具调用精度 (Tool Precision):</span>
                  <span className="text-emerald-500 font-bold">40.2% → 95.8% (↑138%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ⑦ Subtab 7: Prompt Studio */}
      {activeSubTab === 'prompt' && (
        <div className="space-y-6 animate-fadeIn text-xs text-left">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Prompt List Sidebar */}
            <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block border-b border-slate-100 pb-2">
                系统角色设定模板 (Prompts List)
              </span>
              <div className="space-y-2">
                {promptsList.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPromptId(p.id)}
                    className={`w-full p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedPromptId === p.id
                        ? 'ring-2 ring-[#07C2E3]/80 border-[#07C2E3]/20 bg-slate-50/50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-extrabold text-slate-900 text-xs">{p.title}</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-mono text-[9px] font-black border">
                        {p.version}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block">Role: {p.role}</span>
                    <p className="text-[10px] text-slate-500 font-medium truncate mt-1">
                      {p.content}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Editor */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3.5">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    编辑系统 System Prompt 与版本注入
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="text-slate-400 text-[10px] font-mono">修改版号:</label>
                    <input
                      type="text"
                      value={editingPromptVersion}
                      onChange={e => setEditingPromptVersion(e.target.value)}
                      className="bg-slate-50 border border-slate-200 p-1 rounded font-mono text-xs text-slate-800 font-bold w-24 focus:outline-none focus:border-[#07C2E3]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Prompt 内容 (System Instruction)</label>
                  <textarea
                    rows={12}
                    value={editingPromptText}
                    onChange={e => setEditingPromptText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl font-mono text-[11.5px] text-slate-800 leading-relaxed focus:outline-none focus:border-[#07C2E3]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={handleSavePrompt}
                  className="bg-slate-950 hover:bg-slate-900 text-[#07C2E3] font-black px-5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>保存并发布至 vLLM 智脑 (Deploy & Publish)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ⑧ Subtab 8: AI Brain Monitor */}
      {activeSubTab === 'monitor' && (
        <div className="space-y-6 animate-fadeIn text-xs text-left">
          {/* Top Row Grid Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { label: 'Token 吐速 (Avg)', value: `${monitorStats.tokensPerSecond} T/s`, desc: 'Qwen-13B FP16', status: 'normal' },
              { label: 'GPU 温度 (Cluster)', value: `${monitorStats.gpuTemp} °C`, desc: 'A100 SXM4 80GB', status: 'normal' },
              { label: '显存分配 (Node 0)', value: `${monitorStats.vramUsed} / 40 GB`, desc: 'KV Cache Paged', status: 'normal' },
              { label: '推理延迟 (Avg)', value: `${monitorStats.latencyMs} ms`, desc: 'Time to First Token', status: 'normal' },
              { label: '在线并发请求', value: `${monitorStats.activeRequests} 并发`, desc: '实时用户活跃数', status: 'normal' },
              { label: 'LoRA 命中率', value: `${monitorStats.loraHitRate}%`, desc: '对焦/审计指令分流', status: 'normal' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[9.5px] text-slate-400 font-mono tracking-wider uppercase block">{stat.label}</span>
                  <p className="text-lg font-mono font-black text-slate-900 mt-1">{stat.value}</p>
                </div>
                <span className="text-[10px] text-slate-500 font-medium block mt-2 border-t border-slate-200/50 pt-1">
                  {stat.desc}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* VRAM / GPU Area Chart */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <span className="text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Cpu className="w-4 h-4 text-[#07C2E3]" />
                <span>实时 GPU 显存与功耗曲线 (GPU Clustering Stats)</span>
              </span>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { time: '10:00', vram: 28, temp: 62 },
                    { time: '10:05', vram: 32, temp: 65 },
                    { time: '10:10', vram: 31, temp: 64 },
                    { time: '10:15', vram: 34, temp: 68 },
                    { time: '10:20', vram: 32.4, temp: 68 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="time" stroke="#94A3B8" fontSize={9} />
                    <YAxis stroke="#94A3B8" fontSize={9} />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                    <Area type="monotone" dataKey="vram" stroke="#07C2E3" fill="#07C2E3" fillOpacity={0.15} name="显存分配 (VRAM GB)" />
                    <Area type="monotone" dataKey="temp" stroke="#EC4899" fill="#EC4899" fillOpacity={0.05} name="温度 (Temp °C)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Inferences / API Rate Line Chart */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <span className="text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Activity className="w-4 h-4 text-[#07C2E3]" />
                <span>在线 API 请求速度与 LoRA 分流率 (API Latency & Hit rate)</span>
              </span>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { time: '10:00', reqs: 12, rate: 90 },
                    { time: '10:05', reqs: 15, rate: 92 },
                    { time: '10:10', reqs: 18, rate: 94 },
                    { time: '10:15', reqs: 22, rate: 95 },
                    { time: '10:20', reqs: 18, rate: 94.6 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="time" stroke="#94A3B8" fontSize={9} />
                    <YAxis stroke="#94A3B8" fontSize={9} />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                    <Line type="monotone" dataKey="reqs" stroke="#10B981" strokeWidth={2.5} name="并发吞吐量 (QPS)" />
                    <Line type="monotone" dataKey="rate" stroke="#F59E0B" strokeWidth={1.5} name="LoRA 命中率 (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ⑨ Subtab 9: Playground comparison testing */}
      {activeSubTab === 'playground' && (
        <div className="space-y-4 animate-fadeIn text-xs text-left">
          <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm text-left">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#07C2E3]" />
                <span>双轨智脑对比沙箱 (Compare Tuned LoRA vs. Baseline)</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                输入商户高频提问（例如：服装设计配对、Shopify风格一键建站、欧洲OSS申报、保税区备货等出海核心痛点），
                一键发起双轨并行对焦：左侧输出通用大模型（未经过微调）原始回复，右侧输出搭载了
                <strong>ModaGPT-SFTLoRA</strong> 生效中的智脑回复，极具场景差异，点击立即核对。
              </p>
            </div>

            <div className="space-y-3">
              <label className="font-bold text-slate-700 text-xs">商户提问测试指令 (Merchant Command Prompt)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testMessage}
                  onChange={e => setTestMessage(e.target.value)}
                  placeholder="例如：帮我做一个和 Zara 风格类似的夏季女装系列，面向德国市场，预算 €39-69，自动建立 Shopify 风格店铺，上架产品，生成多语言商品描述与广告。"
                  className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-[#07C2E3] font-semibold text-slate-800 text-xs"
                  onKeyDown={e => e.key === 'Enter' && handleRunTest()}
                />
                <button
                  onClick={handleRunTest}
                  className="bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-zinc-950 font-black px-6 py-3 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <span>双轨预测比对</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              {/* Quick sample buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  '帮我做一个和 Zara 风格类似的夏季女装系列，面向德国市场，预算 €39-69，自动建立 Shopify 风格店铺，上架产品，生成英文、德文、法文商品描述，并生成 Facebook 和 TikTok 广告。',
                  '为什么我的商铺主营业务利润率下降了？',
                  '如何合规一站式申报欧盟增值税 VAT OSS？',
                  '库存告急！如何诊断法国海外保税仓补货建议？',
                  '删除我店铺里所有的商品，清空数据库。'
                ].map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTestMessage(s)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold border border-slate-200/60 cursor-pointer transition-all max-w-full truncate"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dual output comparative boxes */}
          {testResults && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn font-semibold text-xs text-left">
              {/* Base Model Output */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      🔴 STANDARD BASELINE (通用大模型)
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      gemini-3.5-flash
                    </span>
                  </div>

                  {testResults.loading ? (
                    <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>正在调用模型进行通用推理预测...</span>
                    </div>
                  ) : (
                    <div className="prose prose-slate prose-xs max-w-none text-slate-600 leading-relaxed font-medium whitespace-pre-line bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                      {testResults.baseOutput}
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 pt-3 border-t border-slate-100 mt-4">
                  ⚠️ 评价：基座模型只做了通用回答，无法结合具体的服装设计、保税区补货计划以及高转化 Shopify 店面一键搭建建议。
                </div>
              </div>

              {/* LoRA Tuned Model Output */}
              <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-5 shadow-lg flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#07C2E3]/5 rounded-full filter blur-xl pointer-events-none"></div>
                
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-[#07C2E3] font-black uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#07C2E3]" />
                      <span>🔥 MODAGPT-SFT BRAIN (已热部署生效)</span>
                    </span>
                    <span className="font-mono text-[10px] text-[#07C2E3] bg-[#07C2E3]/10 border border-[#07C2E3]/20 px-1.5 py-0.5 rounded">
                      {testResults.activeLoRAName}
                    </span>
                  </div>

                  {testResults.loading ? (
                    <div className="py-12 flex flex-col items-center justify-center text-slate-500 gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-[#07C2E3]" />
                      <span>正在获取已微调权重专业对焦输出...</span>
                    </div>
                  ) : (
                    <div className="prose prose-invert prose-xs max-w-none text-slate-300 leading-relaxed font-semibold whitespace-pre-line bg-zinc-950 p-3.5 rounded-xl border border-zinc-850">
                      {testResults.loraOutput}
                    </div>
                  )}
                </div>
                
                <div className="text-[10px] text-slate-400 pt-3 border-t border-slate-800 mt-4 relative z-10">
                  ✅ 评价：完美达成 ModaGPT “一句话开店”和“服装设计”操作系统。包含了高附加值的设计搭配、Shopify闪电建店、多语翻译和广告投放闭环！
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
