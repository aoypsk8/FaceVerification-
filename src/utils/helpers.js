import crypto from 'crypto';

export const roundSimilarity = (val) => Math.round(val * 100) / 100;

export const hashFile = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');

export const getCurrentDate = () => new Date().toISOString();

export const getStatusCode = (success, httpStatus) => {
  if (success) return 'VERIFICATION_SUCCESS';
  if (httpStatus === 400) return 'VALIDATION_ERROR';
  if (httpStatus === 403) return 'PERMISSION_ERROR';
  return 'SERVER_ERROR';
};
