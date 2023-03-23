import { Response } from "express";
import { AppError } from './appError';

export function handleError(error: AppError, response: Response): void {
  console.log(`Error has occurred ${error.message}, stack: ${error.stack as string}`);
  response.status(error.httpCode);

  if (!error.isOperational) {
    throw error;
  }
}
