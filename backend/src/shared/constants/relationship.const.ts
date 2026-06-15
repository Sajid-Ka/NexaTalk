export const UserRelationship = {
  FRIEND: "friend",
  STRANGER: "stranger",
  BLOCKED: "blocked",
} as const;

export type UserRelationship = (typeof UserRelationship)[keyof typeof UserRelationship];
