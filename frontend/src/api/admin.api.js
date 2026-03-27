// src/api/admin.api.js
import api from "./axios";

export const getDashboardStats = async () => {
    try {
        console.log("📡 Llamando a /admin/dashboard-stats...");
        const response = await api.get("/admin/dashboard-stats");
        console.log("📥 Respuesta recibida:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error en getDashboardStats:", error);
        if (error.response) {
            console.error("   Status:", error.response.status);
            console.error("   Data:", error.response.data);
        }
        throw error;
    }
};

export const getAllUsers = async (page = 1, limit = 10) => {
    try {
        console.log(`📡 Llamando a /admin/users (page: ${page}, limit: ${limit})...`);
        const response = await api.get(`/admin/users`, {
            params: { page, limit }
        });
        console.log("📥 Usuarios recibidos:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error en getAllUsers:", error);
        if (error.response) {
            console.error("   Status:", error.response.status);
            console.error("   Data:", error.response.data);
        }
        throw error;
    }
};
