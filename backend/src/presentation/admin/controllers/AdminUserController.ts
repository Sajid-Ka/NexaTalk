import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { IListUsersUsecase } from "../../../application/admin/interface/IListUsersUsecase";
import { IBlockUserUsecase } from "../../../application/admin/interface/IBlockUserUsecase";
import { IUnblockUserUsecase } from "../../../application/admin/interface/IUnblockUserUsecase";
import { IUpdateUserRoleUsecase } from "../../../application/admin/interface/IUpdateUserRoleUsecase";
import { IDeleteUserUsecase } from "../../../application/admin/interface/IDeleteUserUsecase";
import { ADMIN_TYPES } from "../../../main/di/modules/admin/admin.types";
import { IGetUserDetailsUsecase } from "../../../application/admin/interface/IGetUserDetailsUsecase";
import { successResponse } from "../../../shared/response/responseFormatter";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";

@injectable()
export class AdminUserController {
  constructor(
    @inject(ADMIN_TYPES.ListUsers) private readonly _listUsers: IListUsersUsecase,
    @inject(ADMIN_TYPES.GetUserDetails) private _getUserDetails: IGetUserDetailsUsecase,
    @inject(ADMIN_TYPES.BlockUser) private readonly _blockUser: IBlockUserUsecase,
    @inject(ADMIN_TYPES.UnblockUser) private readonly _unblockUser: IUnblockUserUsecase,
    @inject(ADMIN_TYPES.UpdateRole) private readonly _updateRole: IUpdateUserRoleUsecase,
    @inject(ADMIN_TYPES.DeleteUser) private readonly _deleteUser: IDeleteUserUsecase,
  ) {}

  listUsers = async (req: Request, res: Response) => {
    const users = await this._listUsers.execute({
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      search: req.query.search as string,
      status: req.query.status as "active" | "blocked",
      sort: req.query.sort as string,
    });
    res.json(successResponse(users, "Users fetched"));
  };

  getUserDetails = async (req: Request, res: Response) => {
    const result = await this._getUserDetails.execute(req.params.id);
    res.json(successResponse(result, "User details fetched"));
  };

  blockUser = async (req: AuthenticatedRequest, res: Response) => {
    await this._blockUser.execute(req.params.id, req.user!.userId);
    res.json(successResponse(null, "User blocked"));
  };

  unblockUser = async (req: AuthenticatedRequest, res: Response) => {
    await this._unblockUser.execute(req.params.id, req.user!.userId);
    res.json(successResponse(null, "User unblocked"));
  };

  updateRole = async (req: Request, res: Response) => {
    await this._updateRole.execute(req.params.id, req.body.role);
    res.json(successResponse(null, "Role Updated"));
  };

  deleteUser = async (req: AuthenticatedRequest, res: Response) => {
    await this._deleteUser.execute(req.params.id, req.user!.userId);
    res.json(successResponse(null, "User deleted"));
  };
}
