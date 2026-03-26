import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "steadyleads-secret-key";
const JWT_EXPIRY = "7d";

export interface TokenPayload {
  clientId: string;
  email: string;
  iat: number;
}

export const generateToken = (clientId: string, email: string): string => {
  return jwt.sign(
    { clientId, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};
