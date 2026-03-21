import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import Input from "../../../shared/ui/Input";
import TextArea from "../../../shared/ui/TextArea";
import Switch from "../../../shared/ui/Switch";
import Button from "../../../shared/ui/Button";
import Avatar from "../../../shared/ui/Avatar";
import ProfileCardPreview from "./ProfileCardPreview";
import { getMyProfileApi, updateProfileApi } from "../../profile/api/profileApi";
import toast from "react-hot-toast";
import { UserPresence } from "../../../shared/constants/user.const";

interface ProfileFormData {
  username: string;
  bio: string;
  publicProfile: boolean;
  showOnlineStatus: boolean;
  showActivity: boolean;
  avatar?: string;
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
        showOnlineStatus: true, // Will be in settings later
        showActivity: false, // Will be in settings later
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
              <div className="relative group">
                <Avatar
                  src={formData.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"}
                  fallback={formData.username[0] || "U"}
                  size="xl"
                  className="w-32 h-32 rounded-[40px] border-4 border-indigo-500/20 group-hover:border-indigo-500/40 transition-colors"
                />
                <div className="absolute inset-0 bg-black/40 rounded-[40px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                  <Upload size={24} className="text-white" />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <Button variant="primary" className="bg-indigo-600 hover:bg-indigo-700 px-6 rounded-2xl">
                    Upload New
                  </Button>
                  <Button variant="secondary" className="px-6 rounded-2xl bg-white/5 hover:bg-white/10">
                    Remove
                  </Button>
                </div>
                <p className="text-[10px] text-white/20 font-medium">
                  JPG, PNG or GIF. Max size 2MB.
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