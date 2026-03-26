import { Router, Request, Response } from "express";
import pool from "../db";
import { verifyToken } from "../utils/jwt";

const router = Router();

router.get("/metrics", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    }

    const clientId = payload.clientId;

    const leadsResult = await pool.query(
      "SELECT COUNT(*) as total_leads FROM leads WHERE client_id = $1",
      [clientId]
    );

    const invoicesResult = await pool.query(
      "SELECT COUNT(*) as total_invoices, COALESCE(SUM(amount), 0) as total_amount FROM invoices WHERE client_id = $1",
      [clientId]
    );

    const landingPagesResult = await pool.query(
      "SELECT COUNT(*) as total_pages FROM landing_pages WHERE client_id = $1",
      [clientId]
    );

    return res.json({
      success: true,
      data: {
        total_leads: parseInt(leadsResult.rows[0].total_leads),
        total_invoices: parseInt(invoicesResult.rows[0].total_invoices),
        total_revenue: parseFloat(invoicesResult.rows[0].total_amount),
        landing_pages: parseInt(landingPagesResult.rows[0].total_pages),
      },
    });
  } catch (error) {
    console.error("Dashboard metrics error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch metrics",
    });
  }
});

export default router;
