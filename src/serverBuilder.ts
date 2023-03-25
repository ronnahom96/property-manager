import express, { Router } from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { inject, injectable } from 'tsyringe';
import YAML from 'yamljs';
import { SERVICES } from './common/constants';
import { IConfig } from './common/interfaces';
import { RECORD_ROUTER_SYMBOL } from './records/routes/recordRouter';
import { ErrorHandler } from './common/errorHandler';

@injectable()
export class ServerBuilder {
  private readonly serverInstance: express.Application;

  public constructor(
    @inject(SERVICES.CONFIG) private readonly config: IConfig,
    @inject(SERVICES.ERROR_HANDLER) private readonly errorHandler: ErrorHandler,
    @inject(RECORD_ROUTER_SYMBOL) private readonly recordRouter: Router,
  ) {
    this.serverInstance = express();
  }

  public build(): express.Application {
    this.registerPreRoutesMiddleware();
    this.buildRoutes();
    this.registerPostRoutesMiddleware();

    return this.serverInstance;
  }

  private buildDocsRoutes(): void {
    const swaggerDocument = YAML.load('./swagger.yaml');
    this.serverInstance.use(this.config.get<string>('openapiConfig.basePath'), swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  private buildRoutes(): void {
    this.serverInstance.use('/records', this.recordRouter);
    this.buildDocsRoutes();
  }

  private registerPreRoutesMiddleware(): void {
    this.serverInstance.use(bodyParser.json(this.config.get<bodyParser.Options>('server.request.payload')));
  }

  private registerPostRoutesMiddleware(): void {
    this.serverInstance.use(this.errorHandler.handleError.bind(this.errorHandler));
  }
}
