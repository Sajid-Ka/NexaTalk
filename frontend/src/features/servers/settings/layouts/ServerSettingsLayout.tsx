import {
  Shield,
  Users,
  Ticket,
  ClipboardList,
  Ban,
  AlertTriangle,
} from "lucide-react";
import UserStatusFooter from "../../../home/components/UserStatusFooter";
import { useParams, Navigate, useLocation } from "react-router-dom";
import SettingsLayout from "../../../../shared/layouts/SettingsLayout";
import { useAppSelector } from "../../../../app/store";
import { ServerMemberRole } from "../../../../shared/constants/server.const";

export default function ServerSettingsLayout() {
  const { serverId } = useParams();
  const { pathname } = useLocation();
  const { currentServer } = useAppSelector((state) => state.servers);

  const items = [
    {
      label: "Overview",
      to: `/servers/${serverId}/settings/overview`,
      icon: Shield,
    },
    {
      label: "Members",
      to: `/servers/${serverId}/settings/members`,
      icon: Users,
    },
    {
      label: "Invites",
      to: `/servers/${serverId}/settings/invites`,
      icon: Ticket,
    },
    {
      label: "Audit Logs",
      to: `/servers/${serverId}/settings/audit-logs`,
      icon: ClipboardList,
    },
    {
      label: "Bans",
      to: `/servers/${serverId}/settings/bans`,
      icon: Ban,
    },
    {
      label: "Danger Zone",
      to: `/servers/${serverId}/settings/danger`,
      icon: AlertTriangle,
      danger: true,
    },
  ];

  const filteredItems = items.filter((item) => {
    if (currentServer?.userRole === ServerMemberRole.MEMBER) {
      return item.label === "Danger Zone";
    }
    return true;
  });

  if (currentServer?.userRole === ServerMemberRole.MEMBER && !pathname.endsWith('/danger')) {
    return <Navigate to={`/servers/${serverId}/settings/danger`} replace />;
  }

  return (
    <SettingsLayout
      title="Server Settings"
      items={filteredItems}
      backTo={`/servers/${serverId}`}
      sidebarFooter={<UserStatusFooter />}
    />
  );
}