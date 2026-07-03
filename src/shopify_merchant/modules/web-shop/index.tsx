import React, { useState, useEffect, useRef } from 'react';
import { useContentStore } from '../../stores/contentStore';
import { useProductStore } from '../../stores/productStore';
import { ThemeConfig } from '../../database/themes';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Palette, 
  Layers, 
  RefreshCw, 
  Trash2, 
  Save, 
  ArrowLeft, 
  Upload, 
  Sparkles, 
  Globe, 
  Check, 
  Laptop, 
  Smartphone, 
  Settings,
  Lock,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  Eye,
  CheckCircle,
  HelpCircle,
  X,
  Heart
} from 'lucide-react';

export default function ThemeLibraryAndCustomizer() {
  const { themes, addTheme, updateTheme, deleteTheme, hydrateAll } = useContentStore();
  const { products } = useProductStore();
  
  // States
  const [isEditing, setIsEditing] = useState(false);
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [toast, setToast] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  
  // Simulated sales state
  const [salesCount, setSalesCount] = useState<number>(0);
  const [salesLog, setSalesLog] = useState<string | null>(null);

  // Live shop preview modal
  const [showLiveStore, setShowLiveStore] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Upload ZIP state
  const [zipState, setZipState] = useState<'idle' | 'unzip' | 'verify' | 'done'>('idle');
  const zipInputRef = useRef<HTMLInputElement>(null);

  // Full-screen template preview & responsive browsing portal states
  const [previewingTheme, setPreviewingTheme] = useState<ThemeConfig | null>(null);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewIsPreset, setPreviewIsPreset] = useState<boolean>(false);
  const [rawPresetObj, setRawPresetObj] = useState<any | null>(null);
  const [heartCount, setHeartCount] = useState<number>(385);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  // Helper to map presets to fully valid ThemeConfig preview
  const mapPresetToTheme = (preset: any): ThemeConfig => {
    return {
      id: preset.id,
      name: preset.name,
      status: 'draft',
      primaryColor: preset.primary,
      accentColor: preset.accent,
      backgroundColor: preset.bg,
      textColor: preset.text,
      headerStyle: 'inline',
      footerLayout: 'simple',
      footerText: `© ${preset.name} - Designed and Engineered.`,
      enableSlider: true,
      sliderBanners: [
        {
          id: 'b1',
          imageUrl: preset.image,
          title: preset.title,
          subtitle: preset.subtitle,
          buttonText: '探寻专区',
          buttonLink: '#'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  const handleInstallFromStoreAndEdit = (preset: any) => {
    // Create clone
    const newId = `inst_${preset.id}_${Date.now()}`;
    const cloonedTheme: ThemeConfig = {
      id: newId,
      name: preset.name,
      status: 'draft',
      primaryColor: preset.primary,
      accentColor: preset.accent,
      backgroundColor: preset.bg,
      textColor: preset.text,
      headerStyle: 'inline',
      footerLayout: 'simple',
      footerText: `© ${preset.name} - Designed and Engineered.`,
      enableSlider: true,
      sliderBanners: [
        {
          id: 'b1',
          imageUrl: preset.image,
          title: preset.title,
          subtitle: preset.subtitle,
          buttonText: '探寻专区',
          buttonLink: '#'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    addTheme(cloonedTheme);
    setActiveThemeId(newId);
    
    // Publish it
    themes.forEach(t => {
      if (t.status === 'active') {
        updateTheme(t.id, { status: 'draft' });
      }
    });
    updateTheme(newId, { status: 'active' });
    
    // Enter editing mode
    setIsEditing(true);
    setPreviewingTheme(null);
    triggerToast(`添加主题并进入【${preset.name}】在线装修 🎨`);
  };

  const handleLocalEditFromPreview = (theme: ThemeConfig) => {
    setActiveThemeId(theme.id);
    setIsEditing(true);
    setPreviewingTheme(null);
    triggerToast(`开启【${theme.name} animate-slideUp】在线装修 🛠️`);
  };

  // Hydration
  useEffect(() => {
    hydrateAll();
  }, [hydrateAll]);

  // Sync loaded presets
  useEffect(() => {
    if (themes.length > 0 && !activeThemeId) {
      const active = themes.find(t => t.status === 'active') || themes[0];
      setActiveThemeId(active.id);
    }
  }, [themes, activeThemeId]);

  const activeTheme = themes.find(t => t.id === activeThemeId) || themes.find(t => t.status === 'active') || themes[0];

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const handlePublish = (id: string) => {
    themes.forEach(t => {
      if (t.id === id) {
        updateTheme(t.id, { status: 'active' });
      } else if (t.status === 'active') {
        updateTheme(t.id, { status: 'draft' });
      }
    });
    setActiveThemeId(id);
    triggerToast('已发布');
  };

  const handleSimulateBuy = (pTitle: string) => {
    setSalesCount(prev => prev + 1);
    setSalesLog(`售出：${pTitle.substring(0, 4)}`);
    triggerToast('订购成功');
    setTimeout(() => setSalesLog(null), 3000);
  };

  // Dynamic Theme Store presets state representing three customizable live themes
  const [shelfPresets, setShelfPresets] = useState([
    {
      id: 'pre_horizon',
      name: 'Horizon',
      author: 'di Shopify',
      primary: '#111111',
      accent: '#2563eb',
      bg: '#ffffff',
      text: '#171717',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
      title: '主推新款设计',
      subtitle: '现代都市极简廓形裁剪与色块拼接'
    },
    {
      id: 'pre_tinker',
      name: 'Tinker',
      author: 'di Shopify',
      primary: '#b45309',
      accent: '#059669',
      bg: '#fafaf9',
      text: '#44403c',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80',
      title: '质感泥作陶具',
      subtitle: '手工旋转拉坯与泥胎柴烧自然粗粝'
    },
    {
      id: 'pre_savor',
      name: 'Savor',
      author: 'di Shopify',
      primary: '#dc2626',
      accent: '#1e3a8a',
      bg: '#fffcfc',
      text: '#1a0505',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
      title: '轻奢风味餐饮',
      subtitle: '新鲜慢压有机作料与精细食材拼盘'
    }
  ]);

  // Dynamic Theme Clooner
  const handleInstallFromStore = (preset: typeof shelfPresets[0]) => {
    // Prevent duplicate keys
    const newId = `inst_${preset.id}_${Date.now()}`;
    const cloonedTheme: ThemeConfig = {
      id: newId,
      name: preset.name,
      status: 'draft',
      primaryColor: preset.primary,
      accentColor: preset.accent,
      backgroundColor: preset.bg,
      textColor: preset.text,
      headerStyle: 'inline',
      footerLayout: 'simple',
      footerText: `© ${preset.name} - Designed and Engineered.`,
      enableSlider: true,
      sliderBanners: [
        {
          id: 'b1',
          imageUrl: preset.image,
          title: preset.title,
          subtitle: preset.subtitle,
          buttonText: '探寻专区',
          buttonLink: '#'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    addTheme(cloonedTheme);
    setActiveThemeId(newId);
    
    // Auto active theme
    setTimeout(() => {
      handlePublish(newId);
    }, 50);

    triggerToast(`主题 ${preset.name} 已成功添加并部署！`);
  };

  // AI Generator
  const handleAiGen = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    triggerToast('正在为三套皮肤精算智能方案...');

    setTimeout(() => {
      const mood = aiPrompt.trim().toLowerCase();
      
      let hPrimary = '#111111', hAccent = '#2563eb', hBg = '#ffffff', hText = '#171717', hTitle = 'Horizon 意式摩登', hSub = '都市干练线条与经典黑白灰极简';
      let tPrimary = '#b45309', tAccent = '#059669', tBg = '#fafaf9', tText = '#44403c', tTitle = 'Tinker 泥作微风', tSub = '温润砂器质感与拉丝纹理手工美学';
      let sPrimary = '#dc2626', sAccent = '#1e3a8a', sBg = '#fffcfc', sText = '#1a0505', sTitle = 'Savor 食尚沙龙', sSub = '法式复古深红韵味与有机冷萃风味';

      let hImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80';
      let tImage = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80';
      let sImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80';

      if (mood.includes('珠宝') || mood.includes('首饰') || mood.includes('饰品') || mood.includes('jewelry') || mood.includes('gold') || mood.includes('饰')) {
        hPrimary = '#78350f'; hAccent = '#ca8a04'; hBg = '#fdfcf7'; hText = '#451a03'; hTitle = 'Horizon 奢华流光'; hSub = '高级微镶切工、冷系奢白金配搭钻石光芒';
        tPrimary = '#b45309'; tAccent = '#10b981'; tBg = '#fafaf5'; tText = '#44403c'; tTitle = 'Tinker 原木饰艺'; tSub = '古老手工錾刻拉纹与复古哑光包金砂器';
        sPrimary = '#9f1239'; sAccent = '#db2777'; sBg = '#fff1f2'; sText = '#4c0519'; sTitle = 'Savor 璀璨之夜'; sSub = '深玫红韵底色渲染巴洛克不规则珍宝设计';
        hImage = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80';
        tImage = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80';
        sImage = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80';
      } else if (mood.includes('科技') || mood.includes('数码') || mood.includes('极客') || mood.includes('tech') || mood.includes('cyber') || mood.includes('电脑')) {
        hPrimary = '#2563eb'; hAccent = '#3b82f6'; hBg = '#090d16'; hText = '#f1f5f9'; hTitle = 'Horizon 离子矩阵'; hSub = '冷光阳极氧化合金、幽蓝电路指示灯细节';
        tPrimary = '#d97706'; tAccent = '#ea580c'; tBg = '#0f172a'; tText = '#e2e8f0'; tTitle = 'Tinker 赛博机械'; tSub = '硬核工业结构、朋克铁锈红与多传感器模组';
        sPrimary = '#8b5cf6'; sAccent = '#ec4899'; sBg = '#0e081e'; sText = '#f3e8ff'; sTitle = 'Savor 霓虹幻境'; sSub = '深邃星际赛博底色搭配梦幻荧光粉红氛围';
        hImage = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80';
        tImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80';
        sImage = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80';
      } else if (mood.includes('自然') || mood.includes('茶') || mood.includes('森林') || mood.includes('抹茶') || mood.includes('植物') || mood.includes('tea') || mood.includes('green') || mood.includes('草本')) {
        hPrimary = '#0f5132'; hAccent = '#198754'; hBg = '#f8fdf9'; hText = '#0f1712'; hTitle = 'Horizon 露草林地'; hSub = '晨间山岚雾气森林色彩拼盘、环保极简原色';
        tPrimary = '#166534'; tAccent = '#ca8a04'; tBg = '#fafdfa'; tText = '#14532d'; tTitle = 'Tinker 静雅御茶'; tSub = '温润哑光抹茶黄石釉色、粗陶手执拉坯握感';
        sPrimary = '#1e3a8a'; sAccent = '#059669'; sBg = '#f0fdf4'; sText = '#1f2937'; sTitle = 'Savor 百草膳食'; sSub = '自然纯净植物露、天然草本香薰木箱包边';
        hImage = 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80';
        tImage = 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800&q=80';
        sImage = 'https://images.unsplash.com/photo-1502484640100-09659a8f9f6e?w=800&q=80';
      } else if (mood.includes('少女') || mood.includes('粉') || mood.includes('浪漫') || mood.includes('温情') || mood.includes('pink') || mood.includes('sweet') || mood.includes('甜')) {
        hPrimary = '#db2777'; hAccent = '#f43f5e'; hBg = '#fff5f7'; hText = '#4c0519'; hTitle = 'Horizon 草莓慕斯'; hSub = '轻甜淡雅的粉红气泡、舒缓多维奶白装饰面板';
        tPrimary = '#ea580c'; tAccent = '#fb923c'; tBg = '#fffcf6'; tText = '#4c0519'; tTitle = 'Tinker 蜜桃砂陶'; tSub = '粉色陶土自然风化拉制、治愈奶油白彩绘点缀';
        sPrimary = '#9d174d'; sAccent = '#c084fc'; sBg = '#fff1f2'; sText = '#500724'; sTitle = 'Savor 梦幻霓裳'; sSub = '优雅浪漫深粉色背景、下午茶精美法式西点柜';
        hImage = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80';
        tImage = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80';
        sImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80';
      } else {
        const seedValue = aiPrompt.substring(0, 3);
        hPrimary = '#1d4ed8'; hAccent = '#3b82f6'; hBg = '#ffffff'; hText = '#1e293b'; hTitle = `${seedValue}·流韵 Horizon`; hSub = `定制精细裁剪主色调、自适应极简排布方式`;
        tPrimary = '#a16207'; tAccent = '#15803d'; tBg = '#fafaf9'; tText = '#3f2e21'; tTitle = `${seedValue}·质感 Tinker`; tSub = `在经典泥胚烧制工艺中彰显自然纯粹设计`;
        sPrimary = '#be123c'; sAccent = '#2563eb'; sBg = '#fffbfa'; sText = '#450a0a'; sTitle = `${seedValue}·风情 Savor`; sSub = `高对比度格调视觉、适合打造个性而极具品味的橱窗`;
        hImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80';
        tImage = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80';
        sImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80';
      }

      setShelfPresets([
        {
          id: 'pre_horizon',
          name: hTitle,
          author: 'di Shopify',
          primary: hPrimary,
          accent: hAccent,
          bg: hBg,
          text: hText,
          image: hImage,
          title: hTitle,
          subtitle: hSub
        },
        {
          id: 'pre_tinker',
          name: tTitle,
          author: 'di Shopify',
          primary: tPrimary,
          accent: tAccent,
          bg: tBg,
          text: tText,
          image: tImage,
          title: tTitle,
          subtitle: tSub
        },
        {
          id: 'pre_savor',
          name: sTitle,
          author: 'di Shopify',
          primary: sPrimary,
          accent: sAccent,
          bg: sBg,
          text: sText,
          image: sImage,
          title: sTitle,
          subtitle: sSub
        }
      ]);

      setIsGenerating(false);
      triggerToast('AI精算完成！已为您定制开发了三套极速生动的交互大片方案！');
    }, 1100);
  };

  // ZIP Importer
  const handleZipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.zip')) {
      triggerToast('格式错');
      return;
    }

    setZipState('unzip');
    setTimeout(() => {
      setZipState('verify');
      setTimeout(() => {
        const parsedName = file.name.replace('.zip', '').substring(0, 3);
        const importedTheme: ThemeConfig = {
          id: `zip_${Date.now()}`,
          name: parsedName || '自建',
          status: 'draft',
          primaryColor: '#0f172a',
          accentColor: '#3b82f6',
          backgroundColor: '#ffffff',
          textColor: '#1e293b',
          headerStyle: 'inline',
          footerLayout: 'simple',
          footerText: `© ${parsedName || '导入'}`,
          enableSlider: true,
          sliderBanners: [
            {
              id: 'b1',
              imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
              title: '本地代码导入',
              subtitle: '静态样式已挂载',
              buttonText: '探寻',
              buttonLink: '#'
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        addTheme(importedTheme);
        setActiveThemeId(importedTheme.id);
        setZipState('done');
        triggerToast('导入成功');
        setTimeout(() => setZipState('idle'), 600);
      }, 700);
    }, 700);
  };

  if (!activeTheme) {
    return <div className="p-12 text-center text-xs text-neutral-400 font-mono tracking-wider">正在连线仓库...</div>;
  }

  // Live products
  const activeProducts = products.filter(p => p.status === 'active').slice(0, 3);
  const fallbackProducts = [
    { id: 'f1', title: '哑光磨砂陶瓷杯', price: '48.00', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&q=80' },
    { id: 'f2', title: '极简牛皮零钱包', price: '128.00', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80' },
    { id: 'f3', title: '水洗棉休闲上装', price: '260.00', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&q=80' }
  ];
  const renderProducts = activeProducts.length > 0 ? activeProducts.map(p => ({
    id: p.id,
    title: p.title,
    price: p.price,
    image: p.images?.[0] || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80'
  })) : fallbackProducts;

  // Visual storefront components
  const activeBanner = activeTheme.sliderBanners?.[0] || {
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    title: '新品驾到',
    subtitle: '触得到的轻奢'
  };

  return (
    <div className="min-h-screen bg-[#f6f6f7] py-6 px-4 md:px-8 text-neutral-800 font-sans tracking-tight select-none">
      
      {/* Exquisite minimal HUD alert toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] bg-neutral-950 border border-neutral-850 text-white font-medium px-4 py-2 rounded-lg shadow-xl flex items-center space-x-2 text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <input 
        type="file" 
        ref={zipInputRef} 
        accept=".zip" 
        onChange={handleZipUpload} 
        className="hidden" 
      />

      {/* Mode Switch Coordinator */}
      {!isEditing ? (
        <div className="max-w-5xl mx-auto space-y-5 animate-fadeIn">
          
          {/* Header Dashboard section */}
          <div className="flex items-center justify-between border-b pb-3.5 border-neutral-200">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-[#008060] flex items-center justify-center text-white font-bold text-xs select-none">
                🏪
              </div>
              <h1 className="text-base font-bold text-neutral-900 tracking-tight">在线商店</h1>
            </div>
          </div>

          {/* Main Active Theme Shelf */}
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-2xs divide-y lg:divide-y-0 lg:divide-x lg:grid lg:grid-cols-5 divide-neutral-150">
            
            {/* Live Interactive Split Mockup Screen (Replaces Static JPEG) */}
            <div className="lg:col-span-3 bg-neutral-50/60 p-5 flex flex-col items-center justify-center relative min-h-[300px] overflow-hidden group">
              
              {/* Devices mockup row */}
              <div className="flex items-end justify-center w-full space-x-5 max-w-sm select-none">
                
                {/* Desktop Mini Simulated Frame */}
                <div className="flex-1 bg-white rounded-md shadow-md border border-neutral-250 overflow-hidden transform transition-all group-hover:scale-[1.01]">
                  <div className="bg-neutral-900 px-1.5 py-1 flex items-center space-x-1 border-b">
                    <span className="w-1 h-1 rounded-full bg-red-400"></span>
                    <span className="w-1 h-1 rounded-full bg-yellow-400"></span>
                    <span className="w-1 h-1 rounded-full bg-green-400"></span>
                  </div>
                  
                  {/* Miniature Store Portal */}
                  <div 
                    className="p-3 text-[5px] transition-all min-h-[160px] flex flex-col justify-between" 
                    style={{ backgroundColor: activeTheme.backgroundColor, color: activeTheme.textColor }}
                  >
                    <div>
                      {/* Active Header */}
                      <div className="flex justify-between items-center border-b pb-1.5 mb-2" style={{ borderColor: `${activeTheme.textColor}22` }}>
                        <span className="font-extrabold truncate max-w-[50px]" style={{ color: activeTheme.primaryColor }}>{activeTheme.name}</span>
                        <div className="flex space-x-1.5 font-bold uppercase" style={{ color: `${activeTheme.textColor}99` }}>
                          <span className="underline" style={{ color: activeTheme.primaryColor }}>主页</span>
                          <span>上新</span>
                        </div>
                      </div>

                      {/* Slider Banner block */}
                      <div className="relative h-16 rounded overflow-hidden flex flex-col justify-center p-2">
                        <img referrerPolicy="no-referrer" src={activeBanner.imageUrl} className="absolute inset-0 w-full h-full object-cover brightness-95" />
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative text-white flex flex-col justify-center">
                          <span className="bg-neutral-900/45 px-1 py-0.2 rounded font-black max-w-[100px] truncate leading-tight mb-0.5">{activeBanner.title}</span>
                          <span className="opacity-80 truncate max-w-[80px]" style={{ transform: 'scale(0.85)', transformOrigin: 'left' }}>{activeBanner.subtitle}</span>
                        </div>
                      </div>

                      {/* Micro products grid */}
                      <div className="mt-2 grid grid-cols-2 gap-1 px-0.5">
                        {renderProducts.slice(0, 2).map((item) => (
                          <div key={item.id} className="bg-white/85 p-1 rounded-sm border border-neutral-100 flex flex-col justify-between max-w-full">
                            <div className="flex items-center space-x-1 overflow-hidden">
                              <img referrerPolicy="no-referrer" src={item.image} className="w-4 h-4 object-cover rounded-xs flex-shrink-0" />
                              <span className="truncate text-neutral-900 scale-90 font-bold max-w-[32px]">{item.title}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1 pt-0.5">
                              <span className="font-mono text-neutral-900 scale-[0.8]">${item.price}</span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSimulateBuy(item.title);
                                }}
                                className="px-1 py-0.2 text-[4px] rounded-xs text-white cursor-pointer active:opacity-75"
                                style={{ backgroundColor: activeTheme.primaryColor }}
                              >
                                购买
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-center font-bold text-[4px] mt-2 pt-1 border-t opacity-50" style={{ borderColor: `${activeTheme.textColor}11` }}>
                      {activeTheme.footerText}
                    </div>

                  </div>
                </div>

                {/* Mobile Mini Simulated Frame */}
                <div className="w-[84px] bg-white rounded-lg shadow-lg border-[2px] border-neutral-950 overflow-hidden transform transition-all group-hover:translate-x-1 shrink-0">
                  <div className="bg-neutral-950 h-2.5 flex items-center justify-center relative">
                    <span className="w-1.5 h-1 rounded-full bg-neutral-800 absolute top-0.5"></span>
                  </div>
                  
                  {/* Mobile screen container */}
                  <div 
                    className="p-1.5 text-[4.5px] min-h-[168px] flex flex-col justify-between" 
                    style={{ backgroundColor: activeTheme.backgroundColor, color: activeTheme.textColor }}
                  >
                    <div>
                      <div className="flex justify-between items-center border-b pb-1 mb-1.5" style={{ borderColor: `${activeTheme.textColor}22` }}>
                        <span className="font-extrabold truncate max-w-[35px]" style={{ color: activeTheme.primaryColor }}>{activeTheme.name}</span>
                        <span>≡</span>
                      </div>

                      <div className="h-12 relative rounded-xs overflow-hidden flex flex-col justify-center p-1">
                        <img referrerPolicy="no-referrer" src={activeBanner.imageUrl} className="absolute inset-0 w-full h-full object-cover" />
                        <span className="relative bg-neutral-900/60 text-white rounded-xs p-0.5 max-w-full truncate font-black scale-[0.85]">{activeBanner.title}</span>
                      </div>

                      <div className="mt-1.5 space-y-1">
                        {renderProducts.slice(0, 2).map((item) => (
                          <div key={item.id} className="bg-white/95 p-1 rounded-sm border border-neutral-100 flex items-center justify-between text-[4.5px]">
                            <img referrerPolicy="no-referrer" src={item.image} className="w-3.5 h-3.5 object-cover rounded-xs" />
                            <span className="text-neutral-900 truncate max-w-[28px] font-bold">{item.title}</span>
                            <span className="font-mono text-neutral-850">${item.price}</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSimulateBuy(item.title);
                              }}
                              className="bg-neutral-900 text-white font-extrabold rounded-xs px-1 hover:opacity-85 text-[3.5px] cursor-pointer"
                              style={{ backgroundColor: activeTheme.primaryColor }}
                            >
                              买
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-center border-t py-0.5 mt-1 text-[3.5px] opacity-45" style={{ borderColor: `${activeTheme.textColor}11` }}>
                      © {activeTheme.name}
                    </div>
                  </div>
                </div>

              </div>

              {/* Status Indicator */}
              <div className="absolute bottom-3 right-4 bg-[#008060]/10 text-[#008060] border border-[#008060]/20 px-2 py-0.5 rounded text-[8.5px] font-bold font-mono shadow-3xs tracking-wider">
                ● 实时预览
              </div>

            </div>

            {/* Right Information panel */}
            <div className="lg:col-span-2 p-5 flex flex-col justify-center space-y-3.5">
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#008060] animate-pulse"></span>
                  <span className="text-[10px] font-bold text-[#008060] tracking-wider">当前启用</span>
                </div>
                <h2 className="text-[14px] font-black text-[#111] tracking-tight">
                  {activeTheme.name}
                </h2>
              </div>

              {/* Bottom Customizer & View Store action triggers aligned together as small buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-neutral-150/50">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-neutral-950 text-white hover:bg-neutral-850 active:scale-[0.98] transition-all px-3 py-1.5 rounded-md font-bold flex items-center space-x-1 shadow-2xs text-[11px] cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-[#008060]" />
                  <span>点击编辑</span>
                </button>

                <button
                  onClick={() => {
                    setShowLiveStore(true);
                    triggerToast('启动预览');
                  }}
                  className="bg-white hover:bg-neutral-50 border border-neutral-250 active:scale-[0.98] text-neutral-800 transition-all px-3 py-1.5 rounded-md font-bold flex items-center space-x-1 shadow-2xs text-[11px] cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-neutral-450" />
                  <span>查看商店</span>
                </button>
              </div>
            </div>

          </div>

          {/* AI-assisted designer prompt input bar */}
          <div className="bg-neutral-100/50 rounded-lg p-2.5 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 border border-neutral-200 shadow-3xs">
            <div className="relative flex-1 w-full">
              <Sparkles className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-500 animate-pulse" />
              <input 
                type="text" 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="想要更独特的格调？描述您的构想，让AI为您定向生成专属设计方案... (例如：极简冷淡黑白、热烈加州阳光)"
                className="w-full bg-neutral-50/50 border border-neutral-250 px-3.5 py-2.5 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:bg-white text-neutral-800 font-bold text-[11px] placeholder-neutral-300 transition-all shadow-inner text-left"
              />
              {aiPrompt && (
                <button 
                  onClick={() => setAiPrompt('')} 
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 p-1 font-bold rounded-full hover:bg-neutral-100"
                >
                  <X className="w-3 h-3 text-neutral-400" />
                </button>
              )}
            </div>
            <button
              onClick={handleAiGen}
              disabled={isGenerating || !aiPrompt.trim()}
              className="bg-neutral-950 text-white hover:bg-neutral-850 active:scale-[0.98] px-5 py-2 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 shadow-sm"
            >
              {isGenerating ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-300 fill-indigo-300" />
                  <span>智能精算</span>
                </>
              )}
            </button>
          </div>

          {/* Header resembling Shopify's layout from Image 1 */}
          <div className="flex items-center justify-between border-b pb-2.5 border-neutral-200">
            <h2 className="text-[13.5px] font-extrabold text-[#111] tracking-tight flex items-center space-x-1">
              <span>推荐模板库</span>
            </h2>
            <div className="flex items-center space-x-2.5 text-[10.5px] font-bold">
              <button 
                onClick={() => zipInputRef.current?.click()} 
                className="text-neutral-600 hover:text-neutral-950 hover:underline leading-none cursor-pointer flex items-center space-x-1"
              >
                <Upload className="w-3.5 h-3.5 text-neutral-400" />
                <span>导入本地代码 (.zip)</span>
              </button>
            </div>
          </div>

              {/* EXACTLY 3 templates in a row - Live-rendered React screens */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 pt-2">
                {shelfPresets.map((preset) => {
                  return (
                    <div 
                      key={preset.id}
                      className="border border-neutral-200 rounded-lg p-3 bg-[#fafafa]/80 hover:bg-white transition-all hover:shadow-xs group/shelf flex flex-col justify-between"
                    >
                      
                      {/* Live miniature storefront rendering representing exact live theme CSS configs! No static photo! */}
                      <div 
                        onClick={() => {
                          setPreviewingTheme(mapPresetToTheme(preset));
                          setPreviewIsPreset(true);
                          setRawPresetObj(preset);
                          setHeartCount(380 + Math.floor(Math.random() * 20));
                          setHasLiked(false);
                          triggerToast('正在打开全屏沉浸预览大片 🎬');
                        }}
                        className="rounded-md border p-2 min-h-[148px] flex flex-col justify-between transition-all shadow-3xs mb-3.5 select-none text-left cursor-pointer hover:border-neutral-400 hover:scale-[1.02] active:scale-[0.99] group/mini relative overflow-hidden"
                        style={{ backgroundColor: preset.bg, borderColor: '#e4e4e7' }}
                      >
                        <div>
                          {/* Mini website navbar header */}
                          <div className="flex justify-between items-center border-b pb-1 mb-1.5" style={{ borderColor: `${preset.text}18` }}>
                            <span className="font-black text-[5px] truncate max-w-[50px]" style={{ color: preset.primary }}>
                              {preset.name}
                            </span>
                            <div className="flex space-x-1.5 font-bold uppercase" style={{ color: `${preset.text}88`, transform: 'scale(0.85)', transformOrigin: 'right' }}>
                              <span>主页</span>
                              <span>所有商品</span>
                            </div>
                          </div>

                          {/* Mini dynamic banner background */}
                          <div className="relative h-[48px] rounded overflow-hidden mb-1 flex flex-col justify-center p-1.5 shadow-3xs">
                            <img referrerPolicy="no-referrer" src={preset.image} className="absolute inset-0 w-full h-full object-cover brightness-90 saturate-95" />
                            <div className="absolute inset-0 bg-black/15"></div>
                            <div className="relative text-white flex flex-col justify-center">
                              <span className="bg-neutral-950/40 text-[4px] font-black rounded-sm px-0.8 py-0.1 w-fit truncate max-w-full leading-none">
                                {preset.title}
                              </span>
                              <span className="opacity-80 text-[3px] font-medium truncate max-w-[110px] scale-[0.8] origin-left mt-0.5">
                                {preset.subtitle}
                              </span>
                            </div>
                          </div>

                          {/* Mini product grid showing exact products using customizable colors! */}
                          <div className="grid grid-cols-2 gap-1 px-0.5">
                            {renderProducts.slice(0, 2).map((item) => (
                              <div key={item.id} className="bg-white/90 p-1 rounded-sm border border-neutral-100 flex flex-col justify-between text-[4px]">
                                <div className="flex items-center space-x-1">
                                  <img referrerPolicy="no-referrer" src={item.image} className="w-3 h-3 object-cover rounded-xs" />
                                  <span className="truncate text-neutral-900 max-w-[28px] font-black">{item.title}</span>
                                </div>
                                <div className="flex justify-between items-center mt-1 pt-0.5" style={{ borderTop: `1px solid #f1f5f9` }}>
                                  <span className="font-mono text-neutral-800 font-bold scale-[0.85]">${item.price}</span>
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: preset.primary }}></span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom miniature footer & active palette indicators inside card */}
                        <div className="flex justify-between items-center mt-2.5 pt-1.5 border-t" style={{ borderColor: `${preset.text}10` }}>
                          <div className="flex space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full border border-neutral-250 select-none shadow-3xs" style={{ backgroundColor: preset.primary }} title={`Primary: ${preset.primary}`}></span>
                            <span className="w-1.5 h-1.5 rounded-full border border-neutral-250 select-none shadow-3xs" style={{ backgroundColor: preset.bg }} title={`Background: ${preset.bg}`}></span>
                            <span className="w-1.5 h-1.5 rounded-full border border-neutral-250 select-none shadow-3xs" style={{ backgroundColor: preset.accent }} title={`Accent: ${preset.accent}`}></span>
                          </div>
                          <span className="text-[3px] font-mono tracking-widest text-[#2563eb]">点击全屏游览</span>
                        </div>

                        {/* Elegant hover banner indicator */}
                        <div className="absolute inset-0 bg-neutral-950/10 opacity-0 group-hover/mini:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[0.5px]">
                          <span className="bg-neutral-900/95 text-white text-[9px] font-bold px-2.5 py-1.5 rounded-md shadow-md flex items-center space-x-1 hover:brightness-105 border border-neutral-700 select-none">
                            <Eye className="w-3.5 h-3.5 text-neutral-300 animate-pulse" />
                            <span>全屏沉浸游览 (Preview)</span>
                          </span>
                        </div>

                      </div>

                      {/* Code layout metadata */}
                      <div className="text-left space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-extrabold text-[#111] text-[11px] flex items-center space-x-1.5">
                            <span>{preset.name.split(' ')[0]}</span>
                            <span className="text-[8.5px] text-neutral-400 font-normal font-sans">({preset.name})</span>
                          </h4>
                          <span className="text-[8.5px] font-extrabold text-neutral-400 block tracking-tight uppercase">
                            {preset.author}
                          </span>
                        </div>

                         {/* Real executable trigger action button */}
                        <button
                          onClick={() => handleInstallFromStoreAndEdit(preset)}
                          className="w-full py-1.8 bg-indigo-50 hover:bg-[#eceffd] active:bg-[#e4e8fc] text-[#3b4cf0] hover:text-[#2a39d0] font-black text-[10px] rounded-md transition-all flex items-center justify-center space-x-1 shadow-3xs cursor-pointer select-none"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                          <span>点击编辑</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

          {/* Section: Your Themes Library / 模板库 */}
          <div className="space-y-3.5 pt-1">
            <div className="border-b pb-1.5 border-neutral-200/90 flex items-center justify-between">
              <h2 className="text-[12.5px] font-extrabold text-neutral-950 tracking-tight flex items-center space-x-1">
                <span>我的模版库</span>
                <span className="text-[9.5px] text-neutral-400 font-normal">(Libreria dei temi)</span>
              </h2>
              <span className="text-[9px] font-mono text-neutral-400 font-bold bg-neutral-200 px-1.5 py-0.2 rounded-xs select-none">
                主题槽位: {themes.length} 个
              </span>
            </div>

            {/* List with live miniatures */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
              {themes.map((t) => {
                const isActive = t.status === 'active';
                const bannerObj = t.sliderBanners?.[0] || {
                  imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&q=80',
                  title: '新品上架'
                };
                return (
                  <div 
                    key={t.id} 
                    className="bg-white border rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-2xs transition-all border-neutral-200"
                  >
                    {/* Live Miniature Page Thumbnail */}
                    <div className="p-4 bg-neutral-50/50 flex flex-col items-center justify-center border-b border-neutral-100 min-h-[140px] relative">
                      <div 
                        onClick={() => {
                          setPreviewingTheme(t);
                          setPreviewIsPreset(false);
                          setRawPresetObj(null);
                          setHeartCount(420 + Math.floor(Math.random() * 30));
                          setHasLiked(false);
                          triggerToast('正在打开全屏沉浸预览大片 🎬');
                        }}
                        className="w-full max-w-[124px] rounded shadow-sm p-2 border transition-all flex flex-col justify-between min-h-[92px] text-left select-none relative cursor-pointer hover:border-neutral-400 hover:scale-105 active:scale-98 group/localmini"
                        style={{ backgroundColor: t.backgroundColor, borderColor: '#e4e4e7' }}
                      >
                        {/* Miniature layout header */}
                        <div className="flex justify-between items-center border-b pb-1 mb-1" style={{ borderColor: `${t.textColor}15` }}>
                          <span className="font-extrabold text-[5px] truncate max-w-[48px]" style={{ color: t.primaryColor }}>{t.name}</span>
                          <span className="text-[4px]" style={{ color: t.textColor }}>🛒</span>
                        </div>
                        {/* Miniature banner snapshot */}
                        <div className="relative h-7 rounded-sm overflow-hidden mb-1 flex items-center justify-center">
                          <img referrerPolicy="no-referrer" src={bannerObj.imageUrl} className="absolute inset-0 w-full h-full object-cover brightness-90" />
                          <span className="relative text-[3.5px] font-black text-white bg-black/35 px-1 rounded-xs leading-none max-w-full truncate">
                            {bannerObj.title}
                          </span>
                        </div>
                        {/* Color indicator squares inside */}
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-0.8 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full border border-neutral-200" style={{ backgroundColor: t.primaryColor }}></span>
                            <span className="w-1.5 h-1.5 rounded-full border border-neutral-200" style={{ backgroundColor: t.backgroundColor }}></span>
                            <span className="w-1.5 h-1.5 rounded-full border border-neutral-200" style={{ backgroundColor: t.accentColor }}></span>
                          </div>
                          <span className="text-[3px] opacity-45 font-mono">游览 (View)</span>
                        </div>

                        {/* Elegant hover banner indicator */}
                        <div className="absolute inset-0 bg-neutral-950/5 opacity-0 group-hover/localmini:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[0.5px] rounded">
                          <span className="bg-neutral-900/95 text-white text-[7px] font-extrabold px-1.5 py-1 rounded shadow-xs flex items-center space-x-0.8 border border-neutral-750 scale-90 group-hover/localmini:scale-100 transition-transform">
                            <Eye className="w-3 h-3 text-neutral-300 animate-pulse" />
                            <span>全屏游览</span>
                          </span>
                        </div>
                      </div>

                      {isActive && (
                        <div className="absolute top-2.5 right-2.5 bg-[#008060]/10 text-[#008060] border border-[#008060]/20 px-1.5 py-0.2 rounded text-[8.5px] font-bold shadow-3xs flex items-center space-x-0.5 select-none animate-pulse">
                          <Check className="w-2.5 h-2.5" />
                          <span>当前已部署</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata summary & action panel */}
                    <div className="p-3 bg-neutral-50/25 space-y-2.5 animate-fadeIn">
                      <div className="flex justify-between items-center text-left leading-none">
                        <div>
                          <h4 className="text-neutral-900 font-extrabold text-[11px] truncate max-w-[105px] leading-tight">{t.name}</h4>
                        </div>
                        
                        {!isActive && (
                          <button
                            onClick={() => {
                              handlePublish(t.id);
                              triggerToast(`已成功将“${t.name}”设为主推版本并实施部署 ✨`);
                            }}
                            className="text-[9.5px] text-indigo-600 hover:text-indigo-800 hover:underline font-bold cursor-pointer transition-colors"
                          >
                            激活启用
                          </button>
                        )}
                      </div>

                      <div className="flex space-x-1.5 pt-2 border-t border-neutral-100 text-[10px]">
                        <button
                          onClick={() => {
                            setActiveThemeId(t.id);
                            setIsEditing(true);
                            triggerToast(`正开启“${t.name}”在线装潢 🛠️`);
                          }}
                          className="flex-1 bg-neutral-100/90 hover:bg-neutral-200 active:scale-[0.98] font-black text-neutral-850 py-1.5 rounded-md text-center transition-all cursor-pointer"
                        >
                          点击编辑
                        </button>

                        {themes.length > 1 && !isActive && (
                          <button
                            onClick={() => {
                              if (window.confirm(`确认彻底删除此定制模板 ${t.name} 吗`)) {
                                deleteTheme(t.id);
                                if (activeThemeId === t.id) {
                                  const remaining = themes.filter(item => item.id !== t.id);
                                  setActiveThemeId(remaining[0]?.id || null);
                                }
                                triggerToast('主题已删除');
                              }
                            }}
                            className="px-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-150 rounded-md transition-colors cursor-pointer flex items-center justify-center animate-fadeIn"
                            title="删除该主题"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        /* Dynamic Visual Customizer Screen Layout */
        <div className="max-w-6xl mx-auto space-y-4 animate-fadeIn select-none">
          
          {/* Customizer navbar */}
          <div className="flex items-center justify-between bg-white border border-neutral-200 px-4 py-3 rounded-lg shadow-3xs">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 px-2.5 hover:bg-neutral-50 border border-neutral-250 rounded-md text-neutral-800 text-[10.5px] font-bold cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 inline mr-1" />
                <span>返回上级</span>
              </button>
              <span className="text-neutral-300">|</span>
              <div className="flex items-center space-x-1 text-[11px] font-bold text-neutral-900">
                <span>装修：</span>
                <span className="text-[#008060] bg-[#008060]/10 px-1.5 py-0.2 rounded font-black">{activeTheme.name}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsEditing(false);
                triggerToast('配置已保存');
              }}
              className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-1.5 rounded-md font-bold text-[11px] cursor-pointer shadow-3xs transition-transform active:scale-95"
            >
              保存修改
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            
            {/* Left controller sidebar module */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Palette settings */}
              <div className="bg-white border border-neutral-200 rounded-lg p-4 space-y-3.5 shadow-3xs">
                <h3 className="font-extrabold pb-2 border-b border-neutral-100 flex items-center space-x-1.5 text-[11px] text-neutral-900">
                  <Palette className="w-4 h-4 text-neutral-500" />
                  <span>配色方案</span>
                </h3>
                
                <div className="grid grid-cols-2 gap-3.5 text-[10.5px]">
                  <div>
                    <label className="text-neutral-400 font-bold block mb-1 text-left">主题主色</label>
                    <div className="flex items-center space-x-1.5 bg-neutral-50 px-2 py-1.5 rounded-md border mt-0.5">
                      <input
                        type="color"
                        value={activeTheme.primaryColor}
                        onChange={(e) => updateTheme(activeTheme.id, { primaryColor: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border-0"
                      />
                      <span className="font-mono text-[10px] uppercase font-bold text-neutral-800">{activeTheme.primaryColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-neutral-400 font-bold block mb-1 text-left">网店底色</label>
                    <div className="flex items-center space-x-1.5 bg-neutral-50 px-2 py-1.5 rounded-md border mt-0.5">
                      <input
                        type="color"
                        value={activeTheme.backgroundColor}
                        onChange={(e) => updateTheme(activeTheme.id, { backgroundColor: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border-0"
                      />
                      <span className="font-mono text-[10px] uppercase font-bold text-neutral-800">{activeTheme.backgroundColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-neutral-400 font-bold block mb-1 text-left">首选文字</label>
                    <div className="flex items-center space-x-1.5 bg-neutral-50 px-2 py-1.5 rounded-md border mt-0.5">
                      <input
                        type="color"
                        value={activeTheme.textColor || '#171717'}
                        onChange={(e) => updateTheme(activeTheme.id, { textColor: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border-0"
                      />
                      <span className="font-mono text-[10px] uppercase font-bold text-neutral-800">{activeTheme.textColor || '#171717'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-neutral-400 font-bold block mb-1 text-left">醒目点缀</label>
                    <div className="flex items-center space-x-1.5 bg-neutral-50 px-2 py-1.5 rounded-md border mt-0.5">
                      <input
                        type="color"
                        value={activeTheme.accentColor}
                        onChange={(e) => updateTheme(activeTheme.id, { accentColor: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border-0"
                      />
                      <span className="font-mono text-[10px] uppercase font-bold text-neutral-800">{activeTheme.accentColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slider / Image Config */}
              <div className="bg-white border border-neutral-200 rounded-lg p-4 space-y-3.5 shadow-3xs">
                <h3 className="font-extrabold pb-2 border-b border-neutral-100 flex items-center space-x-1.5 text-[11px] text-neutral-900">
                  <Layers className="w-4 h-4 text-neutral-550" />
                  <span>轮播板块</span>
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-1.5 bg-neutral-50 rounded-md">
                    <span className="text-[10px] font-bold text-neutral-700">启用巨幕轮播</span>
                    <input
                      type="checkbox"
                      checked={activeTheme.enableSlider !== false}
                      onChange={(e) => updateTheme(activeTheme.id, { enableSlider: e.target.checked })}
                      className="w-4 h-4 rounded cursor-pointer"
                    />
                  </div>

                  {activeTheme.sliderBanners && activeTheme.sliderBanners.length > 0 && (
                    <div className="space-y-2 text-left">
                      <label className="text-neutral-400 font-bold text-[10px] block">巨幕大图</label>
                      <select
                        onChange={(e) => {
                          const updated = [...activeTheme.sliderBanners];
                          updated[0].imageUrl = e.target.value;
                          updateTheme(activeTheme.id, { sliderBanners: updated });
                        }}
                        value={activeTheme.sliderBanners[0].imageUrl}
                        className="w-full text-[10.5px] border rounded p-1 font-semibold outline-none"
                      >
                        <option value="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80">都市摩登潮流</option>
                        <option value="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80">泥作雅致黏土</option>
                        <option value="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80">美馔香料香熏</option>
                        <option value="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80">冷核量子科技</option>
                      </select>
                    </div>
                  )}

                  <div className="p-2.5 rounded bg-neutral-50/75 border border-neutral-150 text-[10px] space-y-2">
                    <div className="text-left font-bold text-neutral-500">轮播横幅 1</div>
                    <div className="space-y-1 text-left">
                      <label className="text-neutral-400 font-bold">主广告语</label>
                      <input
                        type="text"
                        maxLength={12}
                        value={activeBanner.title}
                        onChange={(e) => {
                          const updated = [...activeTheme.sliderBanners];
                          updated[0].title = e.target.value;
                          updateTheme(activeTheme.id, { sliderBanners: updated });
                        }}
                        className="w-full border border-neutral-200 rounded px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 text-[11px] font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Interactive Simulator Screen Workspace */}
            <div className="lg:col-span-3 bg-neutral-50 rounded-lg p-4 border border-neutral-200 flex flex-col items-center justify-between shadow-3xs relative overflow-hidden">
              
              {/* Responsive Width Toggle */}
              <div className="flex space-x-1.5 bg-[#e1e1e1] p-1 rounded-md mb-4 text-[10px] font-extrabold shadow-inner z-10 select-none">
                <button
                  type="button"
                  onClick={() => setPreviewMode('desktop')}
                  className={`px-3 py-1 rounded transition-colors flex items-center space-x-1 cursor-pointer ${
                    previewMode === 'desktop' ? 'bg-white shadow text-neutral-900' : 'text-neutral-500'
                  }`}
                >
                  <Laptop className="w-3 h-3" />
                  <span>电脑端</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('mobile')}
                  className={`px-3 py-1 rounded transition-colors flex items-center space-x-1 cursor-pointer ${
                    previewMode === 'mobile' ? 'bg-white shadow text-neutral-900' : 'text-neutral-500'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>手机端</span>
                </button>
              </div>

              {/* Master Responsive Stage Container */}
              <div 
                className={`bg-white rounded-md border overflow-hidden shadow-md transition-all duration-300 transform font-sans flex flex-col justify-between ${
                  previewMode === 'desktop' ? 'w-full max-w-sm' : 'w-[220px]'
                }`}
                style={{ backgroundColor: activeTheme.backgroundColor, color: activeTheme.textColor }}
              >
                
                {/* Simulated store header website */}
                <div className="px-3 py-2 border-b flex justify-between items-center text-[8.5px] font-bold" style={{ borderColor: `${activeTheme.textColor}22` }}>
                  <span className="tracking-wider" style={{ color: activeTheme.primaryColor }}>{activeTheme.name}</span>
                  <div className="flex space-x-2 text-[7.5px] font-bold tracking-tight uppercase" style={{ color: `${activeTheme.textColor}80` }}>
                    <span className="underline" style={{ color: activeTheme.primaryColor }}>主页</span>
                    <span>所有精品</span>
                  </div>
                </div>

                {/* Simulated interactive banner slider */}
                {activeTheme.enableSlider !== false ? (
                  <div className="relative h-24 bg-neutral-100 overflow-hidden flex flex-col justify-end p-2.5">
                    <img referrerPolicy="no-referrer" src={activeBanner.imageUrl} className="absolute inset-0 w-full h-full object-cover transition-all" />
                    <div className="absolute inset-0 bg-black/10"></div>
                    
                    <div className="relative text-white text-left flex flex-col justify-center">
                      <span className="bg-neutral-950/40 text-[7px] font-black rounded-sm px-1 py-0.2 space-y-0.5 block w-fit truncate max-w-full">
                        {activeBanner.title}
                      </span>
                      <span className="text-[5.5px] opacity-80 block truncate max-w-[120px] font-medium scale-90 origin-left mt-0.5">{activeBanner.subtitle}</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-4 bg-transparent"></div>
                )}

                {/* Simulated product showcase */}
                <div className="p-3 text-left space-y-2">
                  <div className="text-[7.5px] font-extrabold uppercase tracking-wider" style={{ color: activeTheme.primaryColor }}>热评推荐</div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {renderProducts.map(item => (
                      <div key={item.id} className="bg-white/90 p-1 rounded-sm border border-neutral-100/50 flex flex-col justify-between min-h-[50px] shadow-3xs hover:scale-105 transition-transform">
                        <div>
                          <img referrerPolicy="no-referrer" src={item.image} className="w-full h-8 object-cover rounded-xs mb-1" />
                          <div className="text-[5.5px] text-neutral-900 font-bold truncate leading-none max-w-full">{item.title}</div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[5px] font-mono leading-none text-neutral-900">${item.price}</span>
                          <button 
                            onClick={() => handleSimulateBuy(item.title)}
                            className="text-white text-[4px] font-extrabold rounded-xs px-1 py-0.2 cursor-pointer"
                            style={{ backgroundColor: activeTheme.primaryColor }}
                          >
                            买
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dynamic customized footer */}
                <div className="p-2.5 text-center text-[5.5px] opacity-65 border-t" style={{ borderColor: `${activeTheme.textColor}11` }}>
                  {activeTheme.footerText}
                </div>

              </div>

              {/* Small instruction help key */}
              <div className="mt-4 text-[9.5px] font-bold text-neutral-400">
                实时改变色轮或文案，模拟机身随心而变
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Fully Functional Immersive Store Preview Overlay (View Store / 查看商店 Realized) */}
      <AnimatePresence>
        {previewingTheme && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#111114] flex flex-col justify-between font-sans text-neutral-200 select-none overflow-hidden"
          >
            {/* Top Chrome Portal Header bar */}
            <div className="bg-[#0b0b0c] border-[#1e1e24] border-b px-6 py-4 flex justify-between items-center shrink-0">
              
              {/* Left Profile details */}
              <div className="flex items-center space-x-3 text-left">
                <div className="w-8 h-8 rounded bg-gradient-to-tr from-[#1e1e24] to-[#2b2b36] border border-neutral-750 flex items-center justify-center text-sm shadow-inner select-none">
                  🎨
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-[12.5px] leading-tight flex items-center space-x-1.5">
                    <span>{previewingTheme.name}</span>
                    <span className="text-[8px] tracking-wider font-mono bg-[#242429] text-indigo-400 border border-indigo-900/35 px-1 rounded-sm uppercase">沙盒预览</span>
                  </h3>
                  <p className="text-neutral-400 text-[9.5px] font-semibold flex items-center space-x-1 mt-0.5">
                    <span>Shopify Premium Layout</span>
                    <span>•</span>
                    <span className="text-neutral-500 font-mono">Real-time Sandbox Simulator</span>
                  </p>
                </div>
              </div>

              {/* Center Device size switchers placed correctly on top center */}
              <div className="hidden md:flex items-center bg-[#151518] rounded-lg border border-neutral-800 p-1 space-x-1 text-neutral-400 font-bold select-none">
                <button 
                  onClick={() => {
                    setPreviewViewport('desktop');
                    triggerToast('切换至 💻 优雅桌面端宽展视图');
                  }}
                  className={`px-3 py-1.5 rounded transition-all flex items-center space-x-1.5 cursor-pointer text-[10px] ${
                    previewViewport === 'desktop' 
                      ? 'bg-neutral-850 text-white border border-neutral-750 shadow-sm' 
                      : 'hover:bg-neutral-900 hover:text-white border border-transparent'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>桌面端</span>
                </button>

                <button 
                  onClick={() => {
                    setPreviewViewport('tablet');
                    triggerToast('切换至 📁 10英寸商用平板视图');
                  }}
                  className={`px-3 py-1.5 rounded transition-all flex items-center space-x-1.5 cursor-pointer text-[10px] ${
                    previewViewport === 'tablet' 
                      ? 'bg-neutral-850 text-white border border-neutral-750 shadow-sm' 
                      : 'hover:bg-neutral-900 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="w-3 h-3 rounded-xs border border-current"></div>
                  <span>平板款</span>
                </button>

                <button 
                  onClick={() => {
                    setPreviewViewport('mobile');
                    triggerToast('切换至 📱 智能大屏移动端布局');
                  }}
                  className={`px-3 py-1.5 rounded transition-all flex items-center space-x-1.5 cursor-pointer text-[10px] ${
                    previewViewport === 'mobile' 
                      ? 'bg-neutral-850 text-white border border-neutral-750 shadow-sm' 
                      : 'hover:bg-neutral-900 hover:text-white border border-transparent'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>移动端</span>
                </button>
              </div>

              {/* Right actions */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => {
                    setPreviewingTheme(null);
                    setRawPresetObj(null);
                  }}
                  className="px-3 py-1.8 bg-transparent hover:bg-neutral-900 border border-neutral-800 text-neutral-300 font-bold text-[10.5px] rounded transition-all cursor-pointer flex items-center space-x-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>关闭游览 (Close)</span>
                </button>

                <button 
                  onClick={() => {
                    if (previewIsPreset && rawPresetObj) {
                      handleInstallFromStoreAndEdit(rawPresetObj);
                    } else {
                      handleLocalEditFromPreview(previewingTheme);
                    }
                  }}
                  className="bg-indigo-600 hover:bg-indigo-505 active:scale-[0.98] text-white px-5 py-2.2 rounded font-extrabold text-[10.5px] transition-all flex items-center space-x-1 shadow-md hover:shadow-indigo-900/10 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-300 fill-indigo-205" />
                  <span>立即编辑使用 (Use & Edit)</span>
                </button>
              </div>

            </div>

            {/* Simulated browser tools / Status bar (Image 2 URL Details) */}
            <div className="bg-[#121214] border-b border-[#212126] px-5 py-2 flex items-center justify-between shrink-0 text-xs">
              
              {/* Left element / Device info placeholder */}
              <div className="flex items-center space-x-2">
                <span className="text-[9px] text-neutral-550 font-mono">SANDBOX ACTIVE</span>
              </div>

              {/* Central URL address details */}
              <div className="flex-1 max-w-sm mx-4 bg-[#0a0a0c]/85 border border-neutral-850/80 px-3.5 py-1 rounded text-[9.5px] font-mono text-neutral-500 text-center select-all">
                <span>store-front/{previewingTheme.id}</span>
              </div>

              {/* Right fit scaler indicator */}
              <div className="text-[9px] font-bold text-neutral-500 hidden sm:flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-505 animate-pulse"></span>
                <span className="uppercase text-neutral-500 tracking-wider">Preview Responsive</span>
              </div>

            </div>

            {/* Simulated Live Viewport Storefront preview wrapper */}
            <div className="flex-1 bg-[#141416] p-4 flex items-center justify-center overflow-auto relative">
              <div 
                className={`h-full max-h-[100%] transition-all duration-300 rounded-lg shadow-2xl border border-neutral-800 flex flex-col overflow-hidden text-left bg-white text-neutral-800 ${
                  previewViewport === 'desktop' ? 'w-full animate-fadeIn' : 
                  previewViewport === 'tablet' ? 'w-[768px] animate-fadeIn' : 
                  'w-[375px] max-h-[640px] border-[12px] border-neutral-900 animate-fadeIn rounded-xl'
                }`}
                style={{ backgroundColor: previewingTheme.backgroundColor, color: previewingTheme.textColor }}
              >
                
                {/* Store mini header */}
                <div className="px-5 py-3 border-b flex justify-between items-center" style={{ borderColor: `${previewingTheme.textColor}18` }}>
                  <div className="flex items-center space-x-2 select-text">
                    <ShoppingBag className="w-4.5 h-4.5" style={{ color: previewingTheme.primaryColor }} />
                    <span className="font-extrabold text-[11px] tracking-wide" style={{ color: previewingTheme.primaryColor }}>
                      {previewingTheme.name} 线上精品店
                    </span>
                  </div>

                  <div className="flex space-x-3 text-[9px] font-extrabold uppercase" style={{ color: `${previewingTheme.textColor}75` }}>
                    <span className="underline" style={{ color: previewingTheme.primaryColor }}>首页</span>
                    <button onClick={() => triggerToast('预留栏目：分类畅销')} className="hover:opacity-80">分类</button>
                    <button onClick={() => triggerToast('预留栏目：关于我们')} className="hover:opacity-80">关于我们</button>
                  </div>
                </div>

                {/* Main body scroll area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6 select-text">
                  
                  {/* Banner */}
                  <div className="relative rounded-lg overflow-hidden h-36 flex flex-col justify-end p-5 shadow-3xs">
                    <img referrerPolicy="no-referrer" src={previewingTheme.sliderBanners[0]?.imageUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80'} className="absolute inset-0 w-full h-full object-cover brightness-90 animate-fadeIn" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"></div>
                    
                    <div className="relative text-white md:max-w-md space-y-1.5 text-left">
                      <span className="bg-neutral-900/60 text-[5px] uppercase tracking-wider font-extrabold px-1 rounded-sm w-fit block mb-1">精工细作</span>
                      <h2 className="text-sm md:text-base font-black leading-tight tracking-wide drop-shadow-sm">{previewingTheme.sliderBanners[0]?.title}</h2>
                      <p className="text-[9.5px] opacity-90 drop-shadow-sm font-semibold">{previewingTheme.sliderBanners[0]?.subtitle}</p>
                    </div>
                  </div>

                  {/* Real responsive products catalog shelves */}
                  <div className="space-y-4 text-left">
                    <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: `${previewingTheme.textColor}18` }}>
                      <h3 className="text-[10px] font-black uppercase tracking-wider" style={{ color: previewingTheme.primaryColor }}>全店畅销尖货</h3>
                      <span className="text-[9.5px] font-bold text-neutral-400">共 {renderProducts.length} 款宝贝</span>
                    </div>

                    {/* Desktop / Responsive layout products grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4.5">
                      {renderProducts.map((item) => (
                        <div 
                          key={item.id} 
                          onClick={() => {
                            setSelectedProduct(item);
                            triggerToast('正在打开宝贝快捷详情');
                          }}
                          className="bg-white/95 rounded-md border border-neutral-150 p-2.5 transition-all hover:border-neutral-350 cursor-pointer flex flex-col justify-between"
                        >
                          <div>
                            <div className="relative rounded bg-neutral-100 overflow-hidden aspect-square mb-2 text-center">
                              <img referrerPolicy="no-referrer" src={item.image} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                            </div>
                            <span className="text-[9px] font-bold text-neutral-900 block truncate text-left mb-1">{item.title}</span>
                          </div>

                          <div className="flex justify-between items-center mt-1">
                            <span className="text-[11px] font-black font-mono leading-none tracking-tight text-neutral-950">${item.price}</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSimulateBuy(item.title);
                              }}
                              className="px-2 py-0.8 text-[8.5px] font-bold text-white rounded transition-all shadow-3xs"
                              style={{ backgroundColor: previewingTheme.primaryColor }}
                            >
                              立即订购
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>

                </div>

                {/* Footer bar */}
                <div className="px-5 py-3 border-t text-center text-[9.5px] opacity-65 font-bold flex justify-between items-center" style={{ borderColor: `${previewingTheme.textColor}18` }}>
                  <span>{previewingTheme.footerText}</span>
                  <span className="font-mono text-[8px] text-[#2ebd59] font-black tracking-wide flex items-center space-x-1 scale-90">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2ebd59] animate-ping"></span>
                    <span>SECURE SIMULATION CONNECTED</span>
                  </span>
                </div>

              </div>
            </div>

            {/* Immersive footer tip bar */}
            <div className="bg-[#0b0b0c] border-[#1e1e24] border-t px-6 py-3 flex justify-between items-center shrink-0 text-[10px] text-neutral-500 select-none font-bold">
              <span>在极高保真度全屏游览中。按 Esc 或点击上方任何“开始编辑”进入装修模式。</span>
              <span className="text-neutral-450 hover:underline cursor-pointer" onClick={() => triggerToast('开发中心提示：按 Esc 键可快速返回面板')}>
                在线网店搭建引擎 V4.0
              </span>
            </div>

          </motion.div>
        )}

        {showLiveStore && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col h-[600px] border border-neutral-100 font-sans text-xs"
              style={{ backgroundColor: activeTheme.backgroundColor, color: activeTheme.textColor }}
            >
              
              {/* Overlay Navigation Navbar */}
              <div className="px-5 py-3 border-b flex justify-between items-center" style={{ borderColor: `${activeTheme.textColor}22` }}>
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-4.5 h-4.5" style={{ color: activeTheme.primaryColor }} />
                  <span className="font-extrabold text-sm tracking-wide" style={{ color: activeTheme.primaryColor }}>{activeTheme.name} 线上旗舰</span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex space-x-4 font-extrabold text-[11px] uppercase" style={{ color: `${activeTheme.textColor}80` }}>
                    <span className="underline" style={{ color: activeTheme.primaryColor }}>首页</span>
                    <button onClick={() => triggerToast('敬请期待更多')} className="hover:opacity-80">关于我们</button>
                  </div>
                  <button 
                    onClick={() => setShowLiveStore(false)}
                    className="p-1.5 hover:bg-neutral-100 rounded-full transition-colors font-bold flex items-center justify-center"
                    style={{ backgroundColor: `${activeTheme.textColor}08`, color: activeTheme.textColor }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* View store main body scroll area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 select-text">
                
                {/* Slider hero presentation banner */}
                {activeTheme.enableSlider !== false && (
                  <div className="relative rounded-xl overflow-hidden h-44 flex flex-col justify-end p-6 md:p-8 shadow-sm">
                    <img referrerPolicy="no-referrer" src={activeBanner.imageUrl} className="absolute inset-0 w-full h-full object-cover brightness-90 animate-fadeIn" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent"></div>
                    
                    <div className="relative text-white md:max-w-md space-y-1.5 text-left">
                      <span className="bg-neutral-900/60 text-xs font-black px-2 py-0.5 rounded-md inline-block">国潮风尚</span>
                      <h2 className="text-lg md:text-xl font-black leading-tight tracking-wide drop-shadow-sm">{activeBanner.title}</h2>
                      <p className="text-[10px] opacity-90 drop-shadow-sm font-semibold">{activeBanner.subtitle}</p>
                    </div>
                  </div>
                )}

                {/* Real-time reactive items catalog shelfs */}
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: `${activeTheme.textColor}22` }}>
                    <h3 className="text-xs font-black uppercase tracking-wider" style={{ color: activeTheme.primaryColor }}>全店畅销尖货</h3>
                    <span className="text-[10px] font-semibold text-neutral-400">共 {renderProducts.length} 款宝贝</span>
                  </div>

                  {/* Grid cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    {renderProducts.map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => setSelectedProduct(item)}
                        className="bg-white/95 rounded-lg border border-neutral-100 shadow-3xs p-3 transition-all hover:-translate-y-1 duration-200 cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative rounded-md overflow-hidden bg-neutral-100 aspect-square mb-2.5">
                            <img referrerPolicy="no-referrer" src={item.image} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                          </div>
                          <span className="text-[10px] font-bold text-neutral-900 block truncate text-left mb-1.5">{item.title}</span>
                        </div>

                        <div className="flex justify-between items-center mt-1.5">
                          <span className="text-xs font-black font-mono leading-none tracking-tight text-neutral-950">${item.price}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSimulateBuy(item.title);
                            }}
                            className="text-white text-[10px] font-black rounded-md px-3 py-1 scale-95 hover:opacity-90 active:scale-95 transition-all shadow-3xs flex items-center space-x-1"
                            style={{ backgroundColor: activeTheme.primaryColor }}
                          >
                            <span>购买</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Detail drawer popup in store */}
              <AnimatePresence>
                {selectedProduct && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
                  >
                    <div className="bg-white rounded-lg p-5 max-w-sm w-full divide-y divide-neutral-100 shadow-2xl relative text-neutral-900 border text-left">
                      <button 
                        onClick={() => setSelectedProduct(null)}
                        className="absolute top-3.5 right-3.5 p-1 rounded-full hover:bg-neutral-100 font-bold"
                      >
                        <X className="w-4 h-4 text-neutral-500" />
                      </button>

                      <div className="pb-4">
                        <img referrerPolicy="no-referrer" src={selectedProduct.image} className="w-full h-44 object-cover rounded-md mb-3 shadow-3xs" />
                        <h4 className="text-xs font-black text-neutral-900 tracking-tight leading-normal">{selectedProduct.title}</h4>
                        <div className="text-[10px] text-neutral-400 font-bold font-mono mt-1">CODE: #{selectedProduct.id.substring(0, 5).toUpperCase()}</div>
                      </div>

                      <div className="pt-4 flex items-center justify-between">
                        <div>
                          <span className="text-[9.5px] text-neutral-400 font-bold block mb-0.5">限时秒杀</span>
                          <span className="font-mono text-sm font-black text-neutral-950">${selectedProduct.price}</span>
                        </div>
                        
                        <button
                          onClick={() => {
                            handleSimulateBuy(selectedProduct.title);
                            setSelectedProduct(null);
                          }}
                          className="px-4 py-1.8 text-[11px] font-bold text-white rounded-md hover:brightness-105 shadow-sm"
                          style={{ backgroundColor: activeTheme.primaryColor }}
                        >
                          立即订购
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dynamic simulated e-commerce footer */}
              <div className="px-5 py-3 border-t text-center text-[9.5px] opacity-65 font-bold flex justify-between items-center" style={{ borderColor: `${activeTheme.textColor}15` }}>
                <span>{activeTheme.footerText}</span>
                <span className="font-mono text-[9px] text-[#2ebd59] font-black tracking-wide flex items-center space-x-1 scale-90">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ebd59] animate-ping"></span>
                  <span>SECURE CONNECTED</span>
                </span>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
