export const ConversationType = {
  DIRECT: "direct",
  GROUP: "group",
  CHANNEL: "channel",
} as const;

export type ConversationType = (typeof ConversationType)[keyof typeof ConversationType];
