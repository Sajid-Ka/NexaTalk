import { ServerPrivacy, ServerTag } from "../../../../../shared/constants/server.const";

export interface UpdateServerRequest {
  name?: string;
  description?: string;
  icon?: string;
  banner?: string;
  privacy?: ServerPrivacy;
  tag?: ServerTag;
}
