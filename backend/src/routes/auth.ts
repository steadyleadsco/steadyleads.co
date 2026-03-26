import { Router, Request, Response } from "express";
import pool from "../db";
import { generateToken, verifyToken } from "../utils/jwt";
import { hashPassword, verifyPassword } from "../utils/password";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password required",
      });
    }

    const result = await pool.query(
      "SELECT id, email, password_hash, name FROM clients WHERE email = \$1 AND login_enabled = true",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    const client = result.rows[0];
    const passwordMatch = await verifyPassword(password, client.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    const token = generateToken(client.id, client.email);

    await pool.query(
      "UPDATE clients SET last_login = NOW(), auth_token = \$1 WHERE id = \$2",
      [token, client.id]
    );

    return res.status(200).json({
      success: true,
      data: {
        clientId: client.id,
        email: client.email,
        name: client.name,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
});

router.post("/verify-token", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Token required",
      });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token",
      });
    }

    return res.json({
      success: true,
      data: payload,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(500).json({
      success: false,
      error: "Token verification failed",
    });
  }
});

router.post("/logout", async (req: Request, res: Response) => {
  try {
    const { clientId } = req.body;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        error: "Client ID required",
      });
    }

    await pool.query(
      "UPDATE clients SET auth_token = NULL WHERE id = \$1",
      [clientId]
    );

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      error: "Logout failed",
    });
  }
});

export default router;

router.get("/me", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token",
      });
    }

    const result = await pool.query(
      "SELECT id, name, email, phone, city, state FROM clients WHERE id = $1",
      [payload.clientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      });
    }

    const client = result.rows[0];

    return res.json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to get client data",
    });
  }
});

