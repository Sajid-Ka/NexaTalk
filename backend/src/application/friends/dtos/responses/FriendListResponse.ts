import { FriendResponse } from "./FriendResponse";

export interface FriendListResponse {
  friends: FriendResponse[];
  total: number;
  online: number;
  offline: number;
}
