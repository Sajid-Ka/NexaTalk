export const ConnectionStatus = {
  CONNECTED: "connected",
  DISCONNECTED: "disconnected",
} as const;

export type ConnectionStatus = (typeof ConnectionStatus)[keyof typeof ConnectionStatus];

export const RedisConnectionState = {
  READY: "ready",
  CONNECTING: "connecting",
  ERROR: "error",
  CLOSED: "closed",
} as const;

export type RedisConnectionState = (typeof RedisConnectionState)[keyof typeof RedisConnectionState];
