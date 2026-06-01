import DashboardLayout from "../components/DashboardLayout";
import FriendsList from "../../friends/components/FriendsList";

export default function HomePage() {
    return (
        <DashboardLayout>
            <FriendsList />
        </DashboardLayout>
    );
}
