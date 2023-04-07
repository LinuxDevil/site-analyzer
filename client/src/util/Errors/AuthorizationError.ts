import { IError } from './IError';

export class AuthorizationError extends IError {
    constructor() {
        super('AuthorizationError');
    }
}
