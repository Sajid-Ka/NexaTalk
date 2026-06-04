import { SettingsSidebar } from "../settingsFeat/profile/components";
import { ProfilePage } from "../settingsFeat/profile/pages";

export default function SettingsPage() {
    return (
        <div className="flex h-screen bg-[#111319] text-white">
            <SettingsSidebar />
            <main className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="max-w-5xl mx-auto py-12 px-8">

                    <>
                        <ProfilePage />
                    </>
                </div>
            </main>
        </div>
    );
}
