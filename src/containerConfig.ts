import config from 'config';
import { DependencyContainer } from 'tsyringe/dist/typings/types';
import { SERVICES } from './common/constants';
import { initializeConnection } from './common/db';
import { InjectionObject, registerDependencies } from './common/dependencyRegistration';
import { productRouterFactory, PRODUCT_ROUTER_SYMBOL } from './products/routes/productRouter';
import { ProductFilterService } from './products/services/productFilterService';

export interface RegisterOptions {
  override?: InjectionObject<unknown>[];
  useChild?: boolean;
}

export const registerExternalValues = async (options?: RegisterOptions): Promise<DependencyContainer> => {
  const appDataSource = await initializeConnection();

  const dependencies: InjectionObject<unknown>[] = [
    { token: SERVICES.CONFIG, provider: { useValue: config } },
    { token: SERVICES.APP_DATA_SOURCE, provider: { useValue: appDataSource } },
    { token: SERVICES.PRODUCT_FILTER_SERVICE, provider: { useClass: ProductFilterService } },
    { token: PRODUCT_ROUTER_SYMBOL, provider: { useFactory: productRouterFactory } },
  ];

  return registerDependencies(dependencies, options?.override, options?.useChild);
};
