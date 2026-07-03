/**
 * DigiKash Integration Service
 * Backend API handlers for Express
 */

import { Request, Response, Router } from 'express';
import { DigiKashNode, PaymentRequest } from '../lib/digikash';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Database types (you should integrate with your actual DB)
interface MerchantGateway {
  id: number;
  merchant_id: number;
  api_key: string;
  merchant_key: string;
  api_secret: string;
  environment: 'sandbox' | 'production';
}

interface PaymentTransaction {
  id: number;
  order_id: string;
  merchant_id: number;
  gateway_trx_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  payment_url?: string;
}

// Mock database (replace with your actual DB)
const mockMerchantGateways: MerchantGateway[] = [];
const mockTransactions: PaymentTransaction[] = [];

/**
 * Get merchant gateway configuration
 */
async function getMerchantGateway(merchantId: number): Promise<MerchantGateway | null> {
  return mockMerchantGateways.find(m => m.merchant_id === merchantId) || null;
}

/**
 * Save merchant gateway configuration
 */
async function saveMerchantGateway(gateway: Omit<MerchantGateway, 'id'>): Promise<MerchantGateway> {
  const newGateway: MerchantGateway = {
    ...gateway,
    id: Date.now(),
  };
  mockMerchantGateways.push(newGateway);
  return newGateway;
}

/**
 * Create transaction record
 */
async function createTransaction(data: Omit<PaymentTransaction, 'id'>): Promise<PaymentTransaction> {
  const transaction: PaymentTransaction = {
    ...data,
    id: Date.now(),
  };
  mockTransactions.push(transaction);
  return transaction;
}

/**
 * Update transaction
 */
async function updateTransaction(
  id: number,
  updates: Partial<PaymentTransaction>
): Promise<PaymentTransaction | null> {
  const index = mockTransactions.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  mockTransactions[index] = { ...mockTransactions[index], ...updates };
  return mockTransactions[index];
}

/**
 * Find transaction by order ID
 */
async function findTransactionByOrderId(orderId: string): Promise<PaymentTransaction | null> {
  return mockTransactions.find(t => t.order_id === orderId) || null;
}

/**
 * POST /api/digikash/config
 * Save merchant's DigiKash configuration
 */
router.post('/config', async (req: Request, res: Response) => {
  try {
    const { merchantId, apiKey, merchantKey, apiSecret, environment } = req.body;
    
    const gateway = await saveMerchantGateway({
      merchant_id: merchantId,
      api_key: apiKey,
      merchant_key: merchantKey,
      api_secret: apiSecret,
      environment: environment || 'sandbox',
    });
    
    res.json({ success: true, data: gateway });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * GET /api/digikash/config/:merchantId
 * Get merchant's configuration
 */
router.get('/config/:merchantId', async (req: Request, res: Response) => {
  try {
    const { merchantId } = req.params;
    const gateway = await getMerchantGateway(parseInt(merchantId));
    
    if (!gateway) {
      return res.status(404).json({ success: false, error: 'Gateway not configured' });
    }
    
    // Don't return secret
    res.json({
      success: true,
      data: {
        id: gateway.id,
        merchant_id: gateway.merchant_id,
        environment: gateway.environment,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * POST /api/digikash/payment
 * Initiate a payment
 */
router.post('/payment', async (req: Request, res: Response) => {
  try {
    const {
      merchantId,
      orderId,
      amount,
      currency,
      customerName,
      customerEmail,
      description,
    } = req.body;

    const gateway = await getMerchantGateway(merchantId);
    if (!gateway) {
      return res.status(400).json({ success: false, error: 'Payment gateway not configured' });
    }

    const digikash = new DigiKashNode({
      apiKey: gateway.api_key,
      merchantKey: gateway.merchant_key,
      apiSecret: gateway.api_secret,
      baseUrl: process.env.DIGIKASH_BASE_URL || 'https://pay.modaui.com',
      environment: gateway.environment,
    });

    // Create local transaction record
    const transaction = await createTransaction({
      order_id: orderId,
      merchant_id: merchantId,
      amount,
      currency,
      status: 'pending',
    });

    const paymentData: PaymentRequest = {
      payment_amount: amount,
      currency_code: currency,
      ref_trx: orderId,
      description: description || `Order #${orderId} payment`,
      ipn_url: `${process.env.BASE_URL}/api/digikash/webhook`,
      success_redirect: `${process.env.BASE_URL}/payment/success?order_id=${orderId}`,
      cancel_redirect: `${process.env.BASE_URL}/payment/cancel?order_id=${orderId}`,
      customer_name: customerName,
      customer_email: customerEmail,
    };

    const payment = await digikash.initiatePayment(paymentData);

    // Update transaction with payment URL
    await updateTransaction(transaction.id, {
      payment_url: payment.payment_url,
    });

    res.json({
      success: true,
      data: {
        payment_url: payment.payment_url,
        transaction_id: transaction.id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * GET /api/digikash/payment/:orderId
 * Verify payment status
 */
router.get('/payment/:orderId', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    
    const transaction = await findTransactionByOrderId(orderId);
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    const gateway = await getMerchantGateway(transaction.merchant_id);
    if (!gateway) {
      return res.status(400).json({ success: false, error: 'Gateway not configured' });
    }

    const digikash = new DigiKashNode({
      apiKey: gateway.api_key,
      merchantKey: gateway.merchant_key,
      apiSecret: gateway.api_secret,
      baseUrl: process.env.DIGIKASH_BASE_URL || 'https://pay.modaui.com',
      environment: gateway.environment,
    });

    // Try to verify from gateway (we need the gateway trx ID for this)
    // For now, just return the local transaction status
    // In real implementation, you'd call digikash.verifyPayment(gatewayTrxId)
    
    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * POST /api/digikash/webhook
 * Handle webhook callbacks from DigiKash
 */
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    
    // TODO: Verify webhook signature
    // TODO: Process the webhook and update transaction status
    
    console.log('Received DigiKash webhook:', payload);
    
    res.json({ success: true, message: 'Webhook received' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;
