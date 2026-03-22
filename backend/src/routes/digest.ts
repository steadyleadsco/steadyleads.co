import { Router, Request, Response } from 'express';
import { ApiResponse } from '../types';
import { ClientService } from '../services/clientService';
import { LeadService } from '../services/leadService';
import { InvoiceService } from '../services/invoiceService';

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

interface DigestData {
  date: string;
  pending_clients: any[];
  daily_summary: {
    total_new_leads: number;
    leads_by_source: any[];
  };
  pending_invoices: any[];
  system_health: {
    database: string;
    last_check: string;
  };
}

// GET /api/digest/daily - Get daily digest (for Ben's approval)
router.get('/daily', async (req: Request, res: Response) => {
  try {
    // Get pending clients (status = pending)
    const allClients = await ClientService.getAll(1000, 0);
    const pendingClients = allClients.filter((c: any) => c.status === 'pending');

    // Get today's lead summary
    const dailySummary = await LeadService.getDailySummary();
    const totalNewLeads = dailySummary.reduce((sum: number, item: any) => sum + item.count, 0);

    // Get pending invoices
    const pendingInvoices = await InvoiceService.getPending();

    // Build digest data
    const digestData: DigestData = {
      date: new Date().toISOString().split('T')[0],
      pending_clients: pendingClients.map((c: any) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        city: c.city,
        monthly_budget: c.monthly_budget,
        created_at: c.created_at,
        action_url: `/approve/client/${c.id}`,
      })),
      daily_summary: {
        total_new_leads: totalNewLeads,
        leads_by_source: dailySummary,
      },
      pending_invoices: pendingInvoices.map((inv: any) => ({
        id: inv.id,
        client_id: inv.client_id,
        amount: inv.amount,
        invoice_type: inv.invoice_type,
        due_date: inv.due_date,
        created_at: inv.created_at,
        action_url: `/approve/invoice/${inv.id}`,
      })),
      system_health: {
        database: 'healthy',
        last_check: new Date().toISOString(),
      },
    };

    sendResponse(res, true, digestData);
  } catch (err) {
    console.error('Get daily digest error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

// PATCH /api/digest/approve/client/:clientId - Approve client
router.patch('/approve/client/:clientId', async (req: Request, res: Response) => {
  try {
    const client = await ClientService.approve(req.params.clientId);
    if (!client) {
      return sendResponse(res, false, undefined, 'Client not found', 404);
    }
    sendResponse(res, true, {
      message: 'Client approved',
      client: client,
    });
  } catch (err) {
    console.error('Approve client error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

// PATCH /api/digest/approve/invoice/:invoiceId - Approve invoice
router.patch('/approve/invoice/:invoiceId', async (req: Request, res: Response) => {
  try {
    const { approvedBy } = req.body;
    if (!approvedBy) {
      return sendResponse(res, false, undefined, 'approvedBy field required', 400);
    }

    const invoice = await InvoiceService.approve(req.params.invoiceId, approvedBy);
    if (!invoice) {
      return sendResponse(res, false, undefined, 'Invoice not found', 404);
    }

    sendResponse(res, true, {
      message: 'Invoice approved',
      invoice: invoice,
    });
  } catch (err) {
    console.error('Approve invoice error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

// PATCH /api/digest/reject/client/:clientId - Reject client
router.patch('/reject/client/:clientId', async (req: Request, res: Response) => {
  try {
    const client = await ClientService.update(req.params.clientId, { created_by: 'rejected' });
    if (!client) {
      return sendResponse(res, false, undefined, 'Client not found', 404);
    }
    sendResponse(res, true, {
      message: 'Client rejected',
      client: client,
    });
  } catch (err) {
    console.error('Reject client error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

export default router;
