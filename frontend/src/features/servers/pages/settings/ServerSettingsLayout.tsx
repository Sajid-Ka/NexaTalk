import {
  Shield,
  Users,
  Ticket,
  ClipboardList,
  Ban,
  AlertTriangle,
} from "lucide-react";

import { useParams } from "react-router-dom";
import SettingsLayout from "../../../../shared/layouts/SettingsLayout";

export default function ServerSettingsLayout() {
  const { serverId } = useParams();

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

  return (
    <SettingsLayout
      title="Server Settings"
      items={items}
      backTo={`/servers/${serverId}`}
    />
  );
}