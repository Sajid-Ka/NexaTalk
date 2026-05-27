import { Container } from "inversify";
import { ADMIN_TYPES } from "./admin.types";
//repositories
import { AdminUserRepository } from "../../../../infrastructure/features/admin/repositories/AdminUserRepository";
import { IAdminUserRepository } from "../../../../domain/features/admin/repositories/IAdminUserRepository";
import { AdminServerRepository } from "../../../../infrastructure/features/admin/repositories/AdminServerRepository";
import { IAdminServerRepository } from "../../../../domain/features/admin/repositories/IAdminServerRepository";

//usecases
import { ListUsers } from "../../../../application/admin/users/usecases/ListUsers";
import { GetUserDetails } from "../../../../application/admin/users/usecases/GetUserDetails";
import { BlockUser } from "../../../../application/admin/users/usecases/BlockUser";
import { UnblockUser } from "../../../../application/admin/users/usecases/UnblockUser";
import { UpdateUserRole } from "../../../../application/admin/users/usecases/UpdateUserRole";
import { ForceLogoutUser } from "../../../../application/admin/users/usecases/ForceLogoutUser";
import { DeleteUser } from "../../../../application/admin/users/usecases/DeleteUser";

import { ListServers } from "../../../../application/admin/servers/usecases/ListServers";
import { GetServerDetails } from "../../../../application/admin/servers/usecases/GetServerDetails";
import { DisableServer } from "../../../../application/admin/servers/usecases/DisableServer";
import { EnableServer } from "../../../../application/admin/servers/usecases/EnableServer";
import { DeleteServerByAdmin } from "../../../../application/admin/servers/usecases/DeleteServerByAdmin";

//controllers
import { AdminUserController } from "../../../../presentation/admin/controllers/AdminUserController";
import { AdminServerController } from "../../../../presentation/admin/controllers/AdminServerController";


export function loadAdminModule(container: Container) {
  //repositories
  container
    .bind<IAdminUserRepository>(ADMIN_TYPES.AdminUserRepository)
    .to(AdminUserRepository)
    .inSingletonScope();
  container
  .bind<IAdminServerRepository>(ADMIN_TYPES.AdminServerRepository)
  .to(AdminServerRepository)
  .inSingletonScope();

  //usecases
  //users
  container.bind(ADMIN_TYPES.ListUsers).to(ListUsers);
  container.bind(ADMIN_TYPES.GetUserDetails).to(GetUserDetails);
  container.bind(ADMIN_TYPES.BlockUser).to(BlockUser);
  container.bind(ADMIN_TYPES.UnblockUser).to(UnblockUser);
  container.bind(ADMIN_TYPES.UpdateRole).to(UpdateUserRole);
  container.bind(ADMIN_TYPES.ForceLogoutUser).to(ForceLogoutUser);
  container.bind(ADMIN_TYPES.DeleteUser).to(DeleteUser);
  //servers
  container.bind(ADMIN_TYPES.ListServers).to(ListServers);
  container.bind(ADMIN_TYPES.GetServerDetails).to(GetServerDetails);
  container.bind(ADMIN_TYPES.DisableServer).to(DisableServer);
  container.bind(ADMIN_TYPES.EnableServer).to(EnableServer);
  container.bind(ADMIN_TYPES.DeleteServerByAdmin).to(DeleteServerByAdmin);

  //controllers
  container.bind(ADMIN_TYPES.AdminUserController).to(AdminUserController);
  container.bind(ADMIN_TYPES.AdminServerController).to(AdminServerController);
}
