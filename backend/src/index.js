/**
 * Gargobarb Server Entry Point
 * 
 * Initializes the database connection and starts the HTTP server.
 */

require('dotenv').config();
const { testConnection, sequelize } = require('./config/db');
const app = require('./app');

// Server Configuration
const PORT = process.env.PORT || 4000;

/**
 * Main application bootstrap function.
 */
const bootstrap = async () => {
  try {
    // 1. Database Connection Test
    await testConnection();
    console.log('✅ MySQL Connection via Sequelize established.');

    // 2. Authentication Test
    await sequelize.authenticate();
    console.log('✅ Database authentication successful.');

    // 3. Start Express Server
    app.listen(PORT, () => {
      console.log(`🚀 Server listening at http://localhost:${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    });

  } catch (error) {
    console.error('❌ Critical error during server startup:');
    console.error(error.message);
    process.exit(1); // Exit with failure
  }
};

// Start the bootstrap process
bootstrap();
