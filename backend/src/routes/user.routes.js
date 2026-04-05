const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');
const User = require('../models/User');
const upload = require('../middleware/upload.middleware');

// ✅ Obtener todos los usuarios (solo admin)
router.get('/', verifyToken, requireRole(1), userController.getAllUsersFiltered);

// ✅ Obtener todos los dueños (rol = 2)
router.get('/owners', verifyToken, requireRole(1), async (req, res) => {
  try {
    const owners = await User.findAll({
      where: { role_id: 2 },
      attributes: ['id', 'full_name', 'email'],
    });
    res.json(owners);
  } catch (error) {
    console.error('❌ Error al obtener dueños:', error);
    res.status(500).json({ error: 'Error al obtener dueños' });
  }
});

// ✅ Actualizar perfil propio (ANTES de /:id para evitar conflicto)
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const { username, full_name, email } = req.body;
    await user.update({ username, full_name, email });
    const safe = user.toJSON();
    delete safe.password_hash;
    delete safe.refresh_token_hash;
    delete safe.reset_code;
    delete safe.reset_code_expires;
    res.json({ message: 'Perfil actualizado', user: safe });
  } catch (err) {
    console.error('❌ Error al actualizar perfil:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Subir avatar
router.post('/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se recibió imagen' });
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const emailFolder = user.email.replace(/[^a-zA-Z0-9.@_-]/g, "_");
    const avatar_url = `/uploads/${emailFolder}/${req.file.filename}`;
    await user.update({ avatar_url });
    const safe = user.toJSON();
    delete safe.password_hash;
    delete safe.refresh_token_hash;
    delete safe.reset_code;
    delete safe.reset_code_expires;
    res.json({ message: 'Avatar actualizado', user: safe });
  } catch (err) {
    console.error('❌ Error al subir avatar:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Eliminar cuenta propia (ANTES de /:id)
router.delete('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    await user.destroy();
    res.json({ message: 'Cuenta eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar cuenta' });
  }
});

// ✅ Crear usuario
router.post('/', userController.createUser);

// ✅ Obtener usuario por ID
router.get('/:id', verifyToken, userController.getUserById);

// ✅ Actualizar usuario por ID (admin)
router.put('/:id', verifyToken, userController.updateUser);

// ✅ Eliminar usuario por ID (solo admin)
router.delete('/:id', verifyToken, requireRole(1), userController.deleteUser);

module.exports = router;
