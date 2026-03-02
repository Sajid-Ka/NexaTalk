import { Schema,model,Document } from "mongoose";

export interface IEmailVerificationTokenDocument extends Document {
    userId : string;
    tokenHash : string;
    expiresAt : Date;
    used : boolean;
    createdAt : Date;
}

const EmailVerificationTokenSchema = new Schema<IEmailVerificationTokenDocument> (
    {
        userId: { type: String, required: true },
        tokenHash: { type: String, required: true, unique: true },
        expiresAt: { type: Date, required: true },
        used: { type: Boolean, required : true, default: false },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

export const EmailVerificationTokenModel  = model<IEmailVerificationTokenDocument>(
    "EmailVerificationToken",
    EmailVerificationTokenSchema
);