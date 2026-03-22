import { Router, Request, Response } from 'express';
import { InvoiceCreateSchema, InvoiceUpdateSchema, ApiResponse } from '../types';
import { InvoiceService } from '../services/invoiceService';
import { ZodError } from 'zod';

const router = Router();

function sendResponse<T>(res: Response, success: boolean, data?: T, error?: string, statusCode = 200) {
  const response: ApiResponse<T> = {
    success,
    data,
    error,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

// POST /api/invoices - Create invoice
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = InvoiceCreateSchema.parse(req.body);
    const invoice = await InvoiceService.create(data);
    sendResponse(res, true, invoice, undefined, 201);
  } catch (err) {
    if (err instanceof ZodError) {
      sendResponse(res, false, undefined, err.errors[0].message, 400);
    } else {
      console.error('Create invoice error:', err);
      sendResponse(res, false, undefined, 'Internal server error', 500);
    }
  }
});

// GET /api/invoices - List all invoices
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const invoices = await InvoiceService.getAll(limit, offset);
    sendResponse(res, true, { invoices, count: invoices.length, limit, offset });
  } catch (err) {
    console.error('List invoices error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

// GET /api/invoices/pending - Get pending invoices (for digest)
router.get('/pending', async (req: Request, res: Response) => {
  try {
    const invoices = await InvoiceService.getPending();
    sendResponse(res, true, { invoices, count: invoices.length });
  } catch (err) {
    console.error('Get pending invoices error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

// GET /api/invoices/:id - Get invoice by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const invoice = await InvoiceService.getById(req.params.id);
    if (!invoice) {
      return sendResponse(res, false, undefined, 'Invoice not found', 404);
    }
    sendResponse(res, true, invoice);
  } catch (err) {
    console.error('Get invoice error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

// GET /api/invoices/client/:clientId - Get invoices for client
router.get('/client/:clientId', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const invoices = await InvoiceService.getByClientId(req.params.clientId, limit, offset);
    sendResponse(res, true, { invoices, count: invoices.length, limit, offset });
  } catch (err) {
    console.error('Get client invoices error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

// PATCH /api/invoices/:id - Update invoice
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const data = InvoiceUpdateSchema.parse(req.body);
    const invoice = await InvoiceService.update(req.params.id, data);
    if (!invoice) {
      return sendResponse(res, false, undefined, 'Invoice not found', 404);
    }
    sendResponse(res, true, invoice);
  } catch (err) {
    if (err instanceof ZodError) {
      sendResponse(res, false, undefined, err.errors[0].message, 400);
    } else {
      console.error('Update invoice error:', err);
      sendResponse(res, false, undefined, 'Internal server error', 500);
    }
  }
});

// PATCH /api/invoices/:id/approve - Approve invoice
router.patch('/:id/approve', async (req: Request, res: Response) => {
  try {
    const { approvedBy } = req.body;
    if (!approvedBy) {
      return sendResponse(res, false, undefined, 'approvedBy field required', 400);
    }
    const invoice = await InvoiceService.approve(req.params.id, approvedBy);
    if (!invoice) {
      return sendResponse(res, false, undefined, 'Invoice not found', 404);
    }
    sendResponse(res, true, invoice);
  } catch (err) {
    console.error('Approve invoice error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

// PATCH /api/invoices/:id/send - Mark invoice as sent
router.patch('/:id/send', async (req: Request, res: Response) => {
  try {
    const invoice = await InvoiceService.send(req.params.id);
    if (!invoice) {
      return sendResponse(res, false, undefined, 'Invoice not found', 404);
    }
    sendResponse(res, true, invoice);
  } catch (err) {
    console.error('Send invoice error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

export default router;
