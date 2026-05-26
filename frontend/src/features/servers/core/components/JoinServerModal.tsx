import React, { useState } from "react";
import { Compass, Loader2 } from "lucide-react";
import Modal from "../../../../shared/ui/Modal";
import Button from "../../../../shared/ui/Button";
import Input from "../../../../shared/ui/Input";
import { useAppDispatch } from "../../../../app/store";
import { joinServerByInvite } from "../store/serverSlice";

interface JoinServerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define the shape of the error that might come from the API
interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

const JoinServerModal: React.FC<JoinServerModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setLoading(true);
    setError(null);

    // Extract code if a full URL was pasted
    const code = inviteCode.includes("/") 
      ? inviteCode.split("/").pop() || inviteCode 
      : inviteCode;

    try {
      await dispatch(joinServerByInvite(code)).unwrap();
      setInviteCode("");
      onClose();
    } catch (err: unknown) {
      // Type-safe error handling with fallback
      let errorMessage = "Failed to join server. Please check the invite code.";
      
      if (err && typeof err === 'object') {
        const apiError = err as ApiError;
        
        // Try to get error message from different possible locations
        if (apiError.message) {
          errorMessage = apiError.message;
        } else if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md text-center"
      showCloseButton={true}
    >
      <div className="flex flex-col items-center py-4">
        <h2 className="text-2xl font-bold text-white mb-6">Join a Server</h2>
        
        <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
          <Compass size={32} className="text-emerald-500" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">Have an invite?</h3>
        <p className="text-white/40 text-sm mb-8 max-w-[280px]">
          Enter the invite link or code below to join an existing server.
        </p>

        <form onSubmit={handleJoin} className="w-full space-y-6">
          <div className="space-y-2 text-left">
            <label className="text-xs font-bold uppercase text-white/40 ml-1">Invite Link or Code</label>
            <Input
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="https://nexatalk.com/invite/..."
              className="bg-white/5 border-white/10 focus:border-indigo-500/50"
              error={error || undefined}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-white/40 hover:text-white"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={loading || !inviteCode.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 px-8 rounded-xl"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join Server"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default JoinServerModal;