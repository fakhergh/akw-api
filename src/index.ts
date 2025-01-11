import 'reflect-metadata';
import 'dotenv/config';
import 'mongoose-paginate-v2';
const { defaultMetadataStorage } = require('class-transformer/cjs/storage');

import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { Request, Response } from 'express';
import * as path from 'path';
import { createExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';

import { authorizationChecker } from '@/authentication/authorization-checker';
import { currentUserChecker } from '@/authentication/current-user-checker';
import { Config } from '@/config';
import { connectDatabase } from '@/database';

const port = Config.app.port;

const server = createExpressServer({
    authorizationChecker,
    currentUserChecker,
    controllers: [path.join(__dirname + '/controllers/*.ts')],
    middlewares: [path.join(__dirname + '/middlewares/*.ts')],
    development: process.env.NODE_ENV === 'development',
    classTransformer: true,
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

server.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
server.use('/docs.json', (_: Request, res: Response) => res.json(spec));

server.listen(port, async () => {
    console.log('Server is running at port: http://localhost:%s', port);
    await connectDatabase();
    console.log('Connected to database');
});

server.on('error', console.error);
