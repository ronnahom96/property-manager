import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { NOT_FOUND } from '../../../../src/common/constants';
import { closeDBConnection, initializeConnection } from '../../../../src/common/db';
import { CompareFilter } from '../../../../src/filters/CompareFilter';
import { ConsumptionProtocol, Record, Type } from '../../../../src/records/models/Record';
import { ProductManager } from '../../../../src/records/models/productManager';
import { ProductFilterService } from '../../../../src/records/services/productFilterService';
import { ProductFilterList } from '../../../../src/records/types';

let productManager: ProductManager;

describe('#ProductManager', () => {
  beforeAll(async () => {
    const appDataSource: DataSource = await initializeConnection();
    productManager = new ProductManager(appDataSource, new ProductFilterService());
  });

  afterAll(async () => {
    await closeDBConnection()
  });

  describe('createProduct', () => {
    it('When create a new record, the method of creating should return the inserted record', async () => {
      // arrange
      const id: string = uuidv4();
      const productInput = new Record(id, "banana", "yellow fruit", { type: "Polygon", coordinates: [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]] }, "https://banana.link.me", Type.QMESH, ConsumptionProtocol.THREE_D_TILES, 1, 3, 10);

      // act
      const record = await productManager.createProduct(productInput);

      // expectation
      expect(record.id).toBe(id);
      expect(record.name).toBe(productInput.name);
      expect(record.description).toBe(productInput.description);
    });

    it('When create a new record, we should find him in the records table by search him by id', async () => {
      // arrange
      const id: string = uuidv4();

      const productInput = new Record(id, "banana", "yellow fruit", { type: "Polygon", coordinates: [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]] }, "https://banana.link.me", Type.QMESH, ConsumptionProtocol.THREE_D_TILES, 1, 3, 10);
      const productFilterList: ProductFilterList = [new CompareFilter("id", id)];

      // act
      await productManager.createProduct(productInput);
      const productList = await productManager.searchProducts(productFilterList);
      const dbProduct = productList[0];

      // expectation
      expect(dbProduct.id).toBe(id);
      expect(dbProduct.name).toBe(productInput.name);
      expect(dbProduct.description).toBe(productInput.description);
    });

    it('When fetch record with negative zoom levels values, it will return these values properly', async () => {
      // arrange
      const id: string = uuidv4();
      const productInput = new Record(id, "banana", "yellow fruit", { type: "Polygon", coordinates: [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]] }, "https://banana.link.me", Type.QMESH, ConsumptionProtocol.THREE_D_TILES, 1, 3, 10);
      const productFilterList: ProductFilterList = [new CompareFilter("id", id)];
      await productManager.createProduct(productInput);

      // act
      const productList = await productManager.searchProducts(productFilterList);
      const dbProduct = productList[0];

      // expectation
      expect(dbProduct.minZoomLevel).toBe(productInput.minZoomLevel);
      expect(dbProduct.maxZoomLevel).toBe(productInput.maxZoomLevel);
      expect(dbProduct.bestResolution).toBe(productInput.bestResolution);
    });

    it('When update record, we would be able to find it in the database with the new values', async () => {
      // arrange
      const id: string = uuidv4();
      const productInput = new Record(id, "banana", "yellow fruit", { type: "Polygon", coordinates: [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]] }, "https://banana.link.me", Type.QMESH, ConsumptionProtocol.THREE_D_TILES, 1, 3, 10);
      const productFilterList: ProductFilterList = [new CompareFilter("id", id)];
      await productManager.createProduct(productInput);

      // act
      await productManager.updateProduct(id, { name: "new name", maxZoomLevel: 100 });
      const productList = await productManager.searchProducts(productFilterList);
      const dbProduct = productList[0];

      // expectation
      expect(dbProduct.name).toBe("new name");
      expect(dbProduct.maxZoomLevel).toBe(100);
    });

    it('When delete record, we would not be able to find him in the database', async () => {
      // arrange
      const id: string = uuidv4();
      const productInput = new Record(id, "banana", "yellow fruit", { type: "Polygon", coordinates: [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]] }, "https://banana.link.me", Type.QMESH, ConsumptionProtocol.THREE_D_TILES, 1, 3, 10);
      const productFilterList: ProductFilterList = [new CompareFilter("id", id)];
      await productManager.createProduct(productInput);

      // act
      await productManager.deleteProduct(id);
      const productList = await productManager.searchProducts(productFilterList);

      // expectation
      expect(productList).toHaveLength(0);
    });

    it('When delete record which not exists, throw 404 "Not Found" error', async () => {
      // arrange
      const id = "This id not exists on the data base";

      // expectation + act
      return expect(productManager.deleteProduct(id)).rejects.toEqual(new Error(NOT_FOUND));
    });
  });
});
