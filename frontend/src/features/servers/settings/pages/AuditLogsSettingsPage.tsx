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
  Settings,
  Hash,
  Crown
} from "lucide-react";
import { useParams } from "react-router-dom";
import Button from "../../../../shared/ui/Button";
import SettingsPageContainer from "../../../../shared/ui/settings/SettingsPageContainer";
import SettingsPageHeader from "../../../../shared/ui/settings/SettingsPageHeader";
import SettingsSection from "../../../../shared/ui/settings/SettingsSection";
import { getServerAuditLogsApi } from "../api/serverSettingsApi";
import type { ServerAuditLog } from "../types";
import { AuditLogAction, AUDIT_LOG_ACTION_LABELS } from "../../../../shared/constants/auditLog.const";

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
const getActionIcon = (action: string) => {
  if (action.startsWith("SERVER_")) return Settings;
  if (action === AuditLogAction.OWNERSHIP_TRANSFERRED) return Crown;
  if (action.startsWith("CHANNEL_")) return Hash;
  if (action === AuditLogAction.MEMBER_PROMOTED || action === AuditLogAction.MEMBER_DEMOTED) return Shield;
  if (action === AuditLogAction.MEMBER_KICKED) return UserMinus;
  if (action.includes("INVITE")) return Ticket;
  if (action === AuditLogAction.MEMBER_BANNED) return Ban;
  if (action === AuditLogAction.MEMBER_UNBANNED) return UserX;
  if (action === AuditLogAction.SERVER_DELETED) return Trash2;
  return ClipboardList;
};

export default function AuditLogsPage() {
  const { serverId } = useParams<{ serverId: string }>();

  const [logs, setLogs] = useState<ServerAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    if (!serverId) return;

    try {
      setLoading(true);
      const response = await getServerAuditLogsApi(serverId, { limit: 50, offset: 0 });
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
          <Button type="button" variant="secondary" className="gap-2" isLoading={loading} onClick={fetchLogs}>
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
            <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            Loading audit logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-center">
            <ClipboardList className="mb-3 text-slate-500" size={32} />
            <p className="font-medium text-white">No audit logs yet</p>
            <p className="mt-1 text-sm text-slate-400">Server actions will appear here.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            {logs.map((log) => {
              const Icon = getActionIcon(log.action);
              const label = AUDIT_LOG_ACTION_LABELS[log.action as keyof typeof AUDIT_LOG_ACTION_LABELS] ?? log.action;
              const hasDetails = log.details && Object.keys(log.details).filter(k => k !== "targetName").length > 0;

              return (
                <div key={log.id} className="flex gap-4 border-t border-white/5 p-5 first:border-t-0">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/5 text-slate-300">
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-semibold text-white">{label}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(log.createdAt).toLocaleString(undefined, {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div className="mt-2 text-sm text-slate-400">
                      <p>
                        <span className="font-medium text-slate-300">By:</span> {log.actorUsername}
                      </p>
                      {log.targetUsername && (
                        <p className="mt-0.5">
                          <span className="font-medium text-slate-300">Target:</span>{" "}
                          <span className={log.action.startsWith("CHANNEL_") ? "text-indigo-400 font-medium" : ""}>
                            {log.targetUsername}
                          </span>
                        </p>
                      )}
                    </div>

                    {hasDetails && (
                      <div className="mt-3 rounded-lg bg-black/20 p-3 text-sm text-slate-300">
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Details</p>
                        <div className="space-y-1.5">
                          {Object.entries(log.details).filter(([key]) => key !== "targetName").map(([key, value]) => (
                            <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                              <span className="shrink-0 font-medium text-slate-400">{key}:</span>
                              {typeof value === 'object' && value !== null ? (
                                <div className="flex flex-col">
                                  {Object.entries(value).map(([subKey, subVal]) => (
                                    <span key={subKey} className="text-slate-200">
                                      <span className="mr-1 text-xs text-slate-500">{subKey}</span>
                                      {String(subVal)}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="break-words text-slate-200">{String(value)}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
