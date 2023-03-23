import { readPackageJsonSync } from '@map-colonies/read-pkg';

export const SERVICE_NAME = readPackageJsonSync().name ?? 'unknown_service';
export const DEFAULT_SERVER_PORT = 80;

// Errors
export const NOT_FOUND = 'Not Found';
export const INVALID_FILTER_TYPE = 'Invalid filter type';

/* eslint-disable @typescript-eslint/naming-convention */
export const SERVICES: Record<string, symbol> = {
  CONFIG: Symbol('Config'),
  APP_DATA_SOURCE: Symbol('APP_DATA_SOURCE'),
  PRODUCT_FILTER_SERVICE: Symbol('PRODUCT_FILTER_SERVICE'),
  GEO_SERVICE: Symbol('GEO_SERVICE'),
  ERROR_HANDLER: Symbol('ERROR_HANDLER'),
};
/* eslint-enable @typescript-eslint/naming-convention */
