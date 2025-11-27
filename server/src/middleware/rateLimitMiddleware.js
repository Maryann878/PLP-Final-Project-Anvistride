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

/**
 * General API rate limiter
 * Protects all API endpoints from abuse while allowing normal usage
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window per IP (generous for normal usage)
  message: {
    message: "Too many requests from this IP, please try again later",
    retryAfter: 15 * 60, // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/api/health' || req.path === '/';
  },
});

/**
 * Strict rate limiter for write operations (POST, PUT, DELETE, PATCH)
 * More restrictive to prevent abuse of data modification endpoints
 */
export const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 write requests per window per IP
  message: {
    message: "Too many write requests from this IP, please try again later",
    retryAfter: 15 * 60, // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
});

