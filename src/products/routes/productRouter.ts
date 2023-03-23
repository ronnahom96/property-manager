import { Router } from 'express';
import { DependencyContainer, FactoryFunction } from 'tsyringe';
import { ProductController } from '../controllers/productController';

const productRouterFactory: FactoryFunction<Router> = (dependencyContainer: DependencyContainer) => {
  const router: Router = Router();
  const controller = dependencyContainer.resolve(ProductController);

  router.post('/filter', controller.searchProducts);
  router.post('/', controller.createProduct);
  router.put('/:id', controller.updateProduct);
  router.delete('/:id', controller.deleteProduct);

  return router;
};

export const PRODUCT_ROUTER_SYMBOL = Symbol('productRouterFactory');
export { productRouterFactory };
