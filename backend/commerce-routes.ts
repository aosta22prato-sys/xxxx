/**
 * Commerce REST API Routes
 */

import express, { Request, Response, NextFunction } from 'express';
import { CoreCommerce, ApiResponse, Product, Order, Customer } from '../src/core-commerce';

const router = express.Router();

// Middleware to get store context
router.use((req: any, res: Response, next: NextFunction) => {
  req.storeId = req.headers['x-store-id'] || 'store_default';
  req.tenantId = req.headers['x-tenant-id'] || 'tenant_default';
  next();
});

// Health check
router.get('/health', (req: any, res: Response<ApiResponse<any>>) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      message: 'Commerce API is running',
      store: req.storeId,
      tenant: req.tenantId
    }
  });
});

// Products endpoints
router.post('/products', (req: any, res: Response<ApiResponse<Product>>) => {
  try {
    const product = CoreCommerce.commerce.createProduct(
      req.storeId,
      req.tenantId,
      req.body
    );
    res.json({
      success: true,
      data: product
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

router.get('/products', (req: any, res: Response<ApiResponse<Product[]>>) => {
  try {
    const products = CoreCommerce.commerce.getProducts(req.storeId);
    res.json({
      success: true,
      data: products
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Orders endpoints
router.post('/orders', (req: any, res: Response<ApiResponse<Order>>) => {
  try {
    const order = CoreCommerce.commerce.createOrder(
      req.storeId,
      req.tenantId,
      req.body
    );
    res.json({
      success: true,
      data: order
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

router.get('/orders', (req: any, res: Response<ApiResponse<Order[]>>) => {
  try {
    const orders = CoreCommerce.commerce.getOrders(req.storeId);
    res.json({
      success: true,
      data: orders
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Customers endpoints
router.post('/customers', (req: any, res: Response<ApiResponse<Customer>>) => {
  try {
    const customer = CoreCommerce.commerce.addCustomer(
      req.storeId,
      req.tenantId,
      req.body
    );
    res.json({
      success: true,
      data: customer
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

router.get('/customers', (req: any, res: Response<ApiResponse<Customer[]>>) => {
  try {
    const customers = CoreCommerce.commerce.getCustomers(req.storeId);
    res.json({
      success: true,
      data: customers
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Events
router.get('/events', (req: any, res: Response<ApiResponse<any[]>>) => {
  try {
    const limit = parseInt(req.query.limit || '100', 10);
    const events = CoreCommerce.events.getHistory(limit);
    res.json({
      success: true,
      data: events
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

export default router;
