import { Container } from "inversify";
import { FRIENDS_TYPES } from "./friends.types";

import { FriendRepository } from "../../../../infrastructure/features/friends/repositories/FriendRepository";

import { SendFriendRequest } from "../../../../application/friends/usecases/SendFriendRequest";
import { RespondFriendRequest } from "../../../../application/friends/usecases/RespondFrinedRequest";
import { GetFriends } from "../../../../application/friends/usecases/GetFriends";
import { GetPendingRequests } from "../../../../application/friends/usecases/GetPendingRequests";
import { RemoveFriend } from "../../../../application/friends/usecases/RemoveFriend";

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

  // Controllers
  container.bind(FRIENDS_TYPES.FriendController).to(FriendController);
}
