import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, Shield, Globe, Loader2 } from "lucide-react";
import Modal from "../../../shared/ui/Modal";
import Button from "../../../shared/ui/Button";
import Input from "../../../shared/ui/Input";
import TextArea from "../../../shared/ui/TextArea";
import { useAppDispatch } from "../../../app/store";
import { createServer } from "../store/serverSlice";
import { cn } from "../../../shared/utils/cn";
import { ServerPrivacy } from "../../../shared/constants/server.const";

const createServerSchema = z.object({
  name: z.string().min(3, "Server name must be at least 3 characters").max(50),
  description: z.string().max(200).optional(),
  privacy: z.enum([ServerPrivacy.PRIVATE, ServerPrivacy.PUBLIC]),
});

type CreateServerFormValues = z.infer<typeof createServerSchema>;

interface CreateServerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateServerModal: React.FC<CreateServerModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [privacy, setPrivacy] = useState<ServerPrivacy>("private");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateServerFormValues>({
    resolver: zodResolver(createServerSchema),
    defaultValues: {
      privacy: ServerPrivacy.PRIVATE,
    },
  });

  const onSubmit = async (data: CreateServerFormValues) => {
    setLoading(true);
    try {
      await dispatch(createServer({ ...data, privacy })).unwrap();
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to create server:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create a Server"
      className="max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Icon Upload Placeholder */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative group cursor-pointer">
            <div className="h-24 w-24 rounded-full border-2 border-dashed border-white/10 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-all duration-200">
              <Upload size={24} className="text-white/40 group-hover:text-white/70" />
              <span className="text-[10px] uppercase font-bold text-white/40 mt-1">Upload Icon</span>
            </div>
          </div>
        </div>

        {/* Server Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-white/40 ml-1">Server Name</label>
          <Input
            {...register("name")}
            placeholder="My Awesome Server"
            error={errors.name?.message}
            className="bg-white/5 border-white/10 focus:border-indigo-500/50"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-white/40 ml-1">Description (optional)</label>
          <TextArea
            {...register("description")}
            placeholder="Explain what your server is about..."
            className="bg-white/5 border-white/10 focus:border-indigo-500/50 min-h-[100px]"
          />
        </div>

        {/* Visibility Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-white/40 ml-1">Visibility</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPrivacy(ServerPrivacy.PRIVATE)}
              className={cn(
                "flex flex-col items-start p-4 rounded-xl border transition-all duration-200 text-left",
                privacy === ServerPrivacy.PRIVATE
                  ? "bg-indigo-600/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              )}
            >
              <Shield size={20} className={cn(privacy === ServerPrivacy.PRIVATE ? "text-indigo-400" : "text-white/40")} />
              <span className="text-sm font-bold mt-2 text-white">Private</span>
              <span className="text-[10px] text-white/40 mt-1">Friends only</span>
            </button>

            <button
              type="button"
              onClick={() => setPrivacy(ServerPrivacy.PUBLIC)}
              className={cn(
                "flex flex-col items-start p-4 rounded-xl border transition-all duration-200 text-left",
                privacy === ServerPrivacy.PUBLIC
                  ? "bg-indigo-600/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              )}
            >
              <Globe size={20} className={cn(privacy === ServerPrivacy.PUBLIC ? "text-indigo-400" : "text-white/40")} />
              <span className="text-sm font-bold mt-2 text-white">Public</span>
              <span className="text-[10px] text-white/40 mt-1">Anyone can join</span>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-white/40 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 px-8"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Server"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateServerModal;
