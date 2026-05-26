export const SERVERS_TYPES = {
  // Repositories
  ServerRepository: Symbol.for("ServerRepository"),
  ServerMemberRepository: Symbol.for("ServerMemberRepository"),
  ServerInviteRepository: Symbol.for("ServerInviteRepository"),

  // Use Cases
  CreateServer: Symbol.for("CreateServer"),
  GetServer: Symbol.for("GetServer"),
  UpdateServer: Symbol.for("UpdateServer"),
  DeleteServer: Symbol.for("DeleteServer"),
  JoinServer: Symbol.for("JoinServer"),
  LeaveServer: Symbol.for("LeaveServer"),
  GetUserServers: Symbol.for("GetUserServers"),
  GetPublicServers: Symbol.for("GetPublicServers"),
  CreateServerInvite: Symbol.for("CreateServerInvite"),
  JoinServerByInvite: Symbol.for("JoinServerByInvite"),
  GetServerMembers: Symbol.for("GetServerMembers"),
  UpdateMemberRole: Symbol.for("UpdateMemberRole"),
  KickMember: Symbol.for("KickMember"),

  // Controllers
  ServerCoreController: Symbol.for("ServerController"),
  ServerMemberController: Symbol.for("ServerMemberController"),
  ServerInviteController: Symbol.for("ServerInviteController"),
};
