import { Response } from "express";
import { RegisterUser } from "../../../application/auth/usecases/RegisterUser";
import { LoginUser } from "../../../application/auth/usecases/LoginUser";
import { RefreshSession } from "../../../application/auth/usecases/RefreshSession";
import { successResponse } from "../../../shared/response/responseFormatter";
import { LoginUserRequest } from "../../../application/auth/dtos/requests/LoginUserRequest";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { logger } from "../../../shared/logger/logger";

export class AuthController {
  constructor(
    private registerUser: RegisterUser,
    private loginUser: LoginUser,
    private refreshSession: RefreshSession
  ) {}

  signup = async (req: AuthenticatedRequest, res: Response) => {
    const result = await this.registerUser.execute(req.body);
    return res.status(201).json(successResponse(result, "User registered successfully"));
  };

  login = async (req: AuthenticatedRequest, res: Response) => {
    const dto: LoginUserRequest = req.body;

    logger.info("Login attempt", { email: dto.email });

    const result = await this.loginUser.execute(
      dto,
      req.ip ?? "unknown",
      req.headers["user-agent"] || "unknown"
    );

    logger.info("Login success", { userId: result.user.id });

    return res.status(200).json(successResponse(result, "Login successful"));
  };

  refresh = async (req: AuthenticatedRequest, res: Response) => {
    const result = await this.refreshSession.execute(req.body.refreshToken);
    return res.status(200).json(successResponse(result, "Token refreshed"));
  };
}