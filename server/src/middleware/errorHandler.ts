// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors';
import { logger } from '../config/logger';

const errorHandler = (
  err: Error & { data?: unknown; statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(`Error: ${err.message}`);

  const statusCode =
    err instanceof CustomError
      ? err.statusCode
      : res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : 500;

  const code = (err as any).code; 

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    ...(code && { code }),
    // 👇 this line makes the frontend able to read `code: INSUFFICIENT_BALANCE`
    ...(err.data !== undefined && { errors: err.data }),
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

export default errorHandler;