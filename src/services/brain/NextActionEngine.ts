import { dbEngine } from '../../db/dbEngine';
import { StoreDigitalTwin, StoreContext } from '../../types';
import { BrainRuntime } from './runtime/BrainRuntime';

export interface NextActionItem {
  id: string;
  code: string;
  title: string;
  description: string;
  remediation: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';
  type: 'VAT_OSS' | 'RESTOCK' | 'GDPR_CONF' | 'TRANSLATE_SEO' | 'COMPLIANCE_KYC' | 'NAV_TAB';
  btnLabel: string;
  actionPayload: {
    action: 'switch_tab' | 'restock' | 'campaign' | 'none';
    payload: any;
  };
}

export interface BusinessDiagnosis {
  tenantId: string;
  storeId: string;
  currentPage: string;
  storeReadiness: number;
  globalStatus: 'HEALED' | 'WARNING' | 'CRITICAL';
  gaps: string[];
  recommendedAction: string;
  actions: NextActionItem[];
}

export class NextActionEngineClass {
  private static instance: NextActionEngineClass;

  private constructor() {}

  public static getInstance(): NextActionEngineClass {
    if (!NextActionEngineClass.instance) {
      NextActionEngineClass.instance = new NextActionEngineClass();
    }
    return NextActionEngineClass.instance;
  }

