import { Request, Response } from "express";
import { RegisterUser } from "../../../application/auth/usecases/RegisterUser";
import { LoginUser } from "../../../application/auth/usecases/LoginUser";
import { RefreshSession } from "../../../application/auth/usecases/RefreshSession";
import { LogoutUser } from "../../../application/auth/usecases/LogoutUser";
import { successResponse } from "../../../shared/response/responseFormatter";
import { logger } from "../../../shared/logger/logger";

export class AuthController {
  constructor(
    private registerUser: RegisterUser,
    private loginUser: LoginUser,
    private refreshSession: RefreshSession,
    private logoutUser: LogoutUser
  ) { }

  signup = async (req: Request, res: Response) => {
    logger.info("Signup request recieved", {
      requestId: (req as any).requestId,
      email: req.body.email,
    });

    const result = await this.registerUser.execute(req.body);

    logger.info("User registered", {
      requestId: (req as any).requestId,
      userId: result.id,
    });

    return res
      .status(201)
      .json(successResponse(result, "User registered successfully"));
  };

  login = async (req: Request, res: Response) => {
    const dto = req.body;
    logger.info("Login attempt", {
      requestId: (req as any).requestId,
      email: dto.email,
    });

    const result = await this.loginUser.execute(
      dto,
      req.ip ?? "unknown",
      req.headers["user-agent"] || "unknown"
    );

    logger.info("Login successful", {
      requestId: (req as any).requestId,
      userId: result.user.id,
    });

    return res.status(200).json(successResponse(result, "Login successful"));
  };

  refresh = async (req: Request, res: Response) => {
    logger.info("Token refresh attempt", {
      requestId: (req as any).requestId,
    });

    const result = await this.refreshSession.execute(req.body.refreshToken);

    return res.status(200).json(successResponse(result, "Token refreshed"));
  };

  logout = async (req: Request, res: Response) => {
    await this.logoutUser.execute(req.body.refreshToken);

    logger.info("User logged out", {
      requestId: (req as any).requestId,
    });

    return res.status(200).json(successResponse(null, "Logged out successfully"));
  };
}
