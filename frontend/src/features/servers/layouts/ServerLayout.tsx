import { Outlet } from "react-router-dom";
import ServerSidebar from "../../home/components/ServerSidebar";

export default function ServerLayout() {
  return (
    <div className="flex h-screen w-full bg-[#090B11] text-white overflow-hidden">
      {/* Sidebar - Fixed Left */}
      <ServerSidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
