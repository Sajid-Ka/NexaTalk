import { inject, injectable } from "inversify";
import { Response } from "express";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { USER_TYPES } from "../../../main/di/modules/user/user.types";
import { IChangePasswordUsecase } from "../../../application/user/interfaces/IChangePasswordUsecase";
import { IDeleteAccountUsecase } from "../../../application/user/interfaces/IDeleteAccountUsecase";
import { ChangePasswordRequest } from "../../../application/user/dtos/requests/ChangePasswordRequest";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { IRequestEmailChangeUsecase } from "../../../application/auth/interfaces/IRequestEmailChangeUsecase";
import { RequestEmailChangeDto } from "../../../application/auth/dtos/requests/RequestEmailChange";

@injectable()
export class AccountController {
  constructor(
    @inject(USER_TYPES.ChangePassword) private readonly _changePassword: IChangePasswordUsecase,
    @inject(USER_TYPES.DeleteAccount) private readonly _deleteAccount: IDeleteAccountUsecase,
    @inject(AUTH_TYPES.RequestEmailChange)
    private readonly _requestEmailChange: IRequestEmailChangeUsecase,
  ) {}

  changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const dto: ChangePasswordRequest = req.body;
    await this._changePassword.execute(userId, dto);
    res.status(200).json({ success: true, message: "Password updated successfully" });
  };

  deleteAccount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    await this._deleteAccount.execute(userId);
    res.status(200).json({ success: true, message: "Account deleted successfully" });
  };

  requestEmailChange = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const dto: RequestEmailChangeDto = req.body;
    await this._requestEmailChange.execute(userId, dto);
    res.status(200).json({
      success: true,
      message: "Verification email sent to your new address",
    });
  };
}
