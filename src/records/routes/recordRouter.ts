import { Router } from 'express';
import { DependencyContainer, FactoryFunction } from 'tsyringe';
import { RecordController } from '../controllers/recordController';

const recordRouterFactory: FactoryFunction<Router> = (dependencyContainer: DependencyContainer) => {
  const router: Router = Router();
  const controller = dependencyContainer.resolve(RecordController);

  router.post('/', controller.createRecord);
  router.get('/filter', controller.searchRecords);
  router.get('/balance/:propertyId', controller.getPropertyBalance);
  router.get('/report', controller.getMonthlyReport);

  return router;
};

export const RECORD_ROUTER_SYMBOL = Symbol('recordRouterFactory');
export { recordRouterFactory };
