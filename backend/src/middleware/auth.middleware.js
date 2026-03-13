// ============================================================
// 📁 backend/src/middleware/auth.middleware.js
// ============================================================
const jwt = require("jsonwebtoken");//jwt
const bcrypt = require("bcryptjs");//bcrypt para encriptar
const { User } = require("../models");//modelo de usuario

// ============================================================
// 🔐 1️⃣ VERIFICAR ACCESS TOKEN (15 min)
// ============================================================
exports.verifyToken = async (req, res, next) => {
  
  const token = req.cookies?.access_token;

  //validacion de que haya token
  if (!token) {
    console.log("⚠️ No token found. Cookies:", Object.keys(req.cookies || {}));
    return res.status(401).json({ code: "NO_TOKEN" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.sub, {
      attributes: { exclude: ["password_hash", "refresh_token_hash"] },
    });

    if (!user) {
      console.log("⚠️ User not found for token - user ID:", decoded.sub);
      return res.status(404).json({ code: "USER_NOT_FOUND" });
    }

    console.log("✅ Token verificado para usuario:", user.username);
    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Error verificando token:", err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ code: "TOKEN_EXPIRED" });
    }

    return res.status(401).json({ code: "TOKEN_INVALID" });
  }
};

// ============================================================
// 🔄 2️⃣ REFRESH TOKEN (ROTACIÓN REAL)
// ============================================================
exports.refreshTokenController = async (req, res) => {
  const refreshToken = req.cookies?.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({ code: "NO_REFRESH_TOKEN" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findByPk(decoded.sub);

    if (!user || !user.refresh_token_hash) {
      return res.status(403).json({ code: "REFRESH_INVALID" });
    }

    const isValid = await bcrypt.compare(
      refreshToken,
      user.refresh_token_hash
    );

    if (!isValid) {
      return res.status(403).json({ code: "REFRESH_INVALID" });
    }

    // 🆕 Nuevo ACCESS TOKEN
    const newAccessToken = jwt.sign(
      {
        sub: user.id,
        username: user.username,
        role_id: user.role_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 🆕 Nuevo REFRESH TOKEN (ROTACIÓN)
    const newRefreshToken = jwt.sign(
      { sub: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    user.refresh_token_hash = await bcrypt.hash(newRefreshToken, 10);
    await user.save();

    // 🍪 Cookies
    const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    };

    res.cookie("access_token", newAccessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refresh_token", newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Tokens renovados correctamente" });
  } catch (err) {
    console.error("❌ Refresh error:", err.message);
    return res.status(403).json({ code: "REFRESH_EXPIRED" });
  }
};

// ============================================================
// 🚪 3️⃣ LOGOUT
// ============================================================
exports.logout = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (userId) {
      const user = await User.findByPk(userId);
      if (user) {
        user.refresh_token_hash = null;
        await user.save();
      }
    }

    const cookieOptions = {
      path: "/",
      sameSite: "lax",
      secure: false
    };

    res.clearCookie("access_token", cookieOptions);
    res.clearCookie("refresh_token", cookieOptions);

    res.json({ message: "Sesión cerrada correctamente" });
  } catch (err) {
    console.error("❌ Logout error:", err.message);
    res.status(500).json({ message: "Error al cerrar sesión" });
  }
};

// ============================================================
// 🛡 4️⃣ VALIDACIÓN DE ROLES
// ============================================================
exports.requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log("⚠️ requireRole - No autenticado");
      return res.status(401).json({ message: "No autenticado" });
    }

    console.log(`🔐 requireRole - User role_id: ${req.user.role_id}, allowed: ${allowedRoles}`);

    if (!allowedRoles.includes(req.user.role_id)) {
      console.log(`❌ requireRole - Acceso denegado para role_id: ${req.user.role_id}`);
      return res.status(403).json({
        message: "Acceso denegado: no tienes permiso",
      });
    }

    console.log(`✅ requireRole - Acceso permitido para user ${req.user.username}`);
    next();
  };
};

// ============================================================
// 🔓 5️⃣ ENDPOINT PRIVADO
// ============================================================
exports.private = (req, res) => {
  res.json({
    message: "Sesión válida",
    user: req.user,
  });
};
