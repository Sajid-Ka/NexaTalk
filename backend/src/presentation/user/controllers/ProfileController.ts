import { Response } from "express";
import { injectable, inject } from "inversify";
import { USER_TYPES } from "../../../main/di/modules/user/user.types";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { successResponse } from "../../../shared/response/responseFormatter";
import { IGetProfileUsecase } from "../../../application/user/interfaces/IGetProfileUsecase";
import { IUpdateProfileUsecase } from "../../../application/user/interfaces/IUpdateProfileUsecase";
import { UpdateProfileRequest } from "../../../application/user/dtos/requests/UpdateProfileRequest";

@injectable()
export class ProfileController {
  constructor(
    @inject(USER_TYPES.GetProfile) private readonly _getProfile: IGetProfileUsecase,
    @inject(USER_TYPES.UpdateProfile) private readonly _updateProfile: IUpdateProfileUsecase,
  ) {}

  getMyProfile = async (req: AuthenticatedRequest, res: Response) => {
    const profile = await this._getProfile.execute(req.user!.userId, req.user!.userId);
    res.json(successResponse(profile, "Profile fetched successfully"));
  };

  getProfileById = async (req: AuthenticatedRequest, res: Response) => {
    const profile = await this._getProfile.execute(req.params.userId, req.user?.userId);
    res.json(successResponse(profile, "Profile fetched successfully"));
  };

  updateProfile = async (req: AuthenticatedRequest, res: Response) => {
    const request: UpdateProfileRequest = {
      avatar: req.body.avatar,
      bio: req.body.bio,
      isProfilePublic: req.body.isProfilePublic,
    };

    const profile = await this._updateProfile.execute(req.user!.userId, request);
    res.json(successResponse(profile, "Profile updated successfully"));
  };
}
