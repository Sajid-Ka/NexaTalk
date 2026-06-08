import { api } from "../../../../../shared/api/axios";
import type { ChangePasswordFormData, ChangeEmailFormData } from "../validators/accountSchema";

export const changePasswordApi = async (data: ChangePasswordFormData) => {
  return await api.put("/users/me/password", data);
};

export const changeEmailApi = async (data: ChangeEmailFormData) => {
  return await api.put("/users/me/email", data);
};

export const deleteAccountApi = async () => {
  return await api.delete("/users/me");
};
