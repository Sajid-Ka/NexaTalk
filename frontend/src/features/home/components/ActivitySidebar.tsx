import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import UserProfileDrawer from "../../users/components/UserProfileDrawer";

export default function ActivitySidebar() {
    const { isOpen, selectedUserId } = useSelector((state: RootState) => state.userProfileDrawer);

    if (isOpen && selectedUserId) {
        return <UserProfileDrawer />;
    }

    return (
        <aside className="w-[340px] hidden xl:flex flex-col bg-[#090B11] p-4 shrink-0 border-l border-white/5 overflow-y-auto no-scrollbar">
            <h2 className="text-xl font-bold mb-4">Active Now</h2>

            <div className="flex-1 flex items-center justify-center p-6 text-center">
                <div className="space-y-3">
                    <h3 className="text-base font-semibold text-white/80">It's quiet for now...</h3>
                    <p className="text-sm text-white/40 leading-relaxed">
                        When a friend starts an activity, it will appear here.
                    </p>
                </div>
            </div>

            {/* Upgrade Card */}
            {/* <div className="mt-auto pt-6">
                <div className="relative rounded-2xl p-5 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-purple-800" />
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                    <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-1">Go Unlimited</h3>
                        <p className="text-[10px] text-white/70 mb-6 leading-relaxed">
                            Boost your server and unlock 4K streaming quality.
                        </p>
                        <Button className="w-full bg-white text-indigo-700 hover:bg-slate-100 font-bold text-xs h-10 border-none shadow-xl">
                            UPGRADE NOW
                        </Button>
                    </div>
                </div>
            </div> */}
        </aside>
    );
}
