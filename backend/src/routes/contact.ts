import { Router, Request, Response } from "express";
import pool from "../db";
import { verifyHCaptcha } from "../utils/hcaptcha";

const router = Router();

router.post("/contact", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, spa_name, city, message, captchaToken } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "Name and email are required",
      });
    }

    if (!captchaToken) {
      return res.status(400).json({
        success: false,
        error: "Captcha verification required",
      });
    }

    const captchaValid = await verifyHCaptcha(captchaToken);

    if (!captchaValid) {
      return res.status(400).json({
        success: false,
        error: "Captcha verification failed",
      });
    }

    const result = await pool.query(
      "INSERT INTO contact_inquiries (name, email, phone, spa_name, city, message, source) VALUES (\$1, \$2, \$3, \$4, \$5, \$6, \$7) RETURNING id, name, email, created_at",
      [name, email, phone || null, spa_name || null, city || null, message || null, "landing-page"]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: "Thank you! We received your inquiry and will be in touch soon.",
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to submit inquiry",
    });
  }
});

router.get("/contact", async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = ((parseInt(page as string) || 1) - 1) * parseInt(limit as string || "20");

    let query = "SELECT * FROM contact_inquiries";
    const params: any[] = [];

    if (status) {
      query += " WHERE status = \$1";
      params.push(status);
    }

    const countResult = await pool.query(
      query.replace("SELECT *", "SELECT COUNT(*) as total"),
      params
    );
    const total = parseInt(countResult.rows[0].total);

    const result = await pool.query(
      query + " ORDER BY created_at DESC LIMIT \$" + (params.length + 1) + " OFFSET \$" + (params.length + 2),
      [...params, limit, offset]
    );

    return res.json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 20,
        pages: Math.ceil(total / parseInt(limit as string || "20")),
      },
    });
  } catch (error) {
    console.error("Contact list error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch inquiries",
    });
  }
});

export default router;
