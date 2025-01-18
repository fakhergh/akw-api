import * as express from 'express';
import morgan from 'morgan';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class LoggerMiddleware implements ExpressMiddlewareInterface {
    async use(request: express.Request, response: express.Response, next: express.NextFunction) {
        if (process.env.NODE_ENV === 'test') return next();
        morgan('dev')(request, response, next);
    }
}
