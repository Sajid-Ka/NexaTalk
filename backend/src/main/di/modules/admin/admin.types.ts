export const ADMIN_TYPES = {
  //repositories
  AdminUserRepository: Symbol.for("AdminUserRepository"),

  //usecases
  ListUsers: Symbol.for("ListUsers"),
  GetUserDetails: Symbol.for("GetUserDetails"),
  BlockUser: Symbol.for("BlockUser"),
  UnblockUser: Symbol.for("UnblockUser"),
  UpdateRole: Symbol.for("UpdateUserRole"),
  ForceLogoutUser: Symbol.for("ForceLogoutUser"),
  DeleteUser: Symbol.for("DeleteUser"),

  //controller
  AdminUserController: Symbol.for("AdminUserController"),
};
