import { getCurrentDate, getStatusCode } from './helpers.js';

export const sendResponse = (res, httpStatus, data) => res.status(httpStatus).json(data);

export const errorResponse = (res, httpStatus, message, similarity = 0, faceMatches = 0, extra = {}) => {
  const code = extra.code || getStatusCode(false, httpStatus);
  return sendResponse(res, httpStatus, {
    success: false,
    status: 'error',
    code,
    date: getCurrentDate(),
    similarity,
    message,
    faceMatches,
    data: null,
    ...extra
  });
};

export const successResponse = (res, similarity, message, faceMatches, extra = {}) => {
  const code = getStatusCode(true, 200);
  return sendResponse(res, 200, {
    success: true,
    status: 'success',
    code,
    date: getCurrentDate(),
    similarity,
    message,
    faceMatches,
    data: { similarity, faceMatches, ...extra },
    ...extra
  });
};
