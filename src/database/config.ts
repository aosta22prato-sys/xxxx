/**
 * Database Configuration Loader
 * Supports both PostgreSQL and JSON fallback based on environment
 */

import type { DatabaseConfig } from './db';

export function getDatabaseConfig(): DatabaseConfig {
  const dbType = process.env.DATABASE_TYPE || 'json'; // 'postgres' or 'json'

  if (dbType === 'postgres') {
    return {
      type: 'postgres',
      postgres: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        database: process.env.DB_NAME || 'deepay_commerce',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        pool: {
          max: parseInt(process.env.DB_POOL_MAX || '20', 10),
          idleTimeoutMillis: parseInt(
            process.env.DB_POOL_IDLE_TIMEOUT || '30000',
            10
          ),
        },
      },
    };
  }

  // Default to JSON
  return {
    type: 'json',
    json: {
      filePath: process.env.DB_JSON_PATH || 'server_db.json',
    },
  };
}

/**
 * Log database configuration (sensitive values masked)
 */
export function logDatabaseConfig(config: DatabaseConfig): void {
  if (config.type === 'postgres' && config.postgres) {
    console.log('[Database Config]', {
      type: 'postgres',
      host: config.postgres.host,
      port: config.postgres.port,
      database: config.postgres.database,
      user: config.postgres.user,
      pool: config.postgres.pool,
    });
  } else {
    console.log('[Database Config]', {
      type: 'json',
      filePath: config.json?.filePath,
    });
  }
}
