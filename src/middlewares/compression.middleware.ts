import compression from 'compression';
import * as express from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class CompressionMiddleware implements ExpressMiddlewareInterface {
    async use(request: express.Request, response: express.Response, next: express.NextFunction) {
        compression()(request, response, next);
    }
}
