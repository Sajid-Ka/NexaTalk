import { NavLink, useParams } from "react-router-dom";

const items = [
  { label: "Overview", path: "overview" },
  { label: "Members", path: "members" },
  { label: "Invites", path: "invites" },
  { label: "Audit Logs", path: "audit-logs" },
  { label: "Bans", path: "bans" },
  { label: "Danger Zone", path: "danger" },
];

export default function SettingsSidebar() {
  const { serverId } = useParams();

  return (
    <nav className="space-y-1 p-3">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={`/servers/${serverId}/settings/${item.path}`}
          className={({ isActive }) =>
            `block rounded-xl px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-indigo-500/20 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}