import { readPackageJsonSync } from '@map-colonies/read-pkg';

export const SERVICE_NAME = readPackageJsonSync().name ?? 'unknown_service';
export const DEFAULT_SERVER_PORT = 80;

// Errors
export const NOT_FOUND = 'No records found';
export const INVALID_DATE = 'Invalid date';

// Record types
export const INCOME = 'income';
export const EXPENSE = 'expense';

/* eslint-disable @typescript-eslint/naming-convention */
export const SERVICES: Record<string, symbol> = {
  CONFIG: Symbol('Config'),
  LOGGER: Symbol('Logger'),
  ERROR_HANDLER: Symbol('ErrorHandler'),
  RECORD_MODEL: Symbol('RecordModel'),
};
/* eslint-enable @typescript-eslint/naming-convention */
