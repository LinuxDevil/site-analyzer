import { IError } from './IError';

export class BadRequestError extends IError {
    constructor(public data: any) {
        super('BadRequestError');
    }
}
