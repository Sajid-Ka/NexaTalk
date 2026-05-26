import { ServerMemberRole } from "../../../../../shared/constants/server.const";

export interface ServerBanCandidateResponse {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  serverRole: ServerMemberRole | null;
}
