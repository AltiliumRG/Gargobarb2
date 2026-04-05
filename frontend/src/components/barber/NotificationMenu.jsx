import React from "react";
import { useNotifications } from "../../context/NotificationContext";
import { Bell, CheckCircle, ShoppingBag, Calendar, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function NotificationMenu({ onClose }) {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  return (
    <div className="absolute top-12 right-0 w-[320px] sm:w-[380px] bg-[#0f141a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[100] flex flex-col overflow-hidden animate-fadeUp">
      
      {/* HEADER */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-yellow-500" />
          <h3 className="font-bold text-white">Notificaciones</h3>
          {unreadCount > 0 && (
            <span className="bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-[11px] text-yellow-500/80 hover:text-yellow-400 font-medium transition"
          >
            Marcar todo leído
          </button>
        )}
      </div>

      {/* LIST */}
      <div className="max-h-[400px] overflow-y-auto custom-scroll">
        {notifications.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <Bell size={32} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">No tienes notificaciones aún.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div 
              key={n.id}
              onClick={() => !n.is_read && markAsRead(n.id)}
              className={`
                p-4 border-b border-white/5 cursor-pointer transition-colors
                ${n.is_read ? "opacity-70" : "bg-yellow-500/5"}
                hover:bg-white/5
              `}
            >
              <div className="flex gap-3">
                {/* ICON TYPE */}
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                  ${n.type === "appointment_new" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"}
                `}>
                  {n.type === "appointment_new" ? <Calendar size={20} /> : <ShoppingBag size={20} />}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white mb-0.5">
                    {n.title}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed mb-2">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-gray-500">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: es })}
                  </span>
                </div>

                {!n.is_read && (
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 shrink-0" />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* FOOTER */}
      <div className="p-3 border-t border-white/5 text-center">
        <button 
          onClick={onClose}
          className="text-xs text-gray-400 hover:text-white transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
