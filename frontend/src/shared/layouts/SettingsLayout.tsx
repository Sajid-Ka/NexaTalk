import { Outlet } from "react-router-dom";
import SettingsSidebar from "../ui/settings/SettingsSidebar";
import type { SettingsSidebarItem } from "../ui/settings/types";

interface SettingsLayoutProps {
  title: string;
  items: SettingsSidebarItem[];
  backTo: string;
}

export default function SettingsLayout({
  title,
  items,
  backTo,
}: SettingsLayoutProps) {
  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        <SettingsSidebar
          title={title}
          items={items}
          backTo={backTo}
        />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}