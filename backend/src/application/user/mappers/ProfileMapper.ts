import { User } from "../../../domain/features/auth/entities/User";
import { Interest } from "../../../domain/features/interests/entities/Interest";
import { ProfileResponse, PublicProfileResponse } from "../dtos/responses/ProfileResponse";
import { InterestApplicationMapper } from "../../interests/mappers/InterestMapper";

export class ProfileMapper {
  static toResponse(user: User, interests: Interest[] = []): ProfileResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      status: user.status,
      globalRole: user.globalRole,
      lastSeenAt: user.lastSeenAt || undefined,
      isProfilePublic: user.isProfilePublic,
      interests: InterestApplicationMapper.toResponseList(interests),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toPublicResponse(user: User, interests: Interest[] = []): PublicProfileResponse {
    return {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      status: user.status,
      globalRole: user.globalRole,
      lastSeenAt: user.lastSeenAt || undefined,
      interests: InterestApplicationMapper.toResponseList(interests),
      createdAt: user.createdAt,
    };
  }
}
