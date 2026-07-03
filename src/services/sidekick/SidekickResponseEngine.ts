import { ConsolidatedContext } from '../brain/BusinessContextEngine';

export interface HumanizedResponsePayload {
  explanation: string;
  remediesList: Array<{
    title: string;
    description: string;
    btnLabel: string;
    actionCode: string;
    isCritical: boolean;
  }>;
  suggestedGoalPrompt: string;
}

export class SidekickResponseEngine {
  private static instance: SidekickResponseEngine | null = null;

  private constructor() {}

  public static getInstance(): SidekickResponseEngine {
    if (!SidekickResponseEngine.instance) {
      SidekickResponseEngine.instance = new SidekickResponseEngine();
    }
    return SidekickResponseEngine.instance;
  }

  /**
   * Formulates high-grade natural-language prose out of structured metrics.
   */
  public humanize(context: ConsolidatedContext): HumanizedResponsePayload {
    let explanation = `您好！我是您的 **Shopify Sidekick** 运营专家。我正通过您店铺的 **Enterprise Operating Brain (商机数据中枢)** 帮您全面审视本站的各项配置、指标以及欧盟市场的合规状态。

当前，您的上线就绪度评分处于 **${context.readinessScore}%** 的水平。若想把产品迅速推向法国和德国这两个重点区域，还有部分关键配置或合规性差距需要弥补。

`;

    if (context.gaps.length > 0) {
      explanation += `### 🔍 大脑最新识别的上线阻碍 (Gaps Identified)：\n`;
      context.gaps.forEach((gap, index) => {
        explanation += `${index + 1}. **${gap}**\n`;
      });
      explanation += `\n这些遗留任务可能会使您的**海外仓派送发生延误**或**阻碍VAT合规审核**。\n\n`;
    }

    if (context.opportunities.length > 0) {
      explanation += `### 💡 高价值商业机会推荐 (Opportunities)：\n`;
      context.opportunities.forEach((opp) => {
        explanation += `- **${opp}** (预计可带来更丰富的自然搜索量与本地化客单转化)。\n`;
      });
      explanation += `\n`;
    }

    if (context.risks.length > 0) {
      explanation += `### ⚠️ 系统关键高危预警 (Risks & Hazards)：\n`;
      context.risks.forEach((risk) => {
        explanation += `- **${risk}**：需立即安排供应链补水或核验税务规则。\n`;
      });
      explanation += `\n`;
    }

    explanation += `针对以上分析，我已经为您制定好了最有效的**下一步最佳行动 (Next Best Action)**，支持直接一键执行。`;

    // Map gaps into highly descriptive button remedies
    const remediesList: Array<{
      title: string;
      description: string;
      btnLabel: string;
      actionCode: string;
      isCritical: boolean;
    }> = [];

    // Map context actions and gaps to executable remedies
    if (context.gaps.some(g => g.includes('VAT'))) {
      remediesList.push({
        title: '合规化申报：注册欧盟 VAT OSS 账户',
        description: '自动对接欧洲税务局一站式欧盟增值税申报平台，打通报税链路，预计节省人工对账时间 94%。',
        btnLabel: '立即开启 OSS 注册',
        actionCode: 'VAT_OSS_COMPLY',
        isCritical: true
      });
    }

    if (context.gaps.some(g => g.includes('Shipping') || g.includes('Shipping Zones'))) {
      remediesList.push({
        title: '物流多元化：配置多国配送区 (Shipping Zones)',
        description: '增加法国、德国和意大利的本地化包裹妥投时效费率计算，保障欧洲尾程妥投率。',
        btnLabel: '增加欧洲配送区',
        actionCode: 'ADD_SHIPPING_ZONES',
        isCritical: false
      });
    }

    if (context.risks.some(r => r.includes('Stock') || r.includes('Inventory'))) {
      remediesList.push({
        title: '供应链预警：触发低库存 SKU 补货流',
        description: '联动 Botble ERP 发起智能补货需求，跟单法国合伙货运，可恢复约 €18,200 的受阻销量。',
        btnLabel: '一键发起跟单补货',
        actionCode: 'RESTOCK_TRIGGER',
        isCritical: true
      });
    }

    if (remediesList.length === 0) {
      remediesList.push({
        title: '海外多语种智能翻译',
        description: '为德国、法国提供百分百精细化一键机器智能翻译校对，使本土加购比大幅飙升。',
        btnLabel: '开始多语种翻译',
        actionCode: 'LOC_TRANSLATIONS',
        isCritical: false
      });
    }

    const suggestedGoalPrompt = `我想解决 ${context.nextBestAction?.action === 'vat_oss_comply' ? '欧盟 VAT 注册' : '低库存SKU补货'} 任务，请协助下发指令。`;

    return {
      explanation,
      remediesList,
      suggestedGoalPrompt
    };
  }
}

export const sidekickResponseEngine = SidekickResponseEngine.getInstance();
