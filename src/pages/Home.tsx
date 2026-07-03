import React from 'react';
import { 
  Building2, 
  Shirt, 
  UtensilsCrossed, 
  ShoppingBag, 
  Scissors, 
  Globe, 
  MonitorPlay, 
  Bot, 
  Database, 
  GitFork, 
  Store, 
  ShieldCheck, 
  ArrowRight,
  Check
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: 'home' | 'register' | 'login') => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const industries = [
    {
      id: 'apparel',
      name: '服装设计批发系统',
      desc: '专为服装企业量身定制的AI驱动款式设计、面料管理与海量零散SKU的高速批发订货后台。',
      icon: Shirt,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 border-indigo-100',
    },
    {
      id: 'restaurant',
      name: '餐馆外卖系统',
      desc: '覆盖堂食点单、桌台轮转、后厨调度与自营外卖配送的AI协同轻量级数字化餐饮平台。',
      icon: UtensilsCrossed,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50 border-rose-100',
    },
    {
      id: 'appliances',
      name: '百货电器系统',
      desc: '支持跨门店连锁、进销存智能调配、品牌多重分级与AI售后追踪的全场景流转管理后台。',
      icon: ShoppingBag,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-100',
    },
    {
      id: 'beauty',
      name: '美容预约系统',
      desc: '以技师智能派单、顾客自主线上预约、耗材与储值智能精细核算为核心的高保真管理后台。',
      icon: Scissors,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-100',
    },
    {
      id: 'ecommerce',
      name: '电商网店系统',
      desc: '跨国际物流实时匹配、供应链上下游极速协同、AI智能配图选品与全渠道营销追踪中枢。',
      icon: Globe,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-100',
    },
    {
      id: 'pos',
      name: 'POS门店系统',
      desc: '软硬一体化柜面收银、不间断收银日志校验、多收银员极速交班、极简离线订单自动补偿。',
      icon: Store,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50 border-violet-100',
    }
  ];

  const capabilities = [
    {
      name: 'AI员工组织架构',
      desc: '自动生成配置岗位的AI CEO、运营、销售、客服等AI虚拟员工团队，秒级实现全要素业务智能协同。',
      icon: Bot,
    },
    {
      name: '原子知识库中心',
      desc: '支持行业说明文档、内部政策、商品图册等异构文件训练，为AI员工注入高度精准的行业大脑。',
      icon: Database,
    },
    {
      name: '可视化工作流画布',
      desc: '通过拖拽式流程定义和业务流分派，让AI自动化流程按照标准化SOP规则在多渠道安全落地运行。',
      icon: GitFork,
    },
    {
      name: '多租户物理安全隔离',
      desc: '原生架构级企业数据物理防护隔离，多层租户、独立命名空间，百分百确保各商户底层资产主权。',
      icon: ShieldCheck,
    },
    {
      name: '开放式插件市场',
      desc: '一键无缝接入并按需组合各大成熟行业插件，全面拓宽企业在支付、外派仓储、AI模型上的专属边界。',
      icon: MonitorPlay,
    },
  ];

  const plans = [
    {
      name: '基础版',
      price: '¥299',
      unit: '/ 月',
      desc: '适合初创单体门店或小微商户，提供标准经营后台及初始AI辅助工具。',
      features: [
        '自动生成行业独立后台',
        '包含1位基础AI助理员工',
        '500MB 企业云端知识库',
        '标准进销存与交易流水看板',
        '核心API接口按量调用权限'
      ],
      cta: '立即免费体验',
      badge: null,
    },
    {
      name: '专业版',
      price: '¥899',
      unit: '/ 月',
      desc: '适合处于成长、扩张期的中型实体或线上商户，深度赋能全流程业务自驱动。',
      features: [
        '基础版全部多维后台系统',
        '包含全套行业原生AI协作团队',
        '5GB 企业定制化深度知识库',
        '可视化企业级业务工作流引擎',
        '高级租户安全策略与独立备份'
      ],
      cta: '开启专业之旅',
      badge: '最受欢迎',
    },
    {
      name: '企业版',
      price: '¥2,999',
      unit: '/ 月',
      desc: '面向集团连锁企业、高密高并发的大型跨国品牌，定制架构级安全运行保障。',
      features: [
        '全功能无限开通、多维行业协同',
        '专属训练超长上下文微调模型',
        '独享主从热备份或专属云数据库',
        '专属私有化API部署及网关调用',
        '7*24小时终身资深技术团队护航'
      ],
      cta: '预约专家演示',
      badge: '尊享定制',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-950">
      {/* Top Navbar */}
      <nav id="navbar" className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">
                AI BUSINESS OS
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                id="nav-login-btn"
                onClick={() => onNavigate('login')}
                className="text-slate-600 hover:text-slate-900 px-4 py-2 text-sm font-medium transition-colors"
              >
                登录
              </button>
              <button
                id="nav-register-btn"
                onClick={() => onNavigate('register')}
                className="text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 text-sm font-medium rounded-lg transition-all"
              >
                注册
              </button>
              <button
                id="nav-start-btn"
                onClick={() => onNavigate('register')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
              >
                开始使用
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="hero" className="relative py-20 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              <span>新一代企业数字化全套基础设施</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-none">
              开启数据物理隔离的 <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">AI 驱动商户云操作系统</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
              面向服装批发、餐饮、百货、美容、电商及门店POS。一键生成行业原生数据库、自主配置AI工作流脑群及知识库隔离存储。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                id="hero-cta-btn"
                onClick={() => onNavigate('register')}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-base font-bold rounded-xl shadow-md cursor-pointer transition-all hover:translate-y-[-1px]"
              >
                创建企业企业空间
              </button>
              <button
                id="hero-secondary-btn"
                onClick={() => {
                  const element = document.getElementById('pricing-section');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-4 text-base font-medium rounded-xl transition-all"
              >
                了解套餐及价格
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Six Industries */}
      <section id="industries-section" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              覆盖六大主流实体与线上商业领域
            </h2>
            <p className="mt-4 text-slate-500">
              我们为每个行业设计了高保真的专属中台。一键选择即可生成包含完整业务逻辑、专属数据库及AI员工工作链的定制空间。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((ind) => {
              const IconComp = ind.icon;
              return (
                <div
                  key={ind.id}
                  id={`industry-card-${ind.id}`}
                  className="bg-white border border-slate-200/60 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  <div className={`p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-6 border ${ind.bgColor}`}>
                    <IconComp className={`w-6 h-6 ${ind.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{ind.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">{ind.desc}</p>
                  <div className="flex items-center text-xs font-semibold text-slate-400 group cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => onNavigate('register')}>
                    <span>申请独立生成的专属后台</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section id="capabilities-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              五大核心底座能力支撑
            </h2>
            <p className="mt-4 text-slate-500">
              不仅仅是简单的SAAS后台。用最底层的AI编排与数据完全物理隔离安全架构，赋能现代商户的核心数字化运转。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((cap, i) => {
              const IconComp = cap.icon;
              return (
                <div
                  key={i}
                  id={`capability-card-${i}`}
                  className="bg-slate-50 border border-slate-200/50 rounded-2xl p-8 hover:bg-slate-50/80 transition-all flex flex-col"
                >
                  <div className="bg-indigo-600 text-white p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-6">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{cap.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Options */}
      <section id="pricing-section" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              透明灵活的价格方案
            </h2>
            <p className="mt-4 text-slate-500">
              没有繁琐的隐藏收费，支持按需订阅。所有套餐均享用我们最高级别的安全沙箱与自动化升级保障。
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((p, i) => (
              <div
                key={i}
                id={`price-card-${i}`}
                className={`bg-white border rounded-2xl p-8 flex flex-col relative transition-all duration-300 ${
                  p.badge ? 'border-indigo-600 shadow-md scale-102 lg:translate-y-[-4px]' : 'border-slate-200 hover:shadow-md'
                }`}
              >
                {p.badge && (
                  <span className="absolute top-0 right-8 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm">
                    {p.badge}
                  </span>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{p.name}</h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{p.price}</span>
                    <span className="text-slate-400 text-sm ml-2">{p.unit}</span>
                  </div>
                  <p className="text-slate-500 text-xs min-h-[40px] leading-relaxed">{p.desc}</p>
                </div>
                <div className="border-t border-slate-100 my-4"></div>
                <ul className="space-y-4 mb-8 flex-grow">
                  {p.features.map((feat, j) => (
                    <li key={j} className="flex items-start text-xs text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 mr-2.5 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onNavigate('register')}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-bold tracking-wide transition-all ${
                    p.badge
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action Footer */}
      <section id="cta-block" className="py-24 bg-indigo-950 text-white relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-white">
            立即创建属于您的全要素数字化空间
          </h2>
          <p className="text-indigo-200 text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            仅用 1 分钟，即刻体验为您行业专属生成的后台工作台。自动配置AI高管骨干团队与知识沙盒引擎。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              id="cta-create-enterprise"
              onClick={() => onNavigate('register')}
              className="px-8 py-4 bg-white text-indigo-950 text-base font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition-all cursor-pointer hover:translate-y-[-1px]"
            >
              创建企业空间 (免费试用)
            </button>
            <button
              id="cta-schedule-demo"
              onClick={() => onNavigate('login')}
              className="px-8 py-4 bg-indigo-900 hover:bg-indigo-850 border border-indigo-700/60 text-indigo-100 text-base font-semibold rounded-xl transition-all"
            >
              已有企业空间 立即登录
            </button>
          </div>
        </div>
      </section>

      {/* Simple Clean Footer */}
      <footer className="bg-slate-950 text-slate-500 text-xs py-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-2">© 2026 AI BUSINESS OS Inc. 保留所有权利。</p>
          <p className="text-slate-600 font-mono">
            微内核隔离命名空间 • 安全合规生产级系统后台
          </p>
        </div>
      </footer>
    </div>
  );
}
