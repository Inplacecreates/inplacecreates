import type { APIRoute } from "astro";
import { createHash } from "node:crypto";

// Simple rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting function
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 10; // Maximum 10 captcha requests per minute

  const current = rateLimitStore.get(ip);

  if (!current || now > current.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;
  return true;
}

// Simple math captcha generator
function generateMathCaptcha() {
  const operators = ["+", "-", "×"];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  let num1: number, num2: number, answer: number;

  switch (operator) {
    case "+":
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
      answer = num1 + num2;
      break;
    case "-":
      num1 = Math.floor(Math.random() * 50) + 25;
      num2 = Math.floor(Math.random() * 25) + 1;
      answer = num1 - num2;
      break;
    case "×":
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = num1 * num2;
      break;
    default:
      num1 = 5;
      num2 = 3;
      answer = 8;
  }

  return {
    question: `${num1} ${operator} ${num2}`,
    answer: answer.toString(),
  };
}

// Create a hash for the answer to avoid exposing it in the frontend
function createCaptchaHash(answer: string, timestamp: string): string {
  const secret =
    process.env.CAPTCHA_SECRET ||
    "InPlace-Captcha-Secret-2024-Change-In-Production";
  return createHash("sha256")
    .update(answer + timestamp + secret)
    .digest("hex");
}

// Verify captcha hash
export function verifyCaptchaHash(
  answer: string,
  timestamp: string,
  hash: string
): boolean {
  const secret =
    process.env.CAPTCHA_SECRET ||
    "InPlace-Captcha-Secret-2024-Change-In-Production";
  const expectedHash = createHash("sha256")
    .update(answer + timestamp + secret)
    .digest("hex");

  // Check if timestamp is not too old (5 minutes max)
  const now = Date.now();
  const captchaTime = parseInt(timestamp);
  const maxAge = 5 * 60 * 1000; // 5 minutes in milliseconds

  if (now - captchaTime > maxAge) {
    return false;
  }

  return expectedHash === hash;
}

export const GET: APIRoute = async ({ request, clientAddress }) => {
  try {
    // Get IP address for rate limiting
    const ip = clientAddress || "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({
          error: "Too many captcha requests. Please wait before trying again.",
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const captcha = generateMathCaptcha();
    const timestamp = Date.now().toString();
    const hash = createCaptchaHash(captcha.answer, timestamp);

    return new Response(
      JSON.stringify({
        question: captcha.question,
        timestamp,
        hash,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Captcha generation error:", error);

    return new Response(
      JSON.stringify({ error: "Failed to generate captcha" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
