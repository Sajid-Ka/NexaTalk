export interface SessionListResponse {
  id: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
}
