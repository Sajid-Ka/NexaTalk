import { Container } from "inversify";
import { USER_TYPES } from "./user.types";

import { UserSettingsRepository } from "../../../../infrastructure/features/users/repositories/UserSettingsRepository";

//settigns
import { GetUserSettings } from "../../../../application/user/usecases/GetUserSettings";
import { UpdateUserSettings } from "../../../../application/user/usecases/UpdateUserSettings";
import { UserSettingsController } from "../../../../presentation/user/controllers/UserSettingsController";

//Profile
import { GetProfile } from "../../../../application/user/usecases/GetProfile";
import { UpdateProfile } from "../../../../application/user/usecases/UpdateProfile";
import { ProfileController } from "../../../../presentation/user/controllers/ProfileController";

//Avatar
import { UploadAvatar } from "../../../../application/user/usecases/UploadAvatar";
import { DeleteAvatar } from "../../../../application/user/usecases/DeleteAvatar";

//search
import { SearchUsers } from "../../../../application/user/usecases/SearchUsers";

// Account
import { ChangePassword } from "../../../../application/user/usecases/ChangePassword";
import { ChangeEmail } from "../../../../application/user/usecases/ChangeEmail";
import { DeleteAccount } from "../../../../application/user/usecases/DeleteAccount";
import { AccountController } from "../../../../presentation/user/controllers/AccountController";

export function loadUserModule(container: Container) {
  //Settings
  container.bind(USER_TYPES.UserSettingsRepository).to(UserSettingsRepository).inSingletonScope();
  container.bind(USER_TYPES.GetUserSettings).to(GetUserSettings);
  container.bind(USER_TYPES.UpdateUserSettings).to(UpdateUserSettings);
  container.bind(USER_TYPES.UserSettingsController).to(UserSettingsController);

  //Profile
  container.bind(USER_TYPES.GetProfile).to(GetProfile);
  container.bind(USER_TYPES.UpdateProfile).to(UpdateProfile);
  container.bind(USER_TYPES.ProfileController).to(ProfileController);

  // Avatar
  container.bind(USER_TYPES.UploadAvatar).to(UploadAvatar);
  container.bind(USER_TYPES.DeleteAvatar).to(DeleteAvatar);

  //search
  container.bind(USER_TYPES.SearchUsers).to(SearchUsers);

  // Account
  container.bind(USER_TYPES.ChangePassword).to(ChangePassword);
  container.bind(USER_TYPES.ChangeEmail).to(ChangeEmail);
  container.bind(USER_TYPES.DeleteAccount).to(DeleteAccount);
  container.bind(USER_TYPES.AccountController).to(AccountController);
}
