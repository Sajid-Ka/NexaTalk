import { Schema,model,Document } from "mongoose";

export interface IResetPasswordTokenDocument extends Document {
    userId : string;
    tokenHash : string;
    expiresAt : Date;
    used : boolean;
    createdAt : Date;
}

const ResetPasswordTokenSchema = new Schema<IResetPasswordTokenDocument>(
    {
        userId : {type : String, required : true},
        tokenHash : {type : String, required : true, unique : true},
        expiresAt : {type : Date, required : true},
        used : {type : Boolean, default : false},
    },
    {
        timestamps : {createdAt : true, updatedAt : false},
    }
);

export const ResetPasswordTokenModel = model<IResetPasswordTokenDocument>(
    "ResetPasswordToken",
    ResetPasswordTokenSchema
);