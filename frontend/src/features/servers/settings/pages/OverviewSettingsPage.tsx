import {
  Globe,
  Lock,
  Upload,
  Save,
  Loader2,
  X
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { uploadServerImageApi, updateServerApi } from "../api/serverSettingsApi";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { setCurrentServer, fetchUserServers, fetchServerDetails } from "../../core/store/serverSlice";
import { ServerPrivacy, ServerValidation } from "../../../../shared/constants/server.const";
import Button from "../../../../shared/ui/Button";
import Input from "../../../../shared/ui/Input";
import TextArea from "../../../../shared/ui/TextArea";
import SettingsGrid from "../../../../shared/ui/settings/SettingsGrid";
import SettingsSection from "../../../../shared/ui/settings/SettingsSection";
import SettingsPageHeader from "../../../../shared/ui/settings/SettingsPageHeader";
import SettingsPageContainer from "../../../../shared/ui/settings/SettingsPageContainer";
import { cn } from "../../../../shared/utils/cn";

//image loader helper function
const getImageUrl = (url?: string) => {
  if (!url) return "";

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }

  const apiBaseUrl = import.meta.env.VITE_API_URL || window.location.origin;
  const apiOrigin = new URL(apiBaseUrl, window.location.origin).origin;

  return url.startsWith("/") ? `${apiOrigin}${url}` : `${apiOrigin}/${url}`;
};

