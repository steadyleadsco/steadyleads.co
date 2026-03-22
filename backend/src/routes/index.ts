import { Router } from 'express';
import clientsRouter from './clients';
import leadsRouter from './leads';
import invoicesRouter from './invoices';
import landingPagesRouter from './landingPages';
import digestRouter from './digest';

const router = Router();

// Mount all route modules
router.use('/clients', clientsRouter);
router.use('/leads', leadsRouter);
router.use('/invoices', invoicesRouter);
router.use('/landing-pages', landingPagesRouter);
router.use('/digest', digestRouter);

export default router;
