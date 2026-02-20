import jwt from "jsonwebtoken";
import { env } from "../../../shared/config/env";
import { ITokenService } from "../../../domain/auth/interfaces/ITokenService";

export class JwtTokenService implements ITokenService {
    generateAccessToken(userId: string): string {
        return jwt.sign({userId}, env.JWT_SECRET, {expiresIn: "15m"})
    }

    generateRefreshToken(userId: string): string {
        return jwt.sign({userId}, env.JWT_SECRET, {expiresIn : "7d"});
    }
}