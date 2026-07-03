/**
 * JWT Authentication Middleware
 * Simple JWT implementation for API authentication
 */

import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export interface DecodedToken {
  storeId: string;
  tenantId: string;
  userId?: string;
  role?: string;
  iat: number;
  exp: number;
}

// Get secret from environment or use default for dev
const JWT_SECRET = process.env.JWT_SECRET || 'deepay-dev-secret-key-not-for-production';
const TOKEN_EXPIRY = process.env.JWT_EXPIRY || '24h';

/**
 * Generate JWT token
 */
export function generateToken(payload: {
  storeId: string;
  tenantId: string;
  userId?: string;
  role?: string;
}): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch (error) {
    return null;
  }
}

/**
 * Express middleware for JWT authentication
 * Checks for token in Authorization header or x-api-key header
 */
export function jwtMiddleware(req: any, res: Response, next: NextFunction): void {
  // Skip authentication for health check and public endpoints
  const publicEndpoints = ['/api/commerce/health', '/health', '/api/health'];
  if (publicEndpoints.includes(req.path)) {
    return next();
  }

  // Get token from Authorization header (Bearer scheme) or x-api-key header
  let token: string | null = null;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  }

  // Fallback to x-api-key header for simpler use cases
  if (!token) {
    token = req.headers['x-api-key'] as string;
  }

  // Allow requests with store/tenant headers (development mode)
  const storeId = req.headers['x-store-id'];
  const tenantId = req.headers['x-tenant-id'];

  if (storeId && tenantId) {
    // Development mode: use headers directly
    req.user = { storeId, tenantId };
    return next();
  }

  // If no token and no headers, reject
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing token or store/tenant headers',
    });
  }

  // Verify token
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or expired token',
    });
  }

  // Attach decoded token to request
  req.user = decoded;
  next();
}

/**
 * Express middleware for role-based access control
 */
export function roleMiddleware(allowedRoles: string[]) {
  return (req: any, res: Response, next: NextFunction): void => {
    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Insufficient permissions',
      });
    }
    next();
  };
}

/**
 * Example: Generate a test token for development
 */
export function generateTestToken(
  storeId = 'store_test',
  tenantId = 'tenant_test',
  userId = 'user_test',
  role = 'admin'
): string {
  return generateToken({ storeId, tenantId, userId, role });
}
