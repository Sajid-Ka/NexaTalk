import { Server } from "../../../../domain/features/servers/entities/Server";
import { User } from "../../../../domain/features/auth/entities/User";
import { AdminServerResponse } from "../dtos/responses/AdminServerResponse";

export class AdminServerMapper {
  static toResponse(server: Server, owner: User | null): AdminServerResponse {
    return {
      id: server.id,
      name: server.name,
      description: server.description,
      icon: server.icon,
      banner: server.banner,
      ownerId: server.ownerId,
      ownerUsername: owner?.username ?? "Unknown Owner",
      privacy: server.privacy,
      isDisabled: server.isDisabled,
      memberCount: server.memberCount,
      tag: server.tag,
      createdAt: server.createdAt,
      updatedAt: server.updatedAt,
    };
  }
}
