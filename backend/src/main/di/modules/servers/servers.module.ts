import { Container } from "inversify";
import { SERVERS_TYPES } from "./servers.types";

// Repositories
import { ServerRepository } from "../../../../infrastructure/features/servers/repositories/ServerRepository";
import { ServerMemberRepository } from "../../../../infrastructure/features/servers/repositories/ServerMemberRepository";
import { ServerInviteRepository } from "../../../../infrastructure/features/servers/repositories/ServerInviteRepository";

// Use Cases
import { CreateServer } from "../../../../application/servers/usecases/CreateServer";
import { GetServer } from "../../../../application/servers/usecases/GetServer";
import { UpdateServer } from "../../../../application/servers/usecases/UpdateServer";
import { DeleteServer } from "../../../../application/servers/usecases/DeleteServer";
import { JoinServer } from "../../../../application/servers/usecases/JoinServer";
import { LeaveServer } from "../../../../application/servers/usecases/LeaveServer";
import { GetUserServers } from "../../../../application/servers/usecases/GetUserServers";
import { GetPublicServers } from "../../../../application/servers/usecases/GetPublicServers";
import { CreateServerInvite } from "../../../../application/servers/usecases/CreateServerInvite";
import { JoinServerByInvite } from "../../../../application/servers/usecases/JoinServerByInvite";

// Controllers
import { ServerController } from "../../../../presentation/servers/controllers/ServerController";

export function loadServersModule(container: Container) {
  // Repositories
  container.bind(SERVERS_TYPES.ServerRepository).to(ServerRepository).inSingletonScope();
  container
    .bind(SERVERS_TYPES.ServerMemberRepository)
    .to(ServerMemberRepository)
    .inSingletonScope();
  container
    .bind(SERVERS_TYPES.ServerInviteRepository)
    .to(ServerInviteRepository)
    .inSingletonScope();

  // Use Cases
  container.bind(SERVERS_TYPES.CreateServer).to(CreateServer);
  container.bind(SERVERS_TYPES.GetServer).to(GetServer);
  container.bind(SERVERS_TYPES.UpdateServer).to(UpdateServer);
  container.bind(SERVERS_TYPES.DeleteServer).to(DeleteServer);
  container.bind(SERVERS_TYPES.JoinServer).to(JoinServer);
  container.bind(SERVERS_TYPES.LeaveServer).to(LeaveServer);
  container.bind(SERVERS_TYPES.GetUserServers).to(GetUserServers);
  container.bind(SERVERS_TYPES.GetPublicServers).to(GetPublicServers);
  container.bind(SERVERS_TYPES.CreateServerInvite).to(CreateServerInvite);
  container.bind(SERVERS_TYPES.JoinServerByInvite).to(JoinServerByInvite);

  // Controllers
  container.bind(SERVERS_TYPES.ServerController).to(ServerController);
}
