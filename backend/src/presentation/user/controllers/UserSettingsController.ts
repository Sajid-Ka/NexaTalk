import { Response } from "express";
import { injectable, inject } from "inversify";
import { USER_TYPES } from "../../../main/di/modules/user/user.types";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { successResponse } from "../../../shared/response/responseFormatter";
import { IGetUserSettingsUsecase } from "../../../application/user/interfaces/IGetUserSettingsUsecase";
import { IUpdateUserSettingsUsecase } from "../../../application/user/interfaces/IUpdateUserSettingsUsecase";
import { UpdateUserSettingsRequest } from "../../../application/user/dtos/requests/UpdateUserSettingsRequest";

@injectable()
export class UserSettingsController {
  constructor(
    @inject(USER_TYPES.GetUserSettings) private readonly _getUserSettings: IGetUserSettingsUsecase,
    @inject(USER_TYPES.UpdateUserSettings)
    private readonly _updateUserSettings: IUpdateUserSettingsUsecase,
  ) {}

  getSettings = async (req: AuthenticatedRequest, res: Response) => {
    const settings = await this._getUserSettings.execute(req.user!.userId);
    res.json(successResponse(settings, "Settings fetched successfully"));
  };

  updateSettings = async (req: AuthenticatedRequest, res: Response) => {
    const request: UpdateUserSettingsRequest = {
      showRecommendations: req.body.showRecommendations,
      allowFriendRecommendations: req.body.allowFriendRecommendations,
      allowServerRecommendations: req.body.allowServerRecommendations,
    };

    const settings = await this._updateUserSettings.execute(req.user!.userId, request);
    res.json(successResponse(settings, "Settings updated successfully"));
  };
}
