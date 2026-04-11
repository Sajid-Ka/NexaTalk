import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { fetchServerDetails } from "../store/serverSlice";
import ServerDashboardContent from "../components/dashboard/ServerDashboardContent";
import ServerDashboardErrorState from "../components/dashboard/ServerDashboardErrorState";
import ServerDashboardLoading from "../components/dashboard/ServerDashboardLoading";

export default function ServerDashboard() {
  const { serverId } = useParams<{ serverId: string }>();
  const dispatch = useAppDispatch();
  const { currentServer, loading, error } = useAppSelector((state) => state.servers);

  useEffect(() => {
    if (serverId) {
      dispatch(fetchServerDetails(serverId));
    }
  }, [serverId, dispatch]);

  if (loading) {
    return <ServerDashboardLoading />;
  }

  if (error || !currentServer) {
    return <ServerDashboardErrorState message={error} />;
  }

  return <ServerDashboardContent server={currentServer} />;
}
