export const USER_TYPES = {
  //settings
  UserSettingsRepository: Symbol.for("UserSettingsRepository"),
  GetUserSettings: Symbol.for("GetUserSettings"),
  UpdateUserSettings: Symbol.for("UpdateUserSettings"),
  UserSettingsController: Symbol.for("UserSettingsController"),

  //Profile
  GetProfile: Symbol.for("GetProfile"),
  UpdateProfile: Symbol.for("UpdateProfile"),
  ProfileController: Symbol.for("ProfileController"),

  // Avatar
  UploadAvatar: Symbol.for("UploadAvatar"),
  DeleteAvatar: Symbol.for("DeleteAvatar"),

  //search
  SearchUsers: Symbol.for("SearchUsers"),
};
