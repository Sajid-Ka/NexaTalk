import { Container } from "inversify";
import { USER_TYPES } from "./user.types";

import { UserSettingsRepository } from "../../../../infrastructure/features/users/repositories/UserSettingsRepository";

import { GetUserSettings } from "../../../../application/user/usecases/GetUserSettings";
import { UpdateUserSettings } from "../../../../application/user/usecases/UpdateUserSettings";

import { UserSettingsController } from "../../../../presentation/user/controllers/UserSettingsController";

export function loadUserModule(container: Container) {
  // Repositories
  container.bind(USER_TYPES.UserSettingsRepository).to(UserSettingsRepository).inSingletonScope();

  // Use Cases
  container.bind(USER_TYPES.GetUserSettings).to(GetUserSettings);
  container.bind(USER_TYPES.UpdateUserSettings).to(UpdateUserSettings);

  // Controllers
  container.bind(USER_TYPES.UserSettingsController).to(UserSettingsController);
}
