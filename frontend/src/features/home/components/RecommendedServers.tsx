import { useState } from "react";
import Avatar from "../../../shared/ui/Avatar";
import Button from "../../../shared/ui/Button";
import { useRecommendedServersQuery, useInvalidateRecommendations } from "../../recommendations/api/recommendationApi";
import { api } from "../../../shared/api/axios";
import toast from "react-hot-toast";

// Use API client to join server since we might not have a dedicated useMutation
const joinServerApi = async (serverId: string) => {
  return api.post(`/servers/${serverId}/join`);
};

export default function RecommendedServers({ enabled = true }: { enabled?: boolean }) {
  const { data: servers, isLoading, isError } = useRecommendedServersQuery(5, enabled);
  const invalidateRecommendations = useInvalidateRecommendations();
  const [joiningIds, setJoiningIds] = useState<Set<string>>(new Set());

  if (!enabled) return null;

  if (isError) {
    return (
      <div className="px-4 py-3 opacity-60">
        <p className="text-xs text-white/40">Unable to load recommendations</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-2 space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-white/10" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-white/10 rounded w-1/2" />
              <div className="h-2 bg-white/10 rounded w-3/4" />
            </div>
            <div className="w-16 h-6 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!servers || servers.length === 0) {
    return (
      <div className="px-4 py-3 space-y-1">
        <p className="text-xs text-white/50">No matching communities found.</p>
        <p className="text-[10px] text-white/30">Try adding more interests.</p>
      </div>
    );
  }

  const handleJoinServer = async (serverId: string) => {
    try {
      setJoiningIds((prev) => new Set(prev).add(serverId));
      await joinServerApi(serverId);
      toast.success("Joined server");
      invalidateRecommendations();
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || "Failed to join server");
      setJoiningIds((prev) => {
        const next = new Set(prev);
        next.delete(serverId);
        return next;
      });
    }
  };

  return (
    <div className="px-2 space-y-0.5">
      {servers.map((server) => {
        const isJoining = joiningIds.has(server.id);

        return (
          <div key={server.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 group transition-colors">
            <Avatar
              src={server.icon || ""}
              fallback={server.name[0]}
              size="sm"
              className="rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{server.name}</p>
              <p className="text-[10px] text-white/40 truncate">
                Matches your {server.matchedInterest} interest
              </p>
            </div>
            <Button
              size="sm"
              variant={isJoining ? "secondary" : "primary"}
              className="h-6 px-2 text-[10px]"
              onClick={() => handleJoinServer(server.id)}
              disabled={isJoining}
            >
              {isJoining ? "Joining" : "Join"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
