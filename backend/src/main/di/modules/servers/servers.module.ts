import { Container } from "inversify";
import { SERVERS_TYPES } from "./servers.types";

// Repositories
import { ServerRepository } from "../../../../infrastructure/features/servers/repositories/ServerRepository";
import { ServerMemberRepository } from "../../../../infrastructure/features/servers/repositories/ServerMemberRepository";
import { ServerInviteRepository } from "../../../../infrastructure/features/servers/repositories/ServerInviteRepository";
import { ServerBanRepository } from "../../../../infrastructure/features/servers/repositories/ServerBanRepository";

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
import { IGetServerMembersUsecase } from "../../../../application/servers/members/interfaces/IGetServerMembersUsecase";
import { GetServerMembers } from "../../../../application/servers/members/usecases/GetServerMembers";
import { IUpdateMemberRoleUsecase } from "../../../../application/servers/members/interfaces/IUpdateMemberRoleUsecase";
import { UpdateMemberRole } from "../../../../application/servers/members/usecases/UpdateMemberRole";
import { IKickMemberUsecase } from "../../../../application/servers/members/interfaces/IKickMemberUsecase";
import { KickMember } from "../../../../application/servers/members/usecases/KickMember";
import { GetServerInvites } from "../../../../application/servers/invites/usecases/GetServerInvites";
import { RevokeServerInvite } from "../../../../application/servers/invites/usecases/RevokeServerInvite";
import { IGetServerInvitesUsecase } from "../../../../application/servers/invites/interfaces/IGetServerInvitesUsecase";
import { IRevokeServerInviteUsecase } from "../../../../application/servers/invites/interfaces/IRevokeServerInviteUsecase";
import { GetServerBans } from "../../../../application/servers/bans/usecases/GetServerBans";
import { BanServerMember } from "../../../../application/servers/bans/usecases/BanServerMember";
import { UnbanServerMember } from "../../../../application/servers/bans/usecases/UnbanServerMember";
import { IGetServerBansUsecase } from "../../../../application/servers/bans/interfaces/IGetServerBansUsecase";
import { IBanServerMemberUsecase } from "../../../../application/servers/bans/interfaces/IBanServerMemberUsecase";
import { IUnbanServerMemberUsecase } from "../../../../application/servers/bans/interfaces/IUnbanServerMemberUsecase";
import { SearchServerBanCandidates } from "../../../../application/servers/bans/usecases/SearchServerBanCandidates";
import { ISearchServerBanCandidatesUsecase } from "../../../../application/servers/bans/interfaces/ISearchServerBanCandidatesUsecase";

// Controllers
import { ServerCoreController } from "../../../../presentation/servers/controllers/ServerCoreController";
import { ServerMemberController } from "../../../../presentation/servers/controllers/ServerMemberController";
import { ServerInviteController } from "../../../../presentation/servers/controllers/ServerInviteController";
import { ServerBanController } from "../../../../presentation/servers/controllers/ServerBanController";

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
  container.bind(SERVERS_TYPES.ServerBanRepository).to(ServerBanRepository).inSingletonScope();

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
  container.bind<IGetServerInvitesUsecase>(SERVERS_TYPES.GetServerInvites).to(GetServerInvites);
  container
    .bind<IRevokeServerInviteUsecase>(SERVERS_TYPES.RevokeServerInvite)
    .to(RevokeServerInvite);
  container.bind<IGetServerMembersUsecase>(SERVERS_TYPES.GetServerMembers).to(GetServerMembers);
  container.bind<IUpdateMemberRoleUsecase>(SERVERS_TYPES.UpdateMemberRole).to(UpdateMemberRole);
  container.bind<IKickMemberUsecase>(SERVERS_TYPES.KickMember).to(KickMember);
  container.bind<IGetServerBansUsecase>(SERVERS_TYPES.GetServerBans).to(GetServerBans);
  container.bind<IBanServerMemberUsecase>(SERVERS_TYPES.BanServerMember).to(BanServerMember);
  container.bind<IUnbanServerMemberUsecase>(SERVERS_TYPES.UnbanServerMember).to(UnbanServerMember);
  container
    .bind<ISearchServerBanCandidatesUsecase>(SERVERS_TYPES.SearchServerBanCandidates)
    .to(SearchServerBanCandidates);

  // Controllers
  container.bind<ServerCoreController>(SERVERS_TYPES.ServerCoreController).to(ServerCoreController);
  container
    .bind<ServerMemberController>(SERVERS_TYPES.ServerMemberController)
    .to(ServerMemberController);
  container
    .bind<ServerInviteController>(SERVERS_TYPES.ServerInviteController)
    .to(ServerInviteController);
  container.bind<ServerBanController>(SERVERS_TYPES.ServerBanController).to(ServerBanController);
}
