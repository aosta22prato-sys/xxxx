/**
 * Real Execution System - 集成测试脚本
 * 
 * 完整测试系统的所有核心组件是否真正可用
 */

import {
  RealExecutionSystem,
  realExecutionEngine,
  businessStateObserver,
  safetyGuard,
  resultEvaluator,
  toolRegistry,
} from './index';
import { createMockContext } from './mock-implementation';

// ============================================
// 颜色输出辅助
// ============================================
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

const log = {
  title: (text: string) => console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`),
  header: (text: string) => console.log(`${colors.cyan}📌 ${text}${colors.reset}`),
  success: (text: string) => console.log(`${colors.green}✓ ${text}${colors.reset}`),
  warning: (text: string) => console.log(`${colors.yellow}⚠️  ${text}${colors.reset}`),
  error: (text: string) => console.log(`${colors.red}✗ ${text}${colors.reset}`),
  info: (text: string) => console.log(`${colors.magenta}ℹ️  ${text}${colors.reset}`),
  result: (text: string) => console.log(`   ${text}`),
};

// ============================================
// 测试 1: 系统初始化
// ============================================
async function testSystemInitialization() {
  log.header('Test 1: 系统初始化测试');
  
  try {
    const status = RealExecutionSystem.getStatus();
    
    log.success('系统初始化成功！');
    log.result(`已注册工具数: ${status.tools}`);
    log.result(`安全规则数: ${status.safety.totalRules}`);
    
    if (status.tools > 0) {
      log.success(`✓ Tool Registry 正常 (${status.tools}个工具)`);
    } else {
      log.error('✗ Tool Registry 无工具注册');
    }
    
    return true;
  } catch (error) {
    log.error(`系统初始化失败: ${error}`);
    return false;
  }
}

// ============================================
// 测试 2: Tool Registry 功能
// ============================================
async function testToolRegistry() {
  log.header('Test 2: Tool Registry 功能测试');
  
  try {
    const tools = toolRegistry.getToolList();
    log.success(`获取工具列表成功 (总计: ${tools.length})`);
    
    // 按分类统计
    const categories = new Map<string, number>();
    for (const tool of tools) {
      const count = categories.get(tool.category) || 0;
      categories.set(tool.category, count + 1);
    }
    
    log.result('工具分布:');
    for (const [category, count] of categories) {
      log.result(`  - ${category}: ${count}个`);
    }
    
    // 测试获取单个工具
    if (tools.length > 0) {
      const firstTool = toolRegistry.getTool(tools[0].name);
      if (firstTool) {
        log.success(`✓ 成功获取工具: ${firstTool.name}`);
      }
    }
    
    return true;
  } catch (error) {
    log.error(`Tool Registry 测试失败: ${error}`);
    return false;
  }
}

// ============================================
// 测试 3: Business State Observer
// ============================================
async function testBusinessStateObserver() {
  log.header('Test 3: Business State Observer 测试');
  
  try {
    const ctx = createMockContext('test-store', 'test-tenant');
    
    const state = await businessStateObserver.observeBusinessState(ctx);
    
    log.success('成功读取业务状态！');
    log.result(`销售收入: ¥${state.revenue.daily.toFixed(2)}`);
    log.result(`利润: ¥${state.profit.absolute.toFixed(2)}`);
    log.result(`库存SKU: ${state.inventory.skuCount}`);
    log.result(`客户总数: ${state.customers.total}`);
    log.result(`订单总数: ${state.orders.total}`);
    log.result(`营销支出: ¥${state.marketing.spend.toFixed(2)}`);
    log.result(`平均物流时间: ${state.logistics.avgShippingTime}小时`);
    
    return true;
  } catch (error) {
    log.error(`Business State Observer 测试失败: ${error}`);
    return false;
  }
}

// ============================================
// 测试 4: Safety Guard
// ============================================
async function testSafetyGuard() {
  log.header('Test 4: Safety Guard 安全检查测试');
  
  try {
    const ctx = createMockContext('test-store', 'test-tenant');
    const state = await businessStateObserver.observeBusinessState(ctx);
    
    // 测试一个安全的动作
    const safeAction = {
      toolName: 'updatePrice',
      parameters: { productId: 'prod-1', newPrice: 100, oldPrice: 90 },
      rationale: '测试价格更新',
    };
    
    const safeValidation = await safetyGuard.validate(safeAction, state);
    
    if (safeValidation.isValid) {
      log.success('✓ 安全动作通过验证');
    } else {
      log.warning(`⚠️  安全动作被阻止: ${safeValidation.reason}`);
    }
    
    // 测试一个不安全的动作
    const unsafeAction = {
      toolName: 'refundOrder',
      parameters: { orderId: 'ord-1', refundAmount: 600000 }, // 太大的退款
      rationale: '测试退款',
    };
    
    const unsafeValidation = await safetyGuard.validate(unsafeAction, state);
    
    if (!unsafeValidation.isValid) {
      log.success(`✓ 不安全动作被正确阻止: ${unsafeValidation.reason}`);
    } else {
      log.warning('⚠️  不安全动作未被阻止!');
    }
    
    const stats = safetyGuard.getStats();
    log.result(`安全规则数: ${stats.totalRules}`);
    log.result(`检查次数: ${stats.validationCount}`);
    log.result(`阻止次数: ${stats.blockedCount}`);
    
    return true;
  } catch (error) {
    log.error(`Safety Guard 测试失败: ${error}`);
    return false;
  }
}

// ============================================
// 测试 5: 完整执行循环
// ============================================
async function testFullExecutionCycle() {
  log.header('Test 5: 完整执行循环 (6阶段)');
  
  try {
    const ctx = createMockContext('test-store', 'test-tenant');
    
    const goal = {
      type: 'increase-revenue',
      description: '通过优化广告和库存来增加收入',
    };
    
    log.info('开始执行循环...');
    log.result('阶段1: OBSERVE (读取状态)');
    log.result('阶段2: PLAN (生成计划)');
    log.result('阶段3: SAFETY CHECK (安全验证)');
    log.result('阶段4: EXECUTE (执行动作)');
    log.result('阶段5: EVALUATE (评估结果)');
    log.result('阶段6: LEARN (学习记忆)');
    
    console.log('');
    
    const startTime = Date.now();
    const result = await realExecutionEngine.runFullCycle(ctx, goal);
    const duration = Date.now() - startTime;
    
    log.success(`✓ 执行循环完成 (耗时: ${duration}ms)`);
    log.result(`循环ID: ${result.cycleId}`);
    log.result(`执行动作数: ${result.actionsExecuted}`);
    log.result(`成功动作数: ${result.successCount}`);
    log.result(`评估得分: ${result.evaluation.overallScore}/100`);
    log.result(`影响等级: ${result.evaluation.overallImpact}`);
    
    // 显示性能变化
    if (Object.keys(result.evaluation.performanceDelta).length > 0) {
      log.result('关键指标变化:');
      for (const [metric, value] of Object.entries(result.evaluation.performanceDelta)) {
        const sign = (value as number) > 0 ? '+' : '';
        log.result(`  - ${metric}: ${sign}${(value as number).toFixed(2)}`);
      }
    }
    
    return true;
  } catch (error) {
    log.error(`执行循环测试失败: ${error}`);
    return false;
  }
}

// ============================================
// 测试 6: 自主循环
// ============================================
async function testAutonomousLoop() {
  log.header('Test 6: 自主循环测试');
  
  try {
    const ctx = createMockContext('test-store', 'test-tenant');
    const goal = {
      type: 'increase-profit',
      description: '持续增加利润',
    };
    
    log.info('启动自主循环 (3分钟示例)...');
    log.result('将在后台每1分钟执行一次');
    
    // 启动循环
    await realExecutionEngine.startAutonomousLoop(ctx, goal, 1);
    
    log.success('✓ 自主循环已启动');
    
    // 等待几个循环
    await new Promise(resolve => setTimeout(resolve, 3000)); // 等待3秒看看有没有执行
    
    const status = realExecutionEngine.getStatus();
    log.result(`已执行循环数: ${status.cyclesCompleted}`);
    
    // 停止循环
    realExecutionEngine.stopAutonomousLoop();
    log.success('✓ 自主循环已停止');
    
    return true;
  } catch (error) {
    log.error(`自主循环测试失败: ${error}`);
    return false;
  }
}

// ============================================
// 测试 7: Result Evaluator
// ============================================
async function testResultEvaluator() {
  log.header('Test 7: Result Evaluator 评估测试');
  
  try {
    const ctx = createMockContext('test-store', 'test-tenant');
    
    const oldState = await businessStateObserver.observeBusinessState(ctx);
    
    // 模拟状态变化
    const newState = { ...oldState };
    newState.revenue.daily *= 1.15; // 收入增加15%
    newState.profit.absolute *= 1.20; // 利润增加20%
    newState.orders.total = Math.floor(newState.orders.total * 1.10); // 订单增加10%
    
    const evaluation = resultEvaluator.evaluateCycle(
      [
        {
          toolName: 'createAdCampaign',
          parameters: { budget: 1000 },
          rationale: '创建新广告活动',
        },
        {
          toolName: 'adjustInventory',
          parameters: { productId: 'prod-1', quantity: 50 },
          rationale: '调整库存',
        },
      ],
      oldState,
      newState
    );
    
    log.success('✓ 评估完成');
    log.result(`评分: ${evaluation.overallScore}/100`);
    log.result(`影响等级: ${evaluation.overallImpact}`);
    log.result(`关键指标变化数: ${Object.keys(evaluation.performanceDelta).length}`);
    
    if (evaluation.learnings && evaluation.learnings.length > 0) {
      log.result('学习要点:');
      evaluation.learnings.slice(0, 3).forEach(learning => {
        log.result(`  - ${learning}`);
      });
    }
    
    return true;
  } catch (error) {
    log.error(`Result Evaluator 测试失败: ${error}`);
    return false;
  }
}

// ============================================
// 主测试函数
// ============================================
export async function runIntegrationTests() {
  console.log(`\n${colors.magenta}╔════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.magenta}║  AI Commerce OS - Real Execution System  ║${colors.reset}`);
  console.log(`${colors.magenta}║       集成测试 Integration Tests        ║${colors.reset}`);
  console.log(`${colors.magenta}╚════════════════════════════════════════╝${colors.reset}\n`);
  
  const tests = [
    { name: '系统初始化', fn: testSystemInitialization },
    { name: 'Tool Registry', fn: testToolRegistry },
    { name: 'Business State Observer', fn: testBusinessStateObserver },
    { name: 'Safety Guard', fn: testSafetyGuard },
    { name: '完整执行循环', fn: testFullExecutionCycle },
    { name: '自主循环', fn: testAutonomousLoop },
    { name: 'Result Evaluator', fn: testResultEvaluator },
  ];
  
  const results: { name: string; passed: boolean }[] = [];
  
  for (const test of tests) {
    try {
      const passed = await test.fn();
      results.push({ name: test.name, passed });
    } catch (error) {
      log.error(`测试异常: ${error}`);
      results.push({ name: test.name, passed: false });
    }
  }
  
  // 测试总结
  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  log.header('测试总结');
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  for (const result of results) {
    if (result.passed) {
      console.log(`${colors.green}✓${colors.reset} ${result.name}`);
    } else {
      console.log(`${colors.red}✗${colors.reset} ${result.name}`);
    }
  }
  
  console.log(`\n${colors.cyan}总体结果: ${passed}/${total} 测试通过${colors.reset}`);
  
  if (passed === total) {
    console.log(`\n${colors.green}✓ 所有测试通过！系统完全可用！${colors.reset}\n`);
    return true;
  } else {
    console.log(`\n${colors.yellow}⚠️  部分测试未通过，需要修复${colors.reset}\n`);
    return false;
  }
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  runIntegrationTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('测试执行失败:', error);
    process.exit(1);
  });
}
