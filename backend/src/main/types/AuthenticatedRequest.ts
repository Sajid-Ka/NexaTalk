import { Request } from "express";
import { AccessTokenPayload } from "../../domain/auth/types/AccessTokenPayload";

export interface AuthenticatedRequest extends Request {
  user?: AccessTokenPayload;
  requestId?: string;
}
