export interface PendingDirectInviteResponse {
  id: string;
  serverId: {
    _id: string;
    name: string;
    icon?: string;
  };
  senderId: {
    _id: string;
    username: string;
    avatar?: string;
  };
  receiverId: string;
  status: "pending";
  createdAt: Date;
}
