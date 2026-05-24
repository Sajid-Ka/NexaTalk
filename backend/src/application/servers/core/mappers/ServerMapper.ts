import { Server } from "../../../../domain/features/servers/entities/Server";
import { ServerResponse } from "../dtos/responses/ServerResponse";

export class ServerMapper {
  static toResponse(server: Server): ServerResponse {
    return {
      id: server.id,
      name: server.name,
      description: server.description,
      icon: server.icon,
      banner: server.banner,
      ownerId: server.ownerId,
      privacy: server.privacy,
      isDisabled: server.isDisabled,
      memberCount: server.memberCount,
      tags: server.tags,
      createdAt: server.createdAt,
      updatedAt: server.updatedAt,
    };
  }

  static toResponseList(servers: Server[]): ServerResponse[] {
    return servers.map((server) => this.toResponse(server));
  }
}
