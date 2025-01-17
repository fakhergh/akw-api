const { defaultMetadataStorage } = require('class-transformer/cjs/storage');

import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { Request, Response } from 'express';
import { createExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';

import { authorizationChecker } from '@/authentication/authorization-checker';
import { currentUserChecker } from '@/authentication/current-user-checker';
import { AuthController } from '@/controllers/auth.controller';
import { HealthController } from '@/controllers/health.controller';
import { KycSubmissionController } from '@/controllers/kyc-submission.controller';
import { UserController } from '@/controllers/user.controller';
import { CompressionMiddleware } from '@/middlewares/compression.middleware';
import { GlobalErrorMiddleware } from '@/middlewares/global-error.middleware';
import { HelmetMiddleware } from '@/middlewares/helmet.middleware';
import { LoggerMiddleware } from '@/middlewares/logger.middleware';
import { NotFoundErrorMiddleware } from '@/middlewares/not-found.middleware';
import { ServeStaticMiddleware } from '@/middlewares/serve-static.middleware';

const controllers = [AuthController, UserController, KycSubmissionController, HealthController];
const middlewares = [
    LoggerMiddleware,
    HelmetMiddleware,
    CompressionMiddleware,
    ServeStaticMiddleware,
    NotFoundErrorMiddleware,
    GlobalErrorMiddleware,
];

const app = createExpressServer({
    authorizationChecker,
    currentUserChecker,
    controllers,
    middlewares,
    development: process.env.NODE_ENV === 'development',
    classTransformer: false,
    validation: {
        skipNullProperties: false,
        skipUndefinedProperties: false,
        skipMissingProperties: false,
    },
    cors: true,
    defaultErrorHandler: false,
});

const schemas: any = validationMetadatasToSchemas({
    classTransformerMetadataStorage: defaultMetadataStorage,
    refPointerPrefix: '#/components/schemas/',
});

const storage = getMetadataArgsStorage();

export const spec = routingControllersToSpec(
    storage,
    {},
    {
        info: { title: 'AKW Application API', version: '1.0.0' },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas,
        },
        security: [{ bearerAuth: [] }],
    },
);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
app.use('/docs.json', (_: Request, res: Response) => res.json(spec));

export { app };
