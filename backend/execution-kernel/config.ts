/**
 * Execution Kernel Configuration Management
 * Environment-based configuration with validation
 */

export interface KernelConfig {
  // Core settings
  environment: 'development' | 'production' | 'test';
  debug: boolean;

  // Event Bus
  eventBusMaxHistory: number;
  eventBusAsyncMode: boolean;

  // Transactions
  transactionTimeout: number;
  maxActiveTransactions: number;

  // Recovery
  maxRetries: number;
  retryDelays: number[];
  enableCompensation: boolean;

  // Persistence
  persistence: {
    enabled: boolean;
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    maxPoolConnections: number;
  };

  // Logging
  logging: {
    level: string;
    enableConsole: boolean;
    enableFile: boolean;
    logDir: string;
  };

  // Performance
  performance: {
    enableMonitoring: boolean;
    maxMetrics: number;
    sampleRate: number; // 0-1
  };

  // Security
  security: {
    enableAudit: boolean;
    enableEncryption: boolean;
    maxAuditLogs: number;
  };

  // API
  api: {
    enableSSE: boolean;
    sseTimeout: number;
    requestTimeout: number;
  };

  // Cleanup
  cleanup: {
    enabled: boolean;
    interval: number; // ms
    olderThanMs: number;
  };
}

export const DEFAULT_CONFIG: KernelConfig = {
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  debug: process.env.DEBUG === 'true',

  eventBusMaxHistory: 10000,
  eventBusAsyncMode: true,

  transactionTimeout: 60000,
  maxActiveTransactions: 1000,

  maxRetries: 3,
  retryDelays: [1000, 3000, 5000],
  enableCompensation: true,

  persistence: {
    enabled: process.env.PERSISTENCE_ENABLED !== 'false',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'kernel_db',
    user: process.env.DB_USER || 'kernel',
    password: process.env.DB_PASSWORD || 'kernel',
    maxPoolConnections: 20
  },

  logging: {
    level: process.env.LOG_LEVEL || 'INFO',
    enableConsole: process.env.LOG_CONSOLE !== 'false',
    enableFile: process.env.LOG_FILE === 'true',
    logDir: process.env.LOG_DIR || './logs'
  },

  performance: {
    enableMonitoring: process.env.PERF_MONITORING !== 'false',
    maxMetrics: 1000,
    sampleRate: 0.1
  },

  security: {
    enableAudit: process.env.AUDIT_ENABLED !== 'false',
    enableEncryption: process.env.ENCRYPTION_ENABLED === 'true',
    maxAuditLogs: 100000
  },

  api: {
    enableSSE: process.env.SSE_ENABLED !== 'false',
    sseTimeout: 30000,
    requestTimeout: 60000
  },

  cleanup: {
    enabled: process.env.CLEANUP_ENABLED !== 'false',
    interval: 3600000, // 1 hour
    olderThanMs: 2592000000 // 30 days
  }
};

/**
 * Configuration Manager
 */
export class ConfigManager {
  private config: KernelConfig;

  constructor(overrides?: Partial<KernelConfig>) {
    this.config = this.mergeConfig(DEFAULT_CONFIG, overrides || {});
    this.validate();
    console.log('[Config] Initialized', {
      environment: this.config.environment,
      persistence: this.config.persistence.enabled,
      audit: this.config.security.enableAudit,
      cleanup: this.config.cleanup.enabled
    });
  }

  /**
   * Merge configs
   */
  private mergeConfig(
    base: KernelConfig,
    overrides: Partial<KernelConfig>
  ): KernelConfig {
    return {
      ...base,
      ...overrides,
      persistence: { ...base.persistence, ...overrides.persistence },
      logging: { ...base.logging, ...overrides.logging },
      performance: { ...base.performance, ...overrides.performance },
      security: { ...base.security, ...overrides.security },
      api: { ...base.api, ...overrides.api },
      cleanup: { ...base.cleanup, ...overrides.cleanup }
    };
  }

  /**
   * Validate configuration
   */
  private validate(): void {
    // Validate retry delays
    if (this.config.retryDelays.length < this.config.maxRetries) {
      console.warn('[Config] Retry delays less than max retries, padding with last value');
      const lastDelay = this.config.retryDelays[this.config.retryDelays.length - 1];
      while (this.config.retryDelays.length < this.config.maxRetries) {
        this.config.retryDelays.push(lastDelay);
      }
    }

    // Validate performance sample rate
    if (this.config.performance.sampleRate < 0 || this.config.performance.sampleRate > 1) {
      console.warn('[Config] Invalid sample rate, setting to 0.1');
      this.config.performance.sampleRate = 0.1;
    }

    console.log('[Config] Validation passed');
  }

  /**
   * Get config
   */
  getConfig(): KernelConfig {
    return this.config;
  }

  /**
   * Get specific setting
   */
  get<K extends keyof KernelConfig>(key: K): KernelConfig[K] {
    return this.config[key];
  }

  /**
   * Update config
   */
  update(key: string, value: any): void {
    const keys = key.split('.');
    let target: any = this.config;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!target[keys[i]]) {
        target[keys[i]] = {};
      }
      target = target[keys[i]];
    }

    target[keys[keys.length - 1]] = value;
    console.log(`[Config] Updated ${key} = ${value}`);
  }

  /**
   * Is production
   */
  isProduction(): boolean {
    return this.config.environment === 'production';
  }

  /**
   * Is development
   */
  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  /**
   * Get config summary
   */
  getSummary(): Record<string, any> {
    return {
      environment: this.config.environment,
      persistence: this.config.persistence.enabled,
      audit: this.config.security.enableAudit,
      monitoring: this.config.performance.enableMonitoring,
      cleanup: this.config.cleanup.enabled,
      logLevel: this.config.logging.level,
      transactionTimeout: this.config.transactionTimeout,
      maxRetries: this.config.maxRetries
    };
  }
}

// Export singleton
export const config = new ConfigManager();

/**
 * Create config manager from environment
 */
export function createConfigFromEnv(
  overrides?: Partial<KernelConfig>
): ConfigManager {
  return new ConfigManager(overrides);
}
