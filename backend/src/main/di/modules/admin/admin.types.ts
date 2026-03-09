export const ADMIN_TYPES = {
    AdminUserRepository: Symbol.for("AdminUserRepository"),
    ListUsers: Symbol.for("ListUsers"),
    GetUserDetails : Symbol.for("GetUserDetails"),
    BlockUser: Symbol.for("BlockUser"),
    UnblockUser: Symbol.for("UnblockUser"),
    UpdateRole: Symbol.for("UpdateUserRole"),
    DeleteUser: Symbol.for("DeleteUser"),
    AdminUserController: Symbol.for("AdminUserController"),
}