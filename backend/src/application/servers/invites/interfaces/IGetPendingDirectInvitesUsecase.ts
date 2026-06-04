import { PendingDirectInviteResponse } from "../dtos/responses/PendingDirectInviteResponse";

export interface IGetPendingDirectInvitesUsecase {
  execute(receiverId: string): Promise<PendingDirectInviteResponse[]>;
}
