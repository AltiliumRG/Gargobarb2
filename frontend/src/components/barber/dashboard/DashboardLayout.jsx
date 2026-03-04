import { useState } from "react";
import { useDashboardData } from "../../../hooks/useDashboardData";
import DashboardSidebar from "./DashboardSidebar";
import { Menu, Bell, Search, User } from "lucide-react";

export default function DashboardLayout({ children, activeTab, setActiveTab }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const data = useDashboardData();

    return (
        <div className="flex min-h-screen bg-[#060608] text-gray-100 font-sans selection:bg-yellow-500/30">
            <DashboardSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 border-b border-white/5 bg-[#0c0c0e]/50 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-gray-400"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-3 py-1.5 focus-within:border-yellow-500/50 transition-all">
                            <Search size={16} className="text-gray-500" />
                            <input
                                type="text"
                                placeholder="Buscar algo..."
                                className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-gray-600"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 hover:bg-white/5 rounded-lg text-gray-400">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-500 rounded-full border-2 border-[#0c0c0e]"></span>
                        </button>
                        <div className="h-8 w-[1px] bg-white/5 mx-1"></div>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-white uppercase tracking-tight">C. Ruiz</p>
                                <p className="text-[10px] text-gray-500">Administrador</p>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-black font-black shadow-lg shadow-yellow-500/10">
                                <User size={18} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-8 animate-in fade-in duration-500">
                    {children(data)}
                </main>
            </div>
        </div>
    );
}
