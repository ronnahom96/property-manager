import httpStatus from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';
import { AppError } from '../../common/appError';
import { NOT_FOUND, SERVICES } from '../../common/constants';
import { ProductFilter } from '../../filters/ProductFilter';
import { IProduct } from '../interfaces';
import { ProductFilterService } from '../services/productFilterService';
import { ProductFilterList, ProductQueryBuilder } from '../types';
import { Product } from './Product';

@injectable()
export class ProductManager {
  private readonly productRepository: Repository<Product>;

  public constructor(@inject(SERVICES.APP_DATA_SOURCE) private readonly appDataSource: DataSource,
    @inject(ProductFilterService) private readonly productFilterService: ProductFilterService) {
    this.productRepository = this.appDataSource.getRepository(Product);
  }

  public async createProduct(entity: Product): Promise<Product> {
    const product = await this.productRepository.save(entity);
    console.log(`Added a product with the name ${product.name}`);

    return product;
  }

  public async deleteProduct(id: string): Promise<void> {
    await this.findProductOrThrowError(id);
    await this.productRepository.delete(id);
    console.log(`A product with the id ${id} has been deleted`);
  }

  public async updateProduct(id: string, dataForUpdate: Partial<IProduct>): Promise<Product> {
    const originalProduct: Product = await this.findProductOrThrowError(id);
    const mergeProduct = { ...originalProduct, ...dataForUpdate };
    const resultProduct = await this.productRepository.save(mergeProduct);
    console.log(`Update a product with the id ${id}`);

    return resultProduct;
  }

  public async searchProducts(filterList: ProductFilterList): Promise<Product[]> {
    let queryBuilder: ProductQueryBuilder = this.productRepository.createQueryBuilder("product");

    for (const filter of filterList) {
      const castedFilter: ProductFilter = this.productFilterService.castFilter(filter);
      queryBuilder = castedFilter.appendFilterForQuery(queryBuilder);
    }

    const productList: Product[] = await queryBuilder.getMany();
    return productList;
  }

  private async findProductOrThrowError(id: string): Promise<Product> {
    const product: Product | null = await this.productRepository.findOneBy({ id });

    if (product === null) {
      throw new AppError(NOT_FOUND, httpStatus.NOT_FOUND, true);
    };

    return product;
  }
}
