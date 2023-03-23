/* eslint-disable @typescript-eslint/no-magic-numbers */
import * as supertest from 'supertest';
import { ProductFilter } from '../../../../src/filters/ProductFilter';
import { IProduct } from '../../../../src/products/interfaces';

export class ProductRequestSender {
  public constructor(private readonly app: Express.Application) { }

  public async searchProducts(filters: Partial<ProductFilter>[]): Promise<supertest.Response> {
    return supertest.agent(this.app).post('/products/filter').send(filters).set('Content-Type', 'application/json');
  }

  public async createProduct(product: Partial<IProduct>): Promise<supertest.Response> {
    return supertest.agent(this.app).post('/products').send(product).set('Content-Type', 'application/json');
  }

  public async deleteProduct(id: string): Promise<supertest.Response> {
    return supertest.agent(this.app).delete(`/products/${id}`).set('Content-Type', 'application/json');
  }

  public async updateProduct(id: string, updateData: Partial<IProduct>): Promise<supertest.Response> {
    return supertest.agent(this.app).put(`/products/${id}`).send(updateData).set('Content-Type', 'application/json');
  }
}
