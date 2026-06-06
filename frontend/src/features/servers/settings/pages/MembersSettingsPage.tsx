import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { RefreshCw, Users, Search } from "lucide-react";
import Button from "../../../../shared/ui/Button";
import SettingsPageContainer from "../../../../shared/ui/settings/SettingsPageContainer";
import SettingsPageHeader from "../../../../shared/ui/settings/SettingsPageHeader";
import SettingsSection from "../../../../shared/ui/settings/SettingsSection";
import ConfirmModal from "../../../../shared/ui/modals/ConfirmModal";
import { ServerMemberRole } from "../../../../shared/constants/server.const";
import { useAuth } from "../../../auth/context/useAuth";
import TransferOwnershipModal from "../../../../shared/ui/modals/TransferOwnershipModal";
import { transferOwnershipApi } from "../api/serverSettingsApi";
import {
  getServerMembersApi,
  updateMemberRoleApi,
  kickMemberApi,
} from "../api/serverSettingsApi";
import ServerMembersTable from "../components/members/ServerMembersTable";
import type { ServerSettingsMember } from "../types";

type ServerMembersResponse = {
  success: boolean;
  message?: string;
  data: ServerSettingsMember[];
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
};

export default function MembersSettingsPage() {
  const { serverId } = useParams<{ serverId: string }>();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [members, setMembers] = useState<ServerSettingsMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [kickModal, setKickModal] = useState<{
    isOpen: boolean;
    member: ServerSettingsMember | null;
  }>({ isOpen: false, member: null });

  const [promoteModal, setPromoteModal] = useState<{
    isOpen: boolean;
    member: ServerSettingsMember | null;
  }>({
    isOpen: false,
    member: null,
  });

  const [demoteModal, setDemoteModal] = useState<{
    isOpen: boolean;
    member: ServerSettingsMember | null;
  }>({
    isOpen: false,
    member: null,
  });

  const [transferModal, setTransferModal] = useState<{
    isOpen: boolean;
    member: ServerSettingsMember | null;
  }>({ isOpen: false, member: null });


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const currentUserRole = useMemo(() => {
    const currentMember = members.find((member) => member.userId === user?.id);
    return currentMember?.role ?? ServerMemberRole.MEMBER;
  }, [members, user?.id]);

  const fetchMembers = useCallback(async () => {
    if (!serverId) return;

    try {
      setLoading(true);
      const response = await getServerMembersApi(serverId);
      const payload = response.data as ServerMembersResponse;
      setMembers(payload.data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load server members"));
    } finally {
      setLoading(false);
    }
  }, [serverId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const filteredMembers = useMemo(() => {
    if (!debouncedSearch) return members;

    return members.filter((member) => {
      const username = member.username.toLowerCase();

      return username.includes(debouncedSearch) 
    });
  }, [members, debouncedSearch]);

  const handlePromoteToAdmin = (
    member: ServerSettingsMember
  ) => {
    setPromoteModal({
      isOpen: true,
      member,
    });
  };

  const confirmPromote = async () => {
    if (!serverId || !promoteModal.member) return;

    try {
      setActionLoading(promoteModal.member.id);

      await updateMemberRoleApi(
        serverId,
        promoteModal.member.userId,
        ServerMemberRole.ADMIN
      );

      setMembers((prev) =>
        prev.map((m) =>
          m.userId === promoteModal.member?.userId
            ? { ...m, role: ServerMemberRole.ADMIN }
            : m
        )
      );

      toast.success(
        `${promoteModal.member.username} is now an admin`
      );

      setPromoteModal({
        isOpen: false,
        member: null,
      });
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to promote member")
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDemoteToMember = (
    member: ServerSettingsMember
  ) => {
    setDemoteModal({
      isOpen: true,
      member,
    });
  };

  const confirmDemote = async () => {
    if (!serverId || !demoteModal.member) return;

    try {
      setActionLoading(demoteModal.member.id);

      await updateMemberRoleApi(
        serverId,
        demoteModal.member.userId,
        ServerMemberRole.MEMBER
      );

      setMembers((prev) =>
        prev.map((m) =>
          m.userId === demoteModal.member?.userId
            ? { ...m, role: ServerMemberRole.MEMBER }
            : m
        )
      );

      toast.success(
        `${demoteModal.member.username} is now a member`
      );

      setDemoteModal({
        isOpen: false,
        member: null,
      });
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to demote member")
      );
    } finally {
      setActionLoading(null);
    }
  };

  const confirmTransferOwnership = async () => {
    if (!serverId || !transferModal.member) return;

    try {
      setActionLoading(transferModal.member.id);
      await transferOwnershipApi(serverId, transferModal.member.userId);

      setMembers((prev) =>
        prev.map((m) => {
          if (m.userId === transferModal.member?.userId) {
            return { ...m, role: ServerMemberRole.OWNER };
          }
          if (m.userId === user?.id) {
            return { ...m, role: ServerMemberRole.ADMIN }; // Demote self to Admin
          }
          return m;
        })
      );

      toast.success(`Ownership transferred to ${transferModal.member.username}`);
      setTransferModal({ isOpen: false, member: null });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to transfer ownership"));
    } finally {
      setActionLoading(null);
    }
  };


  const handleKickMember = async () => {
    if (!serverId || !kickModal.member) return;

    try {
      setActionLoading(kickModal.member.id);
      await kickMemberApi(serverId, kickModal.member.userId);

      setMembers((prev) =>
        prev.filter((m) => m.userId !== kickModal.member?.userId)
      );

      toast.success(`${kickModal.member.username} has been kicked`);
      setKickModal({ isOpen: false, member: null });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to kick member"));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <SettingsPageContainer>
      <SettingsPageHeader
        title="Members"
        description="Review server members, promote trusted users, demote admins, or remove members."
        actions={
          <Button
            type="button"
            variant="secondary"
            className="gap-2"
            isLoading={loading}
            onClick={fetchMembers}
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
        }
      />

     

      <SettingsSection
        title="Server Members"
        description={
                      debouncedSearch
                        ? `${filteredMembers.length} matching member${filteredMembers.length === 1 ? "" : "s"} out of ${members.length}.`
                        : `${members.length} member${members.length === 1 ? "" : "s"} in this server.`
                    }
      >

         <div className="mb-4 flex items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search members by name, ID, or role..."
              className="h-11 w-full rounded-xl border border-white/10 bg-[#0F121D] pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {debouncedSearch && (
            <p className="shrink-0 text-sm text-slate-400">
              {filteredMembers.length} result{filteredMembers.length === 1 ? "" : "s"}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-sm text-slate-400">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            <span className="ml-2">Loading members...</span>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-center">
            <Users className="mb-3 text-slate-500" size={32} />
            <p className="font-medium text-white">No members found</p>
            <p className="mt-1 text-sm text-slate-400">
              Members will appear here after they join.
            </p>
          </div>
        ) : (
          <ServerMembersTable
            members={filteredMembers}
            currentUserRole={currentUserRole}
            tableLoading={loading}
            actionLoading={actionLoading !== null}
            onPromote={handlePromoteToAdmin}
            onDemote={handleDemoteToMember}
            onTransferOwnership={(member) => setTransferModal({ isOpen: true, member })}
            onKick={(member) => setKickModal({ isOpen: true, member })}
          />
        )}
      </SettingsSection>

      <ConfirmModal
        isOpen={promoteModal.isOpen}
        onClose={() =>
          setPromoteModal({
            isOpen: false,
            member: null,
          })
        }
        onConfirm={confirmPromote}
        title={`Promote ${promoteModal.member?.username}?`}
        description={`Are you sure you want to promote ${promoteModal.member?.username} to admin?`}
        confirmText="Promote to Admin"
        loading={actionLoading === promoteModal.member?.id}
      />

      <ConfirmModal
        isOpen={demoteModal.isOpen}
        onClose={() =>
          setDemoteModal({
            isOpen: false,
            member: null,
          })
        }
        onConfirm={confirmDemote}
        title={`Demote ${demoteModal.member?.username}?`}
        description={`Are you sure you want to remove admin privileges from ${demoteModal.member?.username}?`}
        confirmText="Demote to Member"
        destructive
        loading={actionLoading === demoteModal.member?.id}
      />

      <TransferOwnershipModal
        isOpen={transferModal.isOpen}
        username={transferModal.member?.username || ""}
        onClose={() => setTransferModal({ isOpen: false, member: null })}
        onConfirm={confirmTransferOwnership}
        loading={actionLoading === transferModal.member?.id}
      />


      <ConfirmModal
        isOpen={kickModal.isOpen}
        onClose={() => setKickModal({ isOpen: false, member: null })}
        onConfirm={handleKickMember}
        title={`Kick ${kickModal.member?.username}?`}
        description={`Are you sure you want to kick ${kickModal.member?.username} from this server? They can rejoin if invited.`}
        confirmText="Kick Member"
        destructive
        loading={actionLoading === kickModal.member?.id}
      />
    </SettingsPageContainer>
  );
}