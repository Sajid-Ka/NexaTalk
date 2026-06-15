// import React from "react";
import ServerSidebar from "./ServerSidebar";
import NavSidebar from "./NavSidebar";
import ActivitySidebar from "./ActivitySidebar";

interface DashboardLayoutProps {
    children?: React.ReactNode;
}

export default function DashboardLayout({ children : children }: DashboardLayoutProps) {
    return (
        <div className="flex h-screen w-full bg-[#0F121D] text-white overflow-hidden">
            {/* 1st Column: Server Sidebar */}
            <ServerSidebar />

            {/* 2nd Column: Navigation Sidebar */}
            <NavSidebar />

            {/* 3rd Column: Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#151926]">
                {children}
            </main>

            {/* 4th Column: Activity Sidebar */}
            <ActivitySidebar />
        </div>
    );
}
