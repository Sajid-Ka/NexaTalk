import { Users, Server, MessageSquare, AlertTriangle, MonitorPlay, Heart, Laptop, Share2 } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import StatsCard from "../components/StatsCard";
import RevenueChart from "../components/RevenueChart";
import CommissionCard from "../components/CommissionCard";
import ActivityList from "../components/ActivityList";
import AlertsSection from "../components/AlertsSection";

export default function AdminDashboardPage() {
    return (
        <div className="flex h-screen w-full bg-[#0F121D] text-white overflow-hidden font-sans">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#0A0C14] overflow-y-auto">
                {/* Header */}
                <header className="px-8 py-6 flex flex-col gap-1 border-b border-white/5 bg-[#0F121D]/50 backdrop-blur-md sticky top-0 z-10">
                    <h1 className="text-2xl font-black tracking-tight">Overview</h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Last updated: Just now</p>
                </header>

                <div className="p-8 space-y-8">
                    {/* Top Row: Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        <StatsCard
                            title="Total Users"
                            value="2.4M"
                            icon={Users}
                            trend={{ value: "12.5%", isPositive: true }}
                            subtext="vs last week"
                        />
                        <StatsCard
                            title="Total Servers"
                            value="85.2k"
                            icon={Server}
                            trend={{ value: "3.2%", isPositive: true }}
                        />
                        <StatsCard
                            title="Total Messages"
                            value="142M"
                            icon={MessageSquare}
                            subtext="~24h vol"
                        />
                        <StatsCard
                            title="Reports Pending"
                            value="15"
                            icon={AlertTriangle}
                            subtext="Action Required"
                            alert
                        />
                        <StatsCard
                            title="Active Streams"
                            value="4.1k"
                            icon={MonitorPlay}
                            subtext="Live Now"
                            trend={{ value: "", isPositive: true }}
                        />
                    </div>

                    {/* Middle Row: Revenue Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[280px]">
                        <RevenueChart
                            title="Today's Revenue"
                            amount="$12,450.00"
                            variant="purple"
                        />
                        <RevenueChart
                            title="Monthly Revenue"
                            amount="$342,890.00"
                            variant="blue"
                        />
                    </div>

                    {/* Bottom Row: Commission & Activities */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Commission Grid & Activity Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <CommissionCard
                                    title="Superchat Commission"
                                    amount="$8,400"
                                    icon={Heart}
                                    variant="pink"
                                />
                                <CommissionCard
                                    title="Subscriptions"
                                    amount="$152,000"
                                    icon={Laptop}
                                    variant="blue"
                                />
                                <CommissionCard
                                    title="Affiliate Commission"
                                    amount="$4,200"
                                    icon={Share2}
                                    variant="indigo"
                                />
                            </div>
                            <ActivityList />
                        </div>

                        {/* Right Sidebar: Critical Alerts */}
                        <div className="lg:col-span-1">
                            <AlertsSection />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
