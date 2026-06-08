import { RequestEmailChangeDto } from "../dtos/requests/RequestEmailChange";

export interface IRequestEmailChangeUsecase {
  execute(userId: string, dto: RequestEmailChangeDto): Promise<void>;
}
