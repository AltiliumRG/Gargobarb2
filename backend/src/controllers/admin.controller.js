// ============================================================
// 📁 backend/src/controllers/admin.controller.js
// ============================================================

const { User, Barbershop } = require("../models");

exports.getDashboardStats = async (req, res) => {
    try {
        console.log("📊 Iniciando getDashboardStats...");

        // 1. KPI Counts
        const totalUsers = await User.count();
        console.log("✅ Total de usuarios:", totalUsers);

        const totalBarbershops = await Barbershop.count();
        console.log("✅ Total de barberías:", totalBarbershops);

        // 2. Recent Records (Last 5 users)
        const recentUsers = await User.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'username', 'email', 'role_id', 'createdAt']
        });
        console.log("✅ Usuarios recientes:", recentUsers.length);

        // Respond
        const response = {
            kpis: {
                totalUsers,
                totalBarbershops
            },
            recentUsers: recentUsers
        };

        console.log("📤 Enviando respuesta:", JSON.stringify(response, null, 2));
        res.json(response);

    } catch (error) {
        console.error("❌ Error en getDashboardStats:", error.message);
        console.error("❌ Stack:", error.stack);
        res.status(500).json({ 
            error: "Error fetching admin dashboard stats",
            message: error.message 
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        console.log("📊 Iniciando getAllUsers...");
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        console.log(`📄 Parámetros - page: ${page}, limit: ${limit}, offset: ${offset}`);

        // Get total count
        const totalUsers = await User.count();
        console.log(`✅ Total de usuarios en BD: ${totalUsers}`);

        // Get paginated users
        const users = await User.findAll({
            offset: offset,
            limit: limit,
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'username', 'email', 'full_name', 'role_id', 'createdAt']
        });

        console.log(`✅ Usuarios obtenidos en esta página: ${users.length}`);

        const totalPages = Math.ceil(totalUsers / limit);

        const response = {
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalUsers: totalUsers,
                limit: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            users: users
        };

        console.log("📤 Enviando respuesta:", JSON.stringify(response, null, 2));
        res.json(response);

    } catch (error) {
        console.error("❌ Error en getAllUsers:", error.message);
        console.error("❌ Stack:", error.stack);
        res.status(500).json({ 
            error: "Error fetching users",
            message: error.message 
        });
    }
};
