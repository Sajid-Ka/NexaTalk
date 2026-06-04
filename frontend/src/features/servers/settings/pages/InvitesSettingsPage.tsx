import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Copy, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";

import Button from "../../../../shared/ui/Button";
import Input from "../../../../shared/ui/Input";
import ConfirmModal from "../../../../shared/ui/ConfirmModal";
import SettingsPageContainer from "../../../../shared/ui/settings/SettingsPageContainer";
import SettingsPageHeader from "../../../../shared/ui/settings/SettingsPageHeader";
import SettingsSection from "../../../../shared/ui/settings/SettingsSection";
import type { ServerInvite } from "../../core/types";
import {
  createInviteApi,
  getServerInvitesApi,
  revokeInviteApi,
} from "../api/serverSettingsApi";

type ServerInvitesResponse = {
  success: boolean;
  message?: string;
  data: ServerInvite[];
};

type ServerInviteResponse = {
  success: boolean;
  message?: string;
  data: ServerInvite;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error?.message ?? fallback;
  }

  return fallback;
};

const formatDate = (value: string | null) => {
  if (!value) return "Never expires";

  return new Date(value).toLocaleDateString();
};

export default function InvitesSettingsPage() {
  const { serverId } = useParams<{ serverId: string }>();

  const [invites, setInvites] = useState<ServerInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [maxUses, setMaxUses] = useState("10");
  const [expiresInDays, setExpiresInDays] = useState("7");
  const [revokeModal, setRevokeModal] = useState<{
    isOpen: boolean;
    invite: ServerInvite | null;
  }>({
    isOpen: false,
    invite: null,
  });

  const fetchInvites = useCallback(async () => {
    if (!serverId) return;

    try {
      setLoading(true);

      const response = await getServerInvitesApi(serverId);
      const payload = response.data as ServerInvitesResponse;

      setInvites(payload.data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load invites"));
    } finally {
      setLoading(false);
    }
  }, [serverId]);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  const handleCreateInvite = async () => {
    if (!serverId) return;

    try {
      setCreating(true);

      const response = await createInviteApi(serverId, {
        maxUses: Number(maxUses) || 10,
        expiresInDays: Number(expiresInDays) || 7,
      });

      const payload = response.data as ServerInviteResponse;

      setInvites((current) => [payload.data, ...current]);
      toast.success("Invite created");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to create invite"));
    } finally {
      setCreating(false);
    }
  };

  const handleCopyInvite = async (inviteUrl: string) => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast.success("Invite link copied");
    } catch {
      toast.error("Failed to copy invite link");
    }
  };

  const handleRevokeInvite = async () => {
    if (!serverId || !revokeModal.invite) return;

    try {
      setActionLoading(revokeModal.invite.id);

      await revokeInviteApi(serverId, revokeModal.invite.id);

      setInvites((current) =>
        current.filter((invite) => invite.id !== revokeModal.invite?.id),
      );

      toast.success("Invite revoked");
      setRevokeModal({ isOpen: false, invite: null });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to revoke invite"));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <SettingsPageContainer>
      <SettingsPageHeader
        title="Invites"
        description="Create invite links, review active invites, and revoke links that should no longer be used."
        actions={
          <Button
            type="button"
            variant="secondary"
            className="gap-2"
            isLoading={loading}
            onClick={fetchInvites}
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
        }
      />

      <SettingsSection
        title="Create Invite"
        description="Generate a new invite link for this server."
      >
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <Input
            label="Max Uses"
            type="number"
            min={0}
            max={100}
            value={maxUses}
            onChange={(event) => setMaxUses(event.target.value)}
          />

          <Input
            label="Expires In Days"
            type="number"
            min={1}
            max={30}
            value={expiresInDays}
            onChange={(event) => setExpiresInDays(event.target.value)}
          />

          <Button
            type="button"
            className="gap-2"
            isLoading={creating}
            onClick={handleCreateInvite}
          >
            <Plus size={16} />
            Create
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Active Invites"
        description={`${invites.length} invite${invites.length === 1 ? "" : "s"} available.`}
      >
        {loading ? (
          <div className="flex min-h-48 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-sm text-slate-400">
            Loading invites...
          </div>
        ) : invites.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-sm text-slate-400">
            No invites found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[760px]">
              <thead className="bg-white/[0.03]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Invite
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Uses
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Expires
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {invites.map((invite) => (
                  <tr key={invite.id} className="border-t border-white/5">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{invite.code}</p>
                      <p className="mt-1 max-w-sm truncate text-xs text-slate-400">
                        {invite.inviteUrl}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {invite.uses}
                      {invite.maxUses > 0 ? ` / ${invite.maxUses}` : " / unlimited"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-400">
                      {formatDate(invite.expiresAt)}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(invite.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="gap-2"
                          onClick={() => handleCopyInvite(invite.inviteUrl)}
                        >
                          <Copy size={14} />
                          Copy
                        </Button>

                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="gap-2"
                          isLoading={actionLoading === invite.id}
                          onClick={() =>
                            setRevokeModal({ isOpen: true, invite })
                          }
                        >
                          <Trash2 size={14} />
                          Revoke
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SettingsSection>

      <ConfirmModal
        isOpen={revokeModal.isOpen}
        onClose={() => setRevokeModal({ isOpen: false, invite: null })}
        onConfirm={handleRevokeInvite}
        title="Revoke Invite"
        message={`Are you sure you want to revoke invite "${revokeModal.invite?.code}"? This link will stop working immediately.`}
        confirmText="Revoke"
        cancelText="Cancel"
        variant="danger"
      />
    </SettingsPageContainer>
  );
}