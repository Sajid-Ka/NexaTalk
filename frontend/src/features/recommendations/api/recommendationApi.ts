import { useQuery } from "@tanstack/react-query";
import { api } from "../../../shared/api/axios";

export interface RecommendedUserResponse {
  id: string;
  username: string;
  avatar: string;
  mutualInterestCount: number;
  mutualInterests: string[];
  recommendationScore: number;
  isOnline: boolean;
}

export interface RecommendedServerResponse {
  id: string;
  name: string;
  icon: string | null;
  memberCount: number;
  tag: string;
  matchedInterest: string;
  recommendationScore: number;
}

export const recommendationKeys = {
  all: ["recommendations"] as const,
  users: () => [...recommendationKeys.all, "users"] as const,
  servers: () => [...recommendationKeys.all, "servers"] as const,
};

export const useRecommendedUsersQuery = (limit = 5, enabled = true) => {
  return useQuery({
    queryKey: [...recommendationKeys.users(), limit],
    queryFn: async () => {
      const response = await api.get<{ data: RecommendedUserResponse[] }>(`/recommendations/v1/users?limit=${limit}`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 1, // Don't aggressively retry if recommendations fail
    enabled,
  });
};

export const useRecommendedServersQuery = (limit = 5, enabled = true) => {
  return useQuery({
    queryKey: [...recommendationKeys.servers(), limit],
    queryFn: async () => {
      const response = await api.get<{ data: RecommendedServerResponse[] }>(`/recommendations/v1/servers?limit=${limit}`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
    enabled,
  });
};

import { useQueryClient } from "@tanstack/react-query";

export const useInvalidateRecommendations = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: recommendationKeys.all });
  };
};
