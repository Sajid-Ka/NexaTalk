import { useState } from "react";
import { Upload } from "lucide-react";
import Input from "../../../shared/ui/Input";
import TextArea from "../../../shared/ui/TextArea";
import Switch from "../../../shared/ui/Switch";
import Button from "../../../shared/ui/Button";
import Avatar from "../../../shared/ui/Avatar";
import ProfileCardPreview from "./ProfileCardPreview";

export default function ProfileSettings() {
    const [formData, setFormData] = useState({
        username: "Alex_Nexa",
        bio: "Competitive gamer & full-stack developer. Streaming on NexaTalk every Friday!",
        publicProfile: true,
        showOnlineStatus: true,
        showActivity: false,
    });

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

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
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                                    fallback="AN"
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
                            DISPLAY USERNAME
                        </h3>
                        <Input
                            value={formData.username}
                            onChange={(e) => handleChange("username", e.target.value)}
                            placeholder="Enter your username"
                            className="bg-white/[0.03] border-white/5 h-14 rounded-2xl text-base focus:ring-indigo-500/50"
                        />
                    </section>

                    {/* Bio */}
                    <section>
                        <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">
                            BIO / CUSTOM STATUS
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
                            description="Allow anyone on the platform to view your card."
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
                        <button className="text-sm font-bold text-white/40 hover:text-white transition-colors">
                            Discard Changes
                        </button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 px-10 h-14 rounded-2xl text-base shadow-xl shadow-indigo-600/20">
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
                    showOnlineStatus={formData.showOnlineStatus}
                />
            </div>
        </div>
    );
}
