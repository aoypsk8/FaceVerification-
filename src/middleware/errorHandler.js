import multer from 'multer';
import { errorResponse } from '../utils/responses.js';

export const errorHandler = (error, req, res, next) => {
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return errorResponse(res, 400, 'Image file size exceeds 5MB', 0, 0, { code: 'FILE_SIZE_EXCEEDED' });
  }
  return errorResponse(res, 500, error.message || 'An unexpected error occurred', 0, 0, { code: 'UNEXPECTED_ERROR' });
};
