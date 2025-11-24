// server/src/middleware/errorMiddleware.js

// 404 Not Found middleware
export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  
  // General Error Handler middleware
  export const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // Log error for debugging - ALWAYS log full details for Railway debugging
    console.error("❌ Error Handler:", {
      message: err.message,
      name: err.name,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      query: req.query,
    });
    
    res.status(statusCode);
    res.json({
      message: err.message || "Internal server error",
      // In production, still log to console but don't expose stack to client
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  };
  