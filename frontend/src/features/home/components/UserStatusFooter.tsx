import { Mic2, Headphones, Settings } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserPresence } from "../../../shared/constants/user.const";
import Avatar from "../../../shared/ui/Avatar";
import { useAuth } from "../../auth/context/useAuth";
import { ProfileCardPreview } from "../../settings/settingsFeat/profile/components";
import { getMyProfileApi } from "../../settings/settingsFeat/profile/api/profileApi";

export default function UserStatusFooter() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{
    username: string;
    avatar?: string;
    bio?: string;
    status: UserPresence;
    showOnlineStatus: boolean;
  } | null>(null);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const footerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showProfileCard) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        footerRef.current &&
        !footerRef.current.contains(event.target as Node)
      ) {
        setShowProfileCard(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [showProfileCard]);

  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const res = await getMyProfileApi();

        if (isMounted) {
          setProfile({
            username: res.data.data.username,
            avatar: res.data.data.avatar,
            bio: res.data.data.bio,
            status: res.data.data.status,
            showOnlineStatus: res.data.data.showOnlineStatus,
          });
        }
      } catch {
        if (isMounted) {
          setProfile({
            username: user?.username || "",
            status: UserPresence.OFFLINE,
            showOnlineStatus: false,
          });
        }
      }
    };

    fetchProfile();

    const handleProfileUpdate = () => {
      fetchProfile();
    };
    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, [user?.id, user?.username]);

  return (
    <div 
      ref={footerRef}
      className="relative p-2 bg-[#090B11] flex items-center gap-2"
    >
      <div className="relative flex flex-1 min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={() => setShowProfileCard((current) => !current)}
          className="flex flex-1 min-w-0 items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group text-left"
        >
          <Avatar
            src={profile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"}
            fallback={profile?.username?.slice(0, 2).toUpperCase() ?? "NA"}
            size="sm"
            status={profile?.showOnlineStatus ? profile.status : UserPresence.OFFLINE}
          />

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">
              {profile?.username || user?.username}
            </p>
          </div>
        </button>

        {showProfileCard && profile && (
          <div className="absolute left-0 bottom-[calc(100%+12px)] z-50 scale-[0.82] origin-bottom-left">
            <ProfileCardPreview
              compact
              username={profile.username}
              bio={profile.bio || ""}
              avatarUrl={profile.avatar}
              showOnlineStatus={profile.showOnlineStatus}
              status={profile.status}
              onClick={() => navigate("/settings")}
            />
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <button className="p-1.5 rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors">
          <Mic2 size={16} />
        </button>

        <button className="p-1.5 rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors">
          <Headphones size={16} />
        </button>

        <button
          onClick={() => navigate("/settings")}
          className="p-1.5 rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}
