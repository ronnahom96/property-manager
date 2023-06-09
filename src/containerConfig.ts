import config from 'config';
import httpStatus from 'http-status-codes';
import { DependencyContainer } from 'tsyringe/dist/typings/types';
import { AppError } from './common/appError';
import { SERVICES } from './common/constants';
import mongooseLoader from './common/dbLoader';
import { InjectionObject, registerDependencies } from './common/dependencyRegistration';
import { logger } from './common/logger';
import { recordRouterFactory, RECORD_ROUTER_SYMBOL } from './records/routes/recordRouter';
import RecordModel from './records/models/Record';
import { ErrorHandler } from './common/errorHandler';

const dbConnectionUrl = process.env.DB_CONNECTION_URL;

export interface RegisterOptions {
  override?: InjectionObject<unknown>[];
  useChild?: boolean;
}

export const registerExternalValues = async (options?: RegisterOptions): Promise<DependencyContainer> => {
  if (!dbConnectionUrl) {
    throw new AppError("No db connection url found", httpStatus.INTERNAL_SERVER_ERROR, false);
  }

  await mongooseLoader(dbConnectionUrl);

  const dependencies: InjectionObject<unknown>[] = [
    { token: SERVICES.CONFIG, provider: { useValue: config } },
    { token: SERVICES.LOGGER, provider: { useValue: logger } },
    { token: SERVICES.ERROR_HANDLER, provider: { useClass: ErrorHandler } },
    { token: RECORD_ROUTER_SYMBOL, provider: { useFactory: recordRouterFactory } },
    { token: SERVICES.RECORD_MODEL, provider: { useValue: RecordModel } },
  ];

  return registerDependencies(dependencies, options?.override, options?.useChild);
};
