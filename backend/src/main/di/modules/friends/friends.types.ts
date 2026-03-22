export const FRIENDS_TYPES = {
  // Repositories
  FriendRepository: Symbol.for("FriendRepository"),

  // Use Cases
  SendFriendRequest: Symbol.for("SendFriendRequest"),
  RespondFriendRequest: Symbol.for("RespondFriendRequest"),
  GetFriends: Symbol.for("GetFriends"),
  GetPendingRequests: Symbol.for("GetPendingRequests"),
  RemoveFriend: Symbol.for("RemoveFriend"),

  // Controllers
  FriendController: Symbol.for("FriendController"),
};
