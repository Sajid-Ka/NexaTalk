import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { ISearchUsersUsecase } from "../interfaces/ISearchUsersUsecase";
import { SearchUserResponse } from "../dtos/responses/SearchUserResponse";

@injectable()
export class SearchUsers implements ISearchUsersUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(
    query: string,
    limit: number = 10,
    excludeUserId?: string,
  ): Promise<SearchUserResponse[]> {
    this._logger.info("Searching users", { query, limit });

    if (!query || query.trim().length < 2) {
      return [];
    }

    // Search users by username
    const users = await this._userRepo.search(query, limit);

    // Filter out the current user if excludeUserId provided
    const filteredUsers = excludeUserId ? users.filter((u) => u.id !== excludeUserId) : users;

    return filteredUsers.map((user) => ({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      status: user.status,
    }));
  }
}
