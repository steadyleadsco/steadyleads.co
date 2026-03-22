import { Router } from 'express';
import clientsRouter from './clients';
import leadsRouter from './leads';

const router = Router();

// Mount all route modules
router.use('/clients', clientsRouter);
router.use('/leads', leadsRouter);

export default router;
