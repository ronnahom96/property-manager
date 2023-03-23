export class AppError extends Error {
  public readonly httpCode: number;
  public readonly isOperational: boolean;

  public constructor(description: string, httpCode: number, isOperational: boolean) {
    super(description);

    // restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);

    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}
