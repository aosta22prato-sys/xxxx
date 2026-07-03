/**
 * Real Execution - 完整导出
 * 
 * AI Commerce OS 的真实执行层
 */

// Core Interfaces
export * from './core-interfaces';

// Tool Registry
export * from './tool-registry';

// Tools
export * from './tools-product';
export * from './tools-order-inventory';
export * from './tools-marketing-finance';

// Business State Observer
export * from './business-state-observer';

// Safety Guard
export * from './safety-guard';

// Result Evaluator
export * from './result-evaluator';

// Real Execution Engine
export * from './execution-engine-real';

// Unified exports
import { toolRegistry } from './tool-registry';
import { businessStateObserver } from './business-state-observer';
import { safetyGuard } from './safety-guard';
import { resultEvaluator } from './result-evaluator';
import { realExecutionEngine } from './execution-engine-real';

export const RealExecutionSystem = {
  toolRegistry,
  businessStateObserver,
  safetyGuard,
  resultEvaluator,
  realExecutionEngine,

  getStatus() {
    return {
      tools: toolRegistry.getToolList().length,
      safety: safetyGuard.getStats(),
      execution: realExecutionEngine.getStatus(),
    };
  },

  async runGoal(ctx: any, goal: any) {
    return await realExecutionEngine.runFullCycle(ctx, goal);
  },

  async startAutonomous(ctx: any, goal: any, intervalMinutes: number = 5) {
    return await realExecutionEngine.startAutonomousLoop(ctx, goal, intervalMinutes);
  },

  stopAutonomous() {
    realExecutionEngine.stopAutonomousLoop();
  },
};
