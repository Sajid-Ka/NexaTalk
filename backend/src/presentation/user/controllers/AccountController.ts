import { inject, injectable } from "inversify";
import { Response } from "express";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { USER_TYPES } from "../../../main/di/modules/user/user.types";
import { IChangePasswordUsecase } from "../../../application/user/interfaces/IChangePasswordUsecase";
import { IChangeEmailUsecase } from "../../../application/user/interfaces/IChangeEmailUsecase";
import { IDeleteAccountUsecase } from "../../../application/user/interfaces/IDeleteAccountUsecase";
import { ChangePasswordRequest } from "../../../application/user/dtos/requests/ChangePasswordRequest";
import { ChangeEmailRequest } from "../../../application/user/dtos/requests/ChangeEmailRequest";

@injectable()
export class AccountController {
  constructor(
    @inject(USER_TYPES.ChangePassword) private readonly _changePassword: IChangePasswordUsecase,
    @inject(USER_TYPES.ChangeEmail) private readonly _changeEmail: IChangeEmailUsecase,
    @inject(USER_TYPES.DeleteAccount) private readonly _deleteAccount: IDeleteAccountUsecase,
  ) {}

  changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const dto: ChangePasswordRequest = req.body;
    await this._changePassword.execute(userId, dto);
    res.status(200).json({ success: true, message: "Password updated successfully" });
  };

  changeEmail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const dto: ChangeEmailRequest = req.body;
    await this._changeEmail.execute(userId, dto);
    res.status(200).json({ success: true, message: "Email updated successfully" });
  };

  deleteAccount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    await this._deleteAccount.execute(userId);
    res.status(200).json({ success: true, message: "Account deleted successfully" });
  };
}
