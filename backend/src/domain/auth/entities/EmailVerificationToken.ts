export interface EmailVerificationTokenProps {
    id?: string;
    userId : string;
    tokenHash : string;
    expiresAt : Date;
    used?: boolean;
    createdAt?: Date;
}

export class EmailVerificationToken {
    public readonly id?: string;
    public readonly userId : string;
    public readonly tokenHash : string;
    public readonly expiresAt : Date;
    public readonly used : boolean;
    public readonly createdAt : Date;

    constructor(props : EmailVerificationTokenProps) {
        this.id = props.id;
        this.userId = props.userId;
        this.tokenHash = props.tokenHash;
        this.expiresAt = props.expiresAt;
        this.used = props.used ?? false;
        this.createdAt = props.createdAt ?? new Date();
    }

    isExpired() : boolean {
        return this.expiresAt.getTime() <= Date.now();
    }
}