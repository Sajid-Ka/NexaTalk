export const FRIENDS_TYPES = {
  // Repositories
  FriendRepository: Symbol.for("FriendRepository"),

  // Use Cases
  SendFriendRequest: Symbol.for("SendFriendRequest"),
  RespondFriendRequest: Symbol.for("RespondFriendRequest"),
  GetFriends: Symbol.for("GetFriends"),
  GetPendingRequests: Symbol.for("GetPendingRequests"),
  RemoveFriend: Symbol.for("RemoveFriend"),
  BlockUser: Symbol.for("FriendsBlockUser"),
  UnblockUser: Symbol.for("FriendsUnblockUser"),
  GetBlockedUsers: Symbol.for("GetBlockedUsers"),

  // Controllers
  FriendController: Symbol.for("FriendController"),
};
