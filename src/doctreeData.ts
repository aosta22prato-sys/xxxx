export interface DocTreeNode {
  id: string;
  title: string;
  status: 'done' | 'pending';
  locationDesc?: string;
  details?: string;
  children?: DocTreeNode[];
}

export const DOCTREE_DATA: DocTreeNode[] = [
  {
    id: 'entry-1',
    title: '入口一：首页落地页 & 行业核心后台',
    status: 'done',
    details: '包含 SaaS 落地宣传主页、多步骤智能注册流程（自动生成企业、AI机构、行业数据库与工作流），以及六大行业（服装设计、餐馆外卖、百货电器、美容预约、电商网店、POS门店）后台经营驾驶舱。',
    children: [
      {
        id: 'entry-1-landing',
        title: '首页落地页',
        status: 'done',
        locationDesc: '「系统注册流程 & 落地页模态」',
        details: '包含了品牌宣传、产品介绍、行业介绍、AI团队展示、客户案例、价格方案、常见问题等落地页面核心板块，并提供立即开始、免费试用与预约演示入口。',
        children: [
          { id: '1-1', title: '品牌宣传与产品功能介绍', status: 'done', locationDesc: 'SaaS 落地页首屏' },
          { id: '1-2', title: 'AI 虚拟团队与多代理人介绍', status: 'done', locationDesc: '落地页 AI Roster' },
          { id: '1-3', title: '客户案例与价格阶梯方案', status: 'done', locationDesc: '价格明细面板' },
          { id: '1-4', title: '预约演示与免费试用申请', status: 'done', locationDesc: '表单引导弹窗' }
        ]
      },
      {
        id: 'entry-1-signup',
        title: '四步智能注册流水线',
        status: 'done',
        locationDesc: '「系统注册引导」',
        details: '注册时输入企业基本信息，点击选择行业与企业版基础套餐，系统即可自动并发生成一整套企业空间、行业专属后台、专属AI成员组、专属企业知识库和自动化工作流。',
        children: [
          { id: 'steps-1', title: '第一步：创建企业 (企业名称、负责人、电话、基本认证密码)', status: 'done' },
          { id: 'steps-2', title: '第二步：选择行业 (服装设计批发、餐馆外卖、百货电器、美容预约、电商网店、POS门店)', status: 'done' },
          { id: 'steps-3', title: '第三步：选择套餐 (经典基础版 $199、专业进阶版 $499、企业旗舰版)', status: 'done' },
          { id: 'steps-4', title: '第四步：自动开辟空间 (秒级构建专属 AI Employee 关系网、初始化行业 SKU、同步特定领域知识包)', status: 'done' }
        ]
      },
      {
        id: 'ind-apparel',
        title: '行业一：服装设计批发系统',
        status: 'done',
        locationDesc: '「切换 RETAIL 行业」',
        details: '为服装供应链量身定制，包含商品款式、面料及尺码管理，自带 AI 辅助设计、AI买手推荐、多网点自动化采购与低库存一键补货功能。',
        children: [
          { id: 'ap-1', title: '首页驾驶舱 (实时展现销售指数、热卖款式分析与多智能体协调拓扑图)', status: 'done' },
          { id: 'ap-2', title: '设计中心与款式中心 (包含面料物料、款式图谱、尺码及 SKU 精细化明细清单)', status: 'done' },
          { id: 'ap-3', title: '工厂与供应商采购体系 (低水位 SKU 提醒、支持直接一键下发采购订单/PO 协同)', status: 'done' },
          { id: 'ap-4', title: 'AI 专项助理 (AI 专属买手推荐、AI 服装设计思路、AI 批发大宗业务销售助理)', status: 'done' }
        ]
      },
      {
        id: 'ind-restaurant',
        title: '行业二：餐馆外卖系统',
        status: 'done',
        locationDesc: '「切换 FOOD 行业」',
        details: '餐饮外卖与堂食系统，核心是菜单和外卖调度，并内置 AI 点餐员、外卖运营经理、以及厨房队列状态监控。',
        children: [
          { id: 'fd-1', title: '经营驾驶舱 (展示餐馆营业额、客单价分析、外卖配送效率与餐桌占用率图表)', status: 'done' },
          { id: 'fd-2', title: '菜单中心与分类管理 (菜单数据定义，集成菜品库存与原材料消耗预警指标)', status: 'done' },
          { id: 'fd-3', title: '桌台点餐与外卖中心 (前台快速呼入外卖、桌台二维码点单状态跟踪)', status: 'done' },
          { id: 'fd-4', title: 'AI 点餐员 / 服务员 / 店长 / 采购 (提供定制 AI 服务员 System Prompt 训练以及 Slack 虚拟会话机制)', status: 'done' }
        ]
      },
      {
        id: 'ind-goods',
        title: '行业三：百货电器系统',
        status: 'done',
        locationDesc: '「切换 MANUFACTURING 行业」',
        details: '百货电器多网店运营。拥有精准的商品中心、品牌分类、售后追踪体系。集成 AI 售后顾问、AI 采购预测。',
        children: [
          { id: 'gd-1', title: '商品、品牌与多级分类管理 (管理大型百货电器目录、支持级联搜索、精准 SKU 定价)', status: 'done' },
          { id: 'gd-2', title: '仓储物流控制 (支持多仓储联合盘点、库存周转时效监控)', status: 'done' },
          { id: 'gd-3', title: '售后问题解决中心 (对接 AI 售后经理，一键审核异常账期并分析退款合理性)', status: 'done' },
          { id: 'gd-4', title: 'AI 专属导购 & 售后客服 (基于 Gemini 的家电型号参数解答与定制营销活动撰写)', status: 'done' }
        ]
      },
      {
        id: 'ind-beauty',
        title: '行业四：美容预约系统',
        status: 'done',
        locationDesc: '「切换 SERVICE 行业」',
        details: '主打技师调度、门店预订与技师忙闲视图，包含储值管理以及 AI 预约秘书和营销顾问。',
        children: [
          { id: 'bt-1', title: '技师空闲看板 (支持多技师、多美容细分项目忙闲时间轴，实时状态拖曳式交互)', status: 'done' },
          { id: 'bt-2', title: '预约日历中心 (查看未来订单、支持一键呼入修改、取消与分配特定美容床位)', status: 'done' },
          { id: 'bt-3', title: '会员储值与套餐运营 (针对常客发放储值折扣、套餐打卡次数充值与跟进记录)', status: 'done' },
          { id: 'bt-4', title: 'AI 美容专职秘书 / 会员顾问 (智能匹配常客消费记录，主动催付促活、推荐美肤套餐)', status: 'done' }
        ]
      },
      {
        id: 'ind-ecommerce',
        title: '行业五：电商网店系统',
        status: 'done',
        locationDesc: '「切换 RETAIL 行业并在 Sourcing 选项卡体验」',
        details: '跨境和垂直电商网店核心，亮点是 AI 智能选品、物流渠道调度以及第三方 ERP API 结合。',
        children: [
          { id: 'ec-1', title: '店铺与在线商品中心 (快速同步 Shopify/WooCommerce 网店，查看核心转化漏斗及跳出率)', status: 'done' },
          { id: 'ec-2', title: 'AI 智能选品师 (基于社交媒体、TikTok 爆款与全球供应链大盘大数据推荐新品 - 已经与实时的 Gemini 模型深度结合)', status: 'done' },
          { id: 'ec-3', title: '物流与供应链中转 (支持实时触发 DHL、FedEx 的物流发运标签、自动填单创建物流轨迹)', status: 'done' },
          { id: 'ec-4', title: 'AI 运营总监 / 广告专员 (一键生成高转换率社媒营销广告、投放 ROI 分析预测)', status: 'done' }
        ]
      },
      {
        id: 'ind-pos',
        title: '行业六：POS门店系统',
        status: 'done',
        locationDesc: '「Command 收银结算及交班面板」',
        details: '面向线下实体门店提供收银结账、前台交班交接审计、储值与商铺优惠券核销等功能。',
        children: [
          { id: 'ps-1', title: '门店交班一键收退银 (显示交班差额比率、支持核对线上/线下总实收账目)', status: 'done' },
          { id: 'ps-2', title: '收银计费与储值扣减 (前台销售直接自动对账、对扣会员卡余额与派发临时优惠券)', status: 'done' },
          { id: 'ps-3', title: 'AI 智能收银店长 (分析交班异常流水、检测虚假退银欺诈事件，降低门店盗损)', status: 'done' }
        ]
      }
    ]
  },
  {
    id: 'entry-2',
    title: '入口二：商家控制中心',
    status: 'done',
    details: '商家主控制中心（Merchant Control Workspace）。控制并授权整个企业的 AI 团队、设计自动化事件触发、维护 RAG 知识库以及开通应用生态。',
    children: [
      {
        id: 'entry-2-profile',
        title: '企业资料与基础设置',
        status: 'done',
        locationDesc: '「系统头部多租户切换 & 密钥管理」',
        children: [
          { id: 'pr-1', title: '当前运行环境多租户一键自如切换', status: 'done' },
          { id: 'pr-2', title: '手动 Provision 团队独立的 Gemini API Key 核心端点', status: 'done' },
          { id: 'pr-3', title: '员工管理与角色权限配置中心', status: 'pending', locationDesc: '「企业基础运维 - 待后续迭代」' }
        ]
      },
      {
        id: 'entry-2-ai-roster',
        title: '企业 AI 雇员组织架构中心',
        status: 'done',
        locationDesc: '「AI Employees 选项卡 (Agents)」',
        details: '可视化自定义管理所有岗位 AI。可随时启用、禁用、编辑系统 Prompt 提示词，查看目前正在执行的工作任务、量化 ROI 与节省的人性人工总工时。',
        children: [
          { id: 'ros-1', title: '新增、删除、启用与停用 AI 专属雇员 (更新岗位卡片并自动同步到操作总后台)', status: 'done' },
          { id: 'ros-2', title: '岗位核心参数配置 (支持编辑 System Prompt 词，让 AI 深入学习特定商业口吻)', status: 'done' },
          { id: 'ros-3', title: '任务目标、KPI 运行目标与绩效分析 (查看 saved ROI、本月完成决策数和运行健康度)', status: 'done' }
        ]
      },
      {
        id: 'entry-2-rag',
        title: '知识库中心 (RAG Knowledge Sync)',
        status: 'done',
        locationDesc: '「RAG Knowledge Core 选项卡 (RAG)」',
        details: '专为 AI 提供深度企业背景知识。支持一键快速同步各类核心文档、政策制度或商品型号手册，还可以直接输入特定文本片段并即刻嵌入，直接让 AI 用于后续的检索分析。',
        children: [
          { id: 'rag-1', title: '行业默认专业文档包自动建立与同步 (根据注册行业自动初始化对应领域的 PDF/DOC 索引)', status: 'done' },
          { id: 'rag-2', title: '文本片段实时录入同步 (手动录入新信息，立即嵌入到 AI 意识流，辅助回答特定行业问题)', status: 'done' },
          { id: 'rag-3', title: '搜索特定词元进行文档库过滤 (确保资料能完美匹配最新的企业流程政策)', status: 'done' }
        ]
      },
      {
        id: 'entry-2-workflow',
        title: '企业工作流中心 (Visual Workflow Pipeline)',
        status: 'done',
        locationDesc: '「Visual Workflow Pipeline 选项卡 (n8n-Style 引擎)」',
        details: '交互式可视化学徒，商户可以自由设计触发器、条件分支判断并触发特定的 API webhook 与 rest 请求。自带完整的 dry run 沙盒环境。',
        children: [
          { id: 'wf-1', title: '事件触发节点 Trigger (下单成功、退货发起、水位跌破阈值)', status: 'done' },
          { id: 'wf-2', title: 'AI 代理决策节点 Agent Action (AI 自动判断，自动派发大宗采购)', status: 'done' },
          { id: 'wf-3', title: '条件判定分支 Condition Routing (欺诈风险是否超标、毛利率是否符合安全界限)', status: 'done' },
          { id: 'wf-4', title: '物理 API 触达 Action (DHL 物流标签、Twilio WhatsApp 发信、发送采购订单 PO)', status: 'done' }
        ]
      },
      {
        id: 'entry-2-marketplace',
        title: '应用商店市场 (App Marketplace)',
        status: 'done',
        locationDesc: '「SaaS Marketplace (App Market)」',
        details: '允许自由获取、开通与整合一键同步到系统的附加 AI 技能。包含物流模块扩展、定制微信/WhatsApp 催付插件等等。',
        children: [
          { id: 'mkt-1', title: '多合一智能应用插件展示与详细功能、费用卡片描述', status: 'done' },
          { id: 'mkt-2', title: '一键激活/安装插件，直接并发开通对应的背景支持大模型参数', status: 'done' },
          { id: 'mkt-3', title: '定制主题、支付账期维护与开通账单记录统计', status: 'pending', locationDesc: '「计费运维 - 待后续大宗财务结算接入」' }
        ]
      }
    ]
  },
  {
    id: 'entry-3',
    title: '入口三：平台总后台',
    status: 'done',
    details: '针对云端 SaaS 总服务商与超级管理员（Super Admin Console），提供多租户统计、模型成本核算与行业大盘的监控启停控制。',
    children: [
      {
        id: 'entry-3-admin',
        title: '控制大盘与平台驾驶舱',
        status: 'done',
        locationDesc: '「大屏仪表盘 & 实时 Operations 日志台」',
        children: [
          { id: 'adm-1', title: '大盘核心统计 (显示活跃租户数、累计替代工时费用 saved ROI)', status: 'done' },
          { id: 'adm-2', title: '行业启用/禁用高级大盘控制中心 (一键停启用、新增或卸载内置的行业方案)', status: 'done' },
          { id: 'adm-3', title: '模型 API 开销监控 (监测 Gemini tokens 消耗、实时反应 AI 云端运行成本并记录耗损比)', status: 'done' },
          { id: 'adm-4', title: '实时超级审计日志 (记录各企业租户在系统中所有的 AI 路由、欺诈干预与异常订单日志详情)', status: 'done' }
        ]
      },
      {
        id: 'entry-3-sys',
        title: '平台系统运营与风控',
        status: 'pending',
        locationDesc: '「超级系统设置 & 多币种结算」',
        details: '主要包含后台系统层级的高级备份恢复、工单支持、开发者中心和全套财务自动轧账核销。',
        children: [
          { id: 'sys-1', title: '工单催办与工单中心 (支持收集反馈、超级管理员介入仲裁流程)', status: 'pending' },
          { id: 'sys-2', title: '多机构结算，财务自动核销账单 (多国币种、费率及折扣配置)', status: 'pending' },
          { id: 'sys-3', title: '数据库全量灾备与数据恢复一键部署计划', status: 'pending' }
        ]
      }
    ]
  }
];
