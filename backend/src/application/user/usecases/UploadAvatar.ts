import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { NotFoundError } from "../../../domain/core/errors/NotFoundError";
import { BadRequestError } from "../../../domain/core/errors/BadRequestError";
import { IUploadAvatarUsecase } from "../interfaces/IUploadAvatar";

@injectable()
export class UploadAvatar implements IUploadAvatarUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string, file: Express.Multer.File): Promise<{ avatarUrl: string }> {
    this._logger.info("Uploading avatar", {
      userId,
      filename: file?.filename,
      mimetype: file?.mimetype,
      size: file?.size,
    });

    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!file) {
      throw new BadRequestError("No file uploaded");
    }

    const avatarUrl = `/uploads/avatars/${file.filename}`;

    await this._userRepo.update(userId, { avatar: avatarUrl });

    this._logger.info("Avatar uploaded successfully", { userId, avatarUrl });

    return { avatarUrl };
  }
}
