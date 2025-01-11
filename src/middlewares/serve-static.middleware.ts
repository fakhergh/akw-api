import express, { NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

import { Config } from '@/config';

@Middleware({ type: 'after' })
export class ServeStaticMiddleware implements ExpressMiddlewareInterface {
    async use(request: Request, response: Response, next: NextFunction) {
        if (request.url.startsWith(Config.upload.documents.endpoint)) {
            request.url = request.url.replace(Config.upload.documents.endpoint, '');
            express.static(Config.upload.documents.directory)(request, response, next);
        } else {
            next();
        }
    }
}
