import * as express from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'after' })
export class NotFoundErrorMiddleware implements ExpressMiddlewareInterface {
    use(request: express.Request, response: express.Response, next: express.NextFunction): void {
        if (response.headersSent || request.originalUrl.startsWith('/docs')) {
            return next();
        }

        const error = new Error(`${request.originalUrl} not found`);
        response.status(404);
        next(error);
    }
}
