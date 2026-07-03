import { dbEngine } from '../db/dbEngine';
import { 
  WorkflowInstance, 
  WorkflowStep, 
  WorkflowExecutionLog, 
  WorkflowResult, 
  AgentRegistryItem,
  Product,
  FinanceRecord
} from '../types';

export class BusinessWorkflowEngine {
  /**
   * Triggers a new workflow instance from a template ID
   */
  public static triggerWorkflow(templateId: string, triggerReason: string, tenantId: string = 'tenant_global_moda'): WorkflowInstance {
    const templates = dbEngine.workflow_templates.getAll();
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Workflow template ${templateId} not found`);
    }

    // Create workflow instance
    const instance = dbEngine.workflow_instances.create({
      tenant_id: tenantId,
      template_id: templateId,
      name: `${template.name} - ${new Date().toLocaleDateString('zh-CN')} 运行实例`,
      status: 'running',
      current_step_id: '',
      trigger_reason: triggerReason,
      completed_at: null
    });

    // Create steps for this workflow instance
    const stepsConfig = this.getStepsConfigForTemplate(templateId);
    let firstStepId = '';

    stepsConfig.forEach((stepConf, idx) => {
      const step = dbEngine.workflow_steps.create({
        workflow_id: instance.id,
        step_number: stepConf.step_number,
        name: stepConf.name,
        action_type: stepConf.action_type as any,
        status: idx === 0 ? 'running' : 'pending',
        assigned_agent: stepConf.assigned_agent,
        execution_response: null,
        started_at: idx === 0 ? new Date().toISOString() : null,
        completed_at: null
      });

      if (idx === 0) {
        firstStepId = step.id;
        // Mark first step on agent status as 'running'
        this.updateAgentStatus(stepConf.assigned_agent, 'running');
      }
    });

    // Update instance with first step
    dbEngine.workflow_instances.update(instance.id, {
      current_step_id: firstStepId
    });

    // Log the initiation
    dbEngine.workflow_execution_logs.create({
      tenant_id: tenantId,
      workflow_instance_id: instance.id,
      step_id: firstStepId,
      log_level: 'info',
      message: `工作流系统自动启动：${template.name} 被成功触发。事件起因：${triggerReason}`
    });

    return dbEngine.workflow_instances.getById(instance.id)!;
  }

  /**
   * Processes the next pending step of a running workflow instance, executing actual business changes!
   */
  public static executeNextStep(instanceId: string): { completed: boolean; currentStep?: WorkflowStep } {
    const instance = dbEngine.workflow_instances.getById(instanceId);
    if (!instance || instance.status !== 'running') {
      return { completed: true };
    }

    const steps = dbEngine.workflow_steps.getByWorkflow(instanceId).sort((a, b) => a.step_number - b.step_number);
    const activeStepIdx = steps.findIndex(s => s.status === 'running');
    
    if (activeStepIdx === -1) {
      // Find the first pending step to run
      const nextPendingIdx = steps.findIndex(s => s.status === 'pending');
      if (nextPendingIdx === -1) {
        this.finalizeWorkflow(instanceId, 'success');
        return { completed: true };
      }
      
      const stepToRun = steps[nextPendingIdx];
      dbEngine.workflow_steps.update(stepToRun.id, {
        status: 'running',
        started_at: new Date().toISOString()
      });
      dbEngine.workflow_instances.update(instanceId, {
        current_step_id: stepToRun.id
      });
      this.updateAgentStatus(stepToRun.assigned_agent, 'running');
      
      return { completed: false, currentStep: stepToRun };
    }

    // Process the active step
    const activeStep = steps[activeStepIdx];
    let responseText = '';
    let isGovernanceAudit = false;

    // Run custom agent execution simulation logic by step & template
    const templateId = instance.template_id;

    if (templateId === 'tmpl_replenishment') {
      // 补货工作流
      switch (activeStep.step_number) {
        case 1: // 库存安全线偏离检查 (Marcus - InventoryAgent)
          responseText = '已查明：经典大衣 Classic Tailored Trench Coat (APP-TRNCH-01) 实际物理库存跌至 5 件，触发低于安全水位 10 的阈值警戒线。';
          break;
        case 2: // 精细采购补货计划生成 (Marcus - InventoryAgent)
          responseText = '已自动制定补充 50 套大衣的采购补进策略（折让批发价 $115/件），预算开支评估为 $5,750。';
          break;
        case 3: // 经营宪章与预算法规合规审计 (Clarissa - FinanceAgent)
          responseText = '审查完毕：补货开支 $5,750 满足可用流动资金安全保留垫规则，判定为合规支出，财务放行。';
          isGovernanceAudit = true;
          break;
        case 4: // 自动签发采购并执行划转 (Clarissa - FinanceAgent)
          responseText = '实体划账完成：向主营供应商自动下达采购批单 PO-2026-N95，财务账户同步完成首期 $5,750 周转资金流出扣减。';
          // --- 真实扣减 ───
          dbEngine.finance.create({
            tenantId: instance.tenant_id,
            storeId: 'store_paris_moda',
            type: 'Expense',
            amount: 5750,
            category: 'Procurement',
            description: `[工作流授权] 自动采购 Classic Tailored Trench Coat (APP-TRNCH-01) * 50 件`
          });
          break;
        case 5: // 供应链交期跟踪与交货校验 (Marcus - InventoryAgent)
          responseText = '实操验收：供应商工厂完成排单，库存中虚拟在途库存 +50，预计物流提运在 7 天内完成合拢。';
          // --- 真实加库存 ───
          const products = dbEngine.products.getAll();
          const p = products.find(x => x.sku === 'APP-TRNCH-01');
          if (p) {
            dbEngine.products.update(p.id, {
              inventory: (p.inventory || 0) + 50
            });
          }
          break;
      }
    } else if (templateId === 'tmpl_customer_recall') {
      // 流水生命周期与召回工作流
      switch (activeStep.step_number) {
        case 1: // 高危流失客群静默发现与聚合 (Silas - CustomerAgent)
          responseText = '深度发现：自动聚合过滤出 12 名近期连续 45 天无任何点击互动的欧洲尊贵钻石/白金高净值超级VIP会员。';
          break;
        case 2: // 客群意向与消费生命周期分层 (Silas - CustomerAgent)
          responseText = '生命周期分层结果：8 人偏好高档风衣大衣外套，4 人偏好高品质丝质配饰。';
          break;
        case 3: // 自适应精细召回话术与个性配券生成 (Evelyn - MarketingAgent)
          responseText = '物料拟定：根据消费者偏好，对大衣偏好组个性生成 €30 尊享春装券，配饰组匹配 €15 多边礼品配折券。';
          break;
        case 4: // 多通路召回触达派发 (Evelyn - MarketingAgent)
          responseText = '执行下发：通过 Sendgrid 网关与 Twilio 自动发出个性关怀邮件及专属尊荣短信，加密召回券代码已封包下达。';
          break;
        case 5: // 复购周期与回款归因验证 (Silas - CustomerAgent)
          responseText = '最终归因：12 位流失客户中已有 4 位持此专属召回卡券复购复活结算，销售漏斗转化率 €1,450 GMV 实录归零。';
          break;
      }
    } else if (templateId === 'tmpl_price_optimization') {
      // 定价优化工作流
      switch (activeStep.step_number) {
        case 1: // 退货率偏离与毛利警戒诊断 (Garrick - PricingAgent)
          responseText = '诊断：Camel Trench Coat (APP-TRNCH-02) 退货率拉升至 24% 触发毛利绿线预警，探究为尺码不合退换频繁。';
          break;
        case 2: // 价格弹性模拟与尺码修正分析 (Garrick - PricingAgent)
          responseText = '弹性模拟：拟将零售售价自 $159 下降至 $144.50。同时页面尺码选择模块加入身材围偏离预警标识防偏。';
          break;
        case 3: // 自适应GMV与利润回报预测 (Clarissa - FinanceAgent)
          responseText = '模拟推演：降价 9.1% 可刺激销量回转 +30%，同时结合精准尺码预防，退款率预估回降至 4.5%，商铺综合结算纯利润相抵提升 $2,450。';
          isGovernanceAudit = true;
          break;
        case 4: // 跨平台销售价格核准执行与发布 (Garrick - PricingAgent)
          responseText = '改价落地：全新 $144.50 零售售价已实时同步更新推送至主营 Shopify 全网在线交易数据库通道中。';
          // --- 真实价格落库 ───
          const productsList = dbEngine.products.getAll();
          const pTrench = productsList.find(x => x.sku === 'APP-TRNCH-02');
          if (pTrench) {
            dbEngine.products.update(pTrench.id, {
              price: 144.50
            });
          }
          break;
        case 5: // 退款漏斗回转监控与最终收益审计 (Clarissa - FinanceAgent)
          responseText = '效果审计：改价格后，当日录得 5 件新增高纯净成交，无一笔退货申请偏离，综合转化净收益完美对冲损失！';
          break;
      }
    }

    // Update current step to completed
    dbEngine.workflow_steps.update(activeStep.id, {
      status: 'completed',
      execution_response: responseText,
      completed_at: new Date().toISOString()
    });

    // Create log
    dbEngine.workflow_execution_logs.create({
      tenant_id: instance.tenant_id,
      workflow_instance_id: instance.id,
      step_id: activeStep.id,
      log_level: isGovernanceAudit ? 'governance_audit' : 'info',
      message: `${activeStep.name} 执行汇报：${responseText}`
    });

    // Clear active status of the agent (set back to idle)
    this.updateAgentStatus(activeStep.assigned_agent, 'idle');

    // Move to next step
    const nextStepIdx = activeStepIdx + 1;
    if (nextStepIdx < steps.length) {
      const nextStep = steps[nextStepIdx];
      dbEngine.workflow_steps.update(nextStep.id, {
        status: 'running',
        started_at: new Date().toISOString()
      });
      dbEngine.workflow_instances.update(instanceId, {
        current_step_id: nextStep.id
      });
      this.updateAgentStatus(nextStep.assigned_agent, 'running');
      return { completed: false, currentStep: nextStep };
    } else {
      this.finalizeWorkflow(instanceId, 'success');
      return { completed: true };
    }
  }

  /**
   * Finalizes the state of a workflow, creating the Business outcome metrics records in workflows_results!
   */
  private static finalizeWorkflow(instanceId: string, outcome: 'success' | 'failure') {
    const instance = dbEngine.workflow_instances.getById(instanceId);
    if (!instance) return;

    dbEngine.workflow_instances.update(instanceId, {
      status: outcome === 'success' ? 'completed' : 'failed',
      completed_at: new Date().toISOString()
    });

    // Log closure
    dbEngine.workflow_execution_logs.create({
      tenant_id: instance.tenant_id,
      workflow_instance_id: instance.id,
      step_id: null,
      log_level: 'info',
      message: `工作流最终执行关闭。状态判定：【${outcome === 'success' ? '成功' : '失败'}】`
    });

    // Generate real, measurable impact records under workflow_results !
    let revGained = 0;
    let costSaved = 0;
    let impactDetail = '';

    if (instance.template_id === 'tmpl_replenishment') {
      revGained = 11000.00;
      costSaved = 450.00;
      impactDetail = '经典大衣(Trench Coat)库存水位恢复至 55 件。货存断供风险消除，货架率 100%，累计护航 $11,000 GMV。';
    } else if (instance.template_id === 'tmpl_customer_recall') {
      revGained = 1450.00;
      costSaved = 150.00;
      impactDetail = '4名流失欧洲尊贵钻石VIP客户已被再次唤醒并购买！创造流失召回纯 GMV +€1,450 贡献。';
    } else if (instance.template_id === 'tmpl_price_optimization') {
      revGained = 2450.00;
      costSaved = 1200.00;
      impactDetail = '商改价大衣退款率由原 24% 迅速锁死压缩至 4.5%，锁死经营货损流失 $1,200 开卡包折让。';
    }

    // Add row to workflow_results
    dbEngine.workflow_results.create({
      tenant_id: instance.tenant_id,
      workflow_instance_id: instance.id,
      outcome,
      revenue_gained: revGained,
      cost_saved: costSaved,
      metrics_impact: impactDetail
    });
  }

  /**
   * Safe getter for steps configuration definitions
   */
  private static getStepsConfigForTemplate(templateId: string): Array<{ step_number: number; name: string; action_type: string; assigned_agent: string }> {
    if (templateId === 'tmpl_replenishment') {
      return [
        { step_number: 1, name: '库存安全线偏离检查', action_type: 'inventory_check', assigned_agent: 'InventoryAgent' },
        { step_number: 2, name: '精细采购补货计划生成', action_type: 'purchase_plan', assigned_agent: 'InventoryAgent' },
        { step_number: 3, name: '经营宪章与预算法规合规审计', action_type: 'risk_review', assigned_agent: 'FinanceAgent' },
        { step_number: 4, name: '自动签发采购并执行划转', action_type: 'execute', assigned_agent: 'FinanceAgent' },
        { step_number: 5, name: '供应链交期跟踪与交货校验', action_type: 'verify_results', assigned_agent: 'InventoryAgent' }
      ];
    } else if (templateId === 'tmpl_customer_recall') {
      return [
        { step_number: 1, name: '高危流失客群静默发现与聚合', action_type: 'customer_segment', assigned_agent: 'CustomerAgent' },
        { step_number: 2, name: '客群意向与消费生命周期分层', action_type: 'customer_segment', assigned_agent: 'CustomerAgent' },
        { step_number: 3, name: '自适应精细召回话术与个性配券生成', action_type: 'generate_plan', assigned_agent: 'MarketingAgent' },
        { step_number: 4, name: '多通路（Email+SMS）召回触达派发', action_type: 'execute', assigned_agent: 'MarketingAgent' },
        { step_number: 5, name: '复购周期与回款归因验证', action_type: 'verify_results', assigned_agent: 'CustomerAgent' }
      ];
    } else {
      return [
        { step_number: 1, name: '退货率偏离与毛利警戒诊断', action_type: 'inventory_check', assigned_agent: 'PricingAgent' },
        { step_number: 2, name: '价格弹性模拟与尺码修正分析', action_type: 'price_simulate', assigned_agent: 'PricingAgent' },
        { step_number: 3, name: '自适应GMV与利润回报预测', action_type: 'revenue_forecast', assigned_agent: 'FinanceAgent' },
        { step_number: 4, name: '跨平台销售价格核准执行与发布', action_type: 'execute', assigned_agent: 'PricingAgent' },
        { step_number: 5, name: '退款漏斗回转监控与最终收益审计', action_type: 'verify_results', assigned_agent: 'FinanceAgent' }
      ];
    }
  }

  /**
   * Helper to update the idle/running status of registration agent in registry!
   */
  private static updateAgentStatus(agentRole: string, status: 'idle' | 'running') {
    const registries = dbEngine.agent_registry.getAll();
    const match = registries.find(x => x.role === agentRole);
    if (match) {
      dbEngine.agent_registry.update(match.id, {
        status,
        last_active_at: new Date().toISOString(),
        tasks_count: status === 'running' ? match.tasks_count + 1 : match.tasks_count
      });
    }
  }
}
