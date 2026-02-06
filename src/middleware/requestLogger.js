import { logger } from '../utils/logger.js';

/**
 * Request logging middleware
 * Logs every incoming request with timing information
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log transaction start
  logger.transactionStart(req);
  
  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(...args) {
    const processingTime = Date.now() - startTime;
    
    // Log transaction end
    logger.transactionEnd(req, res, processingTime);
    
    // Call original end
    originalEnd.apply(this, args);
  };
  
  next();
};
