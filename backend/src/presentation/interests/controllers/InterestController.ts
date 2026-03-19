import { Response } from "express";
import { injectable, inject } from "inversify";
import { INTERESTS_TYPES } from "../../../main/di/modules/interests/interests.types";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { successResponse } from "../../../shared/response/responseFormatter";
import { IAddUserInterestsUseCase } from "../../../application/interests/interfaces/IAddUserInterestsUsecase";
import { IGetUserInterestsUseCase } from "../../../application/interests/interfaces/IGetUserInterestsUsecase";
import { IRemoveUserInterestsUseCase } from "../../../application/interests/interfaces/IRemoveUserInterestsUsecase";
import { ISearchInterestsUseCase } from "../../../application/interests/interfaces/ISearchInterestsUsecase";
import { IGetPopularInterestsUseCase } from "../../../application/interests/interfaces/IGetPopularInterestsUsecase";
import { AddUserInterestsRequest } from "../../../application/interests/dtos/requests/AddUserInterestsRequest";
import { SearchInterestsQuery } from "../../../application/interests/dtos/requests/SearchInterestsQuery";

@injectable()
export class InterestController {
  constructor(
    @inject(INTERESTS_TYPES.AddUserInterests)
    private readonly _addUserInterests: IAddUserInterestsUseCase,
    @inject(INTERESTS_TYPES.GetUserInterests)
    private readonly _getUserInterests: IGetUserInterestsUseCase,
    @inject(INTERESTS_TYPES.RemoveUserInterests)
    private readonly _removeUserInterests: IRemoveUserInterestsUseCase,
    @inject(INTERESTS_TYPES.SearchInterests)
    private readonly _searchInterests: ISearchInterestsUseCase,
    @inject(INTERESTS_TYPES.GetPopularInterests)
    private readonly _getPopularInterests: IGetPopularInterestsUseCase,
  ) {}

  addInterests = async (req: AuthenticatedRequest, res: Response) => {
    const request: AddUserInterestsRequest = {
      interests: req.body.interests,
    };

    const interests = await this._addUserInterests.execute(req.user!.userId, request);

    res.json(successResponse(interests, "Interests added successfully"));
  };

  getMyInterests = async (req: AuthenticatedRequest, res: Response) => {
    const interests = await this._getUserInterests.execute(req.user!.userId);
    res.json(successResponse(interests, "Interests fetched successfully"));
  };

  getUserInterests = async (req: AuthenticatedRequest, res: Response) => {
    const interests = await this._getUserInterests.execute(req.params.userId);
    res.json(successResponse(interests, "User interests fetched successfully"));
  };

  removeInterests = async (req: AuthenticatedRequest, res: Response) => {
    await this._removeUserInterests.execute(req.user!.userId, req.body.interestIds);
    res.json(successResponse(null, "Interests removed successfully"));
  };

  search = async (req: AuthenticatedRequest, res: Response) => {
    const query: SearchInterestsQuery = {
      q: (req.query.q as string) || "",
      limit: Number(req.query.limit) || 10,
    };

    const interests = await this._searchInterests.execute(query);
    res.json(successResponse(interests, "Search results fetched"));
  };

  getPopular = async (req: AuthenticatedRequest, res: Response) => {
    const limit = Number(req.query.limit) || 20;
    const interests = await this._getPopularInterests.execute(limit);
    res.json(successResponse(interests, "Popular interests fetched"));
  };
}
