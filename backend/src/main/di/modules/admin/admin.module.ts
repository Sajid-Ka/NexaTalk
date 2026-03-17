import { Container } from "inversify";
import { ADMIN_TYPES } from "./admin.types";
import { AdminUserRepository } from "../../../../infrastructure/admin/repositories/AdminUserRepository";

import { ListUsers } from "../../../../application/admin/usecases/ListUsers";
import { GetUserDetails } from "../../../../application/admin/usecases/GetUserDetails";
import { BlockUser } from "../../../../application/admin/usecases/BlockUser";
import { UnblockUser } from "../../../../application/admin/usecases/UnblockUser";
import { UpdateUserRole } from "../../../../application/admin/usecases/UpdateUserRole";
import { ForceLogoutUser } from "../../../../application/admin/usecases/ForceLogoutUser";
import { DeleteUser } from "../../../../application/admin/usecases/DeleteUser";

import { AdminUserController } from "../../../../presentation/admin/controllers/AdminUserController";
import { IAdminUserRepository } from "../../../../domain/admin/repositories/IAdminUserRepository";

export function loadAdminModule(container: Container) {
  container
    .bind<IAdminUserRepository>(ADMIN_TYPES.AdminUserRepository)
    .to(AdminUserRepository)
    .inSingletonScope();
  container.bind(ADMIN_TYPES.ListUsers).to(ListUsers);
  container.bind(ADMIN_TYPES.GetUserDetails).to(GetUserDetails);
  container.bind(ADMIN_TYPES.BlockUser).to(BlockUser);
  container.bind(ADMIN_TYPES.UnblockUser).to(UnblockUser);
  container.bind(ADMIN_TYPES.UpdateRole).to(UpdateUserRole);
  container.bind(ADMIN_TYPES.ForceLogoutUser).to(ForceLogoutUser);
  container.bind(ADMIN_TYPES.DeleteUser).to(DeleteUser);
  container.bind(ADMIN_TYPES.AdminUserController).to(AdminUserController);
}
