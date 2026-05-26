import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Ban,
  ClipboardList,
  RefreshCw,
  Shield,
  Ticket,
  Trash2,
  UserMinus,
  UserX,
} from "lucide-react";
import { useParams } from "react-router-dom";

import Button from "../../../../shared/ui/Button";
import SettingsPageContainer from "../../../../shared/ui/settings/SettingsPageContainer";
import SettingsPageHeader from "../../../../shared/ui/settings/SettingsPageHeader";
import SettingsSection from "../../../../shared/ui/settings/SettingsSection";
import { getServerAuditLogsApi } from "../api/serverSettingsApi";
import type { ServerAuditLog } from "../types";

type ServerAuditLogsResponse = {
  success: boolean;
  message?: string;
  data: ServerAuditLog[];
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error?.message ?? fallback;
  }

  return fallback;
};

const actionLabels: Record<string, string> = {
  MEMBER_ROLE_UPDATED: "Member role updated",
  MEMBER_KICKED: "Member kicked",
  INVITE_CREATED: "Invite created",
  INVITE_REVOKED: "Invite revoked",
  MEMBER_BANNED: "Member banned",
  MEMBER_UNBANNED: "Member unbanned",
  SERVER_DELETED: "Server deleted",
};

const getActionIcon = (action: string) => {
  switch (action) {
    case "MEMBER_ROLE_UPDATED":
      return Shield;
    case "MEMBER_KICKED":
      return UserMinus;
    case "INVITE_CREATED":
    case "INVITE_REVOKED":
      return Ticket;
    case "MEMBER_BANNED":
      return Ban;
    case "MEMBER_UNBANNED":
      return UserX;
    case "SERVER_DELETED":
      return Trash2;
    default:
      return ClipboardList;
  }
};

const formatMetadata = (metadata: Record<string, unknown>) => {
  const entries = Object.entries(metadata);

  if (entries.length === 0) {
    return "No details";
  }

  return entries
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(", ");
};

export default function AuditLogsPage() {
  const { serverId } = useParams<{ serverId: string }>();

  const [logs, setLogs] = useState<ServerAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    if (!serverId) return;

    try {
      setLoading(true);

      const response = await getServerAuditLogsApi(serverId, {
        limit: 50,
        offset: 0,
      });

      const payload = response.data as ServerAuditLogsResponse;

      setLogs(payload.data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load audit logs"));
    } finally {
      setLoading(false);
    }
  }, [serverId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <SettingsPageContainer>
      <SettingsPageHeader
        title="Audit Logs"
        description="Review important moderation and server management actions."
        actions={
          <Button
            type="button"
            variant="secondary"
            className="gap-2"
            isLoading={loading}
            onClick={fetchLogs}
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
        }
      />

      <SettingsSection
        title="Recent Activity"
        description={`${logs.length} recent event${logs.length === 1 ? "" : "s"}.`}
      >
        {loading ? (
          <div className="flex min-h-48 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-sm text-slate-400">
            Loading audit logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-center">
            <ClipboardList className="mb-3 text-slate-500" size={32} />

            <p className="font-medium text-white">No audit logs yet</p>

            <p className="mt-1 text-sm text-slate-400">
              Server actions will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            {logs.map((log) => {
              const Icon = getActionIcon(log.action);

              return (
                <div
                  key={log.id}
                  className="flex gap-4 border-t border-white/5 p-5 first:border-t-0"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/10 text-slate-200">
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-semibold text-white">
                        {actionLabels[log.action] ?? log.action}
                      </p>

                      <p className="text-xs text-slate-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <p className="mt-1 text-sm text-slate-400">
                      By{" "}
                      <span className="font-medium text-slate-200">
                        {log.actorUsername}
                      </span>
                      {log.targetId ? ` • Target: ${log.targetId}` : ""}
                    </p>

                    <p className="mt-2 break-words text-xs text-slate-500">
                      {formatMetadata(log.metadata)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SettingsSection>
    </SettingsPageContainer>
  );
}