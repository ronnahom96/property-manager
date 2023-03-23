import httpStatusCodes from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';
import { getApp } from '../../../src/app';
import { ProductFilter } from '../../../src/filters/ProductFilter';
import { IProduct } from '../../../src/products/interfaces';
import { ConsumptionProtocol, Product, Type } from '../../../src/products/models/Product';
import { ProductFilterList } from '../../../src/products/types';
import { ProductRequestSender } from './helpers/requestSender';

describe('product', () => {
    let requestSender: ProductRequestSender;
    beforeEach(async () => {
        const app = await getApp({ useChild: true });
        requestSender = new ProductRequestSender(app);
    });

    describe('Happy Path', () => {
        it('should return 200 status code and the product', async () => {
            // act
            const response = await requestSender.searchProducts([]);
            const resourceList = response.body as Product[];

            // expectation
            expect(response.status).toBe(httpStatusCodes.OK);
            expect(resourceList.length).toBeDefined();
        });

        it('should return 201 status code and create the product', async () => {
            // arrange
            const id: string = uuidv4();
            const product: IProduct = {
                id,
                "name": "string",
                "description": "string",
                "boundingPolygon": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                10.0,
                                11.2
                            ],
                            [
                                10.5,
                                11.9
                            ],
                            [
                                10.8,
                                12.0
                            ],
                            [
                                10.0,
                                11.2
                            ]
                        ]
                    ]
                },
                "consumptionLink": "string",
                "type": Type.RASTER,
                "consumptionProtocol": ConsumptionProtocol.WMS,
                "bestResolution": 0,
                "minZoomLevel": 0,
                "maxZoomLevel": 0
            }

            // act
            const response = await requestSender.createProduct(product);
            const resource = response.body as Product;

            // expectation
            expect(response.status).toBe(httpStatusCodes.CREATED);
            expect(resource.id).toBeDefined();
        });

        it('should return 204 status code and delete the product', async () => {
            // arrange
            const product: Partial<IProduct> = {
                "name": "string",
                "description": "string",
                "boundingPolygon": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                10.0,
                                11.2
                            ],
                            [
                                10.5,
                                11.9
                            ],
                            [
                                10.8,
                                12.0
                            ],
                            [
                                10.0,
                                11.2
                            ]
                        ]
                    ]
                },
                "consumptionLink": "string",
                "type": Type.RASTER,
                "consumptionProtocol": ConsumptionProtocol.WMS,
                "bestResolution": 0,
                "minZoomLevel": 0,
                "maxZoomLevel": 0
            }
            const createResponse = await requestSender.createProduct(product);
            const createdProduct = createResponse.body as Product;

            // act
            const response = await requestSender.deleteProduct(createdProduct.id);

            // expectation
            expect(response.status).toBe(httpStatusCodes.NO_CONTENT);
        });

        it('should return 200 status code and update the product', async () => {
            // arrange
            const product: Partial<IProduct> = {
                "name": "string",
                "description": "string",
                "boundingPolygon": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                10.0,
                                11.2
                            ],
                            [
                                10.5,
                                11.9
                            ],
                            [
                                10.8,
                                12.0
                            ],
                            [
                                10.0,
                                11.2
                            ]
                        ]
                    ]
                },
                "consumptionLink": "string",
                "type": Type.RASTER,
                "consumptionProtocol": ConsumptionProtocol.WMS,
                "bestResolution": 0,
                "minZoomLevel": 0,
                "maxZoomLevel": 0
            }
            const createResponse = await requestSender.createProduct(product);
            const createdProduct = createResponse.body as Product;
            const updateData: Partial<IProduct> = { name: "new name", maxZoomLevel: 100 };

            // act
            const response = await requestSender.updateProduct(createdProduct.id, updateData);
            const updatedProduct = response.body as Product;

            // expectation
            expect(response.status).toBe(httpStatusCodes.OK);
            expect(updatedProduct.id).toBeDefined();
        });
    });

    describe('Bad Path', () => {
        it('when trying to filter with operator which not exists, should return 400 status code', async () => {
            // arrange
            const filters: Partial<ProductFilter>[] = [{
                "operator": "operator that noe exists",
                "field": "bestResolution",
                "value": 0
            }]

            // act
            const response = await requestSender.searchProducts(filters);

            // expectation
            expect(response.status).toBe(httpStatusCodes.BAD_REQUEST);
        });
    });

    describe('Sad Path', () => {
        it('when trying to delete id which not exists, should return 404 status code', async () => {
            // arrange
            const id = 'id which not exists';

            // act
            const response = await requestSender.deleteProduct(id);

            // expectation
            expect(response.status).toBe(httpStatusCodes.NOT_FOUND);
        });

        it('when trying to update id which not exists, should return 404 status code', async () => {
            // arrange
            const id = 'id which not exists';

            // act
            const response = await requestSender.updateProduct(id, {});

            // expectation
            expect(response.status).toBe(httpStatusCodes.NOT_FOUND);
        });
    });
});
