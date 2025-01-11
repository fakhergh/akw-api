import * as express from 'express';
import helmet from 'helmet';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class HelmetMiddleware implements ExpressMiddlewareInterface {
    async use(request: express.Request, response: express.Response, next: express.NextFunction) {
        helmet()(request, response, next);
    }
}
