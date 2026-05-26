import { Crown, Shield } from "lucide-react";
import { ServerMemberRole } from "../../../../../shared/constants/server.const";

interface MembersRoleBadgeProps {
  role: ServerMemberRole;
}

export default function MembersRoleBadge({ role }: MembersRoleBadgeProps) {
  if (role === ServerMemberRole.OWNER) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
        <Crown size={12} />
        Owner
      </span>
    );
  }

  if (role === ServerMemberRole.ADMIN) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-400">
        <Shield size={12} />
        Admin
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-400">
      Member
    </span>
  );
}