import 'reflect-metadata';
import 'dotenv/config';
const { defaultMetadataStorage } = require('class-transformer/cjs/storage');

import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import * as express from 'express';
import * as path from 'path';
import { createExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';

import { Config } from '@/config';
import { connectDatabase } from '@/database';

const port = Config.app.port;

const server = createExpressServer({
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
        info: { title: 'Next Application API', version: '1.0.0' },
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
server.use('/docs.json', (_: express.Request, res: express.Response) => res.json(spec));

server.listen(port, async () => {
    console.log('Server is running at port: http://localhost:%s', port);
    await connectDatabase();
    console.log('Connected to database');
});

server.on('error', console.error);
