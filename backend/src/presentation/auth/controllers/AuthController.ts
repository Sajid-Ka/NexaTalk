import { Response } from "express";
import { successResponse, errorResponse } from "../../../shared/response/responseFormatter";
import { LoginUserRequest } from "../../../application/auth/dtos/requests/LoginUserRequest";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { ILogger } from "../../../domain/common/services/ILogger";
import { ILoginUserUsecase } from "../../../application/auth/interfaces/ILoginUserUsecase";
import { IRegisterUserUsecase } from "../../../application/auth/interfaces/IRegisterUserUsecase";
import { IRefreshSessionUsecase } from "../../../application/auth/interfaces/IRefreshSessionUsecase";
import { IRequestPasswordResetUsecase } from "../../../application/auth/interfaces/IRequestPasswordResetUsecase";
import { IResetPasswordUsecase } from "../../../application/auth/interfaces/IResetPasswordUsecase";
import { IVerifyEmailUsecase } from "../../../application/auth/interfaces/IVerifyEmailUsecase";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError";
import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { CookieOptions } from "express";

const REFRESH_COOKIE_NAME = "refreshTokenV2";

@injectable()
export class AuthController {
  constructor(
    @inject(AUTH_TYPES.RegisterUser) private readonly _registerUser: IRegisterUserUsecase,
    @inject(AUTH_TYPES.LoginUser) private readonly _loginUser: ILoginUserUsecase,
    @inject(AUTH_TYPES.RefreshSession) private readonly _refreshSession: IRefreshSessionUsecase,
    @inject(AUTH_TYPES.VerifyEmail) private readonly _verifyEmailUsecase: IVerifyEmailUsecase,
    @inject(AUTH_TYPES.RequestPasswordReset) private readonly _requestPasswordReset: IRequestPasswordResetUsecase,
    @inject(AUTH_TYPES.ResetPassword) private readonly _resetPassword: IResetPasswordUsecase,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
    @inject(AUTH_TYPES.RefreshCookieOptions) private readonly _cookieOptions: CookieOptions
  ) {}

  signup = async (req: AuthenticatedRequest, res: Response) => {
    const result = await this._registerUser.execute(req.body);
    return res.status(201).json(successResponse(result, "User registered successfully"));
  };

  verifyEmail = async (req: AuthenticatedRequest, res: Response) => {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json(errorResponse("TOKEN_MISSING", "Token missing"));
    }

    await this._verifyEmailUsecase.execute(token);

    return res.status(200).json(successResponse(null, "Email verified successfully"));
  };

  login = async (req: AuthenticatedRequest, res: Response) => {
    const dto: LoginUserRequest = req.body;

    this._logger.info("Login attempt", { email: dto.email });

    const result = await this._loginUser.execute(
      dto,
      req.ip ?? "unknown",
      req.headers["user-agent"] || "unknown"
    );

    this._logger.info("Login success", { userId: result.user.id });

    res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, this._cookieOptions);

    return res.status(200).json(
      successResponse(
        {
          accessToken: result.accessToken,
          user: result.user,
        },
        "Login successful"
      )
    );
  };

  refresh = async (req: AuthenticatedRequest, res: Response) => {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if (!refreshToken) {
      throw new UnauthorizedError("refresh token missing");
    }

    const result = await this._refreshSession.execute(refreshToken);

    res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, this._cookieOptions);

    return res.status(200).json(
      successResponse(
        {
          accessToken: result.accessToken,
          user: result.user,
        },
        "Token refreshed"
      )
    );
  };

  requestPasswordReset = async (req: AuthenticatedRequest, res: Response) => {
    const { email } = req.body;

    await this._requestPasswordReset.execute(email);

    return res.status(200).json(
      successResponse(null, "If the email exists, reset link has been sent")
    );
  };

  resetPassword = async (req: AuthenticatedRequest, res: Response) => {
    const { token, newPassword } = req.body;

    await this._resetPassword.execute(token, newPassword);

    return res.status(200).json(
      successResponse(null, "Password reset successfully")
    );
  };
}