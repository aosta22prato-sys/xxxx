import { 
  Shirt, 
  UtensilsCrossed, 
  ShoppingBag, 
  Sparkles, 
  Globe, 
  ChevronRight, 
  UserCheck, 
  Database, 
  GitBranch, 
  Layers, 
  Play, 
  Scissors, 
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onQuickBypass?: (targetMode: 'merchant' | 'super_admin') => void;
  onSelectDemoIndustry?: (industry: 'retail' | 'food' | 'education' | 'healthcare' | 'service' | 'manufacturing') => void;
}

export default function HomePage({ onNavigate, onQuickBypass, onSelectDemoIndustry }: HomePageProps) {
  const industries = [
    {
      id: 'apparel',
      name: '服装设计批发系统',
      desc: '专为服装档口与批发商打造。覆盖AI自主款式设计、面料颜色尺码管理、极速分销及采购库存盘点。',
      icon: Shirt,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
    },
    {
      id: 'restaurant',
      name: '餐馆外卖系统',
      desc: '餐馆开店全栈方案。整合桌位点餐、后厨直连、多平台外卖履约、AI智能点餐员以及数字化供应链配给。',
      icon: UtensilsCrossed,
      color: 'bg-amber-50 text-amber-700 border-amber-100'
    },
    {
      id: 'merchandise',
      name: '百货电器系统',
      desc: '大中型百货与家电零售专属。支持多品牌统一建档、全链条仓储管理、售后工单追踪以及精准的AI专属导购客服。',
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-700 border-blue-100'
    },
    {
      id: 'beauty',
      name: '美容预约系统',
      desc: '美发、美容、SPA门店首选。支持灵活的技师排班、会员专属储值运营、套餐设计以及AI智能微信秘书。',
      icon: Scissors,
      color: 'bg-purple-50 text-purple-700 border-purple-100'
    },
    {
      id: 'ecommerce',
      name: '电商网店系统',
      desc: '面向多波段网店精细化运营。集合AI产品选品分析、自动广告投放专员、跨渠道订单追踪与集中化的财务中心。',
      icon: Globe,
      color: 'bg-rose-50 text-rose-700 border-rose-100'
    },
    {
      id: 'pos',
      name: 'POS门店系统',
      desc: '重构新零售实体门店。内置极致流畅的高效收银中心、全渠道实时盘库、店长AI运营日志以及跨门店数据报表。',
      icon: Layers,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-100'
    }
  ];

  const capabilities = [
    {
      name: 'AI 员工中心',
      desc: '可全天候工作的虚拟智能岗位。配备专职AI运营、AI客服主管、AI财务分析师、AI销售和AI行业秘书，像管理真人一样，为AI员工分派任务、训练知识包与配置工作流。',
      icon: UserCheck
    },
    {
      name: '云端企业知识库',
      desc: '打破部门间的信息孤岛。支持一键导入产品手册、规章制度、合同文本、行业规范等多维知识资产。通过AI大模型进行深度自适应训练，使所有AI员工均具备专家级企业常识。',
      icon: Database
    },
    {
      name: '图形化工作流中心',
      desc: '让企业流程实现全自动化自动运行。采用可视化网格配置，支持复杂的逻辑门控（分支判断、循环流转、延时等待），实现AI员工与企业老业务系统（ERP、CRM）无缝咬合。',
      icon: GitBranch
    },
    {
      name: '一站式应用市场',
      desc: '为特定场景提供开箱即用的专业插件与主题。可按需订阅高级财务报表插件、进销存追踪器、短信批量触达工具、多语言多币种折算系统及定制化的系统看板，灵巧按需扩展。',
      icon: Sparkles
    },
    {
      name: '全物理隔离多租户',
      desc: '为每一家企业配备高规格的安全隔离带。支持租户独立数据库、私有资源分发、独立的权限控制字典以及完整的企业运营操作审计审计日志，深度确保企业商业机密万无一失。',
      icon: ShieldCheck
    }
  ];

  const pricingTiers = [
    {
      name: '基础版',
      price: '¥299',
      unit: '月',
      desc: '适合初创门店或小型独立零售团队，提供核心业务系统运作。',
      features: [
        '单项行业定制后台系统',
        '3名岗位制AI员工授权',
        '10GB 企业知识库云端空间',
        '基础业务流程工作流配置',
        '独立的租户级沙箱运行环境',
        '标准工作日在线技术支持'
      ],
      cta: '立即免费试用',
      popular: false
    },
    {
      name: '专业版',
      price: '¥699',
      unit: '月',
      desc: '深度赋能成长期中小企业，释放AI组织的超级协同力量。',
      features: [
        '多行业后台系统无缝自由切换',
        '10名岗位制核心AI员工授权',
        '50GB 多源企业专属知识库空间',
        '高级门控及循环流向工作流',
        '独立应用市场精品插件免费授权 (至多5款)',
        '7*24小时金牌一对一专属支持'
      ],
      cta: '开始专业体验',
      popular: true
    },
    {
      name: '企业版',
      price: '¥1,599',
      unit: '月',
      desc: '为大型集团与连锁形态量身定制，支持无限扩展的大规模SaaS演进。',
      features: [
        '全行业模板与定制开发模块融合',
        '不设上限的专属行业AI员工部署',
        '1TB 独享大规模企业知识库与向量引擎',
        '高保真、无限流向的多级工作流编排',
        '全面打通外部自有ERP/CRM接口及API授权',
        '专属架构师贴身定制及上门培训'
      ],
      cta: '预约企业级演示',
      popular: false
    }
  ];

  return (
    <div id="homepage-container" className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-slate-200 selection:text-slate-900">
      {/* 开发者专属硬核通道 */}
      <div className="bg-slate-950 border-b border-cyan-500/35 py-2.5 px-4 text-xs font-semibold text-slate-200 relative z-[100] shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2.5">
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#07C2E3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#07C2E3]"></span>
            </span>
            <span className="text-slate-300">🤖 AI Commerce OS <span className="text-[#07C2E3] font-bold">开发专线</span>:</span>
            <span className="text-[10px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">Sandbox Auto-Bypass Mode</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="dev-bypass-merchant-header"
              onClick={() => onQuickBypass?.('merchant')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 hover:border-[#07C2E3]/40 rounded-md font-medium transition-all shadow-sm flex items-center gap-1 cursor-pointer active:scale-95 text-xs"
            >
              <span>🚪 立即免签穿梭: <b>[ 商家后台 ]</b></span>
            </button>
            <button
              id="dev-bypass-super-admin-header"
              onClick={() => onQuickBypass?.('super_admin')}
              className="px-3 py-1.5 bg-[#07C2E3]/15 hover:bg-[#07C2E3]/25 text-[#07C2E3] hover:text-cyan-400 border border-[#07C2E3]/35 rounded-md font-medium transition-all shadow-sm flex items-center gap-1 cursor-pointer active:scale-95 text-xs"
            >
              <span>🦾 立即跨越进入: <b>[ 平台总后台 ]</b></span>
            </button>
          </div>
        </div>
      </div>

      {/* 顶部导航 */}
      <nav id="navbar" className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold tracking-wider text-lg shadow-sm">
                AI
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-slate-900 tracking-tight leading-none">AI Business OS</span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide mt-1">企业级多租户业务操作系统</span>
              </div>
            </div>

            {/* 功能区菜单 */}
            <div className="flex items-center space-x-8">
              <button 
                id="btn-nav-login"
                onClick={() => onNavigate('login')}
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                登录
              </button>
              <button 
                id="btn-nav-register"
                onClick={() => onNavigate('register')}
                className="text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4.5 py-2 rounded-lg transition-all shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 cursor-pointer"
              >
                注册账户
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero 区域 */}
      <section id="hero-section" className="relative py-20 lg:py-28 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 py-1.5 px-3.5 rounded-full text-xs font-semibold text-slate-600 mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-slate-900 animate-pulse" />
            <span>全新一代 AI 多租户业务操作系统</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            以 AI 员工为核心的<br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900">
              全场景数字化经营套件
            </span>
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            为您自动生成专属行业后台、专属AI专业团队、企业级安全知识库及自动化工作流。实现多租户物理安全隔离。
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              id="btn-hero-start"
              onClick={() => onNavigate('register')}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <span>立即开始 · 创建企业</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              id="btn-hero-demo"
              onClick={() => onNavigate('register')}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>免费预约演示</span>
            </button>
          </div>

          {/* 快捷穿梭面板 */}
          <div className="mt-12 max-w-xl mx-auto p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-3.5 animate-fadeIn">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#07C2E3] animate-pulse" />
              <span>开发优先快捷调试通道 (Direct Skip Workspace)</span>
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              <button
                id="dev-bypass-merchant-hero"
                onClick={() => onQuickBypass?.('merchant')}
                className="py-3 px-4 bg-slate-850 hover:bg-slate-800 text-slate-100 font-bold rounded-xl border border-slate-700 hover:border-[#07C2E3]/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 text-xs text-center"
              >
                🚪 直接进入 商家端后台
              </button>
              <button
                id="dev-bypass-super-admin-hero"
                onClick={() => onQuickBypass?.('super_admin')}
                className="py-3 px-4 bg-[#07C2E3]/20 hover:bg-[#07C2E3]/35 text-[#07C2E3] hover:text-cyan-400 font-bold rounded-xl border border-[#07C2E3]/30 hover:border-[#07C2E3]/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 text-xs text-center"
              >
                🦾 直接进入 平台总后台 (AI中枢)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 六大行业系统 */}
      <section id="industries-section" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">行业专精系统</h2>
          <p className="mt-4 text-base text-slate-500 max-w-2xl mx-auto">
            支持六大精选实体及线上行业。创建企业后，系统将为您自适应匹配并自动装配独立的行业控制后台。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((ind) => {
            const IconComponent = ind.icon;
            const handleIndustryClick = () => {
              if (onSelectDemoIndustry) {
                const mappedMap: Record<string, 'retail' | 'food' | 'education' | 'healthcare' | 'service' | 'manufacturing'> = {
                  apparel: 'retail',
                  restaurant: 'food',
                  merchandise: 'manufacturing',
                  beauty: 'service',
                  ecommerce: 'education',
                  pos: 'healthcare'
                };
                onSelectDemoIndustry(mappedMap[ind.id]);
              }
            };

            return (
              <div 
                key={ind.id} 
                id={`industry-card-${ind.id}`}
                onClick={handleIndustryClick}
                className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-[#07C2E3]/60 transition-all flex flex-col justify-between cursor-pointer group hover:scale-[1.01] active:scale-[0.99] hover:bg-slate-50/10 text-left"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${ind.color} mb-5 group-hover:scale-105 transition-transform`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#07C2E3] transition-colors">{ind.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">{ind.desc}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span className="text-emerald-600 font-bold">● 物理多租户硬隔离</span>
                  <div className="flex items-center gap-1 text-[#07C2E3] hover:text-[#06B2D0] transition-colors font-bold">
                    <span>进入演示商户端</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 平台核心能力 */}
      <section id="capabilities-section" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-18 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Platform Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 text-white">五大平台数字化支撑能力</h2>
            <p className="text-slate-400 mt-4 text-base">
              无需繁复系统堆砌，平台采用统一数据与AI架构层，赋予每个业务单元绝对的智能化升级。
            </p>
          </div>

          <div className="space-y-12">
            {capabilities.map((cap, index) => {
              const IconComponent = cap.icon;
              return (
                <div 
                  key={index} 
                  id={`capability-block-${index}`}
                  className="bg-slate-800/50 border border-slate-800 p-8 rounded-3xl flex flex-col lg:flex-row lg:items-center gap-8 hover:bg-slate-800/80 transition-all"
                >
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white shrink-0">
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{cap.name}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{cap.desc}</p>
                  </div>
                  <div className="shrink-0 lg:pl-4">
                    <button 
                      onClick={() => onNavigate('register')}
                      className="px-5 py-2.5 bg-white text-slate-900 font-bold text-sm rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>了解详情</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 价格方案定价 */}
      <section id="pricing-section" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">合理透明的价值体系</h2>
          <p className="mt-4 text-base text-slate-500 max-w-2xl mx-auto">
            按企业组织规模选购，无隐藏消费。试用环境一键全透明自动就绪。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingTiers.map((tier, index) => (
            <div 
              key={index}
              id={`pricing-card-${index}`}
              className={`bg-white border rounded-3xl p-8 flex flex-col justify-between relative ${tier.popular ? 'border-slate-900 shadow-lg ring-1 ring-slate-900' : 'border-slate-200 shadow-sm hover:border-slate-300'}`}
            >
              {tier.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold tracking-widest px-3.5 py-1 rounded-full uppercase">
                  最受欢迎
                </span>
              )}
              
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{tier.name}</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed min-h-[32px]">{tier.desc}</p>
                
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold tracking-tight text-slate-900">{tier.price}</span>
                  <span className="text-sm text-slate-500 ml-1">/{tier.unit}</span>
                </div>

                <ul className="space-y-3.5 border-t border-slate-100 pt-6 mb-8">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <CheckCircle2 className="w-4.5 h-4.5 text-slate-900 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onNavigate('register')}
                className={`w-full py-3 px-4 font-bold rounded-xl text-sm transition-all text-center cursor-pointer ${
                  tier.popular 
                    ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-md' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 底部 CTA 区域 */}
      <section id="cta-conclusion-section" className="bg-slate-900 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#1e293b,transparent)] opacity-80" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            开启数字升级契机，让 AI 为企业增效
          </h2>
          <p className="mt-4 text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            立即创建您的企业AI空间，零部署延迟，体验不一样的生产力革命。
          </p>
          <div className="mt-8">
            <button
              id="btn-footer-cta"
              onClick={() => onNavigate('register')}
              className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl text-base shadow-lg hover:bg-slate-50 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>立即创建企业</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer id="footer" className="bg-slate-950 border-t border-slate-900 py-12 text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <span className="text-white font-bold tracking-wider bg-slate-800 w-7 h-7 rounded-md flex items-center justify-center text-xs">AI</span>
            <span className="text-sm font-semibold text-slate-400">AI Business OS</span>
            <span className="text-xs text-slate-600">| © 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-xs font-semibold text-slate-400">
            <span className="hover:text-slate-300 transition-colors cursor-pointer" id="footer-link-terms" onClick={() => onNavigate('register')}>使用条款</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer" id="footer-link-privacy" onClick={() => onNavigate('register')}>隐私政策</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer" id="footer-link-help" onClick={() => onNavigate('register')}>帮助文档</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
