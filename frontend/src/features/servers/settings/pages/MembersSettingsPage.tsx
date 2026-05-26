import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { RefreshCw, Users } from "lucide-react";
import Button from "../../../../shared/ui/Button";
import SettingsPageContainer from "../../../../shared/ui/settings/SettingsPageContainer";
import SettingsPageHeader from "../../../../shared/ui/settings/SettingsPageHeader";
import SettingsSection from "../../../../shared/ui/settings/SettingsSection";
import ConfirmModal from "../../../../shared/ui/modals/ConfirmModal";
import { ServerMemberRole } from "../../../../shared/constants/server.const";
import { useAuth } from "../../../auth/context/useAuth";
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

  const [members, setMembers] = useState<ServerSettingsMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [kickModal, setKickModal] = useState<{
    isOpen: boolean;
    member: ServerSettingsMember | null;
  }>({ isOpen: false, member: null });

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

  const handlePromoteToAdmin = async (member: ServerSettingsMember) => {
    if (!serverId) return;

    try {
      setActionLoading(member.id);
      await updateMemberRoleApi(serverId, member.userId, ServerMemberRole.ADMIN);

      setMembers((prev) =>
        prev.map((m) =>
          m.userId === member.userId ? { ...m, role: ServerMemberRole.ADMIN } : m
        )
      );

      toast.success(`${member.username} is now an admin`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to promote member"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDemoteToMember = async (member: ServerSettingsMember) => {
    if (!serverId) return;

    try {
      setActionLoading(member.id);
      await updateMemberRoleApi(serverId, member.userId, ServerMemberRole.MEMBER);

      setMembers((prev) =>
        prev.map((m) =>
          m.userId === member.userId ? { ...m, role: ServerMemberRole.MEMBER } : m
        )
      );

      toast.success(`${member.username} is now a member`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to demote member"));
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
        description={`${members.length} member${members.length === 1 ? "" : "s"} in this server.`}
      >
        {loading ? (
          <div className="flex min-h-48 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-sm text-slate-400">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            <span className="ml-2">Loading members...</span>
          </div>
        ) : members.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-center">
            <Users className="mb-3 text-slate-500" size={32} />
            <p className="font-medium text-white">No members found</p>
            <p className="mt-1 text-sm text-slate-400">
              Members will appear here after they join.
            </p>
          </div>
        ) : (
          <ServerMembersTable
            members={members}
            currentUserRole={currentUserRole}
            loading={actionLoading !== null}
            onPromote={handlePromoteToAdmin}
            onDemote={handleDemoteToMember}
            onKick={(member) => setKickModal({ isOpen: true, member })}
          />
        )}
      </SettingsSection>

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