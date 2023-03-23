export interface IConfig {
  get: <T>(setting: string) => T;
  has: (setting: string) => boolean;
}

export interface OpenApiConfig {
  filePath: string;
  basePath: string;
  jsonPath: string;
  uiPath: string;
}

export enum Operator {
  GREATER = 'greater',
  GREATER_EQUAL = 'greaterEqual',
  LESS = 'less',
  LESS_EQUAL = 'lessEqual',
  EQUAL = 'equal',
  CONTAINS = 'contains',
  WITHIN = 'within',
  INTERSECTS = 'intersects',
}