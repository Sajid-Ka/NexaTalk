export const INTERESTS_TYPES = {
  // Repositories
  InterestRepository: Symbol.for("InterestRepository"),
  UserInterestRepository: Symbol.for("UserInterestRepository"),
  ServerInterestRepository: Symbol.for("ServerInterestRepository"),

  // Use Cases (to be added in application layer)
  AddUserInterests: Symbol.for("AddUserInterests"),
  GetUserInterests: Symbol.for("GetUserInterests"),
  RemoveUserInterests: Symbol.for("RemoveUserInterests"),
  SearchInterests: Symbol.for("SearchInterests"),
  GetPopularInterests: Symbol.for("GetPopularInterests"),

  // Controllers
  InterestController: Symbol.for("InterestController"),
};
