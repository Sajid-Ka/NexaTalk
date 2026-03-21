import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { NotFoundError } from "../../../domain/core/errors/NotFoundError";
import fs from "fs/promises";
import path from "path";
import { IDeleteAvatarUsecase } from "../interfaces/IDeleteAvatarUsecase";

@injectable()
export class DeleteAvatar implements IDeleteAvatarUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string): Promise<void> {
    this._logger.info("Deleting avatar", { userId });

    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Delete file from storage if exists
    if (user.avatar && !user.avatar.startsWith("http")) {
      // user.avatar should be like "/uploads/avatars/filename.jpg"
      // We need to join it with the project root, but be careful with the leading slash
      const relativePath = user.avatar.startsWith("/") ? user.avatar.slice(1) : user.avatar;
      const filePath = path.join(process.cwd(), relativePath);

      try {
        await fs.unlink(filePath);
      } catch (error) {
        this._logger.warn("Failed to delete avatar file", { path: filePath, error });
      }
    }

    await this._userRepo.update(userId, { avatar: "" });

    this._logger.info("Avatar deleted successfully", { userId });
  }
}
