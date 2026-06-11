import { useQuery } from "@tanstack/react-query";
import { getUserSettingsApi } from "../api/userSettingsApi";

export const USER_SETTINGS_QUERY_KEY = ["user-settings"];

export const useUserSettings = () => {
  return useQuery({
    queryKey: USER_SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const res = await getUserSettingsApi();
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
