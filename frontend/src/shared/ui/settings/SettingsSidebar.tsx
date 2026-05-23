import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import SettingsNavItem from "./SettingsNavItem";
import type { SettingsSidebarItem } from "./types";

interface SettingsSidebarProps {
  title: string;
  items: SettingsSidebarItem[];
  backTo: string;
}

export default function SettingsSidebar({
  title,
  items,
  backTo,
}: SettingsSidebarProps) {
  const navigate = useNavigate();

  return (
    <aside className="w-[300px] border-r border-white/10 bg-[#0B1020]">
      <div className="flex items-center justify-between border-b border-white/10 p-5">
        <h1 className="text-lg font-bold text-white">{title}</h1>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => navigate(backTo)}
          className="text-slate-300 hover:bg-white/10"
        >
          <ArrowLeft size={18} />
        </Button>
      </div>

      <nav className="space-y-1 p-3">
        {items.map((item) => (
          <SettingsNavItem
            key={item.to}
            label={item.label}
            to={item.to}
            icon={item.icon}
            danger={item.danger}
          />
        ))}
      </nav>
    </aside>
  );
}