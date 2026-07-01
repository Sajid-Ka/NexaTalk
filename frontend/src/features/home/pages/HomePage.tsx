import DashboardLayout from "../components/DashboardLayout";
import FriendsList from "../../friends/components/FriendsList";
import { useAppSelector } from "../../../app/store";
import { HomeTab } from "../../../shared/constants/homeTab.const";
import DirectMessagesPage from "../../messages/direct/pages/DirectMessagesPage";

export default function HomePage() {
    const { activeTab } = useAppSelector(state => state.homeNavigation)
    return (
        <DashboardLayout>
            {activeTab === HomeTab.FRIENDS &&
                <FriendsList />
            }

            {activeTab === HomeTab.DIRECTMESSAGES &&
                <DirectMessagesPage />
            }

            {activeTab === HomeTab.GROUPMESSAGES &&
                <div>Coming Soon</div>
            }
        </DashboardLayout>
    );
}
