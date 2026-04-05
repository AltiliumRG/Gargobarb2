const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const { verifyToken } = require("../middleware/auth.middleware");

// POST /api/uploads/site-image
router.post("/site-image", verifyToken, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Archivo requerido" });
    }

    const emailFolder = req.user.email.replace(/[^a-zA-Z0-9.@_-]/g, "_");
    const fileUrl = `${process.env.UPLOADS_URL || `${req.protocol}://${req.get("host")}/uploads`}/${emailFolder}/${req.file.filename}`;

    res.json({
      message: "Imagen subida correctamente",
      url: fileUrl
    });

  } catch (err) {
    console.error("Error upload site image:", err);
    res.status(500).json({ error: "Error subiendo imagen" });
  }
});

module.exports = router;