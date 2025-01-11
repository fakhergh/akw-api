import { StatusCodes } from 'http-status-codes';
import { HttpError } from 'routing-controllers';

export class ConflictError extends HttpError {
    constructor(message: string) {
        super(StatusCodes.CONFLICT, message);
    }
}

export class UnprocessableEntityError extends HttpError {
    constructor(message: string) {
        super(StatusCodes.UNPROCESSABLE_ENTITY, message);
    }
}
