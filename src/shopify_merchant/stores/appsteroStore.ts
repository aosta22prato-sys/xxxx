import { create } from 'zustand';

export interface AppType {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'marketing' | 'support' | 'shipping' | 'finance' | 'ai';
  iconName: string; // Lucide icon mapping name
  isInstalled: boolean;
  rating: number;
  reviews: number;
  developer: string;
  config: Record<string, any>;
}

interface AppsteroState {
  apps: AppType[];
  installApp: (id: string) => void;
  uninstallApp: (id: string) => void;
  updateAppConfig: (id: string, config: Record<string, any>) => void;
}

const INITIAL_APPS: AppType[] = [
  {
    id: 'fx-converter',
    name: '极智多币换算',
    tagline: '商铺自适应货币换算与汇率精算工具',
    description: '自动对齐大盘最新汇率，支持多币种自动结算换算并可嵌入商品页面，提升海外顾客转化率。',
    category: 'finance',
    iconName: 'Coins',
    isInstalled: false,
    rating: 4.9,
    reviews: 142,
    developer: '商流科技',
    config: {
      eurToCny: 7.82,
      eurToUsd: 1.09,
      eurToGbp: 0.85,
      autoSync: true
    }
  },
  {
    id: 'live-bubble',
    name: '客流实时气泡',
    tagline: '极简的在线顾客对话框与智能解答助手',
    description: '在店铺右下角嵌入极简气泡，一键配置定制色，即时接入智能顾客对话与多轮尺码解答。',
    category: 'support',
    iconName: 'MessageSquare',
    isInstalled: false,
    rating: 4.8,
    reviews: 98,
    developer: '流客科技',
    config: {
      bubbleColor: '#2563eb',
      greetingMsg: '您好！很高兴为您服务。请问今天有什么我可以帮您的？',
      showAvatar: true
    }
  },
  {
    id: 'smart-courier',
    name: '一键物流发货',
    tagline: '一键对接快递单证测算并自动履行订单',
    description: '自动读取待发货订单，估算包裹重量和规格，批量录入并生成保价单面，同步大盘状态。',
    category: 'shipping',
    iconName: 'Truck',
    isInstalled: false,
    rating: 4.7,
    reviews: 215,
    developer: '极速物流',
    config: {
      defaultCarrier: 'DHL',
      autoWeightCalc: true,
      senderAddress: '官方保税仓储中心'
    }
  },
  {
    id: 'exit-intent',
    name: '智能出站挽留',
    tagline: '智能识别出站意图，极速弹送专属赠券',
    description: '在侦测到客人试图关闭标签页或移走光标时，精准触发专属折扣弹框，锁定每一次潜在流失。',
    category: 'marketing',
    iconName: 'Gift',
    isInstalled: false,
    rating: 4.6,
    reviews: 64,
    developer: '增长工坊',
    config: {
      discountCode: 'STAY15',
      discountAmount: 15,
      popupTitle: '留步，赠您专属体验折扣 💎'
    }
  },
  {
    id: 'ai-writer',
    name: '星火智能文案',
    tagline: '搭载专属模型生成的极简美学文辞描述',
    description: '基于大语言引擎，一键提炼货品核心灵魂词，针对极简美学或解构美学，秒出优雅的中文商详。',
    category: 'ai',
    iconName: 'Sparkles',
    isInstalled: false,
    rating: 5.0,
    reviews: 310,
    developer: '智能造办',
    config: {
      toneStyle: 'editorial_noir',
      lengthPref: 'balanced'
    }
  }
];

const getStoredApps = (): AppType[] => {
  const saved = localStorage.getItem('appstero_installed_apps');
  if (saved) {
    try {
      // Merge saved state into structural templates to handle structural upgrades
      const parsed: AppType[] = JSON.parse(saved);
      return INITIAL_APPS.map(tmpl => {
        const matchingSaved = parsed.find(p => p.id === tmpl.id);
        if (matchingSaved) {
          return {
            ...tmpl,
            isInstalled: matchingSaved.isInstalled,
            config: { ...tmpl.config, ...matchingSaved.config }
          };
        }
        return tmpl;
      });
    } catch {
      return INITIAL_APPS;
    }
  }
  return INITIAL_APPS;
};

export const useAppsteroStore = create<AppsteroState>((set, get) => ({
  apps: getStoredApps(),
  installApp: (id) => {
    const updated = get().apps.map(app => 
      app.id === id ? { ...app, isInstalled: true } : app
    );
    set({ apps: updated });
    localStorage.setItem('appstero_installed_apps', JSON.stringify(updated));
  },
  uninstallApp: (id) => {
    const updated = get().apps.map(app => 
      app.id === id ? { ...app, isInstalled: false } : app
    );
    set({ apps: updated });
    localStorage.setItem('appstero_installed_apps', JSON.stringify(updated));
  },
  updateAppConfig: (id, newConfig) => {
    const updated = get().apps.map(app => 
      app.id === id ? { ...app, config: { ...app.config, ...newConfig } } : app
    );
    set({ apps: updated });
    localStorage.setItem('appstero_installed_apps', JSON.stringify(updated));
  }
}));
