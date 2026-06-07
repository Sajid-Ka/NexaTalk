import { useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AlertTriangle, Trash2, LogOut } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../../shared/ui/Button";
import Input from "../../../../shared/ui/Input";
import Modal from "../../../../shared/ui/Modal";
import SettingsPageContainer from "../../../../shared/ui/settings/SettingsPageContainer";
import SettingsPageHeader from "../../../../shared/ui/settings/SettingsPageHeader";
import SettingsSection from "../../../../shared/ui/settings/SettingsSection";
import { AppRoute } from "../../../../shared/constants/app-route.const";
import { ServerMemberRole } from "../../../../shared/constants/server.const";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { removeServerFromState } from "../../core/store/serverSlice";
import { deleteServerApi, leaveServerApi } from "../api/serverSettingsApi";
import { useAuth } from "../../../auth/context/useAuth";
import ConfirmModal from "../../../../shared/ui/modals/ConfirmModal";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error?.message ?? fallback;
  }

  return fallback;
};

export default function DangerZonePage() {
  const { serverId } = useParams<{ serverId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentServer, userServers } = useAppSelector((state) => state.servers);
  const { user } = useAuth();

  const serverOwnerId = currentServer?.ownerId ?? userServers.find((server) => server.id === serverId)
  const isOwner = user?.id === serverOwnerId;

  const serverName = useMemo(() => {
    return (
      currentServer?.name ??
      userServers.find((server) => server.id === serverId)?.name ??
      ""
    );
  }, [currentServer?.name, serverId, userServers]);

  const [confirmationText, setConfirmationText] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canDelete = serverName.length > 0 && confirmationText === serverName;

  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const handleDeleteServer = async () => {
    if (!serverId || !canDelete) return;

    try {
      setDeleting(true);

      await deleteServerApi(serverId);

      dispatch(removeServerFromState(serverId));

      toast.success("Server deleted successfully");
      navigate(AppRoute.HOME_PAGE, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete server"));
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const handleLeaveServer = async () => {
    if (!serverId) return;

    try {
      setLeaving(true);
      await leaveServerApi(serverId);
      dispatch(removeServerFromState(serverId));
      toast.success("You left the server.");
      navigate(AppRoute.HOME_PAGE, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to leave server"));
    } finally {
      setLeaving(false);
      setLeaveModalOpen(false);
    }
  };

  return (
    <SettingsPageContainer>
      <SettingsPageHeader
        title="Danger Zone"
        description="Permanent actions for this server. These changes cannot be undone."
      />

      {currentServer?.userRole !== ServerMemberRole.MEMBER && (
        <SettingsSection
          title="Delete Server"
          description="Delete this server, remove its invites, and make it unavailable to members."
          danger
        >
          <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-red-500/10 text-red-300">
                  <AlertTriangle size={22} />
                </div>

                <div>
                  <p className="font-bold text-red-200">
                    Delete this server permanently
                  </p>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    This will delete the server and revoke all active invite links.
                    Only the server owner can perform this action.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="destructive"
                className="gap-2 whitespace-nowrap"
                disabled={!isOwner}
                onClick={() => setDeleteModalOpen(true)}
              >
                <Trash2 size={16} className="shrink-0" />
                <span>Delete Server</span>
              </Button>
            </div>
          </div>
        </SettingsSection>
      )}

      <SettingsSection
        title="Leave Server"
        description="Leave this server and remove it from your server list."
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/5 text-slate-300">
                <LogOut size={22} />
              </div>

              <div>
                <p className="font-bold text-white">Leave this server</p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  You will no longer have access to this server's channels or members.
                  You can rejoin if you receive a new invite.
                </p>
                {isOwner && (
                  <p className="mt-2 text-sm font-medium text-amber-500">
                    You must transfer ownership before leaving this server.
                  </p>
                )}
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              className="gap-2 whitespace-nowrap"
              disabled={isOwner}
              onClick={() => setLeaveModalOpen(true)}
            >
              <LogOut size={16} className="shrink-0" />
              <span>Leave Server</span>
            </Button>
          </div>
        </div>
      </SettingsSection>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!deleting) {
            setDeleteModalOpen(false);
            setConfirmationText("");
          }
        }}
        title="Delete Server"
        className="max-w-xl border-red-500/20"
      >
        <div className="space-y-6">
          <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4">
            <div className="flex gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-500/10 text-red-300">
                <AlertTriangle size={20} />
              </div>

              <div>
                <p className="font-semibold text-red-200">
                  This action cannot be undone
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  This will permanently delete{" "}
                  <span className="font-semibold text-white">{serverName}</span>,
                  revoke all active invite links, and remove access for members.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Type{" "}
              <span className="font-semibold text-white">{serverName}</span>{" "}
              to confirm
            </label>

            <Input
              autoFocus
              value={confirmationText}
              disabled={deleting}
              placeholder={serverName}
              onChange={(event) => setConfirmationText(event.target.value)}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              disabled={deleting}
              onClick={() => {
                setDeleteModalOpen(false);
                setConfirmationText("");
              }}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              className="gap-2 whitespace-nowrap"
              disabled={!canDelete}
              isLoading={deleting}
              onClick={handleDeleteServer}
            >
              <Trash2 size={16} className="shrink-0" />
              <span>Delete Server</span>
            </Button>
          </div>
        </div>
      </Modal>

      {deleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 pointer-events-none">
          <div className="mt-28 w-full max-w-md pointer-events-auto">
            <Input
              autoFocus
              value={confirmationText}
              disabled={deleting}
              placeholder={serverName}
              onChange={(event) => setConfirmationText(event.target.value)}
            />

            <Button
              type="button"
              variant="destructive"
              className="mt-4 w-full gap-2"
              disabled={!canDelete}
              isLoading={deleting}
              onClick={handleDeleteServer}
            >
              <Trash2 size={16} />
              Confirm Delete
            </Button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        onConfirm={handleLeaveServer}
        title="Leave Server?"
        description="Are you sure you want to leave this server?"
        confirmText="Leave Server"
        destructive
        loading={leaving}
      />
    </SettingsPageContainer>
  );
}