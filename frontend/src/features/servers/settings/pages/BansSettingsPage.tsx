import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Ban, ShieldOff, Trash2, UserPlus, X } from "lucide-react";
import { useParams } from "react-router-dom";
import Button from "../../../../shared/ui/Button";
import Input from "../../../../shared/ui/Input";
import TextArea from "../../../../shared/ui/TextArea";
import ConfirmModal from "../../../../shared/ui/ConfirmModal";
import SettingsPageContainer from "../../../../shared/ui/settings/SettingsPageContainer";
import SettingsPageHeader from "../../../../shared/ui/settings/SettingsPageHeader";
import SettingsSection from "../../../../shared/ui/settings/SettingsSection";
import { searchServerBanCandidatesApi } from "../api/serverSettingsApi";
import Avatar from "../../../../shared/ui/Avatar";
import {
  banServerMemberApi,
  getServerBansApi,
  unbanServerMemberApi,
} from "../api/serverSettingsApi";
import type { ServerBan, ServerBanCandidate } from "../types";

type ServerBansResponse = {
  success: boolean;
  message?: string;
  data: ServerBan[];
};

type ServerBanResponse = {
  success: boolean;
  message?: string;
  data: ServerBan;
};

const SEARCH_DEBOUNCE_MS = 500;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error?.message ?? fallback;
  }

  return fallback;
};

