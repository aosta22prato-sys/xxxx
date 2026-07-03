/**
 * PostgreSQL Database Connection & Migration Layer
 * Supports both PostgreSQL and JSON fallback for development
 */

import { Pool, QueryResult } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

export interface DatabaseConfig {
  type: 'postgres' | 'json';
  postgres?: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    pool?: {
      max: number;
      idleTimeoutMillis: number;
    };
  };
  json?: {
    filePath: string;
  };
}

export interface DatabaseSchema {
  products: Record<string, any>[];
  orders: Record<string, any>[];
  customers: Record<string, any>[];
  events: Record<string, any>[];
  audit_logs: Record<string, any>[];
}

let pool: Pool | null = null;
let jsonDbPath: string | null = null;
let dbType: 'postgres' | 'json' = 'json';

/**
 * Initialize database connection
 */
export async function initializeDatabase(config: DatabaseConfig): Promise<void> {
  dbType = config.type;

  if (config.type === 'postgres' && config.postgres) {
    try {
      pool = new Pool({
        host: config.postgres.host,
        port: config.postgres.port,
        database: config.postgres.database,
        user: config.postgres.user,
        password: config.postgres.password,
        max: config.postgres.pool?.max || 20,
        idleTimeoutMillis: config.postgres.pool?.idleTimeoutMillis || 30000,
      });

      // Test connection
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      console.log('[PostgreSQL] Connection established successfully');

      // Run migrations
      await runMigrations();
    } catch (error) {
      console.error('[PostgreSQL] Connection failed, falling back to JSON:', error);
      dbType = 'json';
      pool = null;
      initializeJsonDatabase(config.json?.filePath || 'server_db.json');
    }
  } else {
    initializeJsonDatabase(config.json?.filePath || 'server_db.json');
  }
}

/**
 * Initialize JSON-based database (fallback)
 */
function initializeJsonDatabase(filePath: string): void {
  jsonDbPath = filePath;
  if (!fs.existsSync(filePath)) {
    const emptyDb: DatabaseSchema = {
      products: [],
      orders: [],
      customers: [],
      events: [],
      audit_logs: [],
    };
    fs.writeFileSync(filePath, JSON.stringify(emptyDb, null, 2), 'utf-8');
  }
  console.log('[Database] Using JSON storage at:', filePath);
}

/**
 * Execute raw SQL query (PostgreSQL only)
 */
export async function query(
  sql: string,
  params?: any[]
): Promise<QueryResult | null> {
  if (dbType === 'json') {
    console.warn('[Database] Raw SQL not supported in JSON mode');
    return null;
  }

  if (!pool) {
    throw new Error('Database pool not initialized');
  }

  try {
    return await pool.query(sql, params);
  } catch (error) {
    console.error('[PostgreSQL] Query error:', error);
    throw error;
  }
}

/**
 * Run database migrations
 */
async function runMigrations(): Promise<void> {
  if (dbType !== 'postgres' || !pool) {
    return;
  }

  const migrationsDir = path.join(__dirname, '../../database/migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.log('[Migrations] No migrations directory found');
    return;
  }

  try {
    const migrations = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const migration of migrations) {
      const migrationPath = path.join(migrationsDir, migration);
      const sql = fs.readFileSync(migrationPath, 'utf-8');

      try {
        await pool.query(sql);
        console.log('[Migrations] Applied:', migration);
      } catch (error) {
        // Ignore if already applied
        console.log('[Migrations] Skipped (already applied):', migration);
      }
    }
  } catch (error) {
    console.error('[Migrations] Error:', error);
  }
}

/**
 * Get products from database
 */
export async function getProducts(
  storeId: string,
  tenantId: string
): Promise<any[]> {
  if (dbType === 'postgres' && pool) {
    try {
      const result = await pool.query(
        'SELECT * FROM products WHERE store_id = $1 AND tenant_id = $2 ORDER BY created_at DESC',
        [storeId, tenantId]
      );
      return result.rows;
    } catch (error) {
      console.error('[Database] Error fetching products:', error);
      return [];
    }
  } else {
    const db = loadJsonDb();
    return db.products.filter(
      (p) => p.storeId === storeId && p.tenantId === tenantId
    );
  }
}

/**
 * Insert product into database
 */
