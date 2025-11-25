// server/src/middleware/rateLimitMiddleware.js
import rateLimit from "express-rate-limit";

/**
 * Rate limiter for authentication routes
 * Prevents brute force attacks while being lenient for legitimate users
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window per IP (lenient to avoid blocking legitimate users)
  message: {
    message: "Too many authentication attempts from this IP, please try again after 15 minutes",
    retryAfter: 15 * 60, // seconds
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // Don't count successful login/register attempts
  skipFailedRequests: false, // Count failed attempts (this is what we want to limit)
  // Use IP address for tracking (default behavior)
});

