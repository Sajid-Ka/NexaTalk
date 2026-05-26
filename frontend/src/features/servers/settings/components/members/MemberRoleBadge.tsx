import { Crown, Shield } from "lucide-react";
import { ServerMemberRole } from "../../../../../shared/constants/server.const";

interface Props {
  role: ServerMemberRole;
}

export default function MemberRoleBadge({
  role,
}: Props) {
  if (role === ServerMemberRole.OWNER) {
    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2 py-1 text-xs font-semibold text-amber-300">
        <Crown size={12} />
        Owner
      </div>
    );
  }

  if (role === ServerMemberRole.ADMIN) {
    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-semibold text-indigo-300">
        <Shield size={12} />
        Admin
      </div>
    );
  }

  return (
    <div className="inline-flex items-center rounded-full bg-white/5 px-2 py-1 text-xs font-medium text-slate-300">
      Member
    </div>
  );
}