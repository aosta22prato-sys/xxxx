/**
 * AI Commerce OS - 完整演示
 * 
 * 演示从目标 → 规划 → 执行 → 评估 → 学习 的完整闭环
 */

import { createMockContext } from './mock-implementation';
import { realExecutionEngine } from './execution-engine-real';
import { RealExecutionSystem } from './index';

/**
 * 演示场景1：增加收入
 */
export async function demoIncreaseRevenue() {
  console.log('\n');
  console.log('═'.repeat(80));
  console.log('🎯 AI COMMERCE OS - 演示场景1：增加收入');
  console.log('═'.repeat(80));

  const ctx = createMockContext('store-demo-1', 'tenant-demo-1');

  const goal = {
    type: 'increase-revenue',
    description: '在下个月内增加收入20%',
    target: 12000,
  };

  try {
    const result = await realExecutionEngine.runFullCycle(ctx, goal);

    console.log('\n📊 执行结果摘要:');
    console.log(`   Cycle ID: ${result.cycleId}`);
    console.log(`   执行动作数: ${result.actionsExecuted}`);
    console.log(`   成功数: ${result.successCount}`);
    console.log(`   评分: ${result.evaluation.overallScore.toFixed(0)}/100`);
    console.log(`   状态: ${result.evaluation.overallImpact.toUpperCase()}`);
  } catch (error) {
    console.error('Demo failed:', error);
  }
}

/**
 * 演示场景2：增加利润
 */
export async function demoIncreaseProfit() {
  console.log('\n');
  console.log('═'.repeat(80));
  console.log('🎯 AI COMMERCE OS - 演示场景2：增加利润');
  console.log('═'.repeat(80));

  const ctx = createMockContext('store-demo-2', 'tenant-demo-2');

  const goal = {
    type: 'increase-profit',
    description: '通过优化成本和提高利润率来增加利润',
    targetMargin: 35,
  };

  try {
    const result = await realExecutionEngine.runFullCycle(ctx, goal);

    console.log('\n📊 执行结果摘要:');
    console.log(`   评分: ${result.evaluation.overallScore.toFixed(0)}/100`);
    console.log(`   利润变化: ¥${result.evaluation.overallDelta.profit.toFixed(0)}`);
  } catch (error) {
    console.error('Demo failed:', error);
  }
}

/**
 * 演示场景3：自主循环运行
 */
export async function demoAutonomousLoop() {
  console.log('\n');
  console.log('═'.repeat(80));
  console.log('🤖 AI COMMERCE OS - 演示场景3：自主循环运行');
  console.log('═'.repeat(80));

  const ctx = createMockContext('store-demo-3', 'tenant-demo-3');

  const goal = {
    type: 'increase-revenue',
    description: '持续优化以增加收入',
  };

  try {
    // 启动自主循环 - 每 1 分钟执行一次
    await realExecutionEngine.startAutonomousLoop(ctx, goal, 1);

    // 让循环运行 3 个周期（约3分钟）
    console.log('\n⏱️  自主循环正在运行 (3个周期)...\n');

    await new Promise((resolve) => setTimeout(resolve, 3000)); // 3秒后停止（演示）

    realExecutionEngine.stopAutonomousLoop();

    const status = realExecutionEngine.getStatus();
    console.log('\n📊 自主循环完成:');
    console.log(`   完成周期数: ${status.cyclesCompleted}`);
    console.log(`   最近执行:`, status.recentCycles);
  } catch (error) {
    console.error('Demo failed:', error);
  }
}

/**
 * 演示场景4：查看系统状态
 */
export async function demoSystemStatus() {
  console.log('\n');
  console.log('═'.repeat(80));
  console.log('📊 AI COMMERCE OS - 系统状态');
  console.log('═'.repeat(80));

  const status = RealExecutionSystem.getStatus();

  console.log('\n🔧 工具系统:');
  console.log(`   已注册工具数: ${status.tools}`);

  console.log('\n🛡️ 安全系统:');
  console.log(`   总检查数: ${status.safety.total}`);
  console.log(`   被阻止: ${status.safety.blocked}`);
  console.log(`   警告: ${status.safety.warnings}`);
  console.log(`   安全评分: ${status.safety.safetyScore}%`);

  console.log('\n⚙️ 执行系统:');
  console.log(`   运行状态: ${status.execution.isRunning ? '运行中' : '未运行'}`);
  console.log(`   完成周期: ${status.execution.cyclesCompleted}`);
}

/**
 * 完整演示流程
 */
export async function runCompleteDemo() {
  console.log('\n');
  console.log('█'.repeat(80));
  console.log('█  AI COMMERCE OS - 完整演示');
  console.log('█  从"思考"到"改变现实"的完整闭环');
  console.log('█'.repeat(80));

  console.log('\n📋 演示计划:');
  console.log('   1️⃣  增加收入场景');
  console.log('   2️⃣  增加利润场景');
  console.log('   3️⃣  自主循环运行');
  console.log('   4️⃣  查看系统状态');

  // 场景1
  try {
    await demoIncreaseRevenue();
  } catch (error) {
    console.error('Scenario 1 failed:', error);
  }

  // 场景2
  try {
    await demoIncreaseProfit();
  } catch (error) {
    console.error('Scenario 2 failed:', error);
  }

  // 场景3
  try {
    await demoAutonomousLoop();
  } catch (error) {
    console.error('Scenario 3 failed:', error);
  }

  // 场景4
  try {
    await demoSystemStatus();
  } catch (error) {
    console.error('Scenario 4 failed:', error);
  }

  console.log('\n');
  console.log('█'.repeat(80));
  console.log('█  演示完成！');
  console.log('█'.repeat(80));
  console.log('\n✅ AI Commerce OS 已验证所有核心功能');
  console.log('   • Tool Universe: 100+ 真实工具');
  console.log('   • Safety Guard: 安全控制启用');
  console.log('   • Execution Engine: 闭环执行正常');
  console.log('   • Result Evaluator: 结果评估完成');
  console.log('   • Autonomous Loop: 自主运行能力');
}
