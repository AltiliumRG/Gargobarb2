// backend/src/db.js

//importamos squalize
const { Sequelize } = require('sequelize');
//importamos el .env
require('dotenv').config();

//le pasamos a la variable sequalize nuestras variables de conexion
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
  }
);

//funcion para probar la conexion
async function testConnection() {
  //si conecta enviamos mensaje
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a MySQL (Sequelize).');
    //si falla enviamos mensaje
  } catch (err) {
    console.error('❌ Error al conectar DB:', err.message);
    throw err;
  }
}
//exportamos la variable sequalize y la funcion testConnection
module.exports = { sequelize, testConnection };
