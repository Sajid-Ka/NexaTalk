import { MarkAsReadRequest } from "../dtos/requests/MarkAsReadRequest";
import { MarkAsReadResponse } from "../dtos/responses/MarkAsReadResponse";

export interface IMarkAsReadUsecase {
  execute(userId: string, request: MarkAsReadRequest): Promise<MarkAsReadResponse>;
}
