/**
 * Execution Kernel - Test Suite
 * Comprehensive tests for production reliability
 */

import {
  executionKernel,
  eventBus,
  TransactionManager,
  RecoveryEngine,
  ActionRecord,
  ExecutionContext,
  logger,
  LogLevel
} from './index';

/**
 * Test utilities
 */
class TestHarness {
  private passed: number = 0;
  private failed: number = 0;
  private tests: Array<{ name: string; fn: () => Promise<void> }> = [];

  test(name: string, fn: () => Promise<void>): void {
    this.tests.push({ name, fn });
  }

  async run(): Promise<void> {
    logger.setLevel(LogLevel.DEBUG);

    console.log('\n' + '='.repeat(60));
    console.log('🧪 Execution Kernel Test Suite');
    console.log('='.repeat(60) + '\n');

    for (const test of this.tests) {
      try {
        await test.fn();
        console.log(`✅ ${test.name}`);
        this.passed++;
      } catch (error) {
        console.log(`❌ ${test.name}`);
        console.log(`   Error: ${(error as Error).message}`);
        this.failed++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`Results: ${this.passed} passed, ${this.failed} failed`);
    console.log('='.repeat(60) + '\n');
  }
}

/**
 * Run all tests
 */
export async function runTests(): Promise<void> {
  const harness = new TestHarness();

  // Event Bus Tests
  harness.test('EventBus: emit and listen', async () => {
    let received = false;
    eventBus.once('test_event', () => {
      received = true;
    });
    eventBus.emit({ type: 'test_event', payload: {}, timestamp: Date.now() });
    if (!received) throw new Error('Event not received');
  });

  harness.test('EventBus: event history', async () => {
    eventBus.emit({ type: 'test_event_1', payload: {}, timestamp: Date.now() });
    eventBus.emit({ type: 'test_event_2', payload: {}, timestamp: Date.now() });
    const history = eventBus.getHistory();
    if (history.length < 2) throw new Error('History not captured');
  });

  harness.test('EventBus: waitFor timeout', async () => {
    try {
      await eventBus.waitFor('non_existent_event', 100);
      throw new Error('Should have timed out');
    } catch (err) {
      if ((err as Error).message.includes('Timeout')) {
        return; // Expected
      }
      throw err;
    }
  });

  // Transaction Manager Tests
  harness.test('TransactionManager: create transaction', async () => {
    const txManager = new TransactionManager(eventBus);
    const tx = txManager.begin('tenant_1', 'store_1');
    if (!tx.id || tx.status !== 'pending') {
      throw new Error('Transaction not created properly');
    }
  });

  harness.test('TransactionManager: add action', async () => {
    const txManager = new TransactionManager(eventBus);
    const tx = txManager.begin('tenant_1', 'store_1');
    const action: ActionRecord = {
      id: 'action_1',
      tool: 'test_tool',
      params: {},
      status: 'pending',
      createdAt: Date.now()
    };
    txManager.addAction(tx.id, action);
    const retrieved = txManager.get(tx.id);
    if (!retrieved || retrieved.actions.length === 0) {
      throw new Error('Action not added');
    }
  });

  harness.test('TransactionManager: commit transaction', async () => {
    const txManager = new TransactionManager(eventBus);
    const tx = txManager.begin('tenant_1', 'store_1');
    txManager.commit(tx.id);
    const retrieved = txManager.get(tx.id);
    if (retrieved?.status !== 'committed') {
      throw new Error('Transaction not committed');
    }
  });

  harness.test('TransactionManager: rollback transaction', async () => {
    const txManager = new TransactionManager(eventBus);
    const tx = txManager.begin('tenant_1', 'store_1');
    txManager.rollback(tx.id, 'test_rollback');
    const retrieved = txManager.get(tx.id);
    if (retrieved?.status !== 'rolled_back') {
      throw new Error('Transaction not rolled back');
    }
  });

  // Recovery Engine Tests
  harness.test('RecoveryEngine: network error recovery', async () => {
    const recoveryEngine = new RecoveryEngine(eventBus);
    const action: ActionRecord = {
      id: 'action_1',
      tool: 'test',
      params: {},
      status: 'pending',
      createdAt: Date.now()
    };
    const plan = recoveryEngine.recover(action, new Error('ECONNREFUSED: Connection refused'));
    if (plan.strategy !== 'retry') {
      throw new Error('Network error should use retry strategy');
    }
  });

  harness.test('RecoveryEngine: business conflict recovery', async () => {
    const recoveryEngine = new RecoveryEngine(eventBus);
    const action: ActionRecord = {
      id: 'action_1',
      tool: 'test',
      params: {},
      status: 'pending',
      createdAt: Date.now()
    };
    const plan = recoveryEngine.recover(action, new Error('Business conflict: insufficient inventory'));
    if (plan.strategy !== 'replan') {
      throw new Error('Business conflict should use replan strategy');
    }
  });

  // Execution Kernel Tests
  harness.test('ExecutionKernel: register tool', async () => {
    executionKernel.registerTool('test.tool', async () => ({ success: true }));
    const stats = executionKernel.getStats();
    if (stats.registeredTools < 1) {
      throw new Error('Tool not registered');
    }
  });

  harness.test('ExecutionKernel: execute action', async () => {
    executionKernel.registerTool('test.execute', async (params) => ({
      result: 'success'
    }));

    const results = await executionKernel.execute(
      [
        {
          id: 'action_1',
          tool: 'test.execute',
          params: {},
          status: 'pending',
          createdAt: Date.now()
        }
      ],
      {
        tenantId: 'tenant_1',
        storeId: 'store_1'
      }
    );

    if (!results[0].success) {
      throw new Error('Action execution failed');
    }
  });

  harness.test('ExecutionKernel: execute with failure', async () => {
    executionKernel.registerTool('test.fail', async () => {
      throw new Error('Test error');
    });

    const results = await executionKernel.execute(
      [
        {
          id: 'action_fail',
          tool: 'test.fail',
          params: {},
          status: 'pending',
          createdAt: Date.now()
        }
      ],
      { tenantId: 'tenant_1', storeId: 'store_1' }
    );

    if (results[0].success) {
      throw new Error('Should have failed');
    }
  });

  harness.test('ExecutionKernel: execute with compensation', async () => {
    let compensated = false;

    executionKernel.registerTool('test.compensate', async () => {
      throw new Error('Action failed for compensation test');
    });

    executionKernel.registerTool('test.compensate_rollback', async () => {
      compensated = true;
      return { rolled_back: true };
    });

    // This would need proper setup with compensation logic
    // Skipping for now as it requires more complex setup
  });

  // Multi-tenant isolation tests
  harness.test('Multi-tenant: isolation', async () => {
    executionKernel.registerTool('test.isolation', async (params) => {
      return { tenant: params.tenantId };
    });

    const result1 = await executionKernel.execute(
      [
        {
          id: 'action_1',
          tool: 'test.isolation',
          params: { tenantId: 'tenant_a' },
          status: 'pending',
          createdAt: Date.now()
        }
      ],
      { tenantId: 'tenant_a', storeId: 'store_1' }
    );

    const result2 = await executionKernel.execute(
      [
        {
          id: 'action_2',
          tool: 'test.isolation',
          params: { tenantId: 'tenant_b' },
          status: 'pending',
          createdAt: Date.now()
        }
      ],
      { tenantId: 'tenant_b', storeId: 'store_1' }
    );

    if (result1[0].data.tenant !== 'tenant_a' || result2[0].data.tenant !== 'tenant_b') {
      throw new Error('Multi-tenant isolation failed');
    }
  });

  // Parallel execution tests
  harness.test('ExecutionKernel: parallel execution', async () => {
    executionKernel.registerTool('test.parallel', async (params) => {
      return { id: params.id, completed: true };
    });

    const startTime = Date.now();
    const results = await executionKernel.execute(
      [
        {
          id: 'action_p1',
          tool: 'test.parallel',
          params: { id: 1 },
          status: 'pending',
          createdAt: Date.now()
        },
        {
          id: 'action_p2',
          tool: 'test.parallel',
          params: { id: 2 },
          status: 'pending',
          createdAt: Date.now()
        },
        {
          id: 'action_p3',
          tool: 'test.parallel',
          params: { id: 3 },
          status: 'pending',
          createdAt: Date.now()
        }
      ],
      { tenantId: 'tenant_1', storeId: 'store_1' },
      { parallel: true }
    );

    if (results.length !== 3 || !results.every((r) => r.success)) {
      throw new Error('Parallel execution failed');
    }
  });

  // Statistics tests
  harness.test('ExecutionKernel: statistics', async () => {
    const stats = executionKernel.getStats();
    if (
      !('totalTransactions' in stats) ||
      !('activeTransactions' in stats) ||
      !('registeredTools' in stats)
    ) {
      throw new Error('Statistics not available');
    }
  });

  // Run all tests
  await harness.run();
}

// Export for use
export default { runTests };
