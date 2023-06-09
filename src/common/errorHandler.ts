import { NextFunction, Request, Response } from 'express';
import { Logger } from 'pino';
import { inject, injectable } from 'tsyringe';
import { AppError } from './appError';
import { SERVICES } from './constants';

@injectable()
export class ErrorHandler {
  constructor(@inject(SERVICES.LOGGER) private readonly logger: Logger) { }

  public handleError(error: AppError, request: Request, response: Response, next: NextFunction) {
    this.logger.error({ message: error.message, stack: error.stack });

    if (!error.isOperational) {
      throw error;
    }

    response.status(error.statusCode).send(error.message);
  }
}
