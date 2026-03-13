// backend/src/middleware/error.middleware.js

//si algo falla en el servidor manda 500
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
};
//exportamos
module.exports = { errorHandler };
