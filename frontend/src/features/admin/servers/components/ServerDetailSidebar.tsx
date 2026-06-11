import { Calendar, Hash, Shield, Users } from "lucide-react";
import Avatar from "../../../../shared/ui/Avatar";
import type { ServerTableRow } from "../type/serverManagement.types";
import type { ElementType } from "react";

interface ServerDetailSidebarProps {
  server: ServerTableRow | null;
}

export default function ServerDetailSidebar({
  server,
}: ServerDetailSidebarProps) {
  if (!server) {
    return (
      <div className="flex min-h-[420px] items-center justify-center text-center text-sm text-gray-500">
        Select a server to view details.
      </div>
    );
  }

  const isDisabled = server.raw.isDisabled;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <Avatar
          src={server.raw.icon}
          fallback={server.initials}
          size="xl"
          className="mb-4"
        />

        <h2 className="text-lg font-black text-white">{server.name}</h2>

        <p className="mt-1 text-xs text-gray-500">
          Server ID: {server.id.slice(-8)}
        </p>

        <span
          className={`mt-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
            isDisabled
              ? "bg-red-500/10 text-red-300"
              : "bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {isDisabled ? "Disabled" : "Active"}
        </span>
      </div>

      <div className="space-y-3">
        <DetailItem
          icon={Users}
          label="Members"
          value={server.memberCount.toLocaleString()}
        />

        <DetailItem
          icon={Shield}
          label="Owner"
          value={`@${server.ownerUsername}`}
        />

        <DetailItem
          icon={Calendar}
          label="Created"
          value={server.createdDate}
        />

        <DetailItem
          icon={Hash}
          label="Category"
          value={server.raw.tag ?? "No category"}
        />
      </div>

      {server.raw.description && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Description
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-300">
            {server.raw.description}
          </p>
        </div>
      )}
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-slate-300" />

        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}