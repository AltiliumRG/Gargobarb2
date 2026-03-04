//Importamos las variables de entorno del .env
require('dotenv').config();

//traemos las importaciones de db.js
const { testConnection, sequelize } = require('./config/db');

//traemos el archivo app con todas las importaciones
const app = require('./app');

//usamos el puerto del .env y si no funciona usamos 4000
const PORT = process.env.PORT || 4000;


(async () => {
  try {

    //Funcion TestConnection() en config/db.js

    await testConnection();
    console.log('✅ Conectado a MySQL (Sequelize).');

    await sequelize.authenticate();

    //aqui escuchamos el puerto podiendo utilizar nuestro servidor
    app.listen(PORT, () =>
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    );

    //si hay error imprime mensaje
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
  }
})();
