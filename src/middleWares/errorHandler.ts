import { ErrorRequestHandler } from 'express';
import { isHttpError } from 'http-errors';
import { createResponse } from '@/controllers/helpers/createResponse';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error occurred:`, {
    message: err.message,
    stack: err.stack,
    status: isHttpError(err) ? err.statusCode : 500,
    path: req.originalUrl,
  });

  if (isHttpError(err)) {
    res.status(err.statusCode).json(createResponse(null, err.message));
  } else {
    res
      .status(500)
      .json(createResponse(null, 'An unexpected error has occurred.'));
  }
};
