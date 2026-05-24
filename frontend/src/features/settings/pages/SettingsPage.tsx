import { SettingsSidebar } from "../components/profileSettings";
import RecommendationSettings from "../components/profileSettings/RecommendationSettings";
import ProfileSettings from "../components/profileSettings/ProfileSettings";

export default function SettingsPage() {
    return (
        <div className="flex h-screen bg-[#111319] text-white">
            <SettingsSidebar />
            <main className="flex-1 overflow-y-auto no-scrollbar">
                <div className="max-w-5xl mx-auto py-12 px-8">
                    
                    <>
                        <ProfileSettings />
                        <RecommendationSettings />
                    </>
                </div>
            </main>
        </div>
    );
}
