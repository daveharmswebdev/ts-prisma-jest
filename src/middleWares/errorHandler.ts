import { ErrorRequestHandler } from 'express';
import { isHttpError } from 'http-errors';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (isHttpError(err)) {
    res.status(err.statusCode).json({
      error: err.message,
    });
  } else {
    res.status(500).json({
      error: 'An unexpected error has occurred.',
    });
  }
};
