import { useState } from "react";
import { X, UserMinus } from "lucide-react";
import Button from "../../../shared/ui/Button";
import { removeFriendApi } from "../api/friendApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { closeProfileDrawer } from "../../users/store/userProfileDrawerSlice";
import { useInvalidateRecommendations } from "../../recommendations/api/recommendationApi";

interface RemoveFriendConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  username: string;
  onSuccess?: () => void;
}

export default function RemoveFriendConfirmationModal({ isOpen, onClose, userId, username, onSuccess }: RemoveFriendConfirmationModalProps) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const invalidateRecommendations = useInvalidateRecommendations();

  if (!isOpen) return null;

  const handleRemove = async () => {
    setLoading(true);
    try {
      await removeFriendApi(userId);
      toast.success("Friend removed");
      invalidateRecommendations();
      dispatch(closeProfileDrawer());
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      toast.error("Failed to remove friend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md rounded-2xl bg-[#0F121D] border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <UserMinus size={20} className="text-red-500" />
            Remove Friend
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5 transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-white/70">
            Are you sure you want to remove <strong>{username}</strong> from your friends list?
          </p>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white border-none" onClick={handleRemove} isLoading={loading}>
              Remove Friend
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
