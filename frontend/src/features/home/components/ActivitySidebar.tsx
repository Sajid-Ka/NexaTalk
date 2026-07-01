import { useAppSelector } from "../../../app/store";
import UserProfileDrawer from "../../users/components/UserProfileDrawer";
import DirectChatPanel from "../../messages/shared/components/ConversationChatPanel";
import { cn } from "../../../shared/utils/cn";
import { useLocation } from "react-router-dom";
import { AppRoute } from "../../../shared/constants/app-route.const";

export default function ActivitySidebar() {
    const location = useLocation();
    const canShowChat = location.pathname === AppRoute.HOME_PAGE;

    const { isOpen, selectedUserId } = useAppSelector(
        (state) => state.userProfileDrawer
    );

    const { isOpen: chatOpen } = useAppSelector(
        (state) => state.directChat
    );

        const showChat = canShowChat && chatOpen;

    return (
        <aside
            className={cn(
                "hidden xl:flex flex-col border-l border-white/5 bg-[#090B11] overflow-hidden min-w-0 min-h-0 transition-all duration-300",
                showChat ? "w-[950px] max-w-[calc(100vw-672px)] shrink-0" : "w-[340px] shrink-0"
            )}
        >
            {showChat ? (
                <DirectChatPanel />
            ) : isOpen && selectedUserId ? (
                <UserProfileDrawer />
            ) : (
                <>
                    <div className="border-b border-white/5 px-6 py-5">
                        <h2 className="text-lg font-bold">
                            Active Now
                        </h2>
                    </div>

                    <div className="flex flex-1 items-center justify-center p-6 text-center">
                        <div className="space-y-3">
                            <h3 className="text-base font-semibold text-white/80">
                                It's quiet for now...
                            </h3>

                            <p className="text-sm leading-relaxed text-white/40">
                                When a friend starts an activity, it will appear here.
                            </p>
                        </div>
                    </div>
                </>
            )}

            {/*Place upgrade card here*/}
        </aside>
    );
}


{/* Upgrade Card */ }
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