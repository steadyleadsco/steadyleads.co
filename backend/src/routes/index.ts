import { Router } from "express";
import clientsRouter from "./clients";
import leadsRouter from "./leads";
import invoicesRouter from "./invoices";
import landingPagesRouter from "./landingPages";
import digestRouter from "./digest";
import contactRouter from "./contact";
import authRouter from "./auth";
import dashboardRouter from "./dashboard";

const router = Router();

router.use("/auth", authRouter);
router.use("/dashboard", dashboardRouter);
router.use("/clients", clientsRouter);
router.use("/leads", leadsRouter);
router.use("/invoices", invoicesRouter);
router.use("/landing-pages", landingPagesRouter);
router.use("/digest", digestRouter);
router.use("/", contactRouter);

export default router;
