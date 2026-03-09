import { inject, injectable } from "inversify";
import { ADMIN_TYPES } from "../../../main/di/modules/admin/admin.types";
import { IAdminUserRepository } from "../../../domain/admin/repositories/IAdminUserRepository";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { IUnblockUserUsecase } from "../interface/IUnblockUserUsecase";
import { ILogger } from "../../../domain/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";

@injectable()
export class UnblockUser implements IUnblockUserUsecase {
    constructor(
        @inject(ADMIN_TYPES.AdminUserRepository) private readonly _repo : IAdminUserRepository,
        @inject(COMMON_TYPES.Logger) private readonly _logger : ILogger,
    ) {}

    async execute(userId: string): Promise<void> {
        this._logger.info("Unblock user attempt", { userId });

        const user = await this._repo.findById(userId);

        if(!user){
            this._logger.warn("Unblock user failed - user not found", { userId });
            throw new NotFoundError("User not found");
        }

        await this._repo.update(userId, { isBlocked : false });

        this._logger.info("User unblocked", { userId });
    }
}