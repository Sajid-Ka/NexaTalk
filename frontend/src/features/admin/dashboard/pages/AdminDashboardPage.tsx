import AdminSidebar from "../../shared/components/AdminSidebar";


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


            </main>
        </div>
    );
}
