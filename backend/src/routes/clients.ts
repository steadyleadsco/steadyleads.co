import { Router, Request, Response } from 'express';
import { ClientCreateSchema, ClientUpdateSchema, ApiResponse } from '../types';
import { ClientService } from '../services/clientService';
import { ZodError } from 'zod';

const router = Router();

// Helper: Send API response
function sendResponse<T>(res: Response, success: boolean, data?: T, error?: string, statusCode = 200) {
  const response: ApiResponse<T> = {
    success,
    data,
    error,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

// POST /api/clients - Create client
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = ClientCreateSchema.parse(req.body);
    const client = await ClientService.create(data);
    sendResponse(res, true, client, undefined, 201);
  } catch (err) {
    if (err instanceof ZodError) {
      sendResponse(res, false, undefined, err.errors[0].message, 400);
    } else {
      console.error('Create client error:', err);
      sendResponse(res, false, undefined, 'Internal server error', 500);
    }
  }
});

// GET /api/clients - List clients
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const clients = await ClientService.getAll(limit, offset);
    sendResponse(res, true, { clients, count: clients.length, limit, offset });
  } catch (err) {
    console.error('List clients error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

// GET /api/clients/:id - Get client by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const client = await ClientService.getById(req.params.id);
    if (!client) {
      return sendResponse(res, false, undefined, 'Client not found', 404);
    }
    sendResponse(res, true, client);
  } catch (err) {
    console.error('Get client error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

// GET /api/clients/:id/stats - Get client statistics
router.get('/:id/stats', async (req: Request, res: Response) => {
  try {
    const stats = await ClientService.getStats(req.params.id);
    if (!stats) {
      return sendResponse(res, false, undefined, 'Client not found', 404);
    }
    sendResponse(res, true, stats);
  } catch (err) {
    console.error('Get stats error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

// PATCH /api/clients/:id - Update client
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const data = ClientUpdateSchema.parse(req.body);
    const client = await ClientService.update(req.params.id, data);
    if (!client) {
      return sendResponse(res, false, undefined, 'Client not found', 404);
    }
    sendResponse(res, true, client);
  } catch (err) {
    if (err instanceof ZodError) {
      sendResponse(res, false, undefined, err.errors[0].message, 400);
    } else {
      console.error('Update client error:', err);
      sendResponse(res, false, undefined, 'Internal server error', 500);
    }
  }
});

// PATCH /api/clients/:id/approve - Approve client
router.patch('/:id/approve', async (req: Request, res: Response) => {
  try {
    const client = await ClientService.approve(req.params.id);
    if (!client) {
      return sendResponse(res, false, undefined, 'Client not found', 404);
    }
    sendResponse(res, true, client);
  } catch (err) {
    console.error('Approve client error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

export default router;
