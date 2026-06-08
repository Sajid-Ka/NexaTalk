import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";
import { AlertTriangle, Trash2, KeyRound, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../../../../../shared/ui/Button";
import Input from "../../../../../shared/ui/Input";
import Modal from "../../../../../shared/ui/Modal";
import SettingsPageContainer from "../../../../../shared/ui/settings/SettingsPageContainer";
import SettingsPageHeader from "../../../../../shared/ui/settings/SettingsPageHeader";
import SettingsSection from "../../../../../shared/ui/settings/SettingsSection";

import { useAuth } from "../../../../auth/context/useAuth";
import { AppRoute } from "../../../../../shared/constants/app-route.const";
import {
  changePasswordSchema,
  changeEmailSchema,
} from "../validators/accountSchema";
import type { ChangeEmailFormData, ChangePasswordFormData } from "../validators/accountSchema";
import { changePasswordApi, changeEmailApi, deleteAccountApi } from "../api/accountApi";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const errData = error.response?.data?.error;
    if (errData?.details && Array.isArray(errData.details) && errData.details.length > 0) {
      return errData.details.map((d: { message: string }) => d.message).join(", ");
    }
    return errData?.message ?? error.response?.data?.message ?? fallback;
  }
  return fallback;
};

export default function AccountSettings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Modals & States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  const canDelete = confirmationText === "DELETE";

  // Password Form
  const {
    register: registerPassword,
    getValues: getPasswordValues,
    trigger: triggerPasswordValidation,
    reset: resetPasswordForm,
    setError: setPasswordError,
    formState: { errors: passwordErrors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  // Email Form
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    reset: resetEmailForm,
    setError: setEmailError,
    formState: { errors: emailErrors, isSubmitting: isSubmittingEmail },
  } = useForm<ChangeEmailFormData>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      newEmail: "",
      passwordConfirmation: "",
    },
  });

  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  const onPasswordSubmitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = getPasswordValues();

    try {
      setIsPasswordSubmitting(true);
      await changePasswordApi(data);
      toast.success("Password updated successfully");
      resetPasswordForm();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errData = error.response?.data?.error;
        if (errData?.message === "Incorrect current password") {
          setPasswordError("currentPassword", { type: "manual", message: errData.message });
          return; // Stop here, do not show other errors yet
        }
      }

      // If current password was correct, or we hit another error, trigger frontend validations
      const isFrontendValid = await triggerPasswordValidation();

      if (isFrontendValid && axios.isAxiosError(error)) {
        const errData = error.response?.data?.error;
        if (errData?.message === "New password must be different from your current password") {
          setPasswordError("newPassword", { type: "manual", message: errData.message });
        } else if (errData?.message === "Passwords do not match") {
          setPasswordError("confirmNewPassword", { type: "manual", message: errData.message });
        } else if (errData?.details && Array.isArray(errData.details)) {
          errData.details.forEach((err: { path: string; message: string }) => {
            if (err.path === "newPassword") {
              setPasswordError("newPassword", { type: "manual", message: err.message });
            }
          });
        } else {
          toast.error(errData?.message || "Failed to update password");
        }
      } else if (!isFrontendValid) {
        // Do nothing, triggerPasswordValidation already set the errors
      } else {
        toast.error("Failed to update password");
      }
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  const onEmailSubmit = async (data: ChangeEmailFormData) => {
    try {
      await changeEmailApi(data);
      toast.success("Email updated successfully");
      resetEmailForm();
    } catch (error) {
      const message = getErrorMessage(error, "Failed to update email");
      if (message === "Incorrect password") {
        setEmailError("passwordConfirmation", { type: "manual", message });
      } else if (message === "Email is already in use") {
        setEmailError("newEmail", { type: "manual", message });
      } else {
        toast.error(message);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!canDelete) return;

    try {
      setDeleting(true);
      await deleteAccountApi();
      toast.success("Account deleted successfully");
      await logout();
      navigate(AppRoute.LOGIN, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete account"));
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setConfirmationText("");
    }
  };

  return (
    <SettingsPageContainer>
      <SettingsPageHeader
        title="Account & Security"
        description="Manage your account security, password, and email address."
      />

      <SettingsSection
        title="Password"
        description="Update your password to keep your account secure."
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <form onSubmit={onPasswordSubmitManual} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Current Password"
                {...registerPassword("currentPassword")}
                error={passwordErrors.currentPassword?.message}
                className="bg-white/[0.03] border-white/5 h-12"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="New Password"
                {...registerPassword("newPassword")}
                error={passwordErrors.newPassword?.message}
                className="bg-white/[0.03] border-white/5 h-12"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Confirm New Password"
                {...registerPassword("confirmNewPassword")}
                error={passwordErrors.confirmNewPassword?.message}
                className="bg-white/[0.03] border-white/5 h-12"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={isPasswordSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 h-10 px-6"
              >
                <KeyRound size={16} className="mr-2" />
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Email Address"
        description="Update the email associated with your account."
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Current Email"
                value={user?.email || ""}
                disabled
                className="bg-white/[0.03] border-white/5 h-12 opacity-50 cursor-not-allowed"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="New Email"
                {...registerEmail("newEmail")}
                error={emailErrors.newEmail?.message}
                className="bg-white/[0.03] border-white/5 h-12"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Current Password"
                {...registerEmail("passwordConfirmation")}
                error={emailErrors.passwordConfirmation?.message}
                className="bg-white/[0.03] border-white/5 h-12"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmittingEmail}
                className="bg-indigo-600 hover:bg-indigo-700 h-10 px-6"
              >
                <Mail size={16} className="mr-2" />
                Update Email
              </Button>
            </div>
          </form>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Danger Zone"
        description="Permanent account actions."
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
                  Delete Account
                </p>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Permanently delete your account and all associated data.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="destructive"
              className="gap-2 whitespace-nowrap"
              onClick={() => setDeleteModalOpen(true)}
            >
              <Trash2 size={16} className="shrink-0" />
              <span>Delete Account</span>
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
        title="Delete Account?"
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
                  All account data will be permanently deleted.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Type <span className="font-semibold text-white">DELETE</span> to continue.
            </label>

            <Input
              autoFocus
              value={confirmationText}
              disabled={deleting}
              placeholder="DELETE"
              onChange={(event) => setConfirmationText(event.target.value)}
              className="bg-white/[0.03] border-white/5"
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
              onClick={handleDeleteAccount}
            >
              <Trash2 size={16} className="shrink-0" />
              <span>Delete Account</span>
            </Button>
          </div>
        </div>
      </Modal>
    </SettingsPageContainer>
  );
}