export default function OverviewSettingsPage() {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState<ServerPrivacy>(ServerPrivacy.PRIVATE);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; description?: string; tag?: string }>({});

  const { serverId } = useParams<{ serverId: string }>();
  const dispatch = useAppDispatch();
  const { currentServer } = useAppSelector((state) => state.servers);

  const iconInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [uploadingType, setUploadingType] = useState<"icon" | "banner" | null>(null);

  useEffect(() => {
    if (!serverId) return;

    if (!currentServer || currentServer.id !== serverId) {
      dispatch(fetchServerDetails(serverId));
    }
  }, [serverId, currentServer?.id, dispatch]);

  useEffect(() => {
    if (!currentServer) return;

    setName(currentServer.name || "");
    setDescription(currentServer.description || "");
    setPrivacy(currentServer.privacy || ServerPrivacy.PRIVATE);
    setTags(currentServer.tags || []);
  }, [currentServer]);

  const validateImage = (file: File) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, GIF, and WebP images are allowed");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return false;
    }

    return true;
  };

  const handleServerImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "icon" | "banner",
  ) => {
    const file = event.target.files?.[0];
    if (!file || !serverId) return;

    if (!validateImage(file)) return;

    setUploadingType(type);

    try {
      const updatedServer = await uploadServerImageApi(serverId, file, type);
      dispatch(setCurrentServer(updatedServer));
      toast.success(type === "icon" ? "Server icon uploaded" : "Server banner uploaded");
    } catch {
      toast.error(type === "icon" ? "Failed to upload server icon" : "Failed to upload server banner");
    } finally {
      setUploadingType(null);
      event.target.value = "";
    }
  };

  const validateForm = () => {
    const nextErrors: typeof errors = {};
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (trimmedName.length < ServerValidation.MIN_NAME_LENGTH) {
      nextErrors.name = `Server name must be at least ${ServerValidation.MIN_NAME_LENGTH} characters`;
    }

    if (trimmedName.length > ServerValidation.MAX_NAME_LENGTH) {
      nextErrors.name = `Server name must be at most ${ServerValidation.MAX_NAME_LENGTH} characters`;
    }

    if (trimmedDescription.length > ServerValidation.MAX_DESCRIPTION_LENGTH) {
      nextErrors.description = `Description must be at most ${ServerValidation.MAX_DESCRIPTION_LENGTH} characters`;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const normalizeTags = (value?: string[]) =>
    (value || []).map((tag) => tag.trim().toLowerCase()).filter(Boolean);

  const hasServerChanges = () => {
    if (!currentServer) return false;

    const currentTags = normalizeTags(currentServer.tags);
    const nextTags = normalizeTags(tags);

    return (
      name.trim() !== (currentServer.name || "").trim() ||
      description.trim() !== (currentServer.description || "").trim() ||
      privacy !== currentServer.privacy ||
      JSON.stringify(nextTags) !== JSON.stringify(currentTags)
    );
  };

  const handleSave = async () => {
    if (!serverId) return;

    if (!currentServer) {
      toast.error("Server data is still loading");
      return;
    }

    if (!hasServerChanges()) {
      toast("No changes to save");
      return;
    }

    if (!validateForm()) return;

    setSaving(true);

    try {
      const response = await updateServerApi(serverId, {
        name: name.trim(),
        description: description.trim(),
        privacy,
        tags: normalizeTags(tags),
      });

      dispatch(setCurrentServer(response.data.data));
      dispatch(fetchUserServers());
      toast.success("Server updated successfully");
    } catch {
      toast.error("Failed to update server");
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    const nextTag = tagInput.trim().replace(/^#/, "").toLowerCase();

    if (!nextTag) return;

    if (nextTag.length > ServerValidation.MAX_TAG_LENGTH) {
      setErrors((prev) => ({
        ...prev,
        tag: `Tag must be at most ${ServerValidation.MAX_TAG_LENGTH} characters`,
      }));
      return;
    }

    if (tags.length >= ServerValidation.MAX_TAGS) {
      setErrors((prev) => ({
        ...prev,
        tag: `Cannot have more than ${ServerValidation.MAX_TAGS} tags`,
      }));
      return;
    }

    if (tags.includes(nextTag)) {
      setErrors((prev) => ({ ...prev, tag: "Tag already added" }));
      return;
    }

    setTags((prev) => [...prev, nextTag]);
    setTagInput("");
    setErrors((prev) => ({ ...prev, tag: undefined }));
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((item) => item !== tag));
  };

  const handleTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddTag();
    }
  };

  return (
    <SettingsPageContainer>
      <SettingsPageHeader
        title="Server Overview"
        description="Manage your server profile, branding and visibility settings."
        actions={
          <Button className="gap-2" onClick={handleSave} isLoading={saving}>
            <Save size={16} />
            Save Changes
          </Button>
        }
      />

      {/* SERVER PROFILE */}
      <SettingsSection
        title="Server Profile"
        description="Customize your server identity and appearance."
      >
        <SettingsGrid columns={2}>
          {/* ICON */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-300">
              Server Icon
            </p>

            <input
              ref={iconInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={(event) => handleServerImageUpload(event, "icon")}
            />

            <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-3xl font-black text-white">
              {currentServer?.icon ? (
                <img
                  src={getImageUrl(currentServer.icon)}
                  alt={currentServer.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                currentServer?.name?.[0]?.toUpperCase() || "N"
              )}
            </div>

            <Button
              type="button"
              variant="secondary"
              className="gap-2"
              onClick={() => iconInputRef.current?.click()}
              disabled={uploadingType !== null}
            >
              {uploadingType === "icon" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Upload size={16} />
              )}
              Upload Icon
            </Button>
          </div>

          {/* BANNER */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-300">
              Server Banner
            </p>

            <input
              ref={bannerInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={(event) => handleServerImageUpload(event, "banner")}
            />

            <div className="h-32 overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.45),transparent_32%),radial-gradient(circle_at_74%_28%,rgba(20,184,166,0.32),transparent_30%),linear-gradient(135deg,#312E81_0%,#0B1220_46%,#042F2E_100%)]">
              {currentServer?.banner && (
                <img
                  src={getImageUrl(currentServer.banner)}
                  alt={`${currentServer.name} banner`}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <Button
              type="button"
              variant="secondary"
              className="gap-2"
              onClick={() => bannerInputRef.current?.click()}
              disabled={uploadingType !== null}
            >
              {uploadingType === "banner" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Upload size={16} />
              )}
              Change Banner
            </Button>
          </div>
        </SettingsGrid>

        <div className="mt-6 space-y-5">
          {/* SERVER NAME */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Server Name
            </label>

            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter server name"
              error={errors.name}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Description
            </label>

            <TextArea
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe your community..."
              error={errors.description}
            />

            <p className="mt-2 text-xs text-slate-500">
              {description.trim().length}/{ServerValidation.MAX_DESCRIPTION_LENGTH} characters.
            </p>
          </div>
        </div>
      </SettingsSection>

      {/* PRIVACY */}
      <SettingsSection
        title="Server Privacy"
        description="Control who can discover and join your server."
      >
        <SettingsGrid columns={2}>
          {/* PUBLIC */}
          <button
            type="button"
            onClick={() => setPrivacy(ServerPrivacy.PUBLIC)}
            className={cn(
              "rounded-2xl border p-5 text-left transition hover:border-indigo-400",
              privacy === ServerPrivacy.PUBLIC
                ? "border-indigo-500/30 bg-indigo-500/10"
                : "border-white/10 bg-white/[0.03]"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500/20 text-indigo-200">
                <Globe size={22} />
              </div>

              <div>
                <p className="font-bold text-white">
                  Public Server
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Anyone can discover and join your community.
                </p>
              </div>
            </div>
          </button>

          {/* PRIVATE */}
          <button
            type="button"
            onClick={() => setPrivacy(ServerPrivacy.PRIVATE)}
            className={cn(
              "rounded-2xl border p-5 text-left transition hover:border-white/20",
              privacy === ServerPrivacy.PRIVATE
                ? "border-indigo-500/30 bg-indigo-500/10"
                : "border-white/10 bg-white/[0.03]"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-slate-200">
                <Lock size={22} />
              </div>

              <div>
                <p className="font-bold text-white">
                  Private Server
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Only invited users can join this server.
                </p>
              </div>
            </div>
          </button>
        </SettingsGrid>
      </SettingsSection>

      {/* TAGS */}
      <SettingsSection
        title="Server Tags"
        description="Help users understand your server topic."
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add a tag"
              error={errors.tag}
            />

            <Button
              type="button"
              variant="secondary"
              onClick={handleAddTag}
              disabled={tags.length >= ServerValidation.MAX_TAGS}
            >
              Add
            </Button>
          </div>

          <p className="text-xs text-slate-500">
            {tags.length}/{ServerValidation.MAX_TAGS} tags. Each tag can be up to {ServerValidation.MAX_TAG_LENGTH} characters.
          </p>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-100"
              >
                #{tag}
                <X size={14} />
              </button>
            ))}
          </div>
        </div>
      </SettingsSection>
    </SettingsPageContainer>
  );
}