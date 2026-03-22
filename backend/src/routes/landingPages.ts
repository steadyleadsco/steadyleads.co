import { Router, Request, Response } from 'express';
import { LandingPageCreateSchema, LandingPageUpdateSchema, ApiResponse } from '../types';
import { LandingPageService } from '../services/landingPageService';
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

// POST /api/landing-pages - Create landing page
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = LandingPageCreateSchema.parse(req.body);
    const landingPage = await LandingPageService.create(data);
    sendResponse(res, true, landingPage, undefined, 201);
  } catch (err) {
    if (err instanceof ZodError) {
      sendResponse(res, false, undefined, err.errors[0].message, 400);
    } else {
      console.error('Create landing page error:', err);
      sendResponse(res, false, undefined, 'Internal server error', 500);
    }
  }
});

// GET /api/landing-pages - List all landing pages
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const landingPages = await LandingPageService.getAll(limit, offset);
    sendResponse(res, true, { landingPages, count: landingPages.length, limit, offset });
  } catch (err) {
    console.error('List landing pages error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

// GET /api/landing-pages/:id - Get landing page by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const landingPage = await LandingPageService.getById(req.params.id);
    if (!landingPage) {
      return sendResponse(res, false, undefined, 'Landing page not found', 404);
    }
    sendResponse(res, true, landingPage);
  } catch (err) {
    console.error('Get landing page error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

// GET /api/landing-pages/slug/:slug - Get landing page by slug
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const landingPage = await LandingPageService.getBySlug(req.params.slug);
    if (!landingPage) {
      return sendResponse(res, false, undefined, 'Landing page not found', 404);
    }
    sendResponse(res, true, landingPage);
  } catch (err) {
    console.error('Get landing page by slug error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

// GET /api/landing-pages/client/:clientId - Get landing pages for client
router.get('/client/:clientId', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const landingPages = await LandingPageService.getByClientId(req.params.clientId, limit, offset);
    sendResponse(res, true, { landingPages, count: landingPages.length, limit, offset });
  } catch (err) {
    console.error('Get client landing pages error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

// GET /api/landing-pages/:id/stats - Get landing page statistics
router.get('/:id/stats', async (req: Request, res: Response) => {
  try {
    const stats = await LandingPageService.getStats(req.params.id);
    if (!stats) {
      return sendResponse(res, false, undefined, 'Landing page not found', 404);
    }
    sendResponse(res, true, stats);
  } catch (err) {
    console.error('Get landing page stats error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

// PATCH /api/landing-pages/:id - Update landing page
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const data = LandingPageUpdateSchema.parse(req.body);
    const landingPage = await LandingPageService.update(req.params.id, data);
    if (!landingPage) {
      return sendResponse(res, false, undefined, 'Landing page not found', 404);
    }
    sendResponse(res, true, landingPage);
  } catch (err) {
    if (err instanceof ZodError) {
      sendResponse(res, false, undefined, err.errors[0].message, 400);
    } else {
      console.error('Update landing page error:', err);
      sendResponse(res, false, undefined, 'Internal server error', 500);
    }
  }
});

// PATCH /api/landing-pages/:id/publish - Publish landing page
router.patch('/:id/publish', async (req: Request, res: Response) => {
  try {
    const landingPage = await LandingPageService.publish(req.params.id);
    if (!landingPage) {
      return sendResponse(res, false, undefined, 'Landing page not found', 404);
    }
    sendResponse(res, true, landingPage);
  } catch (err) {
    console.error('Publish landing page error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

// PATCH /api/landing-pages/:id/archive - Archive landing page
router.patch('/:id/archive', async (req: Request, res: Response) => {
  try {
    const landingPage = await LandingPageService.archive(req.params.id);
    if (!landingPage) {
      return sendResponse(res, false, undefined, 'Landing page not found', 404);
    }
    sendResponse(res, true, landingPage);
  } catch (err) {
    console.error('Archive landing page error:', err);
    sendResponse(res, false, undefined, 'Internal server error', 500);
  }
});

export default router;
