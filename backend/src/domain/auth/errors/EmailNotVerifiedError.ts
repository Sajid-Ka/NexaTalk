export class EmailNotVerifiedError extends Error {
    constructor() {
        super("Email is not verified");
        this.name = "EmailNotVerifiedError";
    }
}