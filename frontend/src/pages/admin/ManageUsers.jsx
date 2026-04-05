import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { getAllUsers } from "../../api/admin.api";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Edit, Trash2, Search, Users, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ManageUsers = () => {
  // Form state
  const [form, setForm] = useState({ username: "", email: "", role_id: 2, password: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  // Pagination state
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 15;

  // 🔹 Obtener usuarios con paginación
  const fetchUsers = async (page = 1) => {
    try {
      console.log(`🔄 Obteniendo usuarios - página ${page}...`);
      setLoading(true);
      const data = await getAllUsers(page, itemsPerPage);
      console.log("✅ Datos recibidos:", data);
      setUsers(data.users);
      setPagination(data.pagination);
      setError(null);
      setCurrentPage(page);
    } catch (error) {
      console.error("❌ Error obteniendo usuarios:", error);
      setError(error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  // 🔹 Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.username || !form.email) {
        alert("Por favor completa todos los campos");
        return;
      }

      if (editingId) {
        // Solo actualizar el rol, no toda la información
        await api.put(`/users/${editingId}`, { role_id: form.role_id });
      } else {
        // Crear nuevo usuario
        if (!form.password) {
          alert("Por favor ingresa una contraseña");
          return;
        }
        await api.post("/users", form);
      }

      setEditingId(null);
      setForm({ username: "", email: "", role_id: 2, password: "" });
      fetchUsers(1); // Recarga desde la primera página
    } catch (err) {
      console.error("❌ Error al guardar usuario:", err);
      alert("Error al guardar usuario: " + (err.response?.data?.message || err.message));
    }
  };

  // 🔹 Eliminar usuario
  const handleDelete = async (id, username) => {
    if (confirm(`¿Seguro que deseas eliminar al usuario "${username}"?`)) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers(currentPage);
      } catch (err) {
        console.error("❌ Error al eliminar:", err);
        alert("Error al eliminar usuario: " + (err.response?.data?.message || err.message));
      }
    }
  };

  // 🔹 Editar rol de usuario
  const handleEditRole = (u) => {
    setEditingId(u.id);
    setForm({
      username: u.username,
      email: u.email,
      role_id: u.role_id,
      password: "",
    });
  };

  // 🔹 Cancelar edición
  const handleCancel = () => {
    setEditingId(null);
    setForm({ username: "", email: "", role_id: 2, password: "" });
  };

  // 🔹 Filtrar usuarios por búsqueda (local)
  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleColor = (roleId) => {
    switch (roleId) {
      case 1:
        return "bg-amber-900/20 text-amber-400 border-amber-700/30";
      case 2:
        return "bg-blue-900/20 text-blue-400 border-blue-700/30";
      default:
        return "bg-zinc-800/40 text-zinc-400 border-zinc-700/30";
    }
  };

  const getRoleLabel = (roleId) => {
    switch (roleId) {
      case 1:
        return "Admin";
      case 2:
        return "Barber";
      default:
        return "Client";
    }
  };

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen w-full bg-[#0f0f0f] text-zinc-100 flex flex-col px-4 md:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-emerald-900/40 animate-pulse"></div>
          <div className="h-8 w-48 bg-zinc-800 rounded-lg animate-pulse"></div>
        </div>
        <div className="bg-[#1a1a1a] border border-zinc-800/50 p-6 rounded-2xl h-96 animate-pulse"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="w-full text-white min-h-screen flex flex-col px-4 md:px-8 py-8 font-sans"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-amber-500">
        <Sparkles size={28} className="text-amber-400" />
        <span className="text-zinc-50">Gestión de Usuarios</span>
      </h1>

      {/* Formulario de Creación/Edición */}
      <motion.div
        className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-zinc-800/60 p-8 rounded-2xl shadow-lg mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-3">
          <UserPlus size={20} />
          {editingId ? "Editar Rol de Usuario" : "Crear Nuevo Usuario"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            disabled={editingId !== null}
            className="p-3 rounded-lg bg-zinc-800/40 border border-zinc-700/60 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-500/50 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            disabled={editingId !== null}
            className="p-3 rounded-lg bg-zinc-800/40 border border-zinc-700/60 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-500/50 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <select
            value={form.role_id}
            onChange={(e) => setForm({ ...form, role_id: Number(e.target.value) })}
            className="p-3 rounded-lg bg-zinc-800/40 border border-zinc-700/60 text-white focus:ring-2 focus:ring-amber-500/50 outline-none transition"
          >
            <option value={1}>Administrador</option>
            <option value={2}>Barbero</option>
          </select>
          {!editingId && (
            <input
              type="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="p-3 rounded-lg bg-zinc-800/40 border border-zinc-700/60 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-500/50 outline-none transition"
            />
          )}
          <div className="flex gap-2">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-amber-500 text-black py-3 px-4 rounded-lg font-semibold shadow-md hover:bg-amber-400 transition"
            >
              {editingId ? "Actualizar" : "Crear"}
            </motion.button>
            {editingId && (
              <motion.button
                type="button"
                onClick={handleCancel}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-3 rounded-lg font-semibold border border-zinc-700/60 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100 transition"
              >
                Cancelar
              </motion.button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Barra de búsqueda */}
      <div className="flex items-center gap-2 mb-6 bg-zinc-800/20 p-3 rounded-lg border border-zinc-800/60 w-full md:w-1/2">
        <Search size={18} className="text-amber-500" />
        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent flex-1 text-white placeholder-zinc-500 outline-none"
        />
      </div>

      {/* Stats Bar */}
      {pagination && (
        <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-zinc-800/60 p-4 rounded-2xl shadow-lg mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 border border-amber-900/30 bg-amber-950/30 rounded-xl text-amber-500">
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Total de Usuarios</p>
              <p className="text-2xl font-bold text-amber-400">{pagination.totalUsers}</p>
            </div>
          </div>
          <div className="text-right text-sm text-zinc-400">
            <p>Página <span className="text-amber-400 font-bold">{pagination.currentPage}</span> de <span className="text-amber-400 font-bold">{pagination.totalPages}</span></p>
            <p className="text-xs text-zinc-500 mt-1">Mostrando {users.length} de {pagination.totalUsers} usuarios</p>
          </div>
        </div>
      )}

      {/* Tabla / Tarjetas de usuarios */}
      <motion.div
        className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-zinc-800/60 rounded-2xl shadow-lg flex flex-col flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex-1">
          {/* MOBILE VIEW (CARDS) */}
          <div className="md:hidden grid grid-cols-1 gap-4 p-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <div key={u.id} className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-mono text-amber-500/80 mb-1">#{u.id}</p>
                      <h3 className="text-lg font-bold text-zinc-100">{u.username}</h3>
                      <p className="text-sm text-zinc-400">{u.email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getRoleColor(u.role_id)}`}>
                      {getRoleLabel(u.role_id)}
                    </span>
                  </div>
                  
                  <div className="pt-2 border-t border-zinc-800/50 flex justify-between items-center text-xs">
                    <span className="text-zinc-500">
                      {format(new Date(u.createdAt), "dd/MM/yyyy", { locale: es })}
                    </span>
                    <div className="flex gap-4">
                      <button onClick={() => handleEditRole(u)} className="text-amber-400 p-2">
                        <Edit size={20} />
                      </button>
                      <button onClick={() => handleDelete(u.id, u.username)} className="text-red-500 p-2">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
               <p className="text-center py-10 text-zinc-500 italic">No hay usuarios</p>
            )}
          </div>

          {/* DESKTOP VIEW (TABLE) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="text-xs text-zinc-500 uppercase border-b border-zinc-800/80 sticky top-0 bg-[#0f0f0f]">
                <tr>
                  <th scope="col" className="px-6 py-4 font-bold tracking-widest">ID</th>
                  <th scope="col" className="px-6 py-4 font-bold tracking-widest">Usuario</th>
                  <th scope="col" className="px-6 py-4 font-bold tracking-widest">Email</th>
                  <th scope="col" className="px-6 py-4 font-bold tracking-widest text-center">Rol</th>
                  <th scope="col" className="px-6 py-4 font-bold tracking-widest text-right">Registro</th>
                  <th scope="col" className="px-6 py-4 font-bold tracking-widest text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                <AnimatePresence>
                  {filteredUsers.map((u) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-zinc-800/20 transition-colors"
                    >
                      <td className="px-6 py-5 font-mono text-amber-500/80">#{u.id}</td>
                      <td className="px-6 py-5 text-zinc-100 font-semibold">{u.username}</td>
                      <td className="px-6 py-5 text-zinc-400">{u.email}</td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getRoleColor(u.role_id)}`}>
                          {getRoleLabel(u.role_id)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-zinc-500 font-medium text-right">
                        {format(new Date(u.createdAt), "dd MMM, yyyy", { locale: es })}
                      </td>
                      <td className="px-6 py-5 flex justify-center gap-3">
                        <button onClick={() => handleEditRole(u)} className="text-amber-400 hover:scale-110 transition"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(u.id, u.username)} className="text-red-500 hover:scale-110 transition"><Trash2 size={18} /></button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-6 border-t border-zinc-800/60">
            <div className="text-sm text-zinc-500">
              Mostrando <span className="text-amber-400 font-semibold">{(pagination.currentPage - 1) * itemsPerPage + 1}</span> a <span className="text-amber-400 font-semibold">{Math.min(pagination.currentPage * itemsPerPage, pagination.totalUsers)}</span> de <span className="text-amber-400 font-semibold">{pagination.totalUsers}</span> usuarios
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={!pagination.hasPrevPage}
                className="flex items-center gap-2 px-4 py-2 border border-zinc-800/60 rounded-lg text-sm font-medium text-zinc-300 hover:border-amber-500/30 hover:text-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-zinc-800/60 disabled:hover:text-zinc-300"
              >
                <ChevronLeft size={16} />
                Anterior
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                        pagination.currentPage === pageNum
                          ? "bg-amber-500 text-[#0f0f0f] font-bold"
                          : "border border-zinc-800/60 text-zinc-400 hover:border-amber-500/30 hover:text-amber-400"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={!pagination.hasNextPage}
                className="flex items-center gap-2 px-4 py-2 border border-zinc-800/60 rounded-lg text-sm font-medium text-zinc-300 hover:border-amber-500/30 hover:text-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-zinc-800/60 disabled:hover:text-zinc-300"
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ManageUsers;
