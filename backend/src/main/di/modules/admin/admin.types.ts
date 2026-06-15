export const ADMIN_TYPES = {
  //repositories
  AdminUserRepository: Symbol.for("AdminUserRepository"),
  AdminServerRepository: Symbol.for("AdminServerRepository"),

  //usecases

  //users
  ListUsers: Symbol.for("ListUsers"),
  GetUserDetails: Symbol.for("GetUserDetails"),
  BlockUser: Symbol.for("AdminBlockUser"),
  UnblockUser: Symbol.for("AdminUnblockUser"),
  UpdateRole: Symbol.for("UpdateUserRole"),
  ForceLogoutUser: Symbol.for("ForceLogoutUser"),
  DeleteUser: Symbol.for("DeleteUser"),
  //servers
  ListServers: Symbol.for("ListServers"),
  GetServerDetails: Symbol.for("GetServerDetails"),
  DisableServer: Symbol.for("DisableServer"),
  EnableServer: Symbol.for("EnableServer"),
  DeleteServerByAdmin: Symbol.for("DeleteServerByAdmin"),

  //controller
  AdminUserController: Symbol.for("AdminUserController"),
  AdminServerController: Symbol.for("AdminServerController"),
};
