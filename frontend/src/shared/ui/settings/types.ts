import type { ElementType } from "react";

export interface SettingsSidebarItem {
  label: string;
  to: string;
  icon?: ElementType;
  danger?: boolean;
}