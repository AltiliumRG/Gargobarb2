const { sequelize } = require('../config/db');
require('../models'); // Import models to ensure they are registered with Sequelize

async function syncDatabase() {
    try {
        console.log('🔄 Iniciando sincronización de la base de datos...');

        // sync({ alter: true }) intenta actualizar las tablas existentes para que coincidan con los modelos
        // sin borrar los datos existentes. Agregará columnas nuevas o cambiará tipos si es posible.
        await sequelize.sync({ alter: true });

        console.log('✅ Base de datos sincronizada correctamente sin pérdida de datos.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al sincronizar la base de datos:', error.message);
        process.exit(1);
    }
}

syncDatabase();
