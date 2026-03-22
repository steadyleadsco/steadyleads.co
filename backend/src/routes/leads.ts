import { Router, Request, Response } from 'express';
import { LeadCreateSchema, LeadUpdateSchema, ApiResponse } from '../types';
import { LeadService } from '../services/leadService';
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

// POST /api/leads - Create lead
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = LeadCreateSchema.parse(req.body);
    const lead = await LeadService.create(data);
    sendResponse(res, true, lead, undefined, 201);
  } catch (err) {
    if (err instanceof ZodError) {
      sendResponse(res, false, undefined, err.errors[0].message, 400);
    } else {
      console.error('Create lead error:', err);
      sendResponse(res, false, undefined, 'Internal server error', 500);
    }
  }
});

// GET /api/leads - List all leads
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const leads = await LeadService.getAll(limit, offset);
    sendResponse(res, true, { leads, count: leads.length, limit, offset });
  } catch (err) {
    console.error('List leads error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

// GET /api/leads/:id - Get lead by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const lead = await LeadService.getById(req.params.id);
    if (!lead) {
      return sendResponse(res, false, undefined, 'Lead not found', 404);
    }
    sendResponse(res, true, lead);
  } catch (err) {
    console.error('Get lead error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

// GET /api/leads/client/:clientId - Get leads for client
router.get('/client/:clientId', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const leads = await LeadService.getByClientId(req.params.clientId, limit, offset);
    sendResponse(res, true, { leads, count: leads.length, limit, offset });
  } catch (err) {
    console.error('Get client leads error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

// PATCH /api/leads/:id - Update lead
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const data = LeadUpdateSchema.parse(req.body);
    const lead = await LeadService.update(req.params.id, data);
    if (!lead) {
      return sendResponse(res, false, undefined, 'Lead not found', 404);
    }
    sendResponse(res, true, lead);
  } catch (err) {
    if (err instanceof ZodError) {
      sendResponse(res, false, undefined, err.errors[0].message, 400);
    } else {
      console.error('Update lead error:', err);
      sendResponse(res, false, undefined, 'Internal server error', 500);
    }
  }
});

// GET /api/leads/daily/summary - Get daily summary
router.get('/daily/summary', async (req: Request, res: Response) => {
  try {
    const summary = await LeadService.getDailySummary();
    sendResponse(res, true, summary);
  } catch (err) {
    console.error('Daily summary error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

export default router;
