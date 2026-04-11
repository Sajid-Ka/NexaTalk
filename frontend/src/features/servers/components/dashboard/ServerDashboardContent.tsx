import type { Server } from "../../types";
import ServerDashboardHero from "./ServerDashboardHero";
import ServerDashboardOverview from "./ServerDashboardOverview";
import ServerDashboardSidebar from "./ServerDashboardSidebar";

interface ServerDashboardContentProps {
  server: Server;
}

export default function ServerDashboardContent({
  server,
}: ServerDashboardContentProps) {
  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-[#0F121D]">
      <ServerDashboardHero server={server} />

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-y-auto no-scrollbar">
        <ServerDashboardOverview server={server} />
        <ServerDashboardSidebar server={server} />
      </div>
    </div>
  );
}
