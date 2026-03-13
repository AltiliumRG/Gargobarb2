// ============================================================
// 📁 backend/src/controllers/auth.controller.js
// ============================================================

//bcrypt para encriptar
const bcrypt = require("bcryptjs");
//libreria de google
const { OAuth2Client } = require("google-auth-library");
//
const authService = require("../services/auth.service");
const { User } = require("../models");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ============================================================
// 🍪 Función para enviar cookies seguras (access + refresh)
// ============================================================
const sendAuthCookies = (res, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: false,       // localhost
    sameSite: "lax",     // 🔥 ESTE ES EL FIX REAL
    path: "/",
  };


  res.cookie("access_token", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refresh_token", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};


// ============================================================
// 🟦 REGISTRO
// ============================================================
exports.register = async (req, res) => {
  try {
    console.log("📩 Intento de registro recibido:", req.body);
    const { username, email, password, full_name, phone, role_id } = req.body;

    let avatar_url = null;
    if (req.file) avatar_url = `/uploads/${req.file.filename}`;

    const user = await authService.register({
      username,
      email,
      password,
      full_name,
      phone,
      role_id,
      avatar_url,
    });

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user,
    });
  } catch (error) {
    console.error("❌ Error completo en register:", error);
    res.status(error.status || 500).json({ error: error.message || "Error interno en el servidor" });
  }
};

// ============================================================
// 🔑 LOGIN NORMAL
// ============================================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({
      usernameOrEmail: email,
      password,
    });

    // Enviar cookies
    sendAuthCookies(res, result.accessToken, result.refreshToken);

    res.json({
      message: "Inicio de sesión exitoso",
      user: result.user,
    });
  } catch (error) {
    console.error("❌ Error en login:", error.message);
    res.status(error.status || 500).json({ error: error.message });
  }
};

// ============================================================
// 🔄 RENOVAR TOKENS (Refresh Token)
// ============================================================
exports.refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ error: "No hay refresh token" });
    }

    const result = await authService.refreshTokens(refreshToken);


    // Nuevas cookies
    sendAuthCookies(res, result.accessToken, result.refreshToken);

    res.json({
      message: "Token renovado correctamente",
      user: result.user,
    });
  } catch (error) {
    console.error("❌ Error en refresh:", error.message);
    res.status(error.status || 500).json({ error: error.message });
  }
};

// ============================================================
// 🚪 LOGOUT
// ============================================================
exports.logout = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (userId) {
      await User.update(
        { refresh_token_hash: null },
        { where: { id: userId } }
      );
    }

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.json({ message: "Sesión cerrada correctamente" });
  } catch (error) {
    console.error("❌ Error en logout:", error.message);
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
};

// ============================================================
// 🔐 LOGIN CON GOOGLE
// ============================================================
exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: "Token de Google no recibido" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    const result = await authService.googleAuth({ email, name, picture });

    // Enviar cookies
    sendAuthCookies(res, result.accessToken, result.refreshToken);

    res.json({
      message: "Google Auth exitoso",
      user: result.user,
    });
  } catch (error) {
    console.error("❌ Error en Google Auth:", error.message);
    res.status(error.status || 500).json({ error: error.message });
  }
};