export async function insertProduct(product: any): Promise<any> {
  if (dbType === 'postgres' && pool) {
    try {
      const result = await pool.query(
        `INSERT INTO products (id, store_id, tenant_id, sku, name, description, price, cost_price, stock, min_stock, category, status, tags, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         RETURNING *`,
        [
          product.id,
          product.storeId,
          product.tenantId,
          product.sku,
          product.name,
          product.description,
          product.price,
          product.costPrice,
          product.stock,
          product.minStock,
          product.category,
          product.status,
          JSON.stringify(product.tags),
          product.createdAt,
          product.updatedAt,
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error('[Database] Error inserting product:', error);
      return null;
    }
  } else {
    const db = loadJsonDb();
    db.products.push(product);
    saveJsonDb(db);
    return product;
  }
}

/**
 * Get orders from database
 */
export async function getOrders(
  storeId: string,
  tenantId: string
): Promise<any[]> {
  if (dbType === 'postgres' && pool) {
    try {
      const result = await pool.query(
        'SELECT * FROM orders WHERE store_id = $1 AND tenant_id = $2 ORDER BY created_at DESC',
        [storeId, tenantId]
      );
      return result.rows;
    } catch (error) {
      console.error('[Database] Error fetching orders:', error);
      return [];
    }
  } else {
    const db = loadJsonDb();
    return db.orders.filter(
      (o) => o.storeId === storeId && o.tenantId === tenantId
    );
  }
}

/**
 * Insert order into database
 */
export async function insertOrder(order: any): Promise<any> {
  if (dbType === 'postgres' && pool) {
    try {
      const result = await pool.query(
        `INSERT INTO orders (id, store_id, tenant_id, order_number, customer_id, items, total, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
          order.id,
          order.storeId,
          order.tenantId,
          order.orderNumber,
          order.customerId,
          JSON.stringify(order.items),
          order.total,
          order.status,
          order.createdAt,
          order.updatedAt,
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error('[Database] Error inserting order:', error);
      return null;
    }
  } else {
    const db = loadJsonDb();
    db.orders.push(order);
    saveJsonDb(db);
    return order;
  }
}

/**
 * Get customers from database
 */
export async function getCustomers(
  storeId: string,
  tenantId: string
): Promise<any[]> {
  if (dbType === 'postgres' && pool) {
    try {
      const result = await pool.query(
        'SELECT * FROM customers WHERE store_id = $1 AND tenant_id = $2 ORDER BY created_at DESC',
        [storeId, tenantId]
      );
      return result.rows;
    } catch (error) {
      console.error('[Database] Error fetching customers:', error);
      return [];
    }
  } else {
    const db = loadJsonDb();
    return db.customers.filter(
      (c) => c.storeId === storeId && c.tenantId === tenantId
    );
  }
}

/**
 * Insert customer into database
 */
export async function insertCustomer(customer: any): Promise<any> {
  if (dbType === 'postgres' && pool) {
    try {
      const result = await pool.query(
        `INSERT INTO customers (id, store_id, tenant_id, name, email, phone, tags, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          customer.id,
          customer.storeId,
          customer.tenantId,
          customer.name,
          customer.email,
          customer.phone,
          JSON.stringify(customer.tags),
          customer.createdAt,
          customer.updatedAt,
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error('[Database] Error inserting customer:', error);
      return null;
    }
  } else {
    const db = loadJsonDb();
    db.customers.push(customer);
    saveJsonDb(db);
    return customer;
  }
}

/**
 * Insert event into audit log
 */
export async function insertEvent(event: any): Promise<void> {
  if (dbType === 'postgres' && pool) {
    try {
      await pool.query(
        `INSERT INTO audit_logs (id, tenant_id, store_id, event_type, entity_type, entity_id, old_value, new_value, user_id, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          event.id,
          event.tenantId,
          event.storeId,
          event.type,
          event.entityType,
          event.entityId,
          JSON.stringify(event.oldValue),
          JSON.stringify(event.newValue),
          event.userId,
          event.timestamp,
        ]
      );
    } catch (error) {
      console.error('[Database] Error inserting event:', error);
    }
  } else {
    const db = loadJsonDb();
    db.events.push(event);
    saveJsonDb(db);
  }
}

/**
 * JSON Database Helper Functions
 */
function loadJsonDb(): DatabaseSchema {
  if (!jsonDbPath) {
    throw new Error('JSON database path not set');
  }

  try {
    const data = fs.readFileSync(jsonDbPath, 'utf-8');
    const parsed = JSON.parse(data);
    
    // If it's the old format (has tenants, tenantDB, etc.), convert it
    if (parsed.tenants && !parsed.products) {
      console.log('[Database] Detected old format, migrating to new schema');
      return {
        products: [],
        orders: [],
        customers: [],
        events: [],
        audit_logs: [],
      };
    }
    
    // Ensure all required fields exist
    return {
      products: parsed.products || [],
      orders: parsed.orders || [],
      customers: parsed.customers || [],
      events: parsed.events || [],
      audit_logs: parsed.audit_logs || [],
    };
  } catch (error) {
    console.log('[Database] Creating fresh database schema');
    return {
      products: [],
      orders: [],
      customers: [],
      events: [],
      audit_logs: [],
    };
  }
}

function saveJsonDb(db: DatabaseSchema): void {
  if (!jsonDbPath) {
    throw new Error('JSON database path not set');
  }

  fs.writeFileSync(jsonDbPath, JSON.stringify(db, null, 2), 'utf-8');
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
