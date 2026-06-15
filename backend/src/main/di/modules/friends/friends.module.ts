import { Container } from "inversify";
import { FRIENDS_TYPES } from "./friends.types";

import { FriendRepository } from "../../../../infrastructure/features/friends/repositories/FriendRepository";

import { SendFriendRequest } from "../../../../application/friends/usecases/SendFriendRequest";
import { RespondFriendRequest } from "../../../../application/friends/usecases/RespondFriendRequest";
import { GetFriends } from "../../../../application/friends/usecases/GetFriends";
import { GetPendingRequests } from "../../../../application/friends/usecases/GetPendingRequests";
import { RemoveFriend } from "../../../../application/friends/usecases/RemoveFriend";
import { BlockUser } from "../../../../application/friends/usecases/BlockUser";
import { UnblockUser } from "../../../../application/friends/usecases/UnblockUser";
import { GetBlockedUsers } from "../../../../application/friends/usecases/GetBlockedUsers";

import { FriendController } from "../../../../presentation/friends/controllers/FriendController";

export function loadFriendsModule(container: Container) {
  // Repositories
  container.bind(FRIENDS_TYPES.FriendRepository).to(FriendRepository).inSingletonScope();

  // Use Cases
  container.bind(FRIENDS_TYPES.SendFriendRequest).to(SendFriendRequest);
  container.bind(FRIENDS_TYPES.RespondFriendRequest).to(RespondFriendRequest);
  container.bind(FRIENDS_TYPES.GetFriends).to(GetFriends);
  container.bind(FRIENDS_TYPES.GetPendingRequests).to(GetPendingRequests);
  container.bind(FRIENDS_TYPES.RemoveFriend).to(RemoveFriend);
  container.bind(FRIENDS_TYPES.BlockUser).to(BlockUser);
  container.bind(FRIENDS_TYPES.UnblockUser).to(UnblockUser);
  container.bind(FRIENDS_TYPES.GetBlockedUsers).to(GetBlockedUsers);

  // Controllers
  container.bind(FRIENDS_TYPES.FriendController).to(FriendController);
}
