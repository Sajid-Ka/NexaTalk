import {z} from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    PORT : z.string().default("5000"),
    MONGO_URI : z.string().min(1,"MONGO_URI is required"),
    JWT_SECRET : z.string().min(1, "JWT_SECRET is required"),
});

export const env = envSchema.parse(process.env);