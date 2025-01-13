import * as express from 'express';
import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from 'routing-controllers';

@Middleware({ type: 'after' })
export class GlobalErrorMiddleware implements ExpressErrorMiddlewareInterface {
    error(error: HttpError, _: express.Request, response: express.Response) {
        const statusCode =
            error.httpCode ?? (response.statusCode === 200 ? 500 : response.statusCode) ?? 500;
        response.status(statusCode).json({ status: statusCode, error: error.message });
    }
}
