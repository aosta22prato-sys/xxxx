/**
 * Health Check & Monitoring Service
 * Provides system health status and metrics
 */

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  services: {
    api: boolean;
    database: boolean;
    eventBus: boolean;
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
  };
  metrics?: {
    requestCount: number;
    errorCount: number;
    averageResponseTime: number;
  };
}

export class HealthCheckService {
  private startTime: number = Date.now();
  private requestCount: number = 0;
  private errorCount: number = 0;
  private responseTimes: number[] = [];

  /**
   * Increment request counter
   */
  recordRequest(responseTime: number, isError: boolean = false): void {
    this.requestCount++;
    this.responseTimes.push(responseTime);

    // Keep only last 100 requests
    if (this.responseTimes.length > 100) {
      this.responseTimes.shift();
    }

    if (isError) {
      this.errorCount++;
    }
  }

  /**
   * Get current health status
   */
  getHealthStatus(dbConnected: boolean = true): HealthStatus {
    const memUsage = process.memoryUsage();
    const uptime = (Date.now() - this.startTime) / 1000;

    const avgResponseTime =
      this.responseTimes.length > 0
        ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length
        : 0;

    const status = this.getStatusLevel(dbConnected, avgResponseTime);

    return {
      status,
      timestamp: new Date().toISOString(),
      uptime,
      services: {
        api: true,
        database: dbConnected,
        eventBus: true,
        memory: {
          used: Math.round(memUsage.heapUsed / 1024 / 1024),
          total: Math.round(memUsage.heapTotal / 1024 / 1024),
          percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
        },
      },
      metrics: {
        requestCount: this.requestCount,
        errorCount: this.errorCount,
        averageResponseTime: Math.round(avgResponseTime * 100) / 100,
      },
    };
  }

  /**
   * Determine health status level
   */
  private getStatusLevel(
    dbConnected: boolean,
    avgResponseTime: number
  ): 'healthy' | 'degraded' | 'unhealthy' {
    if (!dbConnected || avgResponseTime > 1000) {
      return 'degraded';
    }

    if (avgResponseTime > 5000) {
      return 'unhealthy';
    }

    return 'healthy';
  }

  /**
   * Get metrics summary
   */
  getMetrics() {
    return {
      totalRequests: this.requestCount,
      totalErrors: this.errorCount,
      errorRate:
        this.requestCount > 0
          ? Math.round((this.errorCount / this.requestCount) * 100 * 100) / 100
          : 0,
      averageResponseTime:
        this.responseTimes.length > 0
          ? Math.round(
              (this.responseTimes.reduce((a, b) => a + b, 0) /
                this.responseTimes.length) *
                100
            ) / 100
          : 0,
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      uptime: (Date.now() - this.startTime) / 1000,
    };
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.requestCount = 0;
    this.errorCount = 0;
    this.responseTimes = [];
  }
}

// Export singleton instance
export const healthCheckService = new HealthCheckService();
