interface HCaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
}

export const verifyHCaptcha = async (token: string): Promise<boolean> => {
  const secretKey = process.env.HCAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.warn("HCAPTCHA_SECRET_KEY not set");
    return true;
  }

  try {
    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `response=${token}&secret=${secretKey}`,
    });

    const result = (await response.json()) as HCaptchaResponse;
    return result.success === true;
  } catch (error) {
    console.error("hCaptcha verification error:", error);
    return false;
  }
};
