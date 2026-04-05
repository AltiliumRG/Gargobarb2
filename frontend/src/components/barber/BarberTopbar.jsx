import { useAuth } from "../../auth/AuthContext";
import api from "../../api/axios";
import { useState } from "react";
import { Bell } from "lucide-react";
import NotificationMenu from "./NotificationMenu";
import { useNotifications } from "../../context/NotificationContext";

export default function BarberTopbar({ toggleSidebar }) {
  const { user, setUser } = useAuth();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="h-16 bg-[#0f141b] border-b border-gray-800 flex items-center justify-between px-6">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="bg-gray-800 px-3 py-1 rounded hover:bg-gray-700"
        >
          ☰
        </button>

        <h1 className="font-bold text-yellow-400">
          Panel Profesional
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        
        {/* BELL NOTIFICATIONS */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-400 hover:text-yellow-500 transition relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-[#0f141b]">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <NotificationMenu onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* USER */}
        <div className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded">
          <img
            src={user?.avatar_url || "https://i.imgur.com/6VBx3io.png"}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm">{user?.username}</span>
        </div>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
