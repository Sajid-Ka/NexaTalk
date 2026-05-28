export const AdminServerStatus = {
  ALL: "all",
  ACTIVE: "active",
  DISABLED: "disabled",
} as const;

export type AdminServerStatus =
  (typeof AdminServerStatus)[keyof typeof AdminServerStatus];

export const AdminServerSort = {
  CREATED_AT: "createdAt",
  MEMBER_COUNT: "memberCount",
} as const;

export type AdminServerSort =
  (typeof AdminServerSort)[keyof typeof AdminServerSort];

export const AdminServerSortOrder = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type AdminServerSortOrder =
  (typeof AdminServerSortOrder)[keyof typeof AdminServerSortOrder];