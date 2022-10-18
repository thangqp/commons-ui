export class UnauthorizedUserException extends Error {
    constructor(value, userName) {
        super(value);
        this.userName = userName;
        this.name = 'UnauthorizedUserException';
    }
}
