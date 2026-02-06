import multer from 'multer';
import { errorResponse } from '../utils/responses.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (error, req, res, next) => {
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    logger.warning('File size exceeded limit', {
      code: error.code,
      field: error.field,
      limit: error.limit,
    });
    return errorResponse(res, 400, 'Image file size exceeds 5MB', 0, 0, { code: 'FILE_SIZE_EXCEEDED' });
  }
  
  logger.error(error, {
    endpoint: req.path,
    method: req.method,
    errorType: 'UNEXPECTED_ERROR',
  });
  
  return errorResponse(res, 500, error.message || 'An unexpected error occurred', 0, 0, { code: 'UNEXPECTED_ERROR' });
};
