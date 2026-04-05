const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configurar el almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 💡 Obtener email del usuario (requiere verifyToken ejecutado antes)
    // O del body si es registro y el cliente lo envió antes que el archivo
    const email = req.user?.email || req.body?.email || "unknown";
    
    // Limpiar email para evitar caracteres extraños en carpetas (opcional)
    const folderName = email.replace(/[^a-zA-Z0-9.@_-]/g, "_");
    
    const userFolder = path.join(__dirname, "../../uploads", folderName);

    // Crear la carpeta si no existe
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }

    cb(null, userFolder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ej: 1731413055123.png
  },
});

// Filtrar tipos de archivo
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Formato de imagen no permitido"));
  }
};

module.exports = multer({ storage, fileFilter });
