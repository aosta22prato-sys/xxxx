import React, { useState } from 'react';
import { 
  Sparkles, 
  Layout, 
  FileText, 
  Menu, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  Eye, 
  RefreshCw, 
  Sliders, 
  Palette, 
  Layers, 
  ShieldCheck, 
  CheckCircle, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  Download, 
  Import,
  Smartphone,
  Tablet,
  Monitor,
  ChevronRight,
  Settings,
  ArrowLeft,
  Copy,
  AlertTriangle,
  FileCode
} from 'lucide-react';
import { IndustryType } from '../../types';
import MarkdownCodeEditor from '../MarkdownCodeEditor';

interface OnlineStoreProps {
  selectedIndustry: IndustryType;
  addLog: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
}

interface StorePage {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'Published' | 'Draft';
  updatedAt: string;
}

interface StoreTheme {
  id: string;
  name: string;
  version: string;
  author: string;
  type: 'official' | 'third-party' | 'user';
  status: 'Published' | 'Draft';
  preview_image: string;
  colorPrimary: string;
  colorBackground: string;
  borderRadius: string;
  fontFamily: string;
  sections: ThemeSection[];
}

interface ThemeSection {
  id: string;
  type: 'header' | 'hero' | 'gallery' | 'product-grid' | 'cta' | 'footer';
  name: string;
  settings: {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    logoUrl?: string;
    menuId?: string;
    bgColor?: string;
    count?: number;
    columns?: number;
    displayPrice?: boolean;
    copyright?: string;
  };
}

