import { Container } from "inversify";
import { SERVERS_TYPES } from "./servers.types";

// Repositories
import { ServerRepository } from "../../../../infrastructure/features/servers/repositories/ServerRepository";
import { ServerMemberRepository } from "../../../../infrastructure/features/servers/repositories/ServerMemberRepository";
import { ServerInviteRepository } from "../../../../infrastructure/features/servers/repositories/ServerInviteRepository";

// Use Cases
import { CreateServer } from "../../../../application/servers/core/usecases/CreateServer";
import { GetServer } from "../../../../application/servers/core/usecases/GetServer";
import { UpdateServer } from "../../../../application/servers/core/usecases/UpdateServer";
import { DeleteServer } from "../../../../application/servers/core/usecases/DeleteServer";
import { JoinServer } from "../../../../application/servers/members/usecases/JoinServer";
import { LeaveServer } from "../../../../application/servers/members/usecases/LeaveServer";
import { GetUserServers } from "../../../../application/servers/core/usecases/GetUserServers";
import { GetPublicServers } from "../../../../application/servers/core/usecases/GetPublicServers";
import { CreateServerInvite } from "../../../../application/servers/invites/usecases/CreateServerInvite";
import { JoinServerByInvite } from "../../../../application/servers/invites/usecases/JoinServerByInvite";

// Controllers
import { ServerCoreController } from "../../../../presentation/servers/controllers/ServerCoreController";
import { ServerMemberController } from "../../../../presentation/servers/controllers/ServerMemberController";
import { ServerInviteController } from "../../../../presentation/servers/controllers/ServerInviteController";
import { IGetServerMembersUsecase } from "../../../../application/servers/members/interfaces/IGetServerMembersUsecase";
import { GetServerMembers } from "../../../../application/servers/members/usecases/GetServerMembers";
import { IUpdateMemberRoleUsecase } from "../../../../application/servers/members/interfaces/IUpdateMemberRoleUsecase";
import { UpdateMemberRole } from "../../../../application/servers/members/usecases/UpdateMemberRole";
import { IKickMemberUsecase } from "../../../../application/servers/members/interfaces/IKickMemberUsecase";
import { KickMember } from "../../../../application/servers/members/usecases/KickMember";

export function loadServersModule(container: Container) {
  // Repositories
  container.bind(SERVERS_TYPES.ServerRepository).to(ServerRepository).inSingletonScope();
  container.bind(SERVERS_TYPES.ServerMemberRepository).to(ServerMemberRepository).inSingletonScope();
  container.bind(SERVERS_TYPES.ServerInviteRepository).to(ServerInviteRepository).inSingletonScope();

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
  container.bind<ServerCoreController>(SERVERS_TYPES.ServerCoreController).to(ServerCoreController);
  container.bind<ServerMemberController>(SERVERS_TYPES.ServerMemberController).to(ServerMemberController);
  container.bind<ServerInviteController>(SERVERS_TYPES.ServerInviteController).to(ServerInviteController);
  container.bind<IGetServerMembersUsecase>(SERVERS_TYPES.GetServerMembers).to(GetServerMembers);
  container.bind<IUpdateMemberRoleUsecase>(SERVERS_TYPES.UpdateMemberRole).to(UpdateMemberRole);
  container.bind<IKickMemberUsecase>(SERVERS_TYPES.KickMember).to(KickMember);
}
