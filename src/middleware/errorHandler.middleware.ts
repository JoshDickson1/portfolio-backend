import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(422).json({
      success: false,
      message: 'Validation error',
      errors: err.flatten().fieldErrors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  logger.error(err);
  return res.status(500).json({
    success: false,
    message: process.env['NODE_ENV'] === 'production' ? 'Internal server error' : err.message,
  });
};
