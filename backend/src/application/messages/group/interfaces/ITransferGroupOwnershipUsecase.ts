import { TransferGroupOwnershipRequest } from "../dtos/requests/TransferGroupOwnershipRequest";
import { GroupResponse } from "../dtos/responses/GroupResponse";

export interface ITransferGroupOwnershipUsecase {
  execute(currentUserId: string, request: TransferGroupOwnershipRequest): Promise<GroupResponse>;
}
