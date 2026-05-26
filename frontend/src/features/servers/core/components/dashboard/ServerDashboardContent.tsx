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
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar bg-[#070A12] text-white">
      <ServerDashboardHero server={server} />

      <div className="relative mx-auto grid w-full max-w-[1680px] grid-cols-1 gap-6 px-4 pb-10 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:px-8">
        <ServerDashboardOverview server={server} />
        <ServerDashboardSidebar server={server} />
      </div>
    </div>
  );
}