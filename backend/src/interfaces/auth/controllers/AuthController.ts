import { Response } from "express";
import { RegisterUser } from "../../../application/auth/usecases/RegisterUser";
import { LoginUser } from "../../../application/auth/usecases/LoginUser";
import { RefreshSession } from "../../../application/auth/usecases/RefreshSession";
import { LogoutUser } from "../../../application/auth/usecases/LogoutUser";
import { successResponse } from "../../../shared/response/responseFormatter";
import { logger } from "../../../shared/logger/logger";
import { LoginUserRequest } from "../../../application/auth/dtos/requests/LoginUserRequest";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";

export class AuthController {
  constructor(
    private registerUser: RegisterUser,
    private loginUser: LoginUser,
    private refreshSession: RefreshSession,
    private logoutUser: LogoutUser,
  ) {}

  signup = async (req: AuthenticatedRequest, res: Response) => {
    logger.info("Signup request recieved", {
      requestId: req.requestId,
      email: req.body.email,
    });

    const result = await this.registerUser.execute(req.body);

    logger.info("User registered", {
      requestId: req.requestId,
      userId: result.id,
    });

    return res.status(201).json(successResponse(result, "User registered successfully"));
  };

  login = async (req: AuthenticatedRequest, res: Response) => {
    const dto: LoginUserRequest = req.body;
    logger.info("Login attempt", {
      requestId: req.requestId,
      email: dto.email,
    });

    const result = await this.loginUser.execute(
      dto,
      req.ip ?? "unknown",
      req.headers["user-agent"] || "unknown",
    );

    logger.info("Login successful", {
      requestId: req.requestId,
      userId: result.user.id,
    });

    return res.status(200).json(successResponse(result, "Login successful"));
  };

  refresh = async (req: AuthenticatedRequest, res: Response) => {
    logger.info("Token refresh attempt", {
      requestId: req.requestId,
    });

    const result = await this.refreshSession.execute(req.body.refreshToken);

    return res.status(200).json(successResponse(result, "Token refreshed"));
  };

  logout = async (req: AuthenticatedRequest, res: Response) => {
    await this.logoutUser.execute(req.body.refreshToken);

    logger.info("User logged out", {
      requestId: req.requestId,
    });

    return res.status(200).json(successResponse(null, "Logged out successfully"));
  };
}
