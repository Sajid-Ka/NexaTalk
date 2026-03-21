import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Loader2 } from "lucide-react";
import Input from "../../../shared/ui/Input";
import TextArea from "../../../shared/ui/TextArea";
import Switch from "../../../shared/ui/Switch";
import Button from "../../../shared/ui/Button";
import Avatar from "../../../shared/ui/Avatar";
import ProfileCardPreview from "./ProfileCardPreview";
import { getMyProfileApi, updateProfileApi } from "../../profile/api/profileApi";
import { uploadAvatarApi, deleteAvatarApi } from "../../profile/api/profileApi";
import toast from "react-hot-toast";
import { UserPresence } from "../../../shared/constants/user.const";
import { AxiosError } from "axios";

interface ProfileFormData {
  username: string;
  bio: string;
  publicProfile: boolean;
  showOnlineStatus: boolean;
  showActivity: boolean;
  avatar?: string;
}

interface ApiErrorResponse {
  error?: {
    message?: string;
  };
  message?: string;
}

export default function ProfileSettings() {
  const [formData, setFormData] = useState<ProfileFormData>({
    username: "",
    bio: "",
    publicProfile: true,
    showOnlineStatus: true,
    showActivity: false,
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getMyProfileApi();
      const profile = res.data.data;
      setFormData({
        username: profile.username,
        bio: profile.bio || "",
        publicProfile: profile.isProfilePublic,
        showOnlineStatus: true,
        showActivity: false,
        avatar: profile.avatar,
      });
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = <K extends keyof ProfileFormData>(field: K, value: ProfileFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, GIF, and WebP images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      console.log("Uploading file:", file.name, file.size, file.type);
      const avatarUrl = await uploadAvatarApi(file);
      console.log("Upload success, avatar URL:", avatarUrl);
      setFormData((prev) => ({ ...prev, avatar: avatarUrl }));
      toast.success("Avatar uploaded successfully");
    } catch (err) {
      console.error("Upload error details:", err);
      
      let errorMessage = "Failed to upload avatar";
      if (err instanceof AxiosError) {
        const data = err.response?.data as ApiErrorResponse;
        errorMessage = data?.error?.message || data?.message || "Failed to upload avatar";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAvatarRemove = async () => {
    if (!formData.avatar) return;
    
    setUploading(true);
    try {
      await deleteAvatarApi();
      setFormData((prev) => ({ ...prev, avatar: "" }));
      toast.success("Avatar removed successfully");
    } catch {
      toast.error("Failed to remove avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfileApi({
        bio: formData.bio,
        isProfilePublic: formData.publicProfile,
      });
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-white/5 h-96 rounded-2xl" />;
  }

  return (
    <div className="flex gap-16">
      <div className="flex-1 max-w-2xl">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
          <p className="text-white/40 text-sm">
            Manage your public identity, status and how others see you.
          </p>
        </header>

        <div className="space-y-10">
          {/* Profile Picture */}
          <section>
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">
              PROFILE PICTURE
            </h3>
            <div className="flex items-center gap-8">
            <div className="relative">
              <div className="relative w-40 h-40 rounded-full border-4 border-indigo-500/20 bg-white/[0.03] flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-indigo-500/40">
                <Avatar
                  src={formData.avatar || undefined}
                  fallback={formData.username[0]?.toUpperCase() || "U"}
                  className="w-28 h-28 rounded-full object-cover"
                />

                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                  </div>
                )}
              </div>
            </div>

              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarUpload}
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    className="hidden"
                  />
                  <Button
                    variant="primary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-indigo-600 hover:bg-indigo-700 px-6 rounded-2xl"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New
                  </Button>

                  {formData.avatar && (
                    <Button
                      variant="secondary"
                      onClick={handleAvatarRemove}
                      disabled={uploading}
                      className="px-6 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>

                <p className="text-[10px] text-white/20 font-medium">
                  JPG, PNG, GIF or WebP. Max size 5MB.
                </p>
              </div>
            </div>
          </section>

          {/* Username */}
          <section>
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">
              USERNAME
            </h3>
            <Input
              value={formData.username}
              disabled
              placeholder="Username"
              className="bg-white/[0.03] border-white/5 h-14 rounded-2xl text-base opacity-75 cursor-not-allowed"
            />
            <p className="text-xs text-white/30 mt-2">Username cannot be changed</p>
          </section>

          {/* Bio */}
          <section>
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">
              BIO / ABOUT ME
            </h3>
            <TextArea
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Tell us about yourself..."
              className="bg-white/[0.03] border-white/5 min-h-[120px] rounded-2xl text-base focus:ring-indigo-500/50 p-5"
            />
          </section>

          {/* Toggles */}
          <section className="space-y-6 pt-4">
            <Switch
              label="Public Profile"
              description="Allow anyone on the platform to view your profile."
              checked={formData.publicProfile}
              onChange={(val) => handleChange("publicProfile", val)}
            />
            <Switch
              label="Show Online Status"
              description="A green dot will appear when you are active."
              checked={formData.showOnlineStatus}
              onChange={(val) => handleChange("showOnlineStatus", val)}
            />
            <Switch
              label="Show Activity"
              description="Display current games or apps you are using."
              checked={formData.showActivity}
              onChange={(val) => handleChange("showActivity", val)}
            />
          </section>

          {/* Actions */}
          <footer className="flex items-center justify-end gap-6 pt-10 mt-10 border-t border-white/5">
            <button 
              onClick={fetchProfile}
              className="text-sm font-bold text-white/40 hover:text-white transition-colors"
            >
              Discard Changes
            </button>
            <Button 
              onClick={handleSave}
              isLoading={saving}
              className="bg-indigo-600 hover:bg-indigo-700 px-10 h-14 rounded-2xl text-base shadow-xl shadow-indigo-600/20"
            >
              Save Changes
            </Button>
          </footer>
        </div>
      </div>

      {/* Preview Sidebar */}
      <div className="hidden lg:block">
        <ProfileCardPreview
          username={formData.username}
          bio={formData.bio}
          avatarUrl={formData.avatar}
          showOnlineStatus={formData.showOnlineStatus}
          status={UserPresence.ONLINE}
          isPro={false}
        />
      </div>
    </div>
  );
}