import {
    LayoutDashboard,
    DollarSign,
    Calendar,
    Users,
    UserSquare2,
    Package,
    History,
    X,
    TrendingUp
} from "lucide-react";

export default function DashboardSidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
    const menuItems = [
        { id: "overview", label: "Dashboard", icon: LayoutDashboard },
        { id: "income", label: "Ingresos", icon: DollarSign },
        { id: "appointments", label: "Citas", icon: Calendar },
        { id: "employees", label: "Empleados", icon: Users },
        { id: "clients", label: "Clientes", icon: UserSquare2 },
        { id: "services", label: "Servicios", icon: Package },
        { id: "sales", label: "Ventas", icon: History },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`
        fixed top-0 left-0 z-50 h-screen transition-transform duration-300 bg-[#0c0c0e] border-r border-white/5 w-64
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:h-auto
      `}>
                <div className="p-6 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-500 p-2 rounded-lg">
                            <TrendingUp size={20} className="text-black" />
                        </div>
                        <h2 className="text-lg font-black text-white uppercase tracking-tighter">Manager Pro</h2>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-80px)]">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    if (window.innerWidth < 1024) setIsOpen(false);
                                }}
                                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive
                                        ? "bg-yellow-500 text-black font-bold shadow-lg shadow-yellow-500/20"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }
                `}
                            >
                                <Icon size={18} className={isActive ? "text-black" : "text-gray-500 group-hover:text-yellow-500"} />
                                <span className="text-sm">{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black"></div>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 w-full p-4 border-t border-white/5 bg-[#0c0c0e]/80 backdrop-blur-md">
                    <div className="flex items-center gap-3 p-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-xs text-yellow-500 font-bold">
                            OWN
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">Dueño Barbería</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Administrador</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
