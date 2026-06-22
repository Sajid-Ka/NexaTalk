import { Interest } from "../../../domain/features/interests/entities/Interest";
import { InterestResponse } from "../dtos/responses/InterestResponse";
import { User } from "../../../domain/features/auth/entities/User";
import { UserWithInterestsResponse } from "../dtos/responses/UserWithInterestsResponse";
// import { Server } from "../../../domain/servers/entities/Server";
// import { ServerWithInterestsResponse } from "../dtos/responses/InterestResponse";

export class InterestApplicationMapper {
  static toResponse(interest: Interest): InterestResponse {
    return {
      id: interest.id,
      name: interest.name,
      category: interest.category,
      createdAt: interest.createdAt,
    };
  }

  static toResponseList(interests: Interest[]): InterestResponse[] {
    return interests.map((i) => this.toResponse(i));
  }

  static toUserWithInterests(
    user: User,
    interests: Interest[],
    matchScore?: number,
    matchedInterests?: string[],
  ): UserWithInterestsResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      status: user.status,
      interests: this.toResponseList(interests),
      matchScore,
      matchedInterests,
    };
  }

  //   static toServerWithInterests(
  //     server: Server,
  //     interests: Interest[],
  //     matchScore?: number,
  //     matchedInterests?: string[]
  //   ): ServerWithInterestsResponse {
  //     return {
  //       id: server.id,
  //       name: server.name,
  //       description: server.description,
  //       icon: server.icon,
  //       memberCount: server.membersCount || 0,
  //       interests: this.toResponseList(interests),
  //       matchScore,
  //       matchedInterests,
  //     };
  //   }
}