export default function OnlineStore({ selectedIndustry, addLog }: OnlineStoreProps) {
  // Tabs: ai-builder (AI建站), theme-store (主题中心), cms (内容管理)
  const [activeTab, setActiveTab] = useState<'ai-builder' | 'theme-store' | 'cms'>('theme-store');
  const [themeSubTab, setThemeSubTab] = useState<'installed' | 'official' | 'third-party' | 'import-upload'>('installed');
  const [cmsTab, setCmsTab] = useState<'pages' | 'menus'>('pages');

  // Interactive local states preserving state management
  const [themes, setThemes] = useState<StoreTheme[]>([
    {
      id: 'theme-modern',
      name: 'Modern (官方极简旗舰版)',
      version: '1.2.0',
      author: 'Official Studio',
      type: 'official',
      status: 'Published',
      preview_image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=300&q=80',
      colorPrimary: '#07C2E3',
      colorBackground: '#FCFCFD',
      borderRadius: '8px',
      fontFamily: 'Inter',
      sections: [
        { id: 'sec-header', type: 'header', name: '全站页眉', settings: { title: 'AURORA OS RETAIL', logoUrl: '' } },
        { id: 'sec-hero', type: 'hero', name: '主幅通栏 Banner', settings: { title: '首选出海自营独立站', subtitle: '专为高净值跨境出营而订制，预编译首屏无缝缓冲加载', buttonText: '立即选购', buttonLink: '#shop', bgColor: 'bg-slate-900' } },
        { id: 'sec-products', type: 'product-grid', name: '精选精品货架 Grid', settings: { count: 4, columns: 2, displayPrice: true } },
        { id: 'sec-footer', type: 'footer', name: '极速注标页脚', settings: { copyright: '© 2026 AI Commerce OS 版权所有' } }
      ]
    },
    {
      id: 'theme-electronics',
      name: 'Electronics (高阶科技风模版)',
      version: '1.1.0',
      author: 'Official Studio',
      type: 'official',
      status: 'Draft',
      preview_image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=300&q=80',
      colorPrimary: '#EAB308',
      colorBackground: '#0F172A',
      borderRadius: '4px',
      fontFamily: 'JetBrains Mono',
      sections: [
        { id: 'sec-header', type: 'header', name: '硬岩页眉', settings: { title: 'CYBER-CORE SYSTEM', logoUrl: '' } },
        { id: 'sec-hero', type: 'hero', name: '量子 Banner', settings: { title: '次世代量子自营网店', subtitle: '双币 VAT 级秒级清算、高拟态 ERP 物流底座。', buttonText: '进入网关', buttonLink: '#shop', bgColor: 'bg-zinc-950' } },
        { id: 'sec-products', type: 'product-grid', name: '商品展示区', settings: { count: 3, columns: 3, displayPrice: true } },
        { id: 'sec-footer', type: 'footer', name: '极板页脚', settings: { copyright: '© 2026 CYBER OS Ltd. All Rights Reserved.' } }
      ]
    },
    {
      id: 'theme-cuisine',
      name: 'Restaurant Gourmet (精致高端饕餮版)',
      version: '2.0.4',
      author: 'Design Guru Co.',
      type: 'third-party',
      status: 'Draft',
      preview_image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80',
      colorPrimary: '#10B981',
      colorBackground: '#F0FDF4',
      borderRadius: '12px',
      fontFamily: 'Playfair Display',
      sections: [
        { id: 'sec-header', type: 'header', name: '法式页眉', settings: { title: 'L’ATELIER GRANDE', logoUrl: '' } },
        { id: 'sec-hero', type: 'hero', name: '主打招牌 Banner', settings: { title: '米其林线上尊享预定', subtitle: '尊享一键多渠道收单、全欧洲冷链生鲜极速物流体系。', buttonText: '预约留位', buttonLink: '#book', bgColor: 'bg-emerald-950' } },
        { id: 'sec-products', type: 'product-grid', name: '推荐单品列表', settings: { count: 4, columns: 2, displayPrice: true } },
        { id: 'sec-footer', type: 'footer', name: '优雅页脚', settings: { copyright: '© 2026 L’Atelier Food. All Rights Reserved.' } }
      ]
    }
  ]);

  // CMS page records
  const [pages, setPages] = useState<StorePage[]>([
    { id: 'page-home', title: '店铺首页 (Home Page)', slug: '', content: '## 欢迎光临本自营旗舰店\n极光自营系统为您打造更快速、更安全的国际零售网络，支持欧盟完税计算。', status: 'Published', updatedAt: '2026-06-08 10:15' },
    { id: 'page-about', title: '关于我们 (About Us)', slug: 'about-us', content: '### 极光设计理念与跨境愿景\n我们致力于新一代企业级全自动流程化出海开独立店。', status: 'Published', updatedAt: '2026-06-07 14:30' },
    { id: 'page-refund', title: '退款政策 (Refund Policy)', slug: 'refund-policy', content: '### 30天安心退款保障 (EU Standard)\n根据欧盟交易标准，享受 14-30 天内无理由退款。', status: 'Published', updatedAt: '2026-06-05 11:12' }
  ]);

  // Navigation Menus
  const [menus, setMenus] = useState([
    {
      id: 'menu-main',
      name: '主导航菜单 (Header Menu)',
      handle: 'main-menu',
      items: [
        { id: 'link-1', label: '网店主页', url: '/' },
        { id: 'link-2', label: '关于我们', url: '/about-us' }
      ]
    },
    {
      id: 'menu-footer',
      name: '底栏导航菜单 (Footer Menu)',
      handle: 'footer-menu',
      items: [
        { id: 'link-3', label: '退款政策', url: '/refund-policy' }
      ]
    }
  ]);

  // States for Visual customization
  const [editingTheme, setEditingTheme] = useState<StoreTheme | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>('sec-hero');
  const [previewScale, setPreviewScale] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewZoom, setPreviewZoom] = useState<number>(100);

  // States for Upload/Import simulators
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'unzipping' | 'validating' | 'done' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string>('');
  const [importStatus, setImportStatus] = useState<'idle' | 'scanning' | 'converting' | 'success' | 'error'>('idle');
  const [compatibilityReport, setCompatibilityReport] = useState<any>(null);

  // States for AI Builder Form
  const [aiIndustry, setAiIndustry] = useState<string>('ecommerce');
  const [aiAesthetic, setAiAesthetic] = useState<string>('minimal');
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isAiBuilding, setIsAiBuilding] = useState<boolean>(false);
  const [aiBuildProgress, setAiBuildProgress] = useState<number>(0);

  // State for creating/editing pages
  const [cmsEditorOpen, setCmsEditorOpen] = useState<boolean>(false);
  const [editingPage, setEditingPage] = useState<StorePage | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('');
  const [pageSlug, setPageSlug] = useState<string>('');
  const [pageContent, setPageContent] = useState<string>('');
  const [pageStatus, setPageStatus] = useState<'Published' | 'Draft'>('Published');

  // State for adding menu links
  const [menuIdToAddLink, setMenuIdToAddLink] = useState<string | null>(null);
  const [newLinkLabel, setNewLinkLabel] = useState<string>('');
  const [newLinkUrl, setNewLinkUrl] = useState<string>('');

  // 1. Theme publish mechanism (Single Published restriction)
  const handlePublishTheme = (themeId: string) => {
    setThemes(prev => prev.map(t => {
      if (t.id === themeId) {
        addLog('Theme System', '部署发布主题项目', `主题「${t.name}」已设为 Published 状态。`, 'success');
        return { ...t, status: 'Published' };
      }
      return { ...t, status: 'Draft' };
    }));
  };

  const handleDuplicateTheme = (themeId: string) => {
    const target = themes.find(t => t.id === themeId);
    if (!target) return;
    const copy: StoreTheme = {
      ...target,
      id: `theme-copy-${Date.now()}`,
      name: `${target.name} (副本)`,
      status: 'Draft',
    };
    setThemes(prev => [...prev, copy]);
    addLog('Theme System', '复制主题模板', `成功生成「${target.name}」的开发中草稿副本`, 'info');
  };

  const handleDeleteTheme = (themeId: string) => {
    const target = themes.find(t => t.id === themeId);
    if (target?.status === 'Published') {
      addLog('Theme System', '删除主题被拒绝', '无法删除当前已发布启用的在线主题。', 'error');
      alert('已公开的主题不可被删除！请先切换发布其他主题。');
      return;
    }
    setThemes(prev => prev.filter(t => t.id !== themeId));
    addLog('Theme System', '删除主题成功', `模板「${target?.name}」已被永久移出工作区。`, 'warning');
  };

  const handleExportTheme = (theme: StoreTheme) => {
    addLog('Theme System', '打包导出主题', `正在打包 ${theme.name}.zip 导出流...`, 'success');
    alert(`主题「${theme.name}」已打包并开始下载：\n- 包含 theme.json\n- 包含 templates/ 结构包\n- 包含 assets 以及 sections 的 CJS 对应。`);
  };

  // 2. Mock Zip theme uploading & validation
  const handleZipUploadMock = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.zip')) {
      setUploadError('格式不支持。主题必须是一个 standard ZIP 归档包，禁止上传 RAR/7Z ！');
      setUploadStatus('error');
      addLog('Theme System', '上传主题失败', '检测到非标准扩展压缩卷，终止解压。', 'error');
      return;
    }

    setZipFile(file);
    setUploadStatus('unzipping');
    setUploadError('');
    addLog('Theme System', '上传主题包接收', `接受到 ZIP 文件: ${file.name}，启动解包解密链...`, 'info');

    setTimeout(() => {
      setUploadStatus('validating');
      addLog('Theme System', '校验 theme.json 标准结构', '正校验模板规范与必须目录 [templates/, sections/, assets/]...', 'info');

      setTimeout(() => {
        // Validation success simulation
        const successTheme: StoreTheme = {
          id: `theme-uploaded-${Date.now()}`,
          name: file.name.replace('.zip', '') + ' (Uploaded Zip)',
          version: '1.0.0',
          author: 'Customer Dev Upload',
          type: 'user',
          status: 'Draft',
          preview_image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=300&q=80',
          colorPrimary: '#07C2E3',
          colorBackground: '#FAFAFA',
          borderRadius: '8px',
          fontFamily: 'Inter',
          sections: [
            { id: 'sec-header', type: 'header', name: '进口端页眉', settings: { title: 'GENERIC SHOP', logoUrl: '' } },
            { id: 'sec-hero', type: 'hero', name: '进口画幅 Banner', settings: { title: '自定义完美导入店铺', subtitle: '通过 theme.json 与 directory 规范进行全要素解译配置。', buttonText: '浏览新品', buttonLink: '#', bgColor: 'bg-slate-900' } },
            { id: 'sec-products', type: 'product-grid', name: '网格货架', settings: { count: 4, columns: 2, displayPrice: true } },
            { id: 'sec-footer', type: 'footer', name: '自建页脚', settings: { copyright: '© 2026 Custom. All Rights Reserved.' } }
          ]
        };

        setThemes(prev => [successTheme, ...prev]);
        setUploadStatus('done');
        addLog('Theme System', '主题标准 ZIP 校验安装完成', `生成模板 ${successTheme.name} 并保存为微编辑状态。`, 'success');
      }, 1000);
    }, 1000);
  };

  // 3. Shopify Theme Liquid Converter Simulator (Includes detailed Compatibility Report)
  const handleShopifyImportTrigger = () => {
    setImportStatus('scanning');
    setCompatibilityReport(null);
    addLog('Shopify Importer', '解析 Shopify Liquid 标准包', '开始扫描主文件 layout/theme.liquid 语法流...', 'info');

    setTimeout(() => {
      setImportStatus('converting');
      addLog('Shopify Importer', 'Liquid 词法翻译与 Block 解析', '转换 Shopify Section schemas 对应 json templates ...', 'info');

      setTimeout(() => {
        const report = {
          themeName: 'Shopify Dawn Advanced Concept',
          totalFiles: 42,
          compatibilityRate: 91.4,
          compatibleItems: [
            'JSON Templates (index.json, product.json, collection.json)',
            'Base Headings and Global CSS Layout Styles',
            'Header and Footer standard blocks',
            'Standard grid dynamic structures'
          ],
          partlyCompatible: [
            'Liquid Filter Filters: money_with_currency (自动转换为 Aurora 多币适配)',
            'Dynamic collection loops settings'
          ],
          incompatible: [
            'render "app-block-trustpilot" (第三方应用占位锁, 需手动配置 App embeds 扩展)'
          ]
        };
        setCompatibilityReport(report);
        setImportStatus('success');
        addLog('Shopify Importer', '翻译解译完毕已成标准转化树', '成功生成高拟兼容性全量报表！', 'success');
      }, 1200);
    }, 1000);
  };

  const installConvertedShopifyTheme = () => {
    if (!compatibilityReport) return;
    const shopifyTheme: StoreTheme = {
      id: `theme-shopify-${Date.now()}`,
      name: `${compatibilityReport.themeName} (Shopify 导入版)`,
      version: '8.4.1 (Compatible)',
      author: 'Shopify Source Importer',
      type: 'third-party',
      status: 'Draft',
      preview_image: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=300&q=80',
      colorPrimary: '#07C2E3',
      colorBackground: '#FCFCFC',
      borderRadius: '6px',
      fontFamily: 'Inter',
      sections: [
        { id: 'sec-header', type: 'header', name: 'Dawn Header Section', settings: { title: 'SHOPIFY IMPORTED BRAND', logoUrl: '' } },
        { id: 'sec-hero', type: 'hero', name: 'Dawn Slide (Banner)', settings: { title: 'Shopify 极速编译独立端', subtitle: '已跳过不兼容第三方应用锚点，多段 HTML/Liquid 自适应成功搭载。', buttonText: 'EXPLORE DAWN', buttonLink: '#', bgColor: 'bg-zinc-850' } },
        { id: 'sec-products', type: 'product-grid', name: 'Main Product Grid', settings: { count: 6, columns: 3, displayPrice: true } },
        { id: 'sec-footer', type: 'footer', name: 'Dawn Footer', settings: { copyright: '© 25 Dawn. Powered by Aurora' } }
      ]
    };

    setThemes(prev => [shopifyTheme, ...prev]);
    setImportStatus('idle');
    setCompatibilityReport(null);
    addLog('Shopify Importer', '成功落柜主题列表', `模板「${shopifyTheme.name}」已被激活进本地草稿，支持即可可视化精装调整！`, 'success');
  };

  // 4. One-Click AI Store Generation Simulator
  const handleAiBuildSubmit = () => {
    setIsAiBuilding(true);
    setAiBuildProgress(10);
    addLog('AI Build Agent', '初始化线上独立站自动生成指令', `建站提示: "${aiPrompt || 'Default high-end store'}" - 领域: ${aiIndustry}, 外观调性: ${aiAesthetic}`, 'info');

    const steps = [
      { prg: 25, msg: '计算风格代码规范配对树...' },
      { prg: 50, msg: '自动化生成 JSON 拓扑分区及 Block 设定...' },
      { prg: 75, msg: '编译注入本地 CMS 页面与初始化全局导航...' },
      { prg: 100, msg: '高拟真实数据全要素安装部署完毕！' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setAiBuildProgress(steps[currentStep].prg);
        addLog('AI Build Agent', '正在执行编译阶段', steps[currentStep].msg, 'tool');
        currentStep++;
      } else {
        clearInterval(interval);
        setIsAiBuilding(false);

        // Generate theme and append
        const themeLabelMap: any = { apparel: '服装高订精工店', restaurant: '米其林食府定制店', ecommerce: '精选科技好物零售独立店', saas: '数码数字化应用大厅' };
        const aestheticLabelMap: any = { minimal: '极简北欧白', premium: '轻奢耀尊金', darkgold: '黑金概念夜', fresh: '葱翠自然绿' };
        
        const genName = `AI-Store [${aestheticLabelMap[aiAesthetic]} x ${themeLabelMap[aiIndustry] || '自营商铺'}]`;
        const genPrimaryColor = aiAesthetic === 'minimal' ? '#07C2E3' : aiAesthetic === 'premium' ? '#F59E0B' : aiAesthetic === 'darkgold' ? '#D97706' : '#10B981';

        const aiGeneratedTheme: StoreTheme = {
          id: `theme-ai-${Date.now()}`,
          name: genName,
          version: '1.0.0 (AI Build)',
          author: 'AI Autopilot Agent',
          type: 'user',
          status: 'Draft',
          preview_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&q=80',
          colorPrimary: genPrimaryColor,
          colorBackground: aiAesthetic === 'darkgold' ? '#0F172A' : '#FAFAFA',
          borderRadius: aiAesthetic === 'minimal' ? '2px' : '10px',
          fontFamily: aiIndustry === 'saas' ? 'JetBrains Mono' : 'Inter',
          sections: [
            { id: 'sec-header', type: 'header', name: 'AI 标配页眉', settings: { title: genName.toUpperCase(), logoUrl: '' } },
            { id: 'sec-hero', type: 'hero', name: 'AI 风格主视觉通栏', settings: { title: `一键智能定制店: ${genName}`, subtitle: '全链路打通后台，支持自动计算欧盟 VAT 并配备多语言客服机器群租。', buttonText: '进入网店', buttonLink: '#', bgColor: 'bg-slate-900' } },
            { id: 'sec-products', type: 'product-grid', name: 'AI 选品货架', settings: { count: 4, columns: 2, displayPrice: true } },
            { id: 'sec-footer', type: 'footer', name: 'AI 专属底标', settings: { copyright: `© 2026 ${genName}. Powered by Aurora Intelligence` } }
          ]
        };

        setThemes(prev => [aiGeneratedTheme, ...prev]);
        addLog('AI Build Agent', '独立自营店全端包成功配发', `已将精装主题「${genName}」注入可用主题库草稿，秒级发布可用。`, 'success');
      }
    }, 1000);
  };

  // 5. Section Block Manipulation in Visual Theme Editor State
  const updateSectionSetting = (sectionId: string, key: string, value: any) => {
    if (!editingTheme) return;
    const updatedSections = editingTheme.sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          settings: {
            ...sec.settings,
            [key]: value
          }
        };
      }
      return sec;
    });

    setEditingTheme({
      ...editingTheme,
      sections: updatedSections
    });
  };

  const reorderSection = (index: number, direction: 'up' | 'down') => {
    if (!editingTheme) return;
    const nextIdx = direction === 'up' ? index - 1 : index + 1;
    if (nextIdx < 0 || nextIdx >= editingTheme.sections.length) return;

    const reordered = [...editingTheme.sections];
    const temp = reordered[index];
    reordered[index] = reordered[nextIdx];
    reordered[nextIdx] = temp;

    setEditingTheme({
      ...editingTheme,
      sections: reordered
    });
    addLog('Visual Editor', '重排分区区块顺序', `调整结构区块第 ${index+1} 项位置`, 'info');
  };

  const deleteSectionInEditor = (sectionId: string, name: string) => {
    if (!editingTheme) return;
    const filtered = editingTheme.sections.filter(s => s.id !== sectionId);
    setEditingTheme({
      ...editingTheme,
      sections: filtered
    });
    addLog('Visual Editor', '移出页面构成区块', `删去分区: ${name}`, 'warning');
  };

  const addCustomSectionToEditor = (type: 'gallery' | 'cta') => {
    if (!editingTheme) return;
    const newSec: ThemeSection = {
      id: `sec-custom-${Date.now()}`,
      type,
      name: type === 'gallery' ? '滑动特色相册' : '宽幅推广呼吁 (CTA)',
      settings: type === 'gallery' 
        ? { title: '限时风尚长廊', count: 3 } 
        : { title: '夏季终极狂欢：满 €1000 即包邮欧洲大陆', buttonText: '一键锁扣', buttonLink: '#', bgColor: 'bg-[#07C2E3]' }
    };

    setEditingTheme({
      ...editingTheme,
      sections: [...editingTheme.sections, newSec]
    });
    setActiveSectionId(newSec.id);
    addLog('Visual Editor', '全新分区搭载', `向当前页面挂载「${newSec.name}」区块成功！`, 'success');
  };

  const saveThemeSettingsInEditor = () => {
    if (!editingTheme) return;
    setThemes(prev => prev.map(t => t.id === editingTheme.id ? editingTheme : t));
    addLog('Visual Editor', '编辑数据封箱同步', `保存并同步到主题「${editingTheme.name}」主配置`, 'success');
    setEditingTheme(null);
  };

  // 6. CMS Page save
  const handleSaveCMSPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageTitle.trim()) return;

    if (editingPage) {
      setPages(prev => prev.map(p => p.id === editingPage.id ? {
        ...p,
        title: pageTitle,
        slug: pageSlug,
        content: pageContent,
        status: pageStatus,
        updatedAt: '2026-06-08 ' + new Date().toTimeString().slice(0, 5)
      } : p));
      addLog('CMS Contents', '修正在册静态页面', `内容页 [${pageTitle}] 编辑成功。`, 'success');
    } else {
      const fresh: StorePage = {
        id: `page-fresh-${Date.now()}`,
        title: pageTitle,
        slug: pageSlug || pageTitle.toLowerCase().replace(/\s+/g, '-'),
        content: pageContent,
        status: pageStatus,
        updatedAt: '2026-06-08 ' + new Date().toTimeString().slice(0, 5)
      };
      setPages(prev => [...prev, fresh]);
      addLog('CMS Contents', '新建专设静态页面', `静态页 [${pageTitle}] 已加入对客独立渲染池`, 'success');
    }
    setCmsEditorOpen(false);
    setEditingPage(null);
  };

  // 7. Navigation link operations
  const handleAddLinkToMenu = (menuId: string) => {
    if (!newLinkLabel.trim() || !newLinkUrl.trim()) return;
    setMenus(prev => prev.map(menu => {
      if (menu.id !== menuId) return menu;
      const targetLink = { id: `link-new-${Date.now()}`, label: newLinkLabel, url: newLinkUrl };
      addLog('Navigation', '挂载子链路', `对 [${menu.name}] 追加导航指向 -> ${newLinkLabel}`, 'success');
      return { ...menu, items: [...menu.items, targetLink] };
    }));
    setMenuIdToAddLink(null);
    setNewLinkLabel('');
    setNewLinkUrl('');
  };

  const moveMenuLink = (menuId: string, index: number, direction: 'up' | 'down') => {
    setMenus(prev => prev.map(menu => {
      if (menu.id !== menuId) return menu;
      const indexTarget = direction === 'up' ? index - 1 : index + 1;
      if (indexTarget < 0 || indexTarget >= menu.items.length) return menu;
      const duplicatedItems = [...menu.items];
      const temp = duplicatedItems[index];
      duplicatedItems[index] = duplicatedItems[indexTarget];
      duplicatedItems[indexTarget] = temp;
      return { ...menu, items: duplicatedItems };
    }));
  };

  const deleteMenuLink = (menuId: string, linkId: string, label: string) => {
    setMenus(prev => prev.map(menu => {
      if (menu.id !== menuId) return menu;
      addLog('Navigation', '移除子链路', `删除 [${menu.name}] 中的联结指向 -> ${label}`, 'warning');
      return { ...menu, items: menu.items.filter(item => item.id !== linkId) };
    }));
  };

  // Rendering Standard Shopify-style Live visual Customizer
  if (editingTheme) {
    const headerSec = editingTheme.sections.find(s => s.type === 'header');
    const heroSec = editingTheme.sections.find(s => s.type === 'hero');
    const productsSec = editingTheme.sections.find(s => s.type === 'product-grid');
    const footerSec = editingTheme.sections.find(s => s.type === 'footer');
    const customSecs = editingTheme.sections.filter(s => s.type === 'gallery' || s.type === 'cta');

    const activeSection = editingTheme.sections.find(s => s.id === activeSectionId);

    return (
      <div id="shopify-visual-editor-container" className="fixed inset-0 bg-slate-950 text-slate-100 flex flex-col z-50 font-sans">
        {/* Editor Top Control Header */}
        <div className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                addLog('Visual Editor', '退出可视化主面板', '放弃正在编辑的所有临时草案修改缓存', 'info');
                setEditingTheme(null);
              }}
              className="p-1.5 hover:bg-slate-800 rounded bg-transparent border-none text-slate-400 hover:text-white cursor-pointer flex items-center mr-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span className="text-xs font-bold font-sans">退出编辑器</span>
            </button>
            <span className="w-1.5 h-3 bg-[#07C2E3] rounded-xs"></span>
            <span className="text-xs font-black text-white">{editingTheme.name}</span>
          </div>

          {/* Scale Frame controls */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setPreviewScale('desktop')}
              className={`p-1 rounded cursor-pointer border-none bg-transparent ${previewScale === 'desktop' ? 'bg-slate-700 text-[#07C2E3]' : 'text-slate-400 hover:text-white'}`}
              title="桌面端尺寸"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPreviewScale('tablet')}
              className={`p-1 rounded cursor-pointer border-none bg-transparent ${previewScale === 'tablet' ? 'bg-slate-700 text-[#07C2E3]' : 'text-slate-400 hover:text-white'}`}
              title="平板尺寸"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPreviewScale('mobile')}
              className={`p-1 rounded cursor-pointer border-none bg-transparent ${previewScale === 'mobile' ? 'bg-slate-700 text-[#07C2E3]' : 'text-slate-400 hover:text-white'}`}
              title="移动端尺寸"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <button
              onClick={saveThemeSettingsInEditor}
              className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-900 font-extrabold px-3 py-1.5 rounded text-xs transition-colors border-none cursor-pointer flex items-center gap-1.5 uppercase font-sans"
            >
              <Check className="w-3.5 h-3.5" />
              <span>保存主题</span>
            </button>
          </div>
        </div>

        {/* Triple Layout Workspace */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          
          {/* L1: Left structural layout list */}
          <div className="w-64 bg-slate-900 border-r border-slate-800 overflow-y-auto p-4 flex flex-col justify-between flex-shrink-0">
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#07C2E3]" />
                <span className="text-[10px] uppercase font-bold text-slate-400 inline-block font-mono">页面大区树 (Page Schema)</span>
              </div>

              <div className="space-y-2">
                {editingTheme.sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`p-2 rounded-lg border text-left cursor-pointer transition-all flex justify-between items-center text-xs group ${
                      activeSectionId === sec.id 
                        ? 'bg-slate-800 border-[#07C2E3] text-white' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                    }`}
                  >
                    <div className="truncate">
                      <span className="text-[9px] uppercase font-mono block text-slate-500 font-semibold">{sec.type}</span>
                      <span className="font-extrabold">{sec.name}</span>
                    </div>

                    {/* Sorting & Delete hooks strictly active */}
                    <div className="flex gap-1 items-center opacity-70 group-hover:opacity-100">
                      <button
                        onClick={(e) => { e.stopPropagation(); reorderSection(idx, 'up'); }}
                        disabled={idx === 0}
                        className="p-0.5 hover:bg-slate-700 disabled:opacity-30 rounded border-none bg-transparent cursor-pointer text-slate-300"
                        title="上移"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); reorderSection(idx, 'down'); }}
                        disabled={idx === editingTheme.sections.length - 1}
                        className="p-0.5 hover:bg-slate-700 disabled:opacity-30 rounded border-none bg-transparent cursor-pointer text-slate-300"
                        title="下移"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      {['gallery', 'cta'].includes(sec.type) && (
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteSectionInEditor(sec.id, sec.name); }}
                          className="p-0.5 text-rose-400 hover:bg-rose-950 rounded border-none bg-transparent cursor-pointer"
                          title="删除分区"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add custom configurable sections */}
              <div className="pt-2 border-t border-slate-850 space-y-2">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">新增区块 Section</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => addCustomSectionToEditor('gallery')}
                    className="p-1 px-2 border border-slate-800 bg-slate-950 focus:border-[#07C2E3] hover:text-white rounded text-[10.5px] cursor-pointer text-slate-400 font-extrabold"
                  >
                    + 相动相册
                  </button>
                  <button
                    onClick={() => addCustomSectionToEditor('cta')}
                    className="p-1 px-2 border border-slate-800 bg-slate-950 focus:border-[#07C2E3] hover:text-white rounded text-[10.5px] cursor-pointer text-slate-400 font-extrabold"
                  >
                    + 促销 CTA
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-[10px] text-slate-500">
              <span className="font-extrabold text-white block">Shopify Compatible</span>
              <span>支持全量配置双向绑定。改动即刻在中间仿真沙盒层级无损体现。</span>
            </div>
          </div>

          {/* L2: Center Live view browser simulator (Strictly responsive scale values responsive) */}
          <div className="flex-1 overflow-auto bg-slate-900 p-4 flex items-center justify-center relative min-h-0">
            <div
              className="bg-white text-slate-800 shadow-2xl transition-all duration-300 border border-slate-800 overflow-y-auto max-h-full"
              style={{
                width: previewScale === 'desktop' ? '100%' : previewScale === 'tablet' ? '768px' : '380px',
                borderRadius: editingTheme.borderRadius,
                minHeight: '480px'
              }}
            >
              {/* Responsive URL Bar */}
              <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between font-mono text-[10px] text-slate-400 select-none">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                </div>
                <div className="bg-white border border-slate-205 rounded-md px-4 py-0.5 w-1/2 text-center text-slate-500 truncate lowercase">
                  https://my-store.is.aurora.com/preview
                </div>
                <div className="text-[9px] bg-slate-200 text-slate-600 px-1 rounded uppercase font-black">
                  Live
                </div>
              </div>

              {/* Dynamic Mockup Body Components */}
              <div className="space-y-0" style={{ fontFamily: editingTheme.fontFamily }}>
                
                {/* 1. Header component */}
                {headerSec && (
                  <header className="border-b border-slate-100 p-4 bg-white flex justify-between items-center text-xs">
                    <span 
                      className="font-black tracking-widest text-[#07C2E3]"
                      style={{ color: editingTheme.colorPrimary }}
                    >
                      {headerSec.settings?.title || 'STORE FRONT'}
                    </span>
                    <nav className="flex gap-3 text-[10px] text-slate-500 font-extrabold select-none">
                      <span>网店首页</span>
                      <span>精选分类</span>
                      <span>关于商用</span>
                    </nav>
                  </header>
                )}

                {/* Simulated Custom Order dynamic loop */}
                {editingTheme.sections.map(section => {
                  if (section.type === 'hero') {
                    return (
                      <div key={section.id} className="p-8 text-center text-slate-100 relative space-y-3 bg-cover bg-center" style={{ backgroundColor: '#0F172A' }}>
                        <span className="text-[9px] bg-[#07C2E3]/15 text-[#07C2E3] px-1.5 py-0.5 rounded uppercase font-black font-semibold" style={{ color: editingTheme.colorPrimary }}>
                          Hero Banner
                        </span>
                        <h1 className="text-xl sm:text-2xl font-extrabold leading-tight tracking-tight text-white">{section.settings?.title}</h1>
                        <p className="text-xs text-slate-400 max-w-lg mx-auto font-medium leading-relaxed">{section.settings?.subtitle}</p>
                        <button 
                          className="text-xs font-black px-4 py-2 bg-[#07C2E3] text-slate-900 border-none inline-block mt-2 transition-transform active:scale-95 cursor-pointer hover:opacity-90"
                          style={{ backgroundColor: editingTheme.colorPrimary, borderRadius: editingTheme.borderRadius }}
                        >
                          {section.settings?.buttonText || '立即购买'}
                        </button>
                      </div>
                    );
                  }

                  if (section.type === 'product-grid') {
                    const count = section.settings?.count || 4;
                    const gridColsClass = section.settings?.columns === 4 ? 'grid-cols-4' : section.settings?.columns === 3 ? 'grid-cols-3' : 'grid-cols-2';
                    return (
                      <div key={section.id} className="p-6 bg-slate-50 text-left space-y-4">
                        <div className="flex border-b border-slate-200 pb-1.5 justify-between items-center">
                          <span className="text-xs font-black text-slate-800">最新精美货源推荐 (Featured Grid)</span>
                          <span className="text-[10px] text-slate-400 font-mono">Count: {count} • Cols: {section.settings?.columns}</span>
                        </div>
                        <div className={`grid gap-4 ${gridColsClass}`}>
                          {Array.from({ length: count }).map((_, idx) => (
                            <div key={idx} className="bg-white border p-2 text-xs space-y-1.5 shadow-3xs" style={{ borderRadius: editingTheme.borderRadius }}>
                              <div className="h-16 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 font-bold border border-slate-200">
                                商品外观货模 #{idx+1}
                              </div>
                              <div>
                                <p className="font-extrabold text-slate-800 truncate">全球跨境合规高订货源 item</p>
                                {section.settings?.displayPrice !== false && <p className="text-[10px] font-mono text-[#07C2E3] font-bold" style={{ color: editingTheme.colorPrimary }}>€ 299.00 EUR</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (section.type === 'gallery') {
                    return (
                      <div key={section.id} className="p-6 bg-white text-left space-y-3">
                        <span className="text-[10px] text-slate-400 font-mono">Section: Gallery</span>
                        <h3 className="text-xs font-black text-slate-800">{section.settings?.title}</h3>
                        <div className="grid grid-cols-3 gap-2">
                          {Array.from({ length: section.settings?.count || 3 }).map((_, i) => (
                            <div key={i} className="h-12 bg-slate-200 flex items-center justify-center text-[8px] text-slate-500 font-extrabold border rounded-md">
                              特色大图 A0{i+1}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (section.type === 'cta') {
                    return (
                      <div key={section.id} className="p-6 text-center text-slate-100 relative bg-[#07C2E3]/95 space-y-2.5" style={{ backgroundColor: editingTheme.colorPrimary }}>
                        <h3 className="text-xs font-black text-white">{section.settings?.title}</h3>
                        <button className="text-[10px] font-black px-3.5 py-1.5 bg-slate-900 border-none text-white rounded">
                          {section.settings?.buttonText || '响应号召'}
                        </button>
                      </div>
                    );
                  }

                  if (section.type === 'footer') {
                    return (
                      <footer key={section.id} className="border-t border-slate-100 bg-white p-6 text-center text-[10px] text-slate-400 space-y-1">
                        <p className="font-semibold">{section.settings?.copyright}</p>
                        <p className="text-[9px] text-slate-350">AI Commerce OS High-Availability Framework v2.1</p>
                      </footer>
                    );
                  }

                  return null;
                })}

              </div>
            </div>
          </div>

          {/* L3: Right properties dynamic editing panel (Tweak section settings directly) */}
          <div className="w-80 bg-slate-900 border-l border-slate-800 overflow-y-auto p-4 space-y-4 flex-shrink-0 text-left">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 text-[#07C2E3]" />
              <span className="text-xs font-black text-white uppercase tracking-wider">属性修改面板 (Settings)</span>
            </div>

            {activeSection ? (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono uppercase block">当前选中分区</span>
                  <span className="font-black text-[#07C2E3] text-xs">{activeSection.name} ({activeSection.type})</span>
                </div>

                {/* HERO banner tweaks */}
                {activeSection.type === 'hero' && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-450 uppercase font-bold block">主幅显示文字</label>
                      <input
                        type="text"
                        value={activeSection.settings?.title || ''}
                        onChange={(e) => updateSectionSetting(activeSection.id, 'title', e.target.value)}
                        className="w-full text-xs p-2 bg-slate-950 border border-slate-800 text-slate-100 rounded focus:outline-none focus:border-[#07C2E3]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-450 uppercase font-bold block">促销说明副文本</label>
                      <textarea
                        rows={3}
                        value={activeSection.settings?.subtitle || ''}
                        onChange={(e) => updateSectionSetting(activeSection.id, 'subtitle', e.target.value)}
                        className="w-full text-xs p-2 bg-slate-950 border border-slate-800 text-slate-100 rounded focus:outline-none focus:border-[#07C2E3]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-450 uppercase font-bold block">主要按钮文案</label>
                      <input
                        type="text"
                        value={activeSection.settings?.buttonText || ''}
                        onChange={(e) => updateSectionSetting(activeSection.id, 'buttonText', e.target.value)}
                        className="w-full text-xs p-2 bg-slate-950 border border-slate-800 text-slate-100 rounded focus:outline-none focus:border-[#07C2E3]"
                      />
                    </div>
                  </div>
                )}

                {/* PRODUCT grid tweaks */}
                {activeSection.type === 'product-grid' && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-450 uppercase font-bold block">精选商品显示个数 ({activeSection.settings?.count})</label>
                      <input
                        type="range"
                        min="2"
                        max="8"
                        value={activeSection.settings?.count || 4}
                        onChange={(e) => updateSectionSetting(activeSection.id, 'count', parseInt(e.target.value))}
                        className="w-full cursor-pointer accent-[#07C2E3]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-450 uppercase font-bold block">推荐货架栅格系统</label>
                      <select
                        value={activeSection.settings?.columns || 2}
                        onChange={(e) => updateSectionSetting(activeSection.id, 'columns', parseInt(e.target.value))}
                        className="w-full p-2 bg-slate-950 border border-slate-800 text-slate-100 rounded text-xs focus:outline-none"
                      >
                        <option value="2">2 列平铺 (适合主流移动优先)</option>
                        <option value="3">3 列平铺 (精致科技风)</option>
                        <option value="4">4 列紧凑 (Shopify 宽幅标准)</option>
                      </select>
                    </div>

                    <div className="space-y-1 pt-1.5">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeSection.settings?.displayPrice !== false}
                          onChange={(e) => updateSectionSetting(activeSection.id, 'displayPrice', e.target.checked)}
                          className="rounded bg-slate-950 border-slate-800 text-[#07C2E3] focus:ring-0"
                        />
                        <span className="text-[11px] text-slate-350">货架商品显示真实外币价格</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* HEADER tweaks */}
                {activeSection.type === 'header' && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-450 uppercase font-bold block">主标店铺字样 Logo (Header Text)</label>
                    <input
                      type="text"
                      value={activeSection.settings?.title || ''}
                      onChange={(e) => updateSectionSetting(activeSection.id, 'title', e.target.value)}
                      className="w-full text-xs p-2 bg-slate-950 border border-slate-800 text-slate-100 rounded focus:outline-none"
                    />
                  </div>
                )}

                {/* FOOTER tweaks */}
                {activeSection.type === 'footer' && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-450 uppercase font-bold block">全底版合规版权署名 (Copyright)</label>
                    <input
                      type="text"
                      value={activeSection.settings?.copyright || ''}
                      onChange={(e) => updateSectionSetting(activeSection.id, 'copyright', e.target.value)}
                      className="w-full text-xs p-2 bg-slate-950 border border-slate-800 text-slate-100 rounded focus:outline-none"
                    />
                  </div>
                )}

                {/* DYNAMIC Custom sections (Gallery/CTA) */}
                {activeSection.type === 'cta' && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-450 uppercase font-bold block">终极标明文案</label>
                      <input
                        type="text"
                        value={activeSection.settings?.title || ''}
                        onChange={(e) => updateSectionSetting(activeSection.id, 'title', e.target.value)}
                        className="w-full text-xs p-2 bg-slate-950 border border-slate-800 text-slate-100 rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-450 uppercase font-bold block">按钮文本</label>
                      <input
                        type="text"
                        value={activeSection.settings?.buttonText || ''}
                        onChange={(e) => updateSectionSetting(activeSection.id, 'buttonText', e.target.value)}
                        className="w-full text-xs p-2 bg-slate-950 border border-slate-800 text-slate-100 rounded focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-500 text-[11px] pt-10 text-center">请在左侧点击任一构成区块，即可在此处精装调整属性。</p>
            )}

            {/* Global theme controls panel */}
            <div className="pt-4 border-t border-slate-800 mt-4 space-y-3 text-xs text-left">
              <div className="flex items-center gap-1 text-[#07C2E3]">
                <Palette className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono uppercase tracking-wide font-black">全局视觉设定 (Style Presets)</span>
              </div>

              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500">自选视觉辅色</span>
                    <span className="text-[10px] font-mono text-[#07C2E3] font-bold">{editingTheme.colorPrimary}</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={editingTheme.colorPrimary}
                      onChange={(e) => {
                        setEditingTheme({
                          ...editingTheme,
                          colorPrimary: e.target.value
                        });
                        addLog('Theme Style', '修改配色设定', `色调已更新为 ${e.target.value}`, 'info');
                      }}
                      className="w-7 h-7 rounded border border-slate-800 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingTheme.colorPrimary}
                      onChange={(e) => setEditingTheme({ ...editingTheme, colorPrimary: e.target.value })}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded p-1.5 text-[11px] text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 block">主题边框圆角大小</span>
                  <select
                    value={editingTheme.borderRadius}
                    onChange={(e) => {
                      setEditingTheme({ ...editingTheme, borderRadius: e.target.value });
                      addLog('Theme Style', '修改边角设定', `容器角度更新为 ${e.target.value}`, 'info');
                    }}
                    className="w-full p-2 bg-slate-950 border border-slate-800 text-slate-100 rounded text-[11px] h-8 focus:outline-none"
                  >
                    <option value="0px">0px (硬朗极简主义)</option>
                    <option value="4px">4px (偏小现代感)</option>
                    <option value="8px">8px (标准圆满款)</option>
                    <option value="12px">12px (饱满草本系)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 block">全站主要字体 (Font-Family)</span>
                  <select
                    value={editingTheme.fontFamily}
                    onChange={(e) => setEditingTheme({ ...editingTheme, fontFamily: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 text-slate-100 rounded text-[11px] h-8 focus:outline-none"
                  >
                    <option value="Inter">Inter (Sans-serif 高清晰度)</option>
                    <option value="JetBrains Mono">JetBrains Mono (科技极客)</option>
                    <option value="Georgia">Georgia (轻古典雅致)</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div id="theme-store-workspace" className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* 1. Header and triple navigation mode */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#07C2E3] rounded-sm"></span>
            <h2 className="text-sm font-black tracking-tight text-slate-900 uppercase">
              主题中心
            </h2>
          </div>
        </div>

        {/* Global tab panels switch selectors */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab('ai-builder')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer border-none bg-transparent ${
              activeTab === 'ai-builder' ? 'bg-white text-slate-950 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#07C2E3]" />
            <span>AI 建站入口</span>
          </button>

          <button
            onClick={() => setActiveTab('theme-store')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer border-none bg-transparent ${
              activeTab === 'theme-store' ? 'bg-white text-slate-950 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-amber-500" />
            <span>主题市场 & 管理</span>
          </button>

          <button
            onClick={() => setActiveTab('cms')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer border-none bg-transparent ${
              activeTab === 'cms' ? 'bg-white text-slate-950 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-500" />
            <span>内容与导航配置</span>
          </button>
        </div>
      </div>

      {/* 2. Main Tab content */}

      {/* CASE 1: AI BUILD ENGINE (Complete Autopilot generator) */}
      {activeTab === 'ai-builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left animate-fadeIn">
          
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sparkles className="w-4 h-4 text-[#07C2E3]" />
                <h3 className="text-xs font-black text-slate-900">AI 主题一键生成部署</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">1. 目标商铺领域</label>
                  <select
                    value={aiIndustry}
                    onChange={(e) => setAiIndustry(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                  >
                    <option value="ecommerce">全品类跨境零售 (Retail)</option>
                    <option value="apparel">精工服饰高级定制 (Apparel)</option>
                    <option value="restaurant">米其林食府尊受预定 (Food)</option>
                    <option value="saas">数码多链路 SaaS 大厅 (Portal)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">2. 视觉审美风格</label>
                  <select
                    value={aiAesthetic}
                    onChange={(e) => setAiAesthetic(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                  >
                    <option value="minimal">极简北欧白 (Minimalist)</option>
                    <option value="premium">尊雅米其黄 (Luxury)</option>
                    <option value="darkgold">神秘高雅深夜 (Pitch Dark)</option>
                    <option value="fresh">自然芳草鲜绿 (Bio Fresh)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">3. 个性化创设 Prompt (可选描述)</label>
                  <textarea
                    rows={3}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="例如: 创设一家位于巴黎的法国手提包跨境电商，主色奢华暖橙，支持对客展示高清宽幅横幅..."
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-[#07C2E3]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleAiBuildSubmit}
                    disabled={isAiBuilding}
                    className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 font-black py-2.5 rounded-lg tracking-wider transition-colors cursor-pointer border-none flex items-center justify-center gap-2"
                  >
                    {isAiBuilding ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                        <span>正在计算、部署生成店铺主题... ({aiBuildProgress}%)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>智能生成主题包 (AI Autopilot Generate)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-slate-800 font-extrabold">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>编译并封装合规规范</span>
              </div>
              <p className="text-[10.5px] text-slate-400 leading-relaxed">
                由 AI Commerce OS 大脑深度审查，直接输出标准 Shopify Schema 数据。支持将生成的页面无缝挂载。
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-[10px] uppercase font-bold font-mono text-slate-400">实时编译进程监控</span>
                <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.2 rounded font-black font-semibold">ONLINE CONNECTED</span>
              </div>

              {isAiBuilding ? (
                <div className="py-8 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-[#07C2E3] mx-auto" />
                  <div className="max-w-xs mx-auto space-y-1">
                    <p className="text-xs font-black text-slate-800">正在生成完全定制店铺结构树...</p>
                    <div className="w-full bg-slate-100 h-1.5 rounded overflow-hidden">
                      <div className="bg-[#07C2E3] h-full duration-300" style={{ width: `${aiBuildProgress}%` }}></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-slate-100 bg-slate-500/5 rounded-xl p-5 text-center min-h-[220px] flex flex-col justify-center items-center space-y-2">
                  <div className="p-3 rounded-full bg-[#07C2E3]/10 text-[#07C2E3]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-black text-slate-800">等待 AI 自主创设指令发出</h4>
                  <p className="text-[10.5px] text-slate-400 max-w-sm leading-relaxed">
                    在左侧选择您所开店铺的业务系统与视觉审美，提交后 AI 自动构建基础配置、权限体系、默认角色并生成高拟 draft 模板。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CASE 2: THEME STORE (MAIN INTERACTIVE WORKSPACE) */}
      {activeTab === 'theme-store' && (
        <div className="space-y-4 text-left animate-fadeIn">
          {/* Sub menu controls */}
          <div className="flex border-b border-slate-100 pb-2 mb-2 items-center gap-4">
            {[
              { id: 'installed', label: '已安装主题' },
              { id: 'official', label: '官方精选市场' },
              { id: 'third-party', label: '第三方开发商主题' },
              { id: 'import-upload', label: 'ZIP 上传与 Shopify 导入' }
            ].map(sub => (
              <button
                key={sub.id}
                onClick={() => setThemeSubTab(sub.id as any)}
                className={`pb-1 text-xs font-extrabold cursor-pointer transition-colors border-none bg-transparent ${
                  themeSubTab === sub.id 
                    ? 'text-slate-900 border-b-2 border-[#07C2E3]' 
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Sub Panel rendering */}
          {themeSubTab === 'installed' && (
            <div className="space-y-6">
              
              {/* Active display theme card */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-slate-200 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] text-emerald-450 uppercase font-mono font-black tracking-wide block">
                      ● 线上活动中 (Current Published Active Theme)
                    </span>
                    <h3 className="text-base font-black text-white">
                      {themes.find(t => t.status === 'Published')?.name || 'Dawn Standard Premium'}
                    </h3>
                    <p className="text-[11px] text-slate-405 font-mono">
                      版本号: {themes.find(t => t.status === 'Published')?.version} • 作者: {themes.find(t => t.status === 'Published')?.author}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const activeT = themes.find(t => t.status === 'Published');
                        if (activeT) setEditingTheme(JSON.parse(JSON.stringify(activeT)));
                        addLog('Visual Editor', '进入可视化编辑器', `装配活动主体「${activeT?.name}」`, 'info');
                      }}
                      className="bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-slate-900 font-extrabold px-3 py-1.5 rounded-lg text-xs cursor-pointer border-none flex items-center gap-1.5 transition-colors font-sans"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>在线可视化编辑</span>
                    </button>
                    <button
                      onClick={() => {
                        const actT = themes.find(t => t.status === 'Published');
                        if (actT) handleExportTheme(actT);
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-2.5 py-1.5 rounded-lg text-xs cursor-pointer border-none flex items-center gap-1 transition-colors"
                      title="导出标准 .zip 备份"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>导出</span>
                    </button>
                  </div>
                </div>

                {/* Micro Preview panel config list */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">辅配主色</span>
                    <div className="flex items-center gap-1.5 text-slate-200 mt-1">
                      <span className="w-3 h-3 rounded-full border border-slate-700" style={{ backgroundColor: themes.find(t => t.status === 'Published')?.colorPrimary }}></span>
                      <span>{themes.find(t => t.status === 'Published')?.colorPrimary}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">圆角半径</span>
                    <span className="text-slate-200 block mt-1">{themes.find(t => t.status === 'Published')?.borderRadius}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">主要字族</span>
                    <span className="text-slate-200 block mt-1">{themes.find(t => t.status === 'Published')?.fontFamily}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">已搭载分片</span>
                    <span className="text-slate-200 block mt-1">{themes.find(t => t.status === 'Published')?.sections.length} 个 Sections</span>
                  </div>
                </div>
              </div>

              {/* Draft installed list templates */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="text-[10px] text-slate-900 font-mono font-black uppercase">DRAFT ARCHIVES ({themes.filter(t => t.status !== 'Published').length})</span>
                  <span className="text-[9px] text-slate-500 font-mono font-semibold">STAGE: DRAFT_ONLY</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {themes.filter(t => t.status !== 'Published').map(theme => (
                    <div key={theme.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-4 hover:border-[#07C2E3] transition-all">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-black text-slate-900 truncate pr-2">{theme.name}</h4>
                          <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 rounded uppercase font-mono font-bold flex-shrink-0">DRAFT</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono">
                          版本: {theme.version} • 作者: {theme.author} • 色: {theme.colorPrimary}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                        {/* Action controllers */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => handlePublishTheme(theme.id)}
                            className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-900 font-extrabold px-2 py-1 text-[11px] rounded transition-colors cursor-pointer border-none"
                          >
                            立即发布启用
                          </button>
                          <button
                            onClick={() => setEditingTheme(JSON.parse(JSON.stringify(theme)))}
                            className="bg-slate-100 hover:bg-slate-250 text-slate-700 font-extrabold px-2 py-1 text-[11px] rounded cursor-pointer border-none"
                          >
                            可视化编辑
                          </button>
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => handleDuplicateTheme(theme.id)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent"
                            title="复制一份"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleExportTheme(theme)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent"
                            title="打包导出"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTheme(theme.id)}
                            className="p-1 text-rose-450 hover:bg-rose-50 rounded cursor-pointer border-none bg-transparent"
                            title="移除此模板"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Subtab: Official themes directory */}
          {themeSubTab === 'official' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Dawn Pro', author: 'Official Design', desc: '自适应全品类极适旗舰模板', version: 'v8.4', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80' },
                { name: 'Fashion Bloom', author: 'Official Design', desc: '专为服饰鞋帽设计的轻奢高长比页面', version: 'v3.2', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80' },
                { name: 'Gourmet Bistro', author: 'Official Design', desc: '餐饮、生鲜米其林专属视觉方案', version: 'v1.4', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80' },
                { name: 'Minimal Mono', author: 'Official Design', desc: '纯色、性冷淡极速出沙视觉模板', version: 'v1.5', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80' },
                { name: 'Dark Cyber Pro', author: 'Official Design', desc: '硬核、黑金、电子发烧产品模板', version: 'v2.1', image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80' },
                { name: 'Cosmetic Beauty', author: 'Official Design', desc: '温润面部、粉妆调配零售模版', version: 'v5.0', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80' }
              ].map(app => (
                <div key={app.name} className="bg-white border rounded-xl overflow-hidden hover:shadow-xs transition-shadow flex flex-col justify-between">
                  <div className="relative h-28 bg-slate-100 overflow-hidden select-none">
                    <img src={app.image} className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                    <span className="absolute top-2 right-2 bg-slate-900/80 text-white text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-black tracking-wide">
                      Official Free
                    </span>
                  </div>
                  <div className="p-3 text-left space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{app.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 mt-1">{app.desc}</p>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-100 font-mono">
                      <span>版本: {app.version}</span>
                      <button 
                        onClick={() => {
                          const installNew: StoreTheme = {
                            id: `theme-[${app.name.toLowerCase()}]-${Date.now()}`,
                            name: app.name,
                            version: app.version,
                            author: app.author,
                            type: 'official',
                            status: 'Draft',
                            preview_image: app.image,
                            colorPrimary: '#07C2E3',
                            colorBackground: '#FAFAFA',
                            borderRadius: '8px',
                            fontFamily: 'Inter',
                            sections: [
                              { id: 'sec-header', type: 'header', name: '官方标配页眉', settings: { title: app.name.toUpperCase(), logoUrl: '' } },
                              { id: 'sec-hero', type: 'hero', name: '官视觉 Banner', settings: { title: `自营商户「${app.name}」`, subtitle: app.desc, buttonText: '查看新品', buttonLink: '#', bgColor: 'bg-slate-900' } },
                              { id: 'sec-products', type: 'product-grid', name: '商品货架', settings: { count: 4, columns: 2, displayPrice: true } },
                              { id: 'sec-footer', type: 'footer', name: '页脚', settings: { copyright: `© 2026 ${app.name} Inc. 版权所有` } }
                            ]
                          };
                          setThemes(prev => [...prev, installNew]);
                          addLog('Theme Market', '安装官方新主题模板', `成功由市场部署「${app.name}」主题至草案。`, 'success');
                        }}
                        className="bg-slate-900 hover:bg-black text-[#07C2E3] font-black px-2 py-1 rounded transition-colors cursor-pointer border-none text-[9.5px]"
                      >
                        一键安装此主题
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Subtab: Third-party markets */}
          {themeSubTab === 'third-party' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center py-10 space-y-2">
              <div className="mx-auto w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                <Palette className="w-5 h-5 text-[#07C2E3]" />
              </div>
              <h4 className="text-xs font-black text-slate-800">开发者联营第三方主题大厅</h4>
              <p className="text-[10px] text-slate-400 max-w-sm mx-auto">
                目前全端独立第三方审核功能已全面挂载。您可以点击下方模拟拉取或前往 ZIP 导入栏目进行手动上传。
              </p>
              <button
                onClick={() => {
                  const devTheme: StoreTheme = {
                    id: `theme-partner-${Date.now()}`,
                    name: 'SaaS Blackout Complex (联营高级黑)',
                    version: '3.1.2',
                    author: 'Partner Studio France',
                    type: 'third-party',
                    status: 'Draft',
                    preview_image: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=300&q=80',
                    colorPrimary: '#F59E0B',
                    colorBackground: '#111827',
                    borderRadius: '0px',
                    fontFamily: 'Inter',
                    sections: [
                      { id: 'sec-header', type: 'header', name: '合作伙伴 Header', settings: { title: 'PARTNER BLACKOUT', logoUrl: '' } },
                      { id: 'sec-hero', type: 'hero', name: '合作宽幅 Banner', settings: { title: '合作伙伴特邀高拟视觉', subtitle: '专为高定外贸而计算的全新响应式样式。', buttonText: '进入选货', buttonLink: '#', bgColor: 'bg-black' } },
                      { id: 'sec-products', type: 'product-grid', name: '合作伙伴展示位', settings: { count: 3, columns: 3, displayPrice: true } },
                      { id: 'sec-footer', type: 'footer', name: '合作伙伴 Footer', settings: { copyright: '© 2026 Partner. Designed in Paris.' } }
                    ]
                  };
                  setThemes(prev => [devTheme, ...prev]);
                  addLog('Theme Market', '安装开发者特邀主题', '「SaaS Blackout Complex」转换部署成功', 'success');
                }}
                className="bg-white hover:bg-slate-100 text-slate-705 border border-slate-205 font-bold px-3 py-1.5 rounded text-xs cursor-pointer transition-all"
              >
                模拟拉取并安装一款高阶第三方模板
              </button>
            </div>
          )}

          {/* Subtab: Import upload Zip (Shopify compat imports & zip uploads) */}
          {themeSubTab === 'import-upload' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              
              {/* L: standard zip upload with real validates */}
              <div className="bg-white border text-left p-5 rounded-2xl shadow-2xs space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-[#07C2E3]" />
                    <span>标准 ZIP 主题压缩包上传</span>
                  </h4>
                  <p className="text-[10px] text-[#07C2E3] font-mono uppercase font-bold">
                    ZIP PROTOCOL V1.0 • APPROVED ARCHITECTURE ONLY
                  </p>
                </div>

                <div className="border-2 border-dashed border-slate-200 hover:border-[#07C2E3] transition-colors rounded-xl p-6 text-center relative cursor-pointer group">
                  <input
                    type="file"
                    accept=".zip"
                    onChange={handleZipUploadMock}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="space-y-2">
                    <div className="mx-auto w-10 h-10 rounded-full bg-[#07C2E3]/10 flex items-center justify-center text-[#07C2E3]">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-xs">
                      <span className="font-extrabold text-slate-850 block">拖拽或点击本区域，上传 .zip 主题包</span>
                      <span className="text-[10px] text-slate-450 block mt-1">支持 ZIP（严禁传入 RAR / 7Z / EXE）</span>
                    </div>
                  </div>
                </div>

                {uploadStatus === 'unzipping' && (
                  <p className="text-[10.5px] text-[#07C2E3] font-bold animate-pulse">正在拆包并提取 theme.json 目录结构...</p>
                )}
                {uploadStatus === 'validating' && (
                  <p className="text-[10.5px] text-amber-500 font-bold animate-pulse">验证所含 pages 及 Sections 拓扑树兼容度...</p>
                )}
                {uploadStatus === 'done' && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded border border-emerald-150 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>上传分析成功！主题包已被追加进「已安装主题-草稿」。</span>
                  </div>
                )}
                {uploadStatus === 'error' && (
                  <p className="text-[10.5px] text-rose-500 font-bold">{uploadError}</p>
                )}
              </div>

              {/* R: Shopify importer parsing Liquid blocks */}
              <div className="bg-white border text-left p-5 rounded-2xl shadow-2xs space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Import className="w-4 h-4 text-[#07C2E3]" />
                    <span>Shopify Premium Theme 直接导入并解译</span>
                  </h4>
                  <p className="text-[10px] text-[#07C2E3] font-mono uppercase font-bold">
                    LIQUID PARSER CORE • ONLINE COMPILING STATUS
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-4 border border-slate-150">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase font-mono text-slate-500 font-bold">同步转换引擎</span>
                    <span className="text-[9px] text-[#07C2E3] font-mono leading-none font-bold">VITE FAST PORTAL v2.1</span>
                  </div>

                  {importStatus === 'idle' && !compatibilityReport && (
                    <button
                      onClick={handleShopifyImportTrigger}
                      className="w-full bg-slate-900 text-[#07C2E3] hover:bg-black font-extrabold py-2 rounded text-xs transition-colors cursor-pointer border-none flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>扫描并解译本地/云端 Shopify Theme</span>
                    </button>
                  )}

                  {importStatus === 'scanning' && (
                    <div className="text-center py-2 space-y-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-[#07C2E3] mx-auto" />
                      <p className="text-[10px] text-slate-404">分析 layout/theme.liquid 标准架构树片段...</p>
                    </div>
                  )}

                  {importStatus === 'converting' && (
                    <div className="text-center py-2 space-y-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-amber-500 mx-auto" />
                      <p className="text-[10px] text-slate-404">进行 Schema JSON 与 Section Blocks 全面语法词法映射...</p>
                    </div>
                  )}

                  {compatibilityReport && (
                    <div className="space-y-3 font-sans text-xs pt-1">
                      <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded text-[11px] border border-emerald-150">
                        <span className="font-extrabold block">兼容度分析报告 (Analysis Report)</span>
                        <div className="mt-1 space-y-0.5 text-[10px]">
                          <p>模板名称: {compatibilityReport.themeName}</p>
                          <p className="font-bold">模块完全识别率: {compatibilityReport.compatibilityRate}% (自动转换解译)</p>
                        </div>
                      </div>

                      <div className="space-y-1 text-[10.5px]">
                        <span className="font-extrabold text-slate-805 block">自动转换资产 :</span>
                        <ul className="list-disc list-inside text-slate-500 space-y-0.5">
                          {compatibilityReport.compatibleItems.map((v: string) => <li key={v}>{v}</li>)}
                        </ul>
                      </div>

                      <div className="space-y-1 text-[10.5px]">
                        <span className="font-extrabold text-amber-600 block">部分兼容/重写指向 :</span>
                        <ul className="list-disc list-inside text-slate-500 space-y-0.5">
                          {compatibilityReport.partlyCompatible.map((v: string) => <li key={v}>{v}</li>)}
                        </ul>
                      </div>

                      <div className="space-y-1 text-[10.5px]">
                        <span className="font-extrabold text-slate-400 block">不兼容项 (直接标注，需手动处理):</span>
                        <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                          {compatibilityReport.incompatible.map((v: string) => <li key={v}>{v}</li>)}
                        </ul>
                      </div>

                      <button
                        onClick={installConvertedShopifyTheme}
                        className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-900 font-extrabold py-2 rounded text-xs border-none cursor-pointer"
                      >
                        双向绑定导入草稿为：Daw Plus Compatible
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* CASE 3: CONTENT & NAVIGATION CMS Panel */}
      {activeTab === 'cms' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xs text-left overflow-hidden animate-fadeIn">
          
          {/* Side Subtabs bar split pages vs navigation */}
          <div className="bg-slate-50 border-b p-2.5 flex justify-between items-center text-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCmsTab('pages')}
                className={`px-3 py-1.5 rounded-lg font-extrabold border-none bg-transparent cursor-pointer transition-all ${
                  cmsTab === 'pages' ? 'bg-slate-200 text-slate-950 font-black' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                在线静态页 (Pages CMS)
              </button>
              <button
                onClick={() => setCmsTab('menus')}
                className={`px-3 py-1.5 rounded-lg font-extrabold border-none bg-transparent cursor-pointer transition-all ${
                  cmsTab === 'menus' ? 'bg-slate-200 text-slate-950 font-black' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                挂载导航链 (Navigation Menus)
              </button>
            </div>

            {cmsTab === 'pages' && (
              <button
                onClick={() => {
                  setEditingPage(null);
                  setPageTitle('');
                  setPageSlug('');
                  setPageContent('');
                  setPageStatus('Published');
                  setCmsEditorOpen(true);
                }}
                className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-900 font-extrabold px-2.5 py-1 text-[11px] border-none rounded cursor-pointer"
              >
                + 添加全新在线页面
              </button>
            )}
          </div>

          <div className="p-5">
            {/* Pages list panel rendering */}
            {cmsTab === 'pages' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-[11.5px] text-slate-655 font-medium border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] text-slate-455 font-mono uppercase h-9 border-b border-slate-200 text-left">
                        <th className="p-2.5 pl-4">页面标题 Header</th>
                        <th className="p-2.5">链接 Slug</th>
                        <th className="p-2.5">更新时间</th>
                        <th className="p-2.5 text-center">发布状态</th>
                        <th className="p-2.5 pr-4 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pages.map(p => (
                        <tr key={p.id} className="h-11 hover:bg-slate-50/50">
                          <td className="p-2.5 pl-4 font-extrabold text-slate-900 text-xs">{p.title}</td>
                          <td className="p-2.5 font-mono text-[#07C2E3]">{p.slug === '' ? '/' : `/${p.slug}`}</td>
                          <td className="p-2.5 font-mono text-[11px] text-slate-400">{p.updatedAt}</td>
                          <td className="p-2.5 text-center">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-black font-semibold font-mono ${p.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="p-2.5 pr-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingPage(p);
                                  setPageTitle(p.title);
                                  setPageSlug(p.slug);
                                  setPageContent(p.content);
                                  setPageStatus(p.status);
                                  setCmsEditorOpen(true);
                                }}
                                className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer border-none bg-transparent"
                                title="编辑内容"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setPages(prev => prev.filter(pg => pg.id !== p.id));
                                  addLog('CMS', '删除静态页项', `从内容库中销毁了「${p.title}」`, 'warning');
                                }}
                                className="p-1 text-rose-450 hover:bg-rose-50 rounded cursor-pointer border-none bg-transparent"
                                title="销毁卸载"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Navigation and sorting handles tree panels */}
            {cmsTab === 'menus' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-left">
                {menus.map(menu => (
                  <div key={menu.id} className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <div>
                        <span className="font-black text-slate-900 block">{menu.name}</span>
                        <span className="text-[9.5px] text-slate-400 font-mono">配置 Handle: {menu.handle}</span>
                      </div>
                      <button
                        onClick={() => {
                          setMenuIdToAddLink(menu.id);
                          setNewLinkLabel('');
                          setNewLinkUrl('');
                        }}
                        className="bg-slate-105 hover:bg-slate-200 text-slate-800 text-[9.5px] font-extrabold px-2 py-1 rounded cursor-pointer border-none"
                      >
                        + 追加连理新子链
                      </button>
                    </div>

                    <div className="space-y-2">
                      {menu.items.map((item, idx) => (
                        <div key={item.id} className="flex justify-between items-center p-2.5 bg-slate-50 border rounded-lg text-xs hover:border-slate-300">
                          <div className="flex items-center gap-2">
                            <Menu className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-extrabold text-slate-800">{item.label}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({item.url})</span>
                          </div>

                          <div className="flex items-center gap-1.5 opacity-90">
                            <button
                              onClick={() => moveMenuLink(menu.id, idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 hover:bg-slate-200 disabled:opacity-30 rounded cursor-pointer border-none bg-transparent"
                            >
                              <ArrowUp className="w-3 h-3 text-slate-500" />
                            </button>
                            <button
                              onClick={() => moveMenuLink(menu.id, idx, 'down')}
                              disabled={idx === menu.items.length - 1}
                              className="p-1 hover:bg-slate-200 disabled:opacity-30 rounded cursor-pointer border-none bg-transparent"
                            >
                              <ArrowDown className="w-3 h-3 text-slate-500" />
                            </button>
                            <span className="text-slate-200">|</span>
                            <button
                              onClick={() => deleteMenuLink(menu.id, item.id, item.label)}
                              className="text-rose-455 hover:bg-rose-50 p-1 rounded cursor-pointer border-none bg-transparent"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {menu.items.length === 0 && (
                        <p className="text-slate-400 py-4 text-center font-mono text-[10px]">该导航尚未搭载任何链路，请点击追加。</p>
                      )}
                    </div>

                    {/* Quick Add Link Zone */}
                    {menuIdToAddLink === menu.id && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-3 mt-3 animate-fadeIn">
                        <span className="font-black text-slate-800 block text-[11px]">追加新联结目标</span>
                        
                        {/* Auto router match selector */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold">智能拉取自 CMS 页面</label>
                          <select
                            onChange={(e) => {
                              const selected = pages.find(p => p.id === e.target.value);
                              if (selected) {
                                setNewLinkLabel(selected.title.split(' ')[0]);
                                setNewLinkUrl(selected.slug === '' ? '/' : `/${selected.slug}`);
                              }
                            }}
                            className="w-full p-1 text-[11px] bg-white border rounded focus:outline-none"
                          >
                            <option value="">-- 点击调配 CMS 页映射 --</option>
                            {pages.map(p => <option key={p.id} value={p.id}>{p.title} (/{p.slug})</option>)}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="标签 (例如: 关于)"
                            value={newLinkLabel}
                            onChange={(e) => setNewLinkLabel(e.target.value)}
                            className="p-1.5 bg-white border rounded text-xs focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="路径 (例如: /about)"
                            value={newLinkUrl}
                            onChange={(e) => setNewLinkUrl(e.target.value)}
                            className="p-1.5 bg-white border rounded text-xs focus:outline-none"
                          />
                        </div>

                        <div className="flex justify-end gap-1.5 pt-1">
                          <button
                            onClick={() => setMenuIdToAddLink(null)}
                            className="px-2 py-1 bg-white hover:bg-slate-100 rounded border border-slate-205 cursor-pointer text-[10px]"
                          >
                            取消
                          </button>
                          <button
                            onClick={() => handleAddLinkToMenu(menu.id)}
                            className="px-3 py-1 bg-[#07C2E3] hover:bg-[#06B2D0] rounded text-slate-900 font-extrabold cursor-pointer border-none text-[10px]"
                          >
                            保存关联
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CASE 4: MODALS (Static Pages adding/editing modal) */}
      {cmsEditorOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white border rounded-2xl w-full max-w-lg overflow-hidden text-left shadow-2xl font-sans">
            <div className="bg-slate-50 border-b p-4 flex justify-between items-center text-xs">
              <span className="font-black text-slate-900">
                {editingPage ? '编辑在线静态页面配置' : '快速挂载全新静态管理页面'}
              </span>
              <button
                onClick={() => setCmsEditorOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold border-none bg-transparent cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCMSPage} className="p-4 text-xs space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono font-bold">页面大标题 (Title) *</span>
                  <input
                    type="text"
                    required
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    placeholder="退换货中心"
                    className="w-full p-2 bg-slate-50 border border-slate-200 focus:border-[#07C2E3] focus:bg-white rounded font-medium focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono font-bold">自定 Slug (不含前斜杠)</span>
                  <input
                    type="text"
                    value={pageSlug}
                    onChange={(e) => setPageSlug(e.target.value)}
                    placeholder="refunds"
                    className="w-full p-2 bg-slate-50 border border-slate-200 focus:border-[#07C2E3] focus:bg-white rounded font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-mono font-bold">HTML / MD 文档流深度主内容</span>
                <MarkdownCodeEditor
                  value={pageContent}
                  onChange={val => setPageContent(val)}
                  placeholder="### 全欧洲放心退款说明...  \n在欧盟任何港口下单均享受标准无理由退流保障..."
                  rows={6}
                  label={`Edit Page: ${pageTitle || 'New Page'}`}
                  aiContext={`E-commerce storefront CMS page. Title: ${pageTitle}, Slug: ${pageSlug}`}
                />
              </div>

              <div className="space-y-1 pt-1 border-t border-slate-100 flex justify-between items-center">
                <div className="flex gap-4">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      checked={pageStatus === 'Published'}
                      onChange={() => setPageStatus('Published')}
                      name="p_modal_st"
                    />
                    <span>在线运行 (Published)</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      checked={pageStatus === 'Draft'}
                      onChange={() => setPageStatus('Draft')}
                      name="p_modal_st"
                    />
                    <span>开发草稿 (Draft)</span>
                  </label>
                </div>

                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCmsEditorOpen(false)}
                    className="px-3.5 py-2 bg-slate-105 hover:bg-slate-120 border border-slate-205 rounded font-extrabold cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-slate-900 border-none rounded font-extrabold cursor-pointer transition-colors"
                  >
                    同步内容并发布 (Save)
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
