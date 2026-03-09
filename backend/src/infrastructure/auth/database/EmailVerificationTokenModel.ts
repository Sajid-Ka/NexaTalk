import { Schema,model,Types } from "mongoose";

export interface IEmailVerificationTokenPersistence {
    _id : Types.ObjectId;
    userId : string;
    tokenHash : string;
    expiresAt : Date;
    used : boolean;
    createdAt : Date;
}

const EmailVerificationTokenSchema = new Schema<IEmailVerificationTokenPersistence> (
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

EmailVerificationTokenSchema.index({ expiresAt: 1 });

export const EmailVerificationTokenModel  = model<IEmailVerificationTokenPersistence>(
    "EmailVerificationToken",
    EmailVerificationTokenSchema
);