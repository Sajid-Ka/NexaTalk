import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import SettingsNavItem from "./SettingsNavItem";
import type { SettingsSidebarItem } from "./types";

interface SettingsSidebarProps {
  title: string;
  items: SettingsSidebarItem[];
  backTo: string;
  footer?: ReactNode;
}

export default function SettingsSidebar({
  title,
  items,
  backTo,
  footer,
}: SettingsSidebarProps) {
  const navigate = useNavigate();

  return (
    <aside className="flex h-screen w-[300px] shrink-0 flex-col border-r border-white/10 bg-[#0B1020]">
      <div className="flex items-center justify-between border-b border-white/10 p-5">
        <h1 className="text-lg font-bold text-white">{title}</h1>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            // Check if there is a previous page within the app's history
            if(window.history.state && window.history.state.idx > 0) {
              navigate(-1);
            }else{
              navigate(backTo)
            }
          }}
          className="text-slate-300 hover:bg-white/10"
        >
          <ArrowLeft size={18} />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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

      {footer && <div className="border-t border-white/10">{footer}</div>}
    </aside>
  );
}