/**
 * Kernel Logger - Logging and Monitoring
 * Complete logging system with levels and performance tracking
 */

export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5
}

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  component: string;
  message: string;
  data?: Record<string, any>;
  error?: Error;
}

export class KernelLogger {
  private level: LogLevel;
  private logs: LogEntry[] = [];
  private maxLogs: number = 50000;
  private enableConsole: boolean;
  private enableFile?: (entry: LogEntry) => Promise<void>;

  constructor(
    level: LogLevel = LogLevel.INFO,
    enableConsole: boolean = true,
    fileHandler?: (entry: LogEntry) => Promise<void>
  ) {
    this.level = level;
    this.enableConsole = enableConsole;
    this.enableFile = fileHandler;
  }

  /**
   * Log message
   */
  private logMessage(
    level: LogLevel,
    component: string,
    message: string,
    data?: Record<string, any>,
    error?: Error
  ): void {
    if (level < this.level) return;

    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      component,
      message,
      data,
      error
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output
    if (this.enableConsole) {
      this.printToConsole(entry);
    }

    // File output
    if (this.enableFile) {
      this.enableFile(entry).catch((err) => {
        console.error('Failed to write log to file:', err);
      });
    }
  }

  /**
   * Print to console
   */
  private printToConsole(entry: LogEntry): void {
    const levelName = LogLevel[entry.level];
    const timestamp = new Date(entry.timestamp).toISOString();
    const prefix = `[${timestamp}] [${levelName}] [${entry.component}]`;

    let output = `${prefix} ${entry.message}`;

    if (entry.data) {
      output += ` ${JSON.stringify(entry.data)}`;
    }

    if (entry.error) {
      output += `\n${entry.error.stack}`;
    }

    switch (entry.level) {
      case LogLevel.TRACE:
      case LogLevel.DEBUG:
        console.debug(output);
        break;
      case LogLevel.INFO:
        console.info(output);
        break;
      case LogLevel.WARN:
        console.warn(output);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(output);
        break;
    }
  }

  /**
   * Public logging methods
   */
  trace(component: string, message: string, data?: Record<string, any>): void {
    this.logMessage(LogLevel.TRACE, component, message, data);
  }

  debug(component: string, message: string, data?: Record<string, any>): void {
    this.logMessage(LogLevel.DEBUG, component, message, data);
  }

  info(component: string, message: string, data?: Record<string, any>): void {
    this.logMessage(LogLevel.INFO, component, message, data);
  }

  warn(component: string, message: string, data?: Record<string, any>): void {
    this.logMessage(LogLevel.WARN, component, message, data);
  }

  error(component: string, message: string, error?: Error, data?: Record<string, any>): void {
    this.logMessage(LogLevel.ERROR, component, message, data, error);
  }

  fatal(component: string, message: string, error?: Error, data?: Record<string, any>): void {
    this.logMessage(LogLevel.FATAL, component, message, data, error);
  }

  /**
   * Get logs
   */
  getLogs(limit: number = 1000, level?: LogLevel): LogEntry[] {
    let filtered = this.logs.slice(-limit);
    if (level !== undefined) {
      filtered = filtered.filter((log) => log.level >= level);
    }
    return filtered;
  }

  /**
   * Clear logs
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * Get statistics
   */
  getStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    for (const level in LogLevel) {
      if (isNaN(Number(level))) {
        stats[level] = this.logs.filter((log) => LogLevel[log.level] === level).length;
      }
    }
    return stats;
  }

  /**
   * Set log level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }
}

/**
 * Performance Monitor
 */
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private maxMetrics: number = 1000;

  /**
   * Record metric
   */
  record(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    const values = this.metrics.get(name)!;
    values.push(value);

    // Keep size bounded
    if (values.length > this.maxMetrics) {
      values.shift();
    }
  }

  /**
   * Get metric statistics
   */
  getStats(name: string): { min: number; max: number; avg: number; count: number } | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;

    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    return { min, max, avg, count: values.length };
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [name, values] of this.metrics) {
      result[name] = this.getStats(name);
    }
    return result;
  }

  /**
   * Clear metrics
   */
  clear(): void {
    this.metrics.clear();
  }
}

/**
 * Timer utility
 */
export class Timer {
  private startTime: number;
  private label: string;
  private logger?: KernelLogger;

  constructor(label: string, logger?: KernelLogger) {
    this.startTime = Date.now();
    this.label = label;
    this.logger = logger;
  }

  /**
   * Get elapsed time
   */
  elapsed(): number {
    return Date.now() - this.startTime;
  }

  /**
   * Log elapsed time
   */
  end(component: string = 'Timer'): number {
    const elapsed = this.elapsed();
    if (this.logger) {
      this.logger.debug(component, `${this.label} completed in ${elapsed}ms`);
    }
    return elapsed;
  }
}

// Export singleton
export const logger = new KernelLogger(LogLevel.INFO, true);
export const perfMonitor = new PerformanceMonitor();

/**
 * Create logger from environment
 */
export function createLoggerFromEnv(): KernelLogger {
  const levelStr = (process.env.LOG_LEVEL || 'INFO').toUpperCase();
  const level = LogLevel[levelStr as keyof typeof LogLevel] || LogLevel.INFO;
  return new KernelLogger(level, process.env.LOG_CONSOLE !== 'false');
}
