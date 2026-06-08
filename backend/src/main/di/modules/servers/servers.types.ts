export const SERVERS_TYPES = {
  // Repositories
  ServerRepository: Symbol.for("ServerRepository"),
  ServerMemberRepository: Symbol.for("ServerMemberRepository"),
  ServerInviteRepository: Symbol.for("ServerInviteRepository"),
  ServerBanRepository: Symbol.for("ServerBanRepository"),
  ServerAuditLogRepository: Symbol.for("ServerAuditLogRepository"),
  ServerDirectInviteRepository: Symbol.for("ServerDirectInviteRepository"),

  // Use Cases

  //servers
  CreateServer: Symbol.for("CreateServer"),
  GetServer: Symbol.for("GetServer"),
  GetPublicServers: Symbol.for("GetPublicServers"),
  GetUserServers: Symbol.for("GetUserServers"),
  UpdateServer: Symbol.for("UpdateServer"),
  DeleteServer: Symbol.for("DeleteServer"),
  //members
  JoinServer: Symbol.for("JoinServer"),
  LeaveServer: Symbol.for("LeaveServer"),
  GetServerMembers: Symbol.for("GetServerMembers"),
  KickMember: Symbol.for("KickMember"),
  UpdateMemberRole: Symbol.for("UpdateMemberRole"),
  TransferOwnership: Symbol.for("TransferOwnership"),
  ServerMembershipCleanupService: Symbol.for("ServerMembershipCleanupService"),

  //invites
  CreateServerInvite: Symbol.for("CreateServerInvite"),
  JoinServerByInvite: Symbol.for("JoinServerByInvite"),
  GetServerInvites: Symbol.for("GetServerInvites"),
  RevokeServerInvite: Symbol.for("RevokeServerInvite"),
  SendDirectServerInvite: Symbol.for("SendDirectServerInvite"),
  GetPendingDirectInvites: Symbol.for("GetPendingDirectInvites"),
  RespondToDirectInvite: Symbol.for("RespondToDirectInvite"),
  GetSentDirectInvites: Symbol.for("GetSentDirectInvites"),
  //bans
  GetServerBans: Symbol.for("GetServerBans"),
  BanServerMember: Symbol.for("BanServerMember"),
  UnbanServerMember: Symbol.for("UnbanServerMember"),
  SearchServerBanCandidates: Symbol.for("SearchServerBanCandidates"),
  //auditLogs
  GetServerAuditLogs: Symbol.for("GetServerAuditLogs"),

  // Controllers
  ServerCoreController: Symbol.for("ServerController"),
  ServerMemberController: Symbol.for("ServerMemberController"),
  ServerInviteController: Symbol.for("ServerInviteController"),
  ServerBanController: Symbol.for("ServerBanController"),
  ServerAuditLogController: Symbol.for("ServerAuditLogController"),
  ServerDirectInviteController: Symbol.for("ServerDirectInviteController"),
};
