import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Upload, 
  X, 
  Check, 
  Award, 
  Tag, 
  Users, 
  Coins, 
  UserPlus, 
  Trash2, 
  UserCheck, 
  ShieldAlert, 
  History,
  FileSpreadsheet,
  Settings,
  Layers,
  Activity,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { CustomerItem, IndustryType } from '../../types';

interface CustomerCenterProps {
  customers: CustomerItem[];
  selectedIndustry: IndustryType;
  addLog: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
  onUpdateCustomers: (updated: CustomerItem[]) => void;
}

// Points adjustment activity log structure
interface PointsLogItem {
  id: string;
  customerId: string;
  customerName: string;
  changeValue: number;
  type: 'add' | 'subtract';
  reason: string;
  operator: string;
  timestamp: string;
}

// Customer importing log
interface ImportLogItem {
  id: string;
  fileName: string;
  rowCount: number;
  status: 'success' | 'warning' | 'failed';
  details: string;
  timestamp: string;
}

// Active dynamic segments list
interface SegmentConfig {
  id: string;
  name: string;
  description: string;
  type: 'condition' | 'manual';
  criteria: {
    spendMin?: number;
    pointsMin?: number;
    statusOnly?: 'active' | 'inactive';
    tagRequired?: string;
  };
}

export default function CustomerCenter({
  customers,
  selectedIndustry,
  addLog,
  onUpdateCustomers
}: CustomerCenterProps) {
  
  // Tab control: 'list'=Task 01 & 06, 'tiers'=Task 02, 'points'=Task 03, 'tags'=Task 04, 'groups'=Task 05, 'io'=Task 07, 'ai-api'=Task 08
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'tiers' | 'points' | 'tags' | 'groups' | 'io' | 'ai-api'>('list');

  // Multi-select state for bulk actions across different views
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);

  // Task 01: Customer view states
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);

  // Track active customerId in context
  React.useEffect(() => {
    const activeId = selectedCustomer?.id || selectedCustomerIds[0] || (customers[0]?.id || undefined);
    if (typeof window !== 'undefined' && window.AIContextTracker) {
      window.AIContextTracker.setCustomerId(activeId);
    }
  }, [selectedCustomer?.id, selectedCustomerIds, customers]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<'createdAt' | 'points' | 'totalSpend' | 'lastOrderAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Task 02: Dynamic Tier Level configuration
  const [tierLimits, setTierLimits] = useState({
    silver: 100,
    gold: 300,
    platinum: 800,
    diamond: 2000
  });
  const [isEditingTiers, setIsEditingTiers] = useState(false);

  // Task 03: Points Center state registers 
  const [pointsHistory, setPointsHistory] = useState<PointsLogItem[]>([
    { id: 'PL-001', customerId: 'CUST-R001', customerName: 'Alex Mercer', changeValue: 100, type: 'add', reason: '跨国网入新注册预授', operator: 'System', timestamp: '2026-06-05 10:00' },
    { id: 'PL-002', customerId: 'CUST-R002', customerName: 'Tiffany Vance', changeValue: 450, type: 'add', reason: '对账系统追加', operator: 'Admin', timestamp: '2026-06-06 14:12' }
  ]);
  const [manualPointsVal, setManualPointsVal] = useState<number>(100);
  const [manualPointsType, setManualPointsType] = useState<'add' | 'subtract'>('add');
  const [manualPointsReason, setManualPointsReason] = useState('企业增值返点对账');

  // Task 04: Customer Custom Tags list
  const [activeTags, setActiveTags] = useState<string[]>(['VIP', '高价值', '30天未购买', '批发客户', '门店客户']);
  const [newGlobalTag, setNewGlobalTag] = useState('');
  const [selectedTagToApply, setSelectedTagToApply] = useState('');

  // Task 05: Customer dynamic segments configuration
  const [segmentData, setSegmentData] = useState<SegmentConfig[]>([
    { id: 'SEG-001', name: '高潜价值客户', description: '历史累计充值或消费额大于等于 €300 ', type: 'condition', criteria: { spendMin: 300 } },
    { id: 'SEG-002', name: '静默待促活组', description: '账户设置暂无成交、状态处于停用', type: 'condition', criteria: { statusOnly: 'inactive' } },
    { id: 'SEG-003', name: '欧洲超级金主', description: '拥有「VIP」标记的高额常客', type: 'condition', criteria: { tagRequired: 'VIP', spendMin: 150 } }
  ]);
  const [newSegmentName, setNewSegmentName] = useState('');
  const [newSegmentMinSpend, setNewSegmentMinSpend] = useState<number>(0);
  const [newSegmentStatus, setNewSegmentStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [activeManualFilter, setActiveManualFilter] = useState<string>('all'); // Manual Segment binding identifier

  // Task 07: Import & Import Log List
  const [importLogs, setImportLogs] = useState<ImportLogItem[]>([
    { id: 'IMP-L01', fileName: 'uk_high_ltv_leads.csv', rowCount: 15, status: 'success', details: '数据表格式校验完美通过，所有账单字段解析正常。自动去重机制开启。', timestamp: '2026-06-05 11:34' }
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Task 08: AI Platform automation simulation states
  const [aiJobIsRunning, setAiJobIsRunning] = useState<string | null>(null);
  const [aiJobsLogs, setAiJobsLogs] = useState<Array<{ id: string; name: string; status: 'pending'|'success'; desc: string; time: string }>>([
    { id: 'AIJ-01', name: 'AI智能客户分类标签运算', status: 'success', desc: '基于LTV频次和退款倾向对5位存量买家完成了AI分类，识别出1位高增长潜力对象。', time: '2026-06-07 19:30' }
  ]);

  // Modal control triggers
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<CustomerItem | null>(null);
  const [showCouponModal, setShowCouponModal] = useState<CustomerItem | null>(null);
  const [selectedCouponCode, setSelectedCouponCode] = useState<string>('COUPON-10PCT');
  
  // Selected single view helper values (Editing basic records)
  const [editCustName, setEditCustName] = useState('');
  const [editCustEmail, setEditCustEmail] = useState('');
  const [editCustPhone, setEditCustPhone] = useState('');

  // Input states for adding new customer
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustPoints, setNewCustPoints] = useState(100);
  const [newCustTags, setNewCustTags] = useState('新注册');

  // Coupon definition mappings
  const couponsList = [
    { code: 'COUPON-10PCT', name: '全场九折折扣券 (10% OFF)', minSpend: 0 },
    { code: 'EUR-15-WMC', name: '€15 无门槛直接扣减券', minSpend: 0 },
    { code: 'BLACK-FRIDAY-30', name: '黑五专属大额优惠券 (满€100 减€30)', minSpend: 100 },
    { code: 'VIP-FREE-SHIP', name: '高阶会员专享全欧包邮券', minSpend: 50 }
  ];

  // Helper: auto level evaluator based on score & threshold limits
  const determineTierFromPoints = (pts: number): CustomerItem['tier'] => {
    if (pts >= tierLimits.diamond) return '钻石会员';
    if (pts >= tierLimits.platinum) return '白金会员';
    if (pts >= tierLimits.gold) return '黄金会员';
    if (pts >= tierLimits.silver) return '白银会员';
    return '普通会员';
  };

  // Auto reassess levels for all clients on configurations shifts
  const triggerReassessAllTiers = () => {
    const updated = customers.map(c => {
      const nextTier = determineTierFromPoints(c.points);
      return { ...c, tier: nextTier };
    });
    onUpdateCustomers(updated);
    addLog('Customer CRM', '等级体系重置', `全局等级判定积分界限生效，系统已实时重刷库中 ${customers.length} 位会员的等级。`, 'success');
  };

  // Task 01: Toggle select / check rows helper
  const handleToggleRowSelection = (customerId: string) => {
    setSelectedCustomerIds(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId) 
        : [...prev, customerId]
    );
  };

  const handleToggleAllSelection = () => {
    if (selectedCustomerIds.length === filteredCustomers.length) {
      setSelectedCustomerIds([]);
    } else {
      setSelectedCustomerIds(filteredCustomers.map(c => c.id));
    }
  };

  // Task 03: Points Manual Adjustment Form Action
  const handleApplyPointsAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) {
      addLog('Points System', '调整失败', '请先在左侧选择一位客户。', 'error');
      return;
    }

    const change = manualPointsType === 'add' ? manualPointsVal : -manualPointsVal;
    const previousPoints = selectedCustomer.points;
    const finalPoints = Math.max(0, previousPoints + change);
    const calculatedTier = determineTierFromPoints(finalPoints);

    // Apply change to database
    const updated = customers.map(c => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          points: finalPoints,
          tier: calculatedTier
        };
      }
      return c;
    });

    onUpdateCustomers(updated);

    // Append to ledger logs
    const newLogId = `PL-${Date.now().toString().slice(-4)}`;
    const newLog: PointsLogItem = {
      id: newLogId,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      changeValue: manualPointsVal,
      type: manualPointsType,
      reason: manualPointsReason,
      operator: 'CRM Manager',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setPointsHistory(prev => [newLog, ...prev]);
    setSelectedCustomer(prev => prev ? { ...prev, points: finalPoints, tier: calculatedTier } : null);

    addLog(
      'Points Ledger',
      '增减积分对账',
      `成功将客户 ${selectedCustomer.name} 的积分 ${manualPointsType === 'add' ? '+' : '-'}${manualPointsVal}，最新积分为 ${finalPoints}。`,
      'success'
    );
    setManualPointsReason('增值返点积分兑付');
  };

  // Task 04: Batch Actions for tags
  const handleBatchApplyTag = () => {
    if (selectedCustomerIds.length === 0 || !selectedTagToApply) return;

    const updated = customers.map(c => {
      if (selectedCustomerIds.includes(c.id)) {
        const nextTags = c.tags.includes(selectedTagToApply) ? c.tags : [...c.tags, selectedTagToApply];
        return { ...c, tags: nextTags };
      }
      return c;
    });

    onUpdateCustomers(updated);
    addLog(
      'Tag Engine',
      '批量关联标签',
      `成功为选定的 ${selectedCustomerIds.length} 位客户账号批量打上 [${selectedTagToApply}] 分类标签。`,
      'success'
    );
    setSelectedCustomerIds([]);
  };

  const handleBatchRemoveTag = () => {
    if (selectedCustomerIds.length === 0 || !selectedTagToApply) return;

    const updated = customers.map(c => {
      if (selectedCustomerIds.includes(c.id)) {
        return { ...c, tags: c.tags.filter(t => t !== selectedTagToApply) };
      }
      return c;
    });

    onUpdateCustomers(updated);
    addLog(
      'Tag Engine',
      '批量解除标签',
      `已批量剥离选定 ${selectedCustomerIds.length} 位客户账号的 [${selectedTagToApply}] 标签属性。`,
      'warning'
    );
    setSelectedCustomerIds([]);
  };

  // Task 05: Segment creation and movement actions
  const handleCreateConditionSegment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSegmentName.trim()) return;

    const newSeg: SegmentConfig = {
      id: `SEG-${Date.now().toString().slice(-3)}`,
      name: newSegmentName,
      description: `系统自动筛选：累计消费大等于 €${newSegmentMinSpend}，注册处于 ${newSegmentStatus === 'all' ? '全部' : newSegmentStatus === 'active' ? '启用状态' : '黑名单/停用'}`,
      type: 'condition',
      criteria: {
        spendMin: Number(newSegmentMinSpend) || undefined,
        statusOnly: newSegmentStatus === 'all' ? undefined : newSegmentStatus
      }
    };

    setSegmentData(prev => [...prev, newSeg]);
    addLog('CRM Segment Module', '自定义条件分组创建', `成功生成新的 CRM 空白条件筛查群组「${newSegmentName}」，已同步触发运算。`, 'success');
    setNewSegmentName('');
    setNewSegmentMinSpend(0);
    setNewSegmentStatus('all');
  };

  // Task 06: Basic customer updates manual submission
  const handleEditCustomerApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal) return;

    const updated = customers.map(c => {
      if (c.id === showEditModal.id) {
        return { ...c, name: editCustName, email: editCustEmail, phone: editCustPhone };
      }
      return c;
    });

    onUpdateCustomers(updated);
    
    if (selectedCustomer?.id === showEditModal.id) {
      setSelectedCustomer(prev => prev ? { ...prev, name: editCustName, email: editCustEmail, phone: editCustPhone } : null);
    }
    
    addLog('Customer CRM', '基础资料修改', `成功保存客户 ${showEditModal.id} 的新基本核心档案数据 (姓名: ${editCustName})。`, 'success');
    setShowEditModal(null);
  };

  // State controls for digital card dispatcher
  const handleTriggerDispatchCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showCouponModal) return;

    const couponObj = couponsList.find(x => x.code === selectedCouponCode) || couponsList[0];
    const activatedTagObj = `COUPON-${couponObj.code}`;

    const updated = customers.map(c => {
      if (c.id === showCouponModal.id) {
        const nextTags = c.tags.includes(activatedTagObj) ? c.tags : [...c.tags, activatedTagObj];
        return { ...c, tags: nextTags };
      }
      return c;
    });

    onUpdateCustomers(updated);
    addLog(
      'CRM Coupons Engine',
      '代金卡券发送',
      `一键拉起安全发送：成功对买家 ${showCouponModal.name} 的绑定邮箱投递专享卡 [${couponObj.name}]。已向数据库打标： ${activatedTagObj}。`,
      'success'
    );
    
    if (selectedCustomer?.id === showCouponModal.id) {
      setSelectedCustomer(prev => prev ? { ...prev, tags: prev.tags.includes(activatedTagObj) ? prev.tags : [...prev.tags, activatedTagObj] } : null);
    }

    setShowCouponModal(null);
  };

  // Task 07: Client CSV Manual Loader
  const handleInsertManualFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = e.target.files?.[0];
    if (!fileObj) return;

    const readerFlowObj = new FileReader();
    readerFlowObj.onload = (evt) => {
      try {
        const parsedTxt = evt.target?.result as string;
        if (!parsedTxt) return;

        const csvLinesArr = parsedTxt.split('\n').map(l => l.trim()).filter(Boolean);
        if (csvLinesArr.length <= 1) {
          throw new Error('CSV 文件除表头外无其他合规数据，请重试');
        }

        const newInsertedArr: CustomerItem[] = [];
        for (let i = 1; i < csvLinesArr.length; i++) {
          const blocks = csvLinesArr[i].split(',').map(b => b.trim());
          if (blocks.length < 3) continue;

          const nName = blocks[0];
          const nEmail = blocks[1];
          const nPhone = blocks[2] || '+44 (0) 20 7946 0000';
          const nPointsVal = Number(blocks[3]) || 120;
          const nTagsStr = blocks[4] || 'CSV导入';

          if (!nName || !nEmail) continue;

          const assignTier = determineTierFromPoints(nPointsVal);
          const genClientId = `CUST-CSV${Math.floor(100 + Math.random() * 900)}`;

          newInsertedArr.push({
            id: genClientId,
            name: nName,
            email: nEmail,
            phone: nPhone,
            tier: assignTier,
            points: nPointsVal,
            tags: nTagsStr.split(';').map(t => t.trim()).filter(Boolean),
            totalSpend: 0,
            orderCount: 0,
            status: 'active',
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
          });
        }

        if (newInsertedArr.length === 0) {
          throw new Error('没有从列字段姓名,邮箱,电话,积分,标签中成功提取合规记录。');
        }

        onUpdateCustomers([...newInsertedArr, ...customers]);

        // Log to table records
        const newImportObj: ImportLogItem = {
          id: `IMP-L${Date.now().toString().slice(-3)}`,
          fileName: fileObj.name,
          rowCount: newInsertedArr.length,
          status: 'success',
          details: `解析完美结束，成功合并在主 CRM 租户内。自动计算了 ${newInsertedArr.length} 位买家的初始会员等级。`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
        };

        setImportLogs(prev => [newImportObj, ...prev]);
        addLog('CRM Import Module', 'CSV 数据表文件加载', `批量处理圆满成功，共导入 ${newInsertedArr.length} 条客户资料。`, 'success');

      } catch (err: any) {
        addLog('CRM Import Module', '解析中断失败', `CSV格式错误：${err.message}`, 'error');
        setImportLogs(prev => [
          {
            id: `IMP-F${Date.now().toString().slice(-3)}`,
            fileName: fileObj.name,
            rowCount: 0,
            status: 'failed',
            details: `加载终止。原因：${err.message || '格式无效'}`,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
          },
          ...prev
        ]);
      }
    };

    readerFlowObj.readAsText(fileObj);
    e.target.value = '';
  };

  const handleDownloadStandardTemplate = () => {
    const sampleHeaders = '姓名,邮箱,电话,积分,标签(多个标签利用英文分号隔开)\n';
    const sampleRecords = 'Alex Mercer,alex@mercer.com,+39 06 123456,350,优质买家;30天未购买\nSocrates,socrates@athens.gr,+30 21 000010,50,普通会员;高风险';
    
    // Create hidden trigger
    const finalContent = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(sampleHeaders + sampleRecords);
    const linkObj = document.createElement("a");
    linkObj.setAttribute("href", finalContent);
    linkObj.setAttribute("download", `standard_crm_import_template.csv`);
    document.body.appendChild(linkObj);
    linkObj.click();
    document.body.removeChild(linkObj);
    addLog('CRM Import Module', '下载导入模板', '成功下载用于批量数据加载的 CSV 示例。', 'info');
  };

  // Task 07: CSV data backup export creator 
  const handleTriggerCSVExport = () => {
    const csvHeaders = ['客户ID', '客户姓名', '唯一邮箱', '联系电话', '会员层级', '积分存量', '累计消费金额', '历史订单笔数', '分类特征标签', '锁定状态'];
    const rows = filteredCustomers.map(x => [
      x.id,
      x.name,
      x.email,
      x.phone,
      x.tier,
      x.points,
      `$${x.totalSpend.toFixed(2)}`,
      x.orderCount,
      x.tags.join(';'),
      x.status === 'active' ? '正常' : '封禁锁定'
    ]);

    const strContent = "data:text/csv;charset=utf-8,\uFEFF" + [csvHeaders.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encoded = encodeURI(strContent);
    const fileAnchorObj = document.createElement("a");
    fileAnchorObj.setAttribute("href", encoded);
    fileAnchorObj.setAttribute("download", `crm_export_${selectedIndustry}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(fileAnchorObj);
    fileAnchorObj.click();
    document.body.removeChild(fileAnchorObj);
    addLog('CRM Core Export', '导出数据表', `成功将选定分类下的 ${filteredCustomers.length} 位真实客户数据表打包为 CSV 并下载。`, 'success');
  };

  // Task 08: Interstitial automation simulators (Placeholder hooks under tight control, no chatbot!)
  const handleTriggerAIBackgroundJob = (jobId: string, jobName: string) => {
    setAiJobIsRunning(jobId);
    addLog('AI Command System', '计划任务就绪', `[${jobName}] 工作流已被后台挂载并注册。正在对多租户隔离数据块进行批处理...`, 'info');

    setTimeout(() => {
      setAiJobIsRunning(null);
      
      let workDetails = '';
      if (jobId === 'AI-TAG') {
        // Tag low frequent users with silent label
        const targetClients = customers.filter(c => c.totalSpend < 150 && !c.tags.includes('30天未购买'));
        const updated = customers.map(c => {
          if (c.totalSpend < 150 && !c.tags.includes('30天未购买')) {
            return { ...c, tags: [...c.tags, '30天未购买'] };
          }
          return c;
        });
        onUpdateCustomers(updated);
        workDetails = `已成功分析 LTV 趋势，并批量为 ${targetClients.length} 位消费倾向极低买家追加了「30天未购买」促活期标签。整个过程中企业数据严格多租户隔离。`;
      } else if (jobId === 'AI-COUPON') {
        // Assign coupon label auto
        const targetClients = customers.filter(c => c.tier === '钻石会员' && !c.tags.includes('EUR-15-WMC'));
        const updated = customers.map(c => {
          if (c.tier === '钻石会员' && !c.tags.includes('EUR-15-WMC')) {
            return { ...c, tags: [...c.tags, 'EUR-15-WMC'] };
          }
          return c;
        });
        onUpdateCustomers(updated);
        workDetails = `已成功识别高消费等高终身价值会员。已为 ${targetClients.length} 位核心钻石会员绑定配置「EUR-15-WMC」扣减对账优惠权限。已准备好拉起邮件通知。`;
      } else {
        workDetails = '跨物理分区数据库广播任务圆满完成。无可用实质状态更新。';
      }

      const freshAiLogObj = {
        id: `AIJ-${Date.now().toString().slice(-3)}`,
        name: jobName,
        status: 'success' as const,
        desc: workDetails,
        time: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };

      setAiJobsLogs(prev => [freshAiLogObj, ...prev]);
      addLog('AI Command System', '任务脚本运行成功', `[${jobName}] 任务节点执行完毕。对库更新正常。`, 'success');

    }, 1500);
  };

  // Handle addition of a single core manual tag on global storage
  const handleCreateGlobalTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = newGlobalTag.trim();
    if (!tag) return;
    if (activeTags.includes(tag)) {
      addLog('Tag Manager', '无法新建', '已存在完全同名的标签，无须重复录入。', 'warning');
      return;
    }
    setActiveTags(prev => [...prev, tag]);
    addLog('Tag Manager', '成功录入全局特征元标签', `新属性标签 [${tag}] 正式激活。`, 'success');
    setNewGlobalTag('');
  };

  // Main list row click helper for detailed profile preview
  const handleFlipAccountStatus = (customerId: string) => {
    const updated = customers.map(c => {
      if (c.id === customerId) {
        const next: 'active' | 'inactive' = c.status === 'active' ? 'inactive' : 'active';
        addLog('Customer Security', '会员账号合规审阅', `成功翻转了账号 ${c.id} / ${c.name} 的运行状态：设为 [${next === 'active' ? '处于启用期' : '封禁锁定中'}]。`, next === 'active' ? 'success' : 'warning');
        return { ...c, status: next };
      }
      return c;
    });

    onUpdateCustomers(updated);

    if (selectedCustomer?.id === customerId) {
      setSelectedCustomer(prev => prev ? { ...prev, status: prev.status === 'active' ? 'inactive' : 'active' } : null);
    }
  };

  // Task 01: Multi-dimensional customer filtering & sorting computing block
  const filteredCustomers = useMemo(() => {
    let baseList = [...customers];

    // Search matches: name, email, phone, ID, or single internal tags
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      baseList = baseList.filter(u => 
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        u.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Dropdown Tiers Filter
    if (filterTier !== 'all') {
      baseList = baseList.filter(u => u.tier === filterTier);
    }

    // Dropdown Status Filter
    if (filterStatus !== 'all') {
      baseList = baseList.filter(u => u.status === filterStatus);
    }

    // Manual Segment Condition grouping (Sidebar Segment selections router)
    if (activeManualFilter !== 'all') {
      const sConf = segmentData.find(s => s.id === activeManualFilter);
      if (sConf && sConf.type === 'condition') {
        const { spendMin, pointsMin, statusOnly, tagRequired } = sConf.criteria;
        if (spendMin !== undefined) baseList = baseList.filter(u => u.totalSpend >= spendMin);
        if (pointsMin !== undefined) baseList = baseList.filter(u => u.points >= pointsMin);
        if (statusOnly !== undefined) baseList = baseList.filter(u => u.status === statusOnly);
        if (tagRequired !== undefined) baseList = baseList.filter(u => u.tags.includes(tagRequired));
      }
    }

    // Core columns sorting evaluator
    baseList.sort((m, n) => {
      let x = m[sortField];
      let y = n[sortField];

      if (typeof x === 'string') {
        const valX = x as string;
        const valY = y as string;
        return sortOrder === 'asc' ? valX.localeCompare(valY) : valY.localeCompare(valX);
      } else {
        const valX = (x || 0) as number;
        const valY = (y || 0) as number;
        return sortOrder === 'asc' ? valX - valY : valY - valX;
      }
    });

    return baseList;
  }, [customers, searchQuery, filterTier, filterStatus, sortField, sortOrder, activeManualFilter, segmentData]);

  // Task 01: Create manual customer record
  const handleCreateCustomerManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustEmail.trim()) return;

    const nextId = `CUST-${selectedIndustry.slice(0, 1).toUpperCase()}${10 + customers.length + 1}`;
    
    // Auto calculate initial level based on points input 
    const determinedTier = determineTierFromPoints(newCustPoints);

    const freshNewUser: CustomerItem = {
      id: nextId,
      name: newCustName,
      email: newCustEmail,
      phone: newCustPhone || '+44 20 7946 0192',
      tier: determinedTier,
      points: newCustPoints,
      tags: newCustTags.split(/[;,,，]/).map(t => t.trim()).filter(Boolean),
      totalSpend: 0,
      orderCount: 0,
      status: 'active',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    onUpdateCustomers([freshNewUser, ...customers]);
    addLog(
      'Customer CRM',
      '新加账户落库',
      `您成功手动生成了一份实体会员档案：[${newCustName}] (${nextId})，初始积分累计 ${newCustPoints} 分 (系统评级: ${determinedTier})。`,
      'success'
    );

    // Clean input targets 
    setNewCustName('');
    setNewCustEmail('');
    setNewCustPhone('');
    setNewCustPoints(100);
    setNewCustTags('新注册');
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col gap-4 text-slate-800">

      {/* Domain Secondary Tabs selection bar - Built exactly as a Shopify Core Panel */}
      <div className="bg-white border border-slate-150 rounded-xl p-1.5 flex flex-wrap gap-1 shadow-xs justify-start select-none">
        
        <button
          onClick={() => { setActiveSubTab('list'); setActiveManualFilter('all'); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 h-8 ${
            activeSubTab === 'list' && activeManualFilter === 'all'
              ? 'bg-[#e6fafc] text-[#07C2E3]'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>[T1/T6] 客户列表与详情</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('tiers'); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 h-8 ${
            activeSubTab === 'tiers'
              ? 'bg-[#e6fafc] text-[#07C2E3]'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>[T2] 会员等级管理</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('points'); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 h-8 ${
            activeSubTab === 'points'
              ? 'bg-[#e6fafc] text-[#07C2E3]'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>[T3] 积分管理中心</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('tags'); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 h-8 ${
            activeSubTab === 'tags'
              ? 'bg-[#e6fafc] text-[#07C2E3]'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>[T4] 客户标签工厂</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('groups'); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 h-8 ${
            activeSubTab === 'groups'
              ? 'bg-[#e6fafc] text-[#07C2E3]'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>[T5] 智能客户分群</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('io'); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 h-8 ${
            activeSubTab === 'io'
              ? 'bg-[#e6fafc] text-[#07C2E3]'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>[T7] CRM 高级导入导出</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('ai-api'); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 h-8 ${
            activeSubTab === 'ai-api'
              ? 'bg-[#e6fafc] text-[#07C2E3]'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>[T8] AI 联合流转接口</span>
        </button>

      </div>

      {/* Main Content Render Layout Panel */}
      <div className="w-full flex flex-col gap-4">

        {/* ----------------- SUBTAB 1 & 6: CUSTOMER LIST AND DETAIL ----------------- */}
        {(activeSubTab === 'list') && (
          <div className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-sm flex flex-col">
            
            {/* Customer Toolbar */}
            <div className="p-3 border-b border-slate-150 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/20 select-none">
              
              <div className="flex flex-wrap items-center gap-2 flex-1 max-w-2xl">
                {/* Search query field */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="过滤客户姓名、邮箱、ID或特定的自定义标签属性..."
                    className="w-full bg-white border border-slate-200 pl-8 pr-3 h-7 rounded-lg text-xs font-medium placeholder-slate-400 focus:outline-hidden focus:border-[#07C2E3] text-slate-800 transition-all font-mono"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Filter selects */}
                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-600 px-2 h-7 rounded-lg text-[10px] font-bold cursor-pointer focus:outline-hidden"
                >
                  <option value="all">所有等级</option>
                  <option value="普通会员">普通会员</option>
                  <option value="白银会员">白银会员</option>
                  <option value="黄金会员">黄金会员</option>
                  <option value="白金会员">白金会员</option>
                  <option value="钻石会员">钻石会员</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-600 px-2 h-7 rounded-lg text-[10px] font-bold cursor-pointer focus:outline-hidden"
                >
                  <option value="all">所有状态</option>
                  <option value="active">正常状态</option>
                  <option value="inactive">封禁状态</option>
                </select>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as any)}
                  className="bg-white border border-slate-200 text-slate-600 px-2 h-7 rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  <option value="createdAt">注册时间</option>
                  <option value="points">当前积分</option>
                  <option value="totalSpend">成交额</option>
                  <option value="lastOrderAt">最近下单</option>
                </select>

                <button
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="bg-white border border-slate-200 text-slate-650 h-7 w-7 rounded-lg text-xs font-bold cursor-pointer flex items-center justify-center border-slate-200"
                  title="反转排序"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>

                {/* Create direct client form trigger */}
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 text-white px-2.5 h-7 rounded-lg text-[10px] font-extrabold cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加会员档案</span>
                </button>

              </div>

            </div>

            {/* Active Conditional segment status pill */}
            {activeManualFilter !== 'all' && (
              <div className="bg-slate-50 border-b border-slate-150 px-4 py-2 flex items-center justify-between text-xs font-sans text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="bg-[#07C2E3]/15 text-[#07C2E3] px-1.5 py-0.5 rounded-sm font-bold text-[9px] uppercase">过滤群组</span>
                  <span>正在查看智能分群 <b>「{segmentData.find(s=>s.id === activeManualFilter)?.name}」</b>，此分群包含动态条件约束。</span>
                </div>
                <button 
                  onClick={() => setActiveManualFilter('all')}
                  className="text-slate-400 hover:text-slate-800 text-[10px] font-bold underline cursor-pointer"
                >
                  清除分群约束恢复全局
                </button>
              </div>
            )}

            {/* Content Table Grid */}
            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-150 min-h-[460px]">
              
              {/* Left Customer Rows and select columns */}
              <div className="flex-1 overflow-x-auto min-h-[300px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/30 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                      <th className="p-3 w-10 text-center">
                        <input 
                          type="checkbox"
                          checked={filteredCustomers.length > 0 && selectedCustomerIds.length === filteredCustomers.length}
                          onChange={handleToggleAllSelection}
                          className="rounded text-[#07C2E3] focus:ring-[#07C2E3]"
                        />
                      </th>
                      <th className="p-3 w-20 text-center">客户ID</th>
                      <th className="p-3">姓名</th>
                      <th className="p-3">联络详情 (邮件/电话)</th>
                      <th className="p-3 text-center">当前层级</th>
                      <th className="p-3 text-center">当前积分</th>
                      <th className="p-3 text-right">历史消费额</th>
                      <th className="p-3 text-center">总定笔</th>
                      <th className="p-3 text-center">状态</th>
                      <th className="p-3 text-right pr-4">物理核销操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700 text-xs">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((cust) => {
                        let tierColor = 'bg-slate-100 text-slate-600 border-slate-200';
                        if (cust.tier === '钻石会员') tierColor = 'bg-indigo-50 text-indigo-700 border-indigo-150 font-bold';
                        else if (cust.tier === '白金会员') tierColor = 'bg-cyan-50 text-cyan-700 border-cyan-150 font-bold';
                        else if (cust.tier === '黄金会员') tierColor = 'bg-amber-50 text-amber-700 border-amber-150';
                        else if (cust.tier === '白银会员') tierColor = 'bg-slate-50 text-slate-600 border-slate-150';

                        const isChecked = selectedCustomerIds.includes(cust.id);

                        return (
                          <tr
                            key={cust.id}
                            onClick={() => setSelectedCustomer(cust)}
                            className={`hover:bg-slate-50/50 cursor-pointer transition-colors border-b border-slate-100 ${
                              selectedCustomer?.id === cust.id ? 'bg-[#e6fafc]/20' : ''
                            }`}
                          >
                            <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <input 
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleRowSelection(cust.id)}
                                className="rounded text-[#07C2E3] focus:ring-[#07C2E3]"
                              />
                            </td>
                            <td className="p-3 text-center font-bold font-mono text-slate-900">{cust.id}</td>
                            <td className="p-3 font-bold text-slate-800">{cust.name}</td>
                            <td className="p-3 font-mono">
                              <div className="text-slate-800 text-[11px] font-bold">{cust.email}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">{cust.phone}</div>
                            </td>
                            <td className="p-3 text-center">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${tierColor}`}>
                                {cust.tier}
                              </span>
                            </td>
                            <td className="p-3 text-center font-mono font-bold text-slate-800">
                              {cust.points}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-slate-900 grid-price">
                              ${cust.totalSpend.toFixed(2)}
                            </td>
                            <td className="p-3 text-center font-mono text-slate-700">
                              {cust.orderCount} 笔
                            </td>
                            <td className="p-3 text-center">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                cust.status === 'active' 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-150' 
                                  : 'bg-rose-50 text-rose-500 border-rose-150'
                              }`}>
                                {cust.status === 'active' ? '正常' : '禁用'}
                              </span>
                            </td>
                            <td className="p-3 text-right pr-4 space-x-1 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              
                              <button
                                onClick={() => {
                                  setSelectedCustomer(cust);
                                  setShowEditModal(cust);
                                  setEditCustName(cust.name);
                                  setEditCustEmail(cust.email);
                                  setEditCustPhone(cust.phone);
                                }}
                                className="bg-white hover:bg-slate-50 border border-slate-200 py-0.5 px-1.5 rounded text-[10px] font-bold text-slate-700 cursor-pointer"
                              >
                                资料
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedCustomer(cust);
                                  setShowCouponModal(cust);
                                }}
                                className="bg-[#e6fafc]/60 hover:bg-[#07C2E3] text-[#07C2E3] hover:text-white border border-[#07C2E3]/20 py-0.5 px-1.5 rounded text-[10px] font-bold cursor-pointer transition-all inline-block"
                              >
                                优惠券
                              </button>

                              <button
                                onClick={() => handleFlipAccountStatus(cust.id)}
                                className={`py-0.5 px-1.5 rounded text-[10px] font-bold cursor-pointer border ${
                                  cust.status === 'active'
                                    ? 'bg-rose-550/10 text-rose-600 border-rose-100 hover:bg-rose-50'
                                    : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100/50'
                                }`}
                              >
                                {cust.status === 'active' ? '拉黑' : '解封'}
                              </button>

                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={10} className="p-10 text-center font-bold text-slate-400">
                          没有在此筛选分区内查询到相关客户实体。
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Right Panel - CRM Task 06: Deep Customer Profile details drawer (Zero AI Fluff!) */}
              <div className="w-full lg:w-[350px] bg-slate-50/40 p-4 shrink-0 flex flex-col gap-4">
                {selectedCustomer ? (
                  <div className="flex flex-col gap-3.5 h-full relative text-left">
                    
                    {/* Closing trigger icon */}
                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="absolute right-0 top-0 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Short title block */}
                    <div className="border-b border-slate-150 pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-[#07C2E3]/20 text-[#07C2E3] flex items-center justify-center font-extrabold text-sm font-sans uppercase">
                          {selectedCustomer.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm leading-tight flex items-center gap-1.5 font-sans">
                            <span>{selectedCustomer.name}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-500 font-mono font-medium px-1.5 py-0.2 rounded">
                              {selectedCustomer.id}
                            </span>
                          </h4>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">注册时间: {selectedCustomer.createdAt}</p>
                        </div>
                      </div>
                    </div>

                    {/* Standard details block */}
                    <div className="space-y-3 text-xs">
                      
                      {/* Contacts block */}
                      <div className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-2">
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase block select-none">基础联络资料</span>
                        
                        <div className="space-y-1.5 font-mono text-[10px]">
                          <div className="flex justify-between">
                            <span className="text-slate-400">通信邮箱:</span>
                            <span className="text-slate-800 font-bold break-all max-w-[180px] text-right">{selectedCustomer.email}</span>
                          </div>
                          <div className="flex justify-between border-t border-slate-50 pt-1.5">
                            <span className="text-slate-400">联络电话:</span>
                            <span className="text-slate-800 font-bold">{selectedCustomer.phone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Financial performance state */}
                      <div className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-2">
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase block select-none">历史定序价值分析</span>
                        
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="bg-slate-50 rounded-lg p-1.5 border border-slate-100">
                            <span className="text-[8px] text-slate-450 block font-sans">累计交易笔数</span>
                            <strong className="font-mono text-sm text-slate-900 font-extrabold block mt-0.5">{selectedCustomer.orderCount} 笔</strong>
                          </div>
                          <div className="bg-[#e6fafc]/40 rounded-lg p-1.5 border border-[#07C2E3]/15">
                            <span className="text-[8px] text-slate-450 block font-sans">LTV 总营业额</span>
                            <strong className="font-mono text-sm text-[#07C2E3] font-black block mt-0.5">${selectedCustomer.totalSpend.toFixed(2)}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Points & Levels auditing */}
                      <div className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-2">
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase block select-none">积分对账与阶梯等级</span>
                        
                        <div className="space-y-1.5 font-sans">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-slate-500 font-medium">尊领等级:</span>
                            <span className="font-bold text-[#07C2E3] flex items-center gap-0.5">
                              <Award className="w-3.5 h-3.5 text-[#07C2E3]" />
                              {selectedCustomer.tier}
                            </span>
                          </div>
                          <div className="flex justify-between items-center border-t border-slate-50 pt-1.5 text-[10px]">
                            <span className="text-slate-500 font-medium">活跃可用券包及返现点:</span>
                            <span className="font-mono font-black text-amber-600 flex items-center gap-0.5">
                              <Coins className="w-3 h-3 text-amber-500" />
                              {selectedCustomer.points} 分
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Customer dynamic Tags cloud */}
                      <div className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-2">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">已绑定分类特征标签</span>
                        <div className="flex flex-wrap gap-1 min-h-[40px] items-center">
                          {selectedCustomer.tags.length > 0 ? (
                            selectedCustomer.tags.map((tg, idx) => (
                              <span 
                                key={idx}
                                className="text-[9px] bg-[#e6fafc] text-[#07C2E3] font-bold px-1.5 py-0.5 rounded border border-cyan-150 flex items-center gap-0.5"
                              >
                                <span>{tg}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = customers.map(u => {
                                      if (u.id === selectedCustomer.id) {
                                        return { ...u, tags: u.tags.filter(t => t !== tg) };
                                      }
                                      return u;
                                    });
                                    onUpdateCustomers(next);
                                    setSelectedCustomer(prev => prev ? { ...prev, tags: prev.tags.filter(t => t !== tg) } : null);
                                    addLog('Tag System', '标签拔除', `剥离了客户 ${selectedCustomer.id} 的属签 [${tg}]`, 'info');
                                  }}
                                  className="text-slate-400 hover:text-rose-500 font-normal px-0.5 text-[8px]"
                                >
                                  ×
                                </button>
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-[10px] italic">暂未绑定任何特征标签。</span>
                          )}
                        </div>
                      </div>

                      {/* Log history of activities roadmap (Task06: 最近活动 - completely realistic logs) */}
                      <div className="bg-white border border-[#eaeaea] rounded-lg p-2.5 space-y-2">
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase block select-none">该用户近期交互轨迹</span>
                        
                        <div className="space-y-3 pl-1 text-[10px] leading-relaxed">
                          <div className="relative border-l border-slate-150 pl-3 pb-1">
                            <span className="absolute -left-[4.5px] top-1 w-2 h-2 rounded-full border border-white bg-emerald-500"></span>
                            <div className="text-xs text-slate-800 font-bold">系统完成了跨境支付合规审议</div>
                            <p className="text-slate-400 font-mono text-[8px]">2026-06-07 15:40</p>
                          </div>
                          
                          <div className="relative border-l border-slate-150 pl-3 pb-1">
                            <span className="absolute -left-[4.5px] top-1 w-2 h-2 rounded-full border border-white bg-slate-350"></span>
                            <div className="text-xs text-slate-650 font-bold">积分由调解工具执行充值变更</div>
                            <p className="text-slate-400 font-mono text-[8px]">2026-06-05 10:14</p>
                          </div>

                          <div className="relative pl-3">
                            <span className="absolute -left-[4px] top-1 w-2 h-2 rounded-full border border-white bg-slate-250"></span>
                            <div className="text-xs text-slate-450">注册入库并配置初始角色权限</div>
                            <p className="text-slate-400 font-mono text-[8px]">{selectedCustomer.createdAt}</p>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 my-auto">
                    <Users className="w-9 h-9 mb-2 text-slate-300 stroke-[1.5]" />
                    <strong className="text-xs text-slate-550 font-sans">点击表格行唤起肖像画幅</strong>
                    <p className="text-[10px] text-slate-400 max-w-[210px] mt-1 font-sans">
                      集成多维消费额度、安全防欺诈等级、卡券记录及操作日志，即刻唤醒高值LTV客户洞悉。
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ----------------- SUBTAB 2: MEMBER TIERS AND THRESHOLDS ----------------- */}
        {activeSubTab === 'tiers' && (
          <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-sm space-y-5 text-left">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-3">
              <div>
                <h3 className="text-base font-extrabold text-[#07C2E3] flex items-center gap-1.5">
                  <Award className="w-5 h-5 text-[#07C2E3]" />
                  <span>[Task 02] 积分会员层级体系</span>
                </h3>
                <p className="text-xs text-[#07C2E3] font-mono mt-0.5 font-bold">LOYALTY_TIERS</p>
              </div>
              <button
                onClick={() => {
                  if (isEditingTiers) {
                    setIsEditingTiers(false);
                    triggerReassessAllTiers();
                  } else {
                    setIsEditingTiers(true);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer h-7 select-none flex items-center justify-center ${
                  isEditingTiers 
                    ? 'bg-[#07C2E3] hover:bg-[#06B2D0] text-white shadow-sm' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isEditingTiers ? '保存阀值规则并应用' : '自定义配置阈值分量'}
              </button>
            </div>

            {/* Level configurations display table */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 select-none">
              
              <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between min-h-[140px]">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">LEVEL 01</span>
                  <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-150 inline-block">
                    <span>普通会员</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-normal mt-1 flex-1">新注册用户的初始兜底类型阶层。</p>
                </div>
                <div className="pt-2 border-t border-slate-200/50 text-xs">
                  <span className="text-slate-450 block text-[9px]">积分需求:</span>
                  <strong className="text-slate-900">&lt; {tierLimits.silver} 分</strong>
                </div>
              </div>

              <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between min-h-[140px]">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">LEVEL 02</span>
                  <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-150 inline-block font-medium">
                    <span>白银会员</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-normal mt-1 flex-1">解锁初阶满减活动及运费补偿金。</p>
                </div>
                <div className="pt-2 border-t border-slate-200/50 text-xs text-left">
                  <span className="text-slate-450 block text-[9px]">积分需求:</span>
                  {isEditingTiers ? (
                    <input
                      type="number"
                      value={tierLimits.silver}
                      onChange={(e) => setTierLimits(prev => ({ ...prev, silver: Math.max(1, Number(e.target.value)) }))}
                      className="w-full bg-white border border-slate-350 rounded p-0.5 text-xs font-mono font-bold font-sans text-slate-800"
                    />
                  ) : (
                    <strong className="text-slate-900">&ge; {tierLimits.silver} 分</strong>
                  )}
                </div>
              </div>

              <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between min-h-[140px]">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">LEVEL 03</span>
                  <h4 className="font-extrabold text-amber-700 text-sm flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 inline-block">
                    <span>黄金会员</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-normal mt-1 flex-1">默认返现累积乘积大增 (1.2x 点数比)。</p>
                </div>
                <div className="pt-2 border-t border-slate-200/50 text-xs">
                  <span className="text-slate-450 block text-[9px]">积分需求:</span>
                  {isEditingTiers ? (
                    <input
                      type="number"
                      value={tierLimits.gold}
                      onChange={(e) => setTierLimits(prev => ({ ...prev, gold: Math.max(1, Number(e.target.value)) }))}
                      className="w-full bg-white border border-slate-350 rounded p-0.5 text-xs font-mono font-bold text-slate-800"
                    />
                  ) : (
                    <strong className="text-slate-900">&ge; {tierLimits.gold} 分</strong>
                  )}
                </div>
              </div>

              <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between min-h-[140px]">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">LEVEL 04</span>
                  <h4 className="font-bold text-cyan-700 text-sm flex items-center gap-1 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100 inline-block">
                    <span>白金会员</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-normal mt-1 flex-1">解锁高层级卡券投放并激活专区购物。</p>
                </div>
                <div className="pt-2 border-t border-slate-200/50 text-xs">
                  <span className="text-slate-450 block text-[9px]">积分需求:</span>
                  {isEditingTiers ? (
                    <input
                      type="number"
                      value={tierLimits.platinum}
                      onChange={(e) => setTierLimits(prev => ({ ...prev, platinum: Math.max(1, Number(e.target.value)) }))}
                      className="w-full bg-white border border-slate-350 rounded p-0.5 text-xs font-mono font-bold text-slate-800"
                    />
                  ) : (
                    <strong className="text-slate-900">&ge; {tierLimits.platinum} 分</strong>
                  )}
                </div>
              </div>

              <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between min-h-[140px]">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">LEVEL 05</span>
                  <h4 className="font-extrabold text-indigo-700 text-sm flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-150 inline-block">
                    <span>钻石会员</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-normal mt-1 flex-1">顶级双优资产，附赠专属物流通道与退换豁免。</p>
                </div>
                <div className="pt-2 border-t border-slate-200/50 text-xs">
                  <span className="text-slate-450 block text-[9px]">积分需求:</span>
                  {isEditingTiers ? (
                    <input
                      type="number"
                      value={tierLimits.diamond}
                      onChange={(e) => setTierLimits(prev => ({ ...prev, diamond: Math.max(1, Number(e.target.value)) }))}
                      className="w-full bg-white border border-slate-350 rounded p-0.5 text-xs font-mono font-bold text-slate-800"
                    />
                  ) : (
                    <strong className="text-slate-900">&ge; {tierLimits.diamond} 分</strong>
                  )}
                </div>
              </div>

            </div>

            {/* Current Tier Allocation Statistic chart table */}
            <div className="border border-slate-150 rounded-xl overflow-hidden mt-4">
              <div className="p-3 bg-slate-50 text-xs font-bold text-slate-700 border-b border-slate-150">
                当前租户内积分等级覆盖名册统计
              </div>
              <div className="p-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                {['普通会员', '白银会员', '黄金会员', '白金会员', '钻石会员'].map(levelName => {
                  const matchCount = customers.filter(c => c.tier === levelName).length;
                  const ratio = ((matchCount / Math.max(1, customers.length)) * 100).toFixed(0);
                  return (
                    <div key={levelName} className="text-center bg-white border border-slate-100 p-3 rounded-lg flex flex-col justify-between">
                      <span className="text-slate-400 text-[10px] block">{levelName}</span>
                      <strong className="text-slate-800 text-xl font-mono block mt-1">{matchCount} 人</strong>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                        <div className="bg-[#07C2E3] h-full" style={{ width: `${ratio}%` }}></div>
                      </div>
                      <span className="text-slate-400 text-[9px] block mt-1">占比约 {ratio}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ----------------- SUBTAB 3: POINTS CENTER & MANUAL RECONCILIATION ----------------- */}
        {activeSubTab === 'points' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-left select-none">
            
            {/* Left Panel: Points adjustment form & criteria display (No hardcoded +/-100 button!) */}
            <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-xs space-y-4">
              
              <div className="border-b border-slate-150 pb-2">
                <h4 className="text-sm font-extrabold text-[#07C2E3] flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>积分即时变动录入</span>
                </h4>
                <p className="text-[10px] text-[#07C2E3] font-mono mt-1 font-bold">POINTS_ENTRY</p>
              </div>

              {selectedCustomer ? (
                <form onSubmit={handleApplyPointsAdjustment} className="space-y-4">
                  <div className="bg-[#e6fafc]/45 p-3 rounded-lg border border-[#07C2E3]/15 text-xs">
                    <p className="font-bold text-[#07C2E3]">目标客户已锚定:</p>
                    <p className="text-slate-700 font-bold mt-1 text-[13px]">{selectedCustomer.name}</p>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">账户ID: {selectedCustomer.id} · 结算邮箱: {selectedCustomer.email}</span>
                    <div className="border-t border-[#07C2E3]/20 pt-2 mt-2 flex items-center justify-between font-mono text-[10px]">
                      <span>当前拥有积分: <b>{selectedCustomer.points} 分</b></span>
                      <span>等级: <b>{selectedCustomer.tier}</b></span>
                    </div>
                  </div>

                  {/* Operation Strategy select block */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-450 font-bold uppercase block">积分增减方向 *</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setManualPointsType('add')}
                        className={`p-2 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                          manualPointsType === 'add'
                            ? 'border-[#07C2E3] bg-[#e6fafc]/40 text-[#07C2E3]'
                            : 'border-slate-200 text-slate-500 bg-white'
                        }`}
                      >
                        增加 (+)
                      </button>
                      <button
                        type="button"
                        onClick={() => setManualPointsType('subtract')}
                        className={`p-2 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                          manualPointsType === 'subtract'
                            ? 'border-[#07C2E3] bg-[#e6fafc]/40 text-[#07C2E3]'
                            : 'border-slate-200 text-slate-500 bg-white'
                        }`}
                      >
                        扣减 (-)
                      </button>
                    </div>
                  </div>

                  {/* Action values */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-450 font-bold block">调整值大小 (正整数) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={manualPointsVal}
                      onChange={(e) => setManualPointsVal(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-mono font-bold font-sans text-slate-800"
                    />
                  </div>

                  {/* Reason label */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-450 font-bold block">调增/调减事务说明原因 *</label>
                    <input
                      type="text"
                      required
                      value={manualPointsReason}
                      onChange={(e) => setManualPointsReason(e.target.value)}
                      placeholder="如: 对账退款扣点, 企业返券核减"
                      className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs text-slate-700"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 text-white py-2 rounded-lg font-extrabold text-xs transition-all cursor-pointer shadow-xs text-center"
                  >
                    确认对账并立即入库生效
                  </button>

                </form>
              ) : (
                <div className="p-10 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 text-xs">
                  <Coins className="w-8 h-8 mx-auto text-slate-300 stroke-[1.5] mb-2" />
                  请点选右侧客户列表行激活并生成积分调整。
                </div>
              )}

              {/* Standard conversion rules display summary */}
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-[10px] leading-relaxed text-slate-600">
                <span className="font-bold text-[#07C2E3] block">跨境多租户默认兑换权重:</span>
                <p className="mt-1">● 店铺单笔成功支付: €1 = 1 VP 积分记账。</p>
                <p>● 单个钻石买家单日总积分调拨对账上限不得超过 10,000 点。</p>
              </div>

            </div>

            {/* Right Panel: Points updating transactions list & log tables */}
            <div className="col-span-1 lg:col-span-2 bg-white border border-slate-150 rounded-xl shadow-xs p-4 space-y-4">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="text-sm font-extrabold text-slate-950 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-[#07C2E3]" />
                  <span>[Task 03] 全局积分手动调整审计历史</span>
                </h4>
                <span className="text-[10px] text-slate-400">显示对账修改日志</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/20 border-b border-slate-150 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="p-2">日志编号</th>
                      <th className="p-2">买家基本联络</th>
                      <th className="p-2 text-center">变动数值</th>
                      <th className="p-2">系统备注操作由</th>
                      <th className="p-2 text-right">变动操作期</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[10px] font-medium text-slate-650 font-mono">
                    {pointsHistory.map((lg) => (
                      <tr key={lg.id} className="hover:bg-slate-50/50">
                        <td className="p-2 font-bold text-slate-800">{lg.id}</td>
                        <td className="p-2">
                          <span className="text-slate-900 font-bold">{lg.customerName}</span>
                          <span className="text-[8px] text-slate-400 block mt-0.5">{lg.customerId}</span>
                        </td>
                        <td className="p-2 text-center">
                          <span className={`px-1 rounded-sm font-bold ${
                            lg.type === 'add' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
                          }`}>
                            {lg.type === 'add' ? '+' : '-'}{lg.changeValue} 分
                          </span>
                        </td>
                        <td className="p-2">
                          <span className="text-slate-800 italic">{lg.reason}</span>
                          <span className="text-[8px] text-slate-400 block mt-0.5">执行操作官: {lg.operator}</span>
                        </td>
                        <td className="p-2 text-right text-slate-400">{lg.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

        {/* ----------------- SUBTAB 4: CUSTOMER TAGS (Task 04) ----------------- */}
        {activeSubTab === 'tags' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-left select-none">
            
            {/* Tag manager registry form */}
            <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-xs space-y-4">
              
              <div className="border-b border-slate-150 pb-2">
                <h4 className="text-sm font-extrabold text-[#07C2E3] flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-[#07C2E3]" />
                  <span>新建属性特征标志</span>
                </h4>
                <p className="text-[10px] text-[#07C2E3] font-mono mt-1 font-bold">TAG_DB</p>
              </div>

              <form onSubmit={handleCreateGlobalTag} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">标志文字名称 (支持中英文) *</label>
                  <input
                    type="text"
                    required
                    value={newGlobalTag}
                    onChange={(e) => setNewGlobalTag(e.target.value)}
                    placeholder="如: 高复购黑卡, 欧洲独立买手"
                    className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-white py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs text-center"
                >
                  确认并保存至系统库
                </button>
              </form>

              {/* Tag library cloud lists */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold block bg-slate-100 pl-1.5 py-0.5">当前已注册标志词库</span>
                <div className="flex flex-wrap gap-1 bg-white p-2.5 rounded-lg border border-slate-150 min-h-[100px] items-start">
                  {activeTags.map((t, idx) => (
                    <span 
                      key={idx}
                      className="text-[10px] bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md flex items-center gap-1"
                    >
                      <span>{t}</span>
                      <button
                        onClick={() => {
                          setActiveTags(prev => prev.filter(x => x !== t));
                          addLog('Tag System', '全局标签注销', `从库中注销标志 [${t}]`, 'warning');
                        }}
                        className="text-slate-400 hover:text-rose-500 font-bold cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Batch tagging operational registers */}
            <div className="col-span-1 lg:col-span-2 bg-white border border-slate-150 rounded-xl shadow-xs p-4 space-y-4">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="text-sm font-extrabold text-slate-950 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#07C2E3]" />
                  <span>批处理关联标签操作</span>
                </h4>
                <span className="text-[10px] text-slate-400">多选用户以触发关联</span>
              </div>

              <div className="bg-[#e6fafc]/40 p-3 rounded-lg border border-[#07C2E3]/20 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-slate-800">批量控制面板 (批量绑定/批量拨离)</p>
                  <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                    已勾选 <b className="font-mono text-[#07C2E3] text-sm">{selectedCustomerIds.length}</b> 位会员。请选定下列某款目标特征标签执行极佳绑定。
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  <select
                    value={selectedTagToApply}
                    onChange={(e) => setSelectedTagToApply(e.target.value)}
                    className="bg-white border border-slate-250 p-1 rounded text-xs text-slate-700 font-bold cursor-pointer focus:outline-hidden"
                  >
                    <option value="">-- 请选择关联的目标标志 --</option>
                    {activeTags.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleBatchApplyTag}
                    disabled={selectedCustomerIds.length === 0 || !selectedTagToApply}
                    className="bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 disabled:bg-slate-100 disabled:text-slate-400 text-white px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-all whitespace-nowrap"
                  >
                    批量绑定打标
                  </button>
                  <button
                    onClick={handleBatchRemoveTag}
                    disabled={selectedCustomerIds.length === 0 || !selectedTagToApply}
                    className="bg-slate-100 hover:bg-slate-200 active:scale-95 disabled:bg-slate-50 disabled:text-slate-350 text-slate-700 border border-slate-200 px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-all whitespace-nowrap"
                  >
                    批量解除剥离
                  </button>
                </div>
              </div>

              {/* Small grid display representing current tags assigned status */}
              <div className="border border-slate-150 rounded-lg overflow-hidden">
                <table className="w-full text-left font-sans text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-150 text-[10px] text-slate-500 font-bold uppercase">
                      <th className="p-2 text-center w-12">多选</th>
                      <th className="p-2">客户名单与ID</th>
                      <th className="p-2">当前绑定的所有分类标签</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.slice(0, 5).map(c => (
                      <tr key={c.id} className="border-b border-slate-100">
                        <td className="p-2 text-center">
                          <input 
                            type="checkbox"
                            checked={selectedCustomerIds.includes(c.id)}
                            onChange={() => handleToggleRowSelection(c.id)}
                            className="rounded text-[#07C2E3] focus:ring-[#07C2E3]"
                          />
                        </td>
                        <td className="p-2">
                          <strong className="text-slate-800">{c.name}</strong>
                          <span className="text-[10px] text-slate-400 font-mono block">{c.id}</span>
                        </td>
                        <td className="p-2">
                          <div className="flex flex-wrap gap-1 max-w-sm">
                            {c.tags.map((tg, i) => (
                              <span key={i} className="text-[9px] bg-slate-50 border border-slate-150 text-slate-500 px-1 py-0.2 rounded-sm font-bold">
                                {tg}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

        {/* ----------------- SUBTAB 5: CUSTOMER SEGMENTS OR GROUPS (Task 05) ----------------- */}
        {activeSubTab === 'groups' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-left select-none">
            
            {/* Conditional rules segment generator */}
            <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-xs space-y-4">
              
              <div className="border-b border-slate-150 pb-2">
                <h4 className="text-sm font-extrabold text-[#07C2E3] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#07C2E3]" />
                  <span>建立条件式智能筛查组</span>
                </h4>
                <p className="text-[10px] text-[#07C2E3] font-mono mt-1 font-bold">SEGMENTATION</p>
              </div>

              <form onSubmit={handleCreateConditionSegment} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">分群名称标识 *</label>
                  <input
                    type="text"
                    required
                    value={newSegmentName}
                    onChange={(e) => setNewSegmentName(e.target.value)}
                    placeholder="如: 欧洲长期沉默金主群"
                    className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">累计总充值或消费最低界限 (¥ EUR) *</label>
                  <input
                    type="number"
                    min="0"
                    value={newSegmentMinSpend}
                    onChange={(e) => setNewSegmentMinSpend(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">客户账号基本状态锁定 *</label>
                  <select
                    value={newSegmentStatus}
                    onChange={(e) => setNewSegmentStatus(e.target.value as any)}
                    className="w-full bg-white border border-slate-250 p-2 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <option value="all">不限制状态</option>
                    <option value="active">必须是正常活跃状态</option>
                    <option value="inactive">封禁、沉默或被禁用的</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 text-white py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs text-center"
                >
                  创建规则段并激活自动运算
                </button>

              </form>

            </div>

            {/* Configured segments selection list & active actions */}
            <div className="col-span-1 lg:col-span-2 bg-white border border-slate-150 rounded-xl shadow-xs p-4 space-y-4">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="text-sm font-extrabold text-slate-950 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#07C2E3]" />
                  <span>[Task 05] 租户分群名录及归类分流</span>
                </h4>
                <span className="text-[10px] text-slate-400">一键过滤或导出</span>
              </div>

              {/* Dynamic configured lists of groupings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {segmentData.map(sg => {
                  
                  // Compute match user statistics immediately
                  let matchedUserCount = customers.length;
                  const { spendMin, pointsMin, statusOnly, tagRequired } = sg.criteria;
                  if (spendMin !== undefined) matchedUserCount = customers.filter(c => c.totalSpend >= spendMin).length;
                  if (statusOnly !== undefined) matchedUserCount = customers.filter(c => c.status === statusOnly).length;
                  if (tagRequired !== undefined) matchedUserCount = customers.filter(c => c.tags.includes(tagRequired) && (spendMin ? c.totalSpend >= spendMin : true)).length;

                  return (
                    <div 
                      key={sg.id} 
                      className={`border p-3.5 rounded-xl space-y-2 flex flex-col justify-between transition-all ${
                        activeManualFilter === sg.id 
                          ? 'border-[#07C2E3] bg-[#e6fafc]/30 shadow-xs' 
                          : 'border-slate-150 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <strong className="text-slate-900 font-extrabold text-xs block">{sg.name}</strong>
                          <span className="text-[8px] bg-slate-150 text-slate-500 font-mono px-1 rounded">{sg.id}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">{sg.description}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">动态计算: <b className="font-mono text-slate-900">{matchedUserCount}人</b></span>
                        
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setActiveManualFilter(sg.id);
                              setActiveSubTab('list');
                              addLog('CRM Grouping', '激活分群过滤', `已激活筛查群组 [${sg.name}]，已同步对主客户表格进行条件规束。`, 'info');
                            }}
                            className="bg-white hover:bg-[#e6fafc] text-slate-700 hover:text-[#07C2E3] border border-slate-200 hover:border-[#07C2E3]/20 py-0.5 px-2 rounded-md text-[10px] font-bold cursor-pointer transition-colors"
                          >
                            调入列表
                          </button>
                          
                          <button
                            onClick={() => {
                              // Perform discrete CSV download of this target segment group 
                              let matchedUsers = [...customers];
                              if (spendMin !== undefined) matchedUsers = matchedUsers.filter(c => c.totalSpend >= spendMin);
                              if (statusOnly !== undefined) matchedUsers = matchedUsers.filter(c => c.status === statusOnly);
                              if (tagRequired !== undefined) matchedUsers = matchedUsers.filter(c => c.tags.includes(tagRequired));

                              const headers = ['客户ID', '姓名', '层级', '总营业额', '状态'];
                              const rows = matchedUsers.map(x => [x.id, x.name, x.tier, `$${x.totalSpend.toFixed(2)}`, x.status]);
                              const dataStr = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                              
                              const bAnchor = document.createElement("a");
                              bAnchor.setAttribute("href", encodeURI(dataStr));
                              bAnchor.setAttribute("download", `segment_${sg.id}_export.csv`);
                              document.body.appendChild(bAnchor);
                              bAnchor.click();
                              document.body.removeChild(bAnchor);
                              addLog('CRM Segment Module', '分群专属提取', `成功导出群组 [${sg.name}] 下共 ${matchedUsers.length} 位会员档案。`, 'success');
                            }}
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 py-0.5 px-2 rounded-md text-[10px] font-bold cursor-pointer transition-colors"
                          >
                            导出
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        )}

        {/* ----------------- SUBTAB 6: CRM ADVANCED IMPORTS & IMPORTS LOG (Task 07) ----------------- */}
        {activeSubTab === 'io' && (
          <div className="bg-white border border-slate-150 p-5 rounded-xl shadow-xs space-y-6 text-left select-none">
            
            <div className="border-b border-slate-150 pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold text-[#07C2E3] flex items-center gap-1.5">
                  <FileSpreadsheet className="w-5 h-5 text-[#07C2E3]" />
                  <span>[Task 07] CRM 高阶批量数据归类导入与备份</span>
                </h3>
                <p className="text-xs text-[#07C2E3] font-mono mt-1 font-bold">CSV_IMPORT</p>
              </div>
              <button
                onClick={handleDownloadStandardTemplate}
                className="bg-[#e6fafc] hover:bg-[#07C2E3] text-[#07C2E3] hover:text-white border border-[#07C2E3]/20 py-1.5 px-3 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
                title="获取官方标准对齐文件格式"
              >
                <Download className="w-3.5 h-3.5" />
                <span>下载 CSV 导入模板</span>
              </button>
            </div>

            {/* Direct loading drag and drop area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center py-8 min-h-[200px]">
                <Upload className="w-10 h-10 text-slate-350 mb-3 stroke-[1.2]" />
                <h5 className="font-extrabold text-slate-800 text-xs">选择文件或将 CSV 拖到此处</h5>
                <p className="text-[10px] text-slate-400 max-w-[190px] mt-1 mb-4 leading-normal">匹配对齐格式：【姓名, 邮箱, 电话, 积分, 标签(英文分号隔开)】</p>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleInsertManualFiles}
                  accept=".csv"
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white hover:bg-slate-100 border border-slate-250 py-1.5 px-4 rounded-lg text-xs font-bold text-slate-700 cursor-pointer shadow-2xs transition-all active:scale-95"
                >
                  浏览并上传文件
                </button>
              </div>

              {/* Loader database backup center */}
              <div className="col-span-1 lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">最近一次导入日志追溯记录 (实时加载)</span>
                  <button 
                    onClick={handleTriggerCSVExport}
                    className="bg-slate-900 hover:bg-slate-850 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 shadow-sm active:scale-95"
                  >
                    <Download className="w-3 h-3 text-[#07C2E3]" />
                    <span>执行租户 CRM 数据库归档备份导出 (.CSV)</span>
                  </button>
                </div>

                <div className="border border-slate-150 rounded-lg overflow-hidden">
                  <table className="w-full text-left font-sans text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-[10px] text-slate-500 font-bold uppercase select-none">
                        <th className="p-2 w-20 text-center">事务编号</th>
                        <th className="p-2">原始加载文件名</th>
                        <th className="p-2 text-center font-bold">成功处理条数</th>
                        <th className="p-2">核对运行详情描述</th>
                        <th className="p-2 text-right pr-3">时间</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importLogs.map(imp => (
                        <tr key={imp.id} className="border-b border-slate-100 text-[11px] font-mono text-slate-600">
                          <td className="p-2 text-center font-bold text-slate-900">{imp.id}</td>
                          <td className="p-2 font-bold text-slate-750">{imp.fileName}</td>
                          <td className="p-2 text-center font-bold text-[#07C2E3]">{imp.rowCount} 记录</td>
                          <td className="p-2 text-slate-450 italic">{imp.details}</td>
                          <td className="p-2 text-right text-slate-400 pr-3">{imp.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ----------------- SUBTAB 8: AI HOOK PLACEHOLDERS (Task 08 - COMPLIANT, NO DIALOG FLUFF!) ----------------- */}
        {activeSubTab === 'ai-api' && (
          <div className="bg-white border border-slate-150 p-5 rounded-xl shadow-xs text-left space-y-5 select-none">
            
            <div className="border-b border-slate-150 pb-3">
              <h3 className="text-base font-extrabold text-[#07C2E3] flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-[#07C2E3]" />
                <span>[Task 08] AI 联合流转计划任务自动化注册</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                根据企业数据审计及合规规则，AI 能力已被抽象至全局调度。此处仅公开注册自动化流转计划任务算子。
                AI 通过创建后台待确认任务、由管理员决定是否「立即执行」对底层 CRM 隔离数据表进行关联更改。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="border border-slate-150 rounded-xl p-4 space-y-3 bg-slate-50/50 hover:border-[#07C2E3]/45 transition-colors">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 font-mono rounded">AI-TAG-ENGINE</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                </div>
                <strong className="text-xs text-slate-900 block font-sans">AI 智能标签归类激活脚本</strong>
                <p className="text-[10px] text-slate-400 leading-normal">
                  规则：检查库中 15 天未提交任何成功订单的「普通会员」，计算退货负反馈几率，对符合标准的买家批量绑定「30天未购买」标签状态。
                </p>
                <div className="pt-2 border-t border-slate-200/50">
                  <button
                    onClick={() => handleTriggerAIBackgroundJob('AI-TAG', 'AI智能标签归类计划运行')}
                    disabled={aiJobIsRunning !== null}
                    className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white font-bold py-1.5 rounded-lg text-[10px] cursor-pointer"
                  >
                    {aiJobIsRunning === 'AI-TAG' ? '对账多租户库中...' : '调入批处理立即试运行 [AI-TAG]'}
                  </button>
                </div>
              </div>

              <div className="border border-slate-150 rounded-xl p-4 space-y-3 bg-slate-50/50 hover:border-[#07C2E3]/45 transition-colors">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 font-mono rounded">AI-COUPON-ENGINE</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                </div>
                <strong className="text-xs text-slate-900 block">AI 钻石会员定向卡券配对机制</strong>
                <p className="text-[10px] text-slate-400 leading-normal">
                  规则：检索处于「正常启用」期、累计积分大等于 1000 回馈分的高 LTV 钻石会员，对该白名单批量自动分配 €15 代折扣代卷资格。
                </p>
                <div className="pt-2 border-t border-slate-200/50">
                  <button
                    onClick={() => handleTriggerAIBackgroundJob('AI-COUPON', 'AI钻石定向卡券派发')}
                    disabled={aiJobIsRunning !== null}
                    className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white font-bold py-1.5 rounded-lg text-[10px] cursor-pointer"
                  >
                    {aiJobIsRunning === 'AI-COUPON' ? '匹配高值名单中...' : '一键流转唤引任务 [AI-COUPON]'}
                  </button>
                </div>
              </div>

              <div className="border border-slate-150 rounded-xl p-4 space-y-3 bg-slate-50/50">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] bg-slate-100 text-slate-450 px-1.5 font-mono rounded">AI-SEGMENT-ENGINE</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                </div>
                <strong className="text-xs text-slate-700 block">AI 动态流失群组自动对账</strong>
                <p className="text-[10px] text-slate-400 leading-normal">
                  规则：匹配上季度活跃度不低于 85%，但本月成交倾向趋近零状态的批发型常客。进行单独的专属客户挽回群组归划。
                </p>
                <div className="pt-2 border-t border-slate-200/50">
                  <button
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 text-slate-400 font-bold py-1.5 rounded-lg text-[10px]"
                  >
                    后续平台大版本升级内测预留 [AI-SEG]
                  </button>
                </div>
              </div>

            </div>

            {/* Task log outputs (Zero AI narrative, pure operation ledger logs) */}
            <div className="border border-slate-150 rounded-xl overflow-hidden mt-4">
              <div className="p-3 bg-slate-50 text-xs font-bold text-slate-700 border-b border-slate-150 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#07C2E3]" />
                <span>AI 后台批处理执行对账日志历史 (跨物理分区独立广播审计)</span>
              </div>
              <div className="p-3 max-h-[160px] overflow-y-auto font-mono text-[10px] text-slate-600 divide-y divide-slate-100 space-y-2">
                {aiJobsLogs.map(log => (
                  <div key={log.id} className="pt-2 flex justify-between gap-4">
                    <span className="text-[#07C2E3] font-bold">● {log.name}</span>
                    <p className="flex-1 text-slate-450 italic">{log.desc}</p>
                    <span className="text-[9px] text-slate-400 pr-2">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ----------------- POPUP MODAL 01: NEW MEMBER MANUAL INSERT DIALOG ----------------- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn select-none text-left">
          <form 
            onSubmit={handleCreateCustomerManualSubmit}
            className="bg-white border border-slate-150 rounded-xl max-w-sm w-full shadow-22xl p-5 relative space-y-4"
          >
            <button 
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-bold text-slate-900 border-b border-slate-120 pb-2.5 flex items-center gap-1.5 text-sm">
              <UserPlus className="w-4 h-4 text-[#07C2E3]" />
              <span>新建跨国买家核心档案</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              
              <div className="space-y-1">
                <label className="text-[10px] text-slate-450 font-bold block uppercase">客户姓名 *</label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="如: Alex Mercer"
                  className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-450 font-bold block uppercase">联系邮箱 (作为账单对齐依据) *</label>
                <input
                  type="email"
                  required
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  placeholder="如: alex.mercer@gmail.com"
                  className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-450 font-bold block uppercase">电话号码 (支持国际前缀)</label>
                <input
                  type="text"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="如: +1 (555) 234-5678"
                  className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block uppercase">预设可用初始积分</label>
                  <input
                    type="number"
                    value={newCustPoints}
                    onChange={(e) => setNewCustPoints(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-100 block opacity-0 select-none">等级评估</label>
                  <span className="text-[10px] text-slate-450 font-bold leading-none block border border-slate-150 p-2 rounded bg-slate-50 italic text-center">
                    等级由系统自动推导
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-450 font-bold block uppercase">分配起始标签 (用分号或逗号隔开)</label>
                <input
                  type="text"
                  value={newCustTags}
                  onChange={(e) => setNewCustTags(e.target.value)}
                  placeholder="如: VIP, 游戏设备控, 门店消费"
                  className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs"
                />
              </div>

            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-50 pt-3 text-xs">
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-1.5 px-3 rounded-lg cursor-pointer"
              >
                取消
              </button>
              <button 
                type="submit"
                className="bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 text-white py-1.5 px-4 rounded-lg font-bold shadow-sm transition-all cursor-pointer"
              >
                立即创建入库
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ----------------- POPUP MODAL 02: EDIT CUSTOMER BASIC PROFILE DIALOG ----------------- */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn select-none text-left">
          <form 
            onSubmit={handleEditCustomerApply}
            className="bg-white border border-slate-150 rounded-xl max-w-sm w-full shadow-22xl p-5 relative space-y-4"
          >
            <button 
              type="button"
              onClick={() => setShowEditModal(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-bold text-slate-900 border-b border-slate-120 pb-2.5 flex items-center gap-1.5 text-sm">
              <span className="text-[#07C2E3]">✎</span>
              <span>编辑客户核心建档</span>
            </h3>

            <div className="space-y-3 text-xs">
              
              <div className="space-y-1">
                <label className="text-[10px] text-slate-450 font-bold block uppercase">客户姓名 *</label>
                <input
                  type="text"
                  required
                  value={editCustName}
                  onChange={(e) => setEditCustName(e.target.value)}
                  className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs text-slate-800 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-450 font-bold block uppercase">通信邮箱 *</label>
                <input
                  type="email"
                  required
                  value={editCustEmail}
                  onChange={(e) => setEditCustEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-mono text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-450 font-bold block uppercase">联系电话</label>
                <input
                  type="text"
                  value={editCustPhone}
                  onChange={(e) => setEditCustPhone(e.target.value)}
                  className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-mono text-slate-800"
                />
              </div>

            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-50 pt-3 text-xs">
              <button 
                type="button"
                onClick={() => setShowEditModal(null)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-1.5 px-3 rounded-lg cursor-pointer"
              >
                取消
              </button>
              <button 
                type="submit"
                className="bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 text-white py-1.5 px-4 rounded-lg font-bold shadow-sm transition-all cursor-pointer"
              >
                保存变更
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ----------------- POPUP MODAL 03: COUPONS BULK ACCREDITOR DIALOG ----------------- */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn select-none text-left">
          <form 
            onSubmit={handleTriggerDispatchCoupon}
            className="bg-white border border-slate-150 rounded-xl max-w-sm w-full shadow-22xl p-5 relative space-y-4"
          >
            <button 
              type="button"
              onClick={() => setShowCouponModal(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-bold text-slate-900 border-b border-slate-120 pb-2.5 flex items-center gap-1.5 text-sm">
              <span className="text-amber-500">🎁</span>
              <span>派发专享代金卡券</span>
            </h3>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 text-xs space-y-1 font-mono">
              <p className="font-bold text-slate-850">目标买家: {showCouponModal.name}</p>
              <p className="text-[9px] text-slate-450">ID / 结算邮箱: {showCouponModal.id} / {showCouponModal.email}</p>
              <div className="border-t border-slate-200/50 pt-1.5 mt-1.5 flex justify-between text-[10px]">
                <span>点数: {showCouponModal.points} 分</span>
                <span>当前等级: {showCouponModal.tier}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-[10px] text-slate-450 font-bold uppercase block">可选数字优惠卡券 *</label>
              <select
                value={selectedCouponCode}
                onChange={(e) => setSelectedCouponCode(e.target.value)}
                className="w-full bg-white border border-slate-250 p-2 rounded-lg text-xs font-bold text-slate-700 cursor-pointer focus:outline-hidden"
              >
                {couponsList.map(cp => (
                  <option key={cp.code} value={cp.code}>
                    {cp.name} [{cp.code}]
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-[#e6fafc]/70 p-2.5 rounded border border-[#07C2E3]/20 text-slate-750 text-[10px] leading-relaxed">
              <span className="font-bold text-[#07C2E3] block">发放机制审计说明:</span>
              <p className="mt-0.5">管理员确认后，系统将自动向会员派发专属激活密钥，并自动在客户属签记录加上此代金券编码，在后续账单和营销邮件结算中自动作为优惠依据对齐。无需人工配置。</p>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3 text-xs">
              <button 
                type="button"
                onClick={() => setShowCouponModal(null)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-1.5 px-3 rounded-lg cursor-pointer"
              >
                取消
              </button>
              <button 
                type="submit"
                className="bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 text-white py-1.5 px-4 rounded-lg font-bold shadow-sm transition-all cursor-pointer"
              >
                确认并即时派发
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
