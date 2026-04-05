const { Notification } = require("../models");

/**
 * GET /api/notifications
 * Obtiene las notificaciones del usuario logueado.
 */
exports.getNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;
    const notifications = await Notification.findAll({
      where: { user_id },
      order: [["created_at", "DESC"]],
      limit: 50,
    });
    res.json(notifications);
  } catch (error) {
    console.error("❌ Error getNotifications:", error);
    res.status(500).json({ error: "Error al obtener notificaciones" });
  }
};

/**
 * PUT /api/notifications/:id/read
 * Marca una notificación como leída.
 */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res.status(404).json({ error: "Notificación no encontrada" });
    }

    if (notification.user_id !== req.user.id) {
      return res.status(403).json({ error: "No tienes permiso" });
    }

    await notification.update({ is_read: true });
    res.json({ message: "Notificación marcada como leída", notification });
  } catch (error) {
    console.error("❌ Error markAsRead:", error);
    res.status(500).json({ error: "Error" });
  }
};

/**
 * PUT /api/notifications/read-all
 * Marca todas las notificaciones como leídas.
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const user_id = req.user.id;
    await Notification.update(
      { is_read: true },
      { where: { user_id, is_read: false } }
    );
    res.json({ message: "Todas las notificaciones marcadas como leídas" });
  } catch (error) {
    console.error("❌ Error markAllAsRead:", error);
    res.status(500).json({ error: "Error" });
  }
};
