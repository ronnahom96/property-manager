import path from 'path';
import jestOpenApi from 'jest-openapi';

jestOpenApi(path.join(process.cwd(), 'swagger.yaml'));
