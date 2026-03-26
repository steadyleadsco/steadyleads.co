import crypto from "crypto";

export const hashPassword = async (password: string): Promise<string> => {
  return crypto.createHash("sha256").update(password + "steadyleads-salt").digest("hex");
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const passwordHash = crypto.createHash("sha256").update(password + "steadyleads-salt").digest("hex");
  return passwordHash === hash;
};
