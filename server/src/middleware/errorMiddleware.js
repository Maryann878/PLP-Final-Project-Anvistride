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
    
    // Enhanced logging with user context
    console.error("❌ Error Handler:", {
      timestamp: new Date().toISOString(),
      message: err.message,
      name: err.name,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('user-agent'),
      userId: req.user?.id || 'anonymous',
      body: process.env.NODE_ENV === 'development' ? req.body : undefined,
      query: process.env.NODE_ENV === 'development' ? req.query : undefined,
      statusCode: statusCode,
    });
    
    res.status(statusCode);
    res.json({
      message: err.message || "Internal server error",
      // In production, still log to console but don't expose stack to client
      ...(process.env.NODE_ENV === "development" && { 
        stack: err.stack,
        details: err
      }),
    });
  };
  