export default function BansSettingsPage() {
  const { serverId } = useParams<{ serverId: string }>();

  const [bans, setBans] = useState<ServerBan[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [candidates, setCandidates] = useState<ServerBanCandidate[]>([]);
  const [selectedUser, setSelectedUser] = useState<ServerBanCandidate | null>(null);
  const [searching, setSearching] = useState(false);
  const [reason, setReason] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [unbanModal, setUnbanModal] = useState<{
    isOpen: boolean;
    ban: ServerBan | null;
  }>({
    isOpen: false,
    ban: null,
  });

  const fetchBans = useCallback(async () => {
    if (!serverId) return;

    try {
      setLoading(true);

      const response = await getServerBansApi(serverId);
      const payload = response.data as ServerBansResponse;

      setBans(payload.data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load bans"));
    } finally {
      setLoading(false);
    }
  }, [serverId]);

  useEffect(() => {
    fetchBans();
  }, [fetchBans]);

  // Debounce search input — search runs after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Auto-search when debounced query changes
  useEffect(() => {
    if (!serverId) return;

    if (debouncedSearch.length < 2) {
      setCandidates([]);
      setHasSearched(false);
      setSearching(false);
      return;
    }

    let ignore = false;

    const search = async () => {
      try {
        setSearching(true);
        setHasSearched(true);

        const response = await searchServerBanCandidatesApi(
          serverId,
          debouncedSearch,
        );

        const payload = response.data as {
          success: boolean;
          message?: string;
          data: ServerBanCandidate[];
        };

        if (!ignore) {
          setCandidates(payload.data ?? []);
        }
      } catch (error) {
        if (!ignore) {
          toast.error(getErrorMessage(error, "Failed to search users"));
          setCandidates([]);
        }
      } finally {
        if (!ignore) {
          setSearching(false);
        }
      }
    };

    search();

    return () => {
      ignore = true;
    };
  }, [debouncedSearch, serverId]);

  const handleBanUser = async () => {
    if (!serverId || !selectedUser) return;

    try {
      setCreating(true);

      const response = await banServerMemberApi(serverId, {
        userId: selectedUser.id,
        reason: reason.trim() || undefined,
      });

      const payload = response.data as ServerBanResponse;

      setBans((current) => [payload.data, ...current]);
      setSearchQuery("");
      setDebouncedSearch("");
      setCandidates([]);
      setSelectedUser(null);
      setReason("");
      setHasSearched(false);
      setBanModalOpen(false);

      toast.success("User banned successfully");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to ban user"));
    } finally {
      setCreating(false);
    }
  };

  const handleUnbanUser = async () => {
    if (!serverId || !unbanModal.ban) return;

    try {
      setActionLoading(unbanModal.ban.userId);

      await unbanServerMemberApi(serverId, unbanModal.ban.userId);

      setBans((current) =>
        current.filter((ban) => ban.userId !== unbanModal.ban?.userId),
      );

      toast.success("User unbanned successfully");
      setUnbanModal({ isOpen: false, ban: null });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to unban user"));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <SettingsPageContainer>
      <SettingsPageHeader
        title="Bans"
        description="Manage users who are blocked from joining this server."
      />

      <SettingsSection
        title="Ban User"
        description="Search by username or email, select a user, then ban them from this server."
        danger
      >
        <div className="space-y-5">
          <div>
            <Input
              label="Search User"
              value={searchQuery}
              placeholder="Search by username or email"
              disabled={creating}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setSelectedUser(null);
              }}
            />

            {searching && (
              <p className="mt-2 text-xs text-slate-400">Searching...</p>
            )}
          </div>

          {selectedUser ? (
            <div className="flex items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={selectedUser.avatar}
                  fallback={selectedUser.username}
                  size="md"
                />

                <div>
                  <p className="font-medium text-white">{selectedUser.username}</p>
                  <p className="text-xs text-slate-400">{selectedUser.email}</p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={creating}
                onClick={() => setSelectedUser(null)}
              >
                <X size={16} />
              </Button>
            </div>
          ) : candidates.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-white/10">
              {candidates.map((candidate) => (
                <button
                  key={candidate.id}
                  type="button"
                  className="flex w-full items-center justify-between border-t border-white/5 px-4 py-3 text-left first:border-t-0 hover:bg-white/[0.04]"
                  onClick={() => setSelectedUser(candidate)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={candidate.avatar}
                      fallback={candidate.username}
                      size="md"
                    />

                    <div>
                      <p className="font-medium text-white">{candidate.username}</p>
                      <p className="text-xs text-slate-400">{candidate.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {candidate.serverRole && (
                      <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300">
                        {candidate.serverRole}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 text-sm font-medium text-red-300">
                      <UserPlus size={15} />
                      Select
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : hasSearched && !searching ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">
              No matching users found. Try a different username or email.
            </div>
          ) : null}

          <TextArea
            rows={4}
            value={reason}
            placeholder="Reason for ban..."
            disabled={creating}
            onChange={(event) => setReason(event.target.value)}
          />

          <div className="flex justify-end">
            <Button
              type="button"
              variant="destructive"
              className="gap-2 whitespace-nowrap"
              disabled={!selectedUser || creating}
              onClick={() => setBanModalOpen(true)}
            >
              <Ban size={16} className="shrink-0" />
              Ban User
            </Button>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Banned Users"
        description={`${bans.length} banned user${bans.length === 1 ? "" : "s"}.`}
      >
        {loading ? (
          <div className="flex min-h-48 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-sm text-slate-400">
            Loading bans...
          </div>
        ) : bans.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-center">
            <ShieldOff className="mb-3 text-slate-500" size={32} />
            <p className="font-medium text-white">No banned users</p>
            <p className="mt-1 text-sm text-slate-400">
              Banned users will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[760px]">
              <thead className="bg-white/[0.03]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Reason
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Banned At
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {bans.map((ban) => (
                  <tr key={ban.id} className="border-t border-white/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={ban.avatar}
                          fallback={ban.username}
                          size="md"
                        />

                        <div>
                          <p className="font-medium text-white">
                            {ban.username}
                          </p>
                          <p className="text-xs text-slate-400">
                            #{ban.userId.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-400">
                      {ban.reason || "No reason provided"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(ban.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="gap-2 whitespace-nowrap"
                          isLoading={actionLoading === ban.userId}
                          onClick={() => setUnbanModal({ isOpen: true, ban })}
                        >
                          <Trash2 size={14} className="shrink-0" />
                          Unban
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
        isOpen={banModalOpen}
        onClose={() => setBanModalOpen(false)}
        onConfirm={handleBanUser}
        title="Ban User"
        message={
          selectedUser
            ? `Are you sure you want to ban "${selectedUser.username}" from this server? They will not be able to join again.${
                reason.trim() ? ` Reason: ${reason.trim()}` : ""
              }`
            : "Are you sure you want to ban this user?"
        }
        confirmText="Ban User"
        cancelText="Cancel"
        variant="danger"
      />

      <ConfirmModal
        isOpen={unbanModal.isOpen}
        onClose={() => setUnbanModal({ isOpen: false, ban: null })}
        onConfirm={handleUnbanUser}
        title="Unban User"
        message={`Allow "${unbanModal.ban?.username}" to join this server again?`}
        confirmText="Unban"
        cancelText="Cancel"
        variant="warning"
      />
    </SettingsPageContainer>
  );
}