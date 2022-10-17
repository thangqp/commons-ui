export class Exception extends Error {
    constructor(value) {
        super(value);
        this.name = 'UnauthorizedException';
    }
}
