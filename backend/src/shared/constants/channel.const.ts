export const ChannelType = {
  TEXT: "text",
  VOICE: "voice",
} as const;

export type ChannelType = (typeof ChannelType)[keyof typeof ChannelType];
