import { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import httpStatus from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { Product } from '../models/Product';
import { IProduct, ProductParams } from '../interfaces';
import { ProductManager } from '../models/productManager';
import { ProductFilterList } from '../types';

type CreateResourceHandler = RequestHandler<undefined, Product, IProduct>;
type GetResourceHandler = RequestHandler<undefined, Product[], ProductFilterList>;
type UpdateResourceHandler = RequestHandler<ProductParams, Product, Partial<IProduct>>;
type DeleteResourceHandler = RequestHandler<ProductParams>;

@injectable()
export class ProductController {
  public constructor(@inject(ProductManager) private readonly manager: ProductManager) { }

  public searchProducts: GetResourceHandler = async (req, res, next) => {
    try {
      const filters: ProductFilterList = req.body;
      const productList: Product[] = await this.manager.searchProducts(filters);
      return res.status(httpStatus.OK).json(productList);
    } catch (error) {
      return next(error)
    }
  };

  public createProduct: CreateResourceHandler = async (req, res, next) => {
    try {
      const id: string = uuidv4();
      const entity: Product = this.metadataToEntity(id, req.body);
      const product = await this.manager.createProduct(entity);
      return res.status(httpStatus.CREATED).json(product);
    } catch (error) {
      return next(error);
    }
  };

  public updateProduct: UpdateResourceHandler = async (req, res, next) => {
    try {
      const id: string = req.params.id;
      const dataForUpdate: Partial<IProduct> = req.body;
      const productAfterUpdate: Product = await this.manager.updateProduct(id, dataForUpdate);
      return res.status(httpStatus.OK).json(productAfterUpdate);
    } catch (error) {
      return next(error);
    }
  };

  public deleteProduct: DeleteResourceHandler = async (req, res, next) => {
    try {
      const id: string = req.params.id;
      await this.manager.deleteProduct(id);
      return res.status(httpStatus.NO_CONTENT).json(null);
    } catch (error) {
      return next(error);
    }
  };

  private metadataToEntity(id: string, { name, description, boundingPolygon, consumptionLink, type, consumptionProtocol,
    bestResolution, maxZoomLevel, minZoomLevel }: IProduct): Product {
    return new Product(id, name as string, description, boundingPolygon, consumptionLink, type, consumptionProtocol,
      bestResolution, minZoomLevel, maxZoomLevel);
  }
}
