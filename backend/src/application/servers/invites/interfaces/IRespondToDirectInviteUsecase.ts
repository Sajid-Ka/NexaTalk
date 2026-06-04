export interface IRespondToDirectInviteUsecase {
  execute(inviteId: string, receiverId: string, status: "accepted" | "rejected"): Promise<void>;
}