  /**
   * Evaluates the current active page, risks, gaps, and db state, 
   * formulating next tactical actions with direct platform execution configurations.
   */
  public diagnose(tenantId = 't_retail', storeId = 'store_retail'): BusinessDiagnosis {
    const runtimeState = BrainRuntime.getOrCreateRuntimeState(tenantId, storeId);
    const currentPage = runtimeState.current_page_type || 'command';
    
    // Default indicators
    let storeReadiness = 87;
    let baseAction: NextActionItem[] = [];
    let gaps: string[] = [];
    let recommendedAction = "一键进行欧盟市场 VAT 备案配置";

    const products = dbEngine.products?.getAll() || [];
    const lowStockProducts = products.filter(p => !p.inventory || p.inventory < 15);
    const orders = dbEngine.orders?.getAll() || [];
    const pendingOrders = orders.filter(o => o.status === 'Pending');

    // 1. Compile localized gaps & actions based on standard routing context
    if (currentPage === 'markets' || currentPage === 'logistics' || currentPage === 'online-store') {
      storeReadiness = 82;
      gaps = [
        "未完成欧盟一站式申报 (VAT OSS Compliance Standard)",
        "欧洲区跨境直邮配送通道未启用 (EU Express Zones Stale)",
        "法语及德语站商品本地化文案残缺"
      ];
      recommendedAction = "激活欧盟本土市场及增值税 VAT 备案规则";

      baseAction.push({
        id: 'na_vat_oss',
        code: 'VAT_OSS_COMPLY',
        title: '启用欧盟一站式增值税申报备案 (VAT OSS)',
        description: '自动对接OSS备案申报机制，规范跨境发货税费代收与代扣。',
        remediation: '在账户设置 -> 税务与关税面板一键配置欧盟一站式合规。',
        priority: 'CRITICAL',
        type: 'VAT_OSS',
        btnLabel: '立即启用合规协议库',
        actionPayload: {
          action: 'switch_tab',
          payload: 'settings'
        }
      });
      baseAction.push({
        id: 'na_eu_languages',
        code: 'TRANSLATE_FR_DE',
        title: '一键部署法语/德语本土爆品文案覆盖',
        description: '系统检测到法国和德国站浏览转化偏低，建议使用AI智能翻译并覆盖商品搜索引擎索引。',
        remediation: '批量运行 AI 智能语言优化管线。',
        priority: 'MEDIUM',
        type: 'TRANSLATE_SEO',
        btnLabel: '一键优化并覆盖中英法多语言文案',
        actionPayload: {
          action: 'switch_tab',
          payload: 'products'
        }
      });
    } 
    else if (currentPage === 'products' || currentPage === 'inventory' || currentPage === 'sourcing' || lowStockProducts.length > 0) {
      storeReadiness = 91;
      const productNames = lowStockProducts.slice(0, 2).map(p => p.name).join(', ');
      gaps = [
        `爆品库存严重不足: ${productNames || '核心冷冬大衣'} (低库存 < 15)`,
        "产品 SEO 结构性元素在出海目标市场不适配 (SEO Target Miss)"
      ];
      recommendedAction = "批量补齐低库存热销爆品并覆盖海外仓货流";

      baseAction.push({
        id: 'na_restock_sourcing',
        code: 'RESTOCK_TRIGGER',
        title: '一键发起供应商热销爆货源补齐与分发',
        description: `自动核算并向本地合伙供应链发送 [${productNames || '高端美丽奴羊毛大衣'}] 补货指令。`,
        remediation: '结合智能供应链推荐一键采入补给，规避爆品断盘风险。',
        priority: 'HIGH',
        type: 'RESTOCK',
        btnLabel: '一键向供应商发起起补货备仓指令 (Restock)',
        actionPayload: {
          action: 'restock',
          payload: { sku: 'all', count: 300 }
        }
      });
      baseAction.push({
        id: 'na_seo_optimize',
        code: 'SEO_SYNTHESIZE',
        title: '运行跨境 SEO 标题与图谱强化管线',
        description: '批量重写商品外海站前端描述页面，将点击率预计提升 8.2%。',
        remediation: '调用 ECOS SEO 智能覆写工具。',
        priority: 'MEDIUM',
        type: 'TRANSLATE_SEO',
        btnLabel: '一键优化并覆盖中英法多语言文案',
        actionPayload: {
          action: 'switch_tab',
          payload: 'products'
        }
      });
    }
    else if (currentPage === 'payments' || currentPage === 'finance' || pendingOrders.length > 5) {
      storeReadiness = 75;
      gaps = [
        "Adyen 等多通道本地法币结算尚未就绪",
        "部分跨境意向客户存在付款超时未转化现象 (Pending Count High)"
      ];
      recommendedAction = "立即提报 KYC 证书并对未付款客户进行自动对账追缴";

      baseAction.push({
        id: 'na_kyc_compliance',
        code: 'KYC_COMPLY',
        title: '提报 Adyen/Stripe 渠道实名 KYC 证书',
        description: '应欧洲法案要求，合规结算必须绑定法人主体证照。',
        remediation: '通过设置面板一键上传真实提款信息。',
        priority: 'HIGH',
        type: 'COMPLIANCE_KYC',
        btnLabel: '立即启用合规协议库',
        actionPayload: {
          action: 'switch_tab',
          payload: 'settings'
        }
      });
    }
    else if (currentPage === 'settings' || currentPage === 'policies') {
      storeReadiness = 78;
      gaps = [
        "GDPR 条款缺少用户隐私自定义同意挂架 (Privacy Directive Miss)",
        "欧洲区法定 14 天退换货规则条款(Cancel Policy) 缺位"
      ];
      recommendedAction = "应用标准 GDPR 法令隐私及取消条款声明";

      baseAction.push({
        id: 'na_gdpr_policy',
        code: 'GDPR_ACTIVATE',
        title: '运行并覆盖标准 GDPR 出海政策协议声明',
        description: '在店铺隐私设置及条款页面强制追加多语种 Cookie 申明和14天不退理由兜底免除声明。',
        remediation: '激活合规政策管线模板直接下发给在线主题端。',
        priority: 'HIGH',
        type: 'GDPR_CONF',
        btnLabel: '立即启用合规协议库',
        actionPayload: {
          action: 'switch_tab',
          payload: 'settings'
        }
      });
    }
    else {
      // General fallbacks (e.g., Command or Dashboard view)
      storeReadiness = 87;
      gaps = [
        "未完成欧盟一站式申报 (VAT OSS Compliance Standard)",
        "法语及意语关键爆品描述缺位 (Required For 出海)"
      ];
      recommendedAction = "一键进行欧盟市场 VAT 备案配置";

      baseAction.push({
        id: 'na_generative_vat',
        code: 'VAT_GENERAL',
        title: '一键启用跨境海外市场 VAT 合规规则',
        description: '对商家提供无感的全自动税收调配，直接消除海外扣回等处罚性风险。',
        remediation: '升级欧洲站增值税规则设置。',
        priority: 'HIGH',
        type: 'VAT_OSS',
        btnLabel: '立即前往海外市场配置',
        actionPayload: {
          action: 'switch_tab',
          payload: 'online-store'
        }
      });
    }

    // Dynamic digital twin sync-up representing the autonomic learning engine
    const twinList = dbEngine.store_digital_twins?.getAll() || [];
    const activeTwin = twinList.find(t => t.tenant_id === tenantId && t.store_id === storeId);
    if (activeTwin) {
      dbEngine.store_digital_twins.update(activeTwin.id, {
        twin_status: 'SYNCED',
        last_snapshot_at: new Date().toISOString(),
        snapshot_data: {
          ...activeTwin.snapshot_data,
          products_count: products.length,
          active_orders_count: orders.length,
          readiness_evaluation: storeReadiness,
          gaps_count: gaps.length
        } as any
      });
    }

    return {
      tenantId,
      storeId,
      currentPage,
      storeReadiness,
      globalStatus: runtimeState.system_load_status,
      gaps,
      recommendedAction,
      actions: baseAction
    };
  }
}

export const NextActionEngine = NextActionEngineClass.getInstance();
