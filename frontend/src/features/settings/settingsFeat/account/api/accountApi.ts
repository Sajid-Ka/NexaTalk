import { api } from "../../../../../shared/api/axios";
import type { ChangePasswordFormData } from "../validators/accountSchema";

export const changePasswordApi = async (data: ChangePasswordFormData) => {
  return await api.put("/users/me/password", data);
};

export const requestEmailChangeApi = async (data: { currentPassword: string; newEmail: string }) => {
  return await api.post("/users/me/request-email-change", data);
};

export const deleteAccountApi = async () => {
  return await api.delete("/users/me");
};
