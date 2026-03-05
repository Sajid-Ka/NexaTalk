import { Response } from "express";
import { IRegisterUserUsecase } from "../../../application/auth/interfaces/IRegisterUserUsecase";
import { successResponse } from "../../../shared/response/responseFormatter";
import { LoginUserRequest } from "../../../application/auth/dtos/requests/LoginUserRequest";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { logger } from "../../../infrastructure/common/logger/WinstonLogger";
import { ILoginUserUsecase } from "../../../application/auth/interfaces/ILoginUserUsecase";
import { IRefreshSessionUsecase } from "../../../application/auth/interfaces/IRefreshSessionUsecase";
import { env } from "../../../shared/config/env";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError";
import { IVerifyEmailUsecase } from "../../../application/auth/interfaces/IVerifyEmailUsecase";
import { IRequestPasswordResetUsecase } from "../../../application/auth/interfaces/IRequestPasswordResetUsecase";
import { IResetPasswordUsecase } from "../../../application/auth/interfaces/IResetPasswordUsecase";
import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";

const REFRESH_COOKIE_NAME = "refreshToken";

const REFRESH_COOKIE_OPTION = {
  httpOnly : true,
  secure : env.NODE_ENV === "production",
  sameSite : "strict" as const,
  path : "/api/auth/refresh",
  maxAge : 7 * 24 * 60 * 60 * 1000,
}

@injectable()
export class AuthController {
  constructor(
    @inject(AUTH_TYPES.RegisterUser) private readonly _registerUser: IRegisterUserUsecase,
    @inject(AUTH_TYPES.LoginUser) private readonly _loginUser: ILoginUserUsecase,
    @inject(AUTH_TYPES.RefreshSession) private readonly _refreshSession: IRefreshSessionUsecase,
    @inject(AUTH_TYPES.VerifyEmail) private readonly _verifyEmailUsecase : IVerifyEmailUsecase,
    @inject(AUTH_TYPES.RequestPasswordReset) private readonly _requestPasswordReset: IRequestPasswordResetUsecase,
    @inject(AUTH_TYPES.ResetPassword) private readonly _resetPassword: IResetPasswordUsecase,
  ) {}

  signup = async (req: AuthenticatedRequest, res: Response) => {
    const result = await this._registerUser.execute(req.body);
    return res.status(201).json(successResponse(result, "User registered successfully"));
  };

  verifyEmail = async (req : AuthenticatedRequest, res : Response) => {
    const { token } = req.body;
    if(!token) {
      return res.status(400).json({
        success : false,
        message : "Token missing",
      })
    }

    await this._verifyEmailUsecase.execute(token);

    return res.status(200).json({
      success : true,
      message : "Email verified successfully",
    })
  }

  login = async (req: AuthenticatedRequest, res: Response) => {
    const dto: LoginUserRequest = req.body;

    logger.info("Login attempt", { email: dto.email });

    const result = await this._loginUser.execute(
      dto,
      req.ip ?? "unknown",
      req.headers["user-agent"] || "unknown"
    );

    logger.info("Login success", { userId: result.user.id });

    res.cookie(REFRESH_COOKIE_NAME, result.refreshToken,REFRESH_COOKIE_OPTION);

    return res.status(200).json(
      successResponse(
        {
          accessToken : result.accessToken,
          user : result.user,
        },
        "Login successful"));
  };

  refresh = async (req: AuthenticatedRequest, res: Response) => {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if(!refreshToken) throw new UnauthorizedError("refresh token missing");

    const result = await this._refreshSession.execute(refreshToken);

    res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, REFRESH_COOKIE_OPTION);

    return res.status(200).json(
      successResponse(
        {
          accessToken : result.accessToken,
        }, 
        "Token refreshed"
      )
    );
  };

  requestPasswordReset = async (req : AuthenticatedRequest, res : Response) => {
    const {email} = req.body;

    await this._requestPasswordReset.execute(email);

    return res.status(200).json({
      success : true,
      message : "If the email exists, reset link has been sent",
    });
  }

  resetPassword = async (req : AuthenticatedRequest, res : Response) => {
    const {token, newPassword} = req.body;

    await this._resetPassword.execute(token,newPassword);

    return res.status(200).json({
      success : true,
      message: "Password reset successfully",
    })
  }
}