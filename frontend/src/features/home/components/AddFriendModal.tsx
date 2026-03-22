import { useState } from "react";
import { X, Search, UserPlus } from "lucide-react";
import Button from "../../../shared/ui/Button";
import Input from "../../../shared/ui/Input";
import Avatar from "../../../shared/ui/Avatar";
import { searchUsersApi } from "../../profile/api/profileApi";
import type { SearchUserResponse } from "../../profile/api/profileApi";
import { sendFriendRequestApi } from "../../friends/api/friendApi";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ApiErrorResponse {
  error?: {
    message?: string;
  };
  message?: string;
}

export default function AddFriendModal({ isOpen, onClose, onSuccess }: AddFriendModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchUserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) return;
    
    setLoading(true);
    try {
      const res = await searchUsersApi(searchQuery);
      setResults(res.data.data);
    } catch {
      toast.error("Failed to search users");
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    setSending(userId);
    try {
      await sendFriendRequestApi({ friendId: userId });
      toast.success("Friend request sent");
      onSuccess();
    } catch (err) {
      let errorMessage = "Failed to send request";
      if (err instanceof AxiosError) {
        const data = err.response?.data as ApiErrorResponse;
        errorMessage = data?.error?.message || data?.message || "Failed to send request";
      }
      toast.error(errorMessage);
    } finally {
      setSending(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-[#0F121D] border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h3 className="text-lg font-bold text-white">Add Friend</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5 transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by username..."
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading} className="bg-indigo-600">
              <Search size={18} />
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-white/40">Searching...</div>
            ) : results.length === 0 ? (
              <div className="text-center py-8 text-white/40">No users found</div>
            ) : (
              results.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar src={user.avatar} fallback={user.username} size="md" />
                    <div>
                      <p className="font-medium text-white">{user.username}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleSendRequest(user.id)}
                    isLoading={sending === user.id}
                    className="bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white"
                  >
                    <UserPlus size={14} className="mr-1" />
                    Add
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}