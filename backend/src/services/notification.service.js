const { Notification, User } = require("../models");
const { sendMail } = require("../utils/mailer");
const { sendSMS } = require("../utils/sms.util");

/**
 * 🔔 Unified Notification Service
 * Creates a DB record, sends an email, and sends an SMS automatically.
 * 
 * @param {Object} options
 * @param {number} options.userId - Recipient user ID
 * @param {string} options.type - Notification type (e.g. appointment_update, order_status)
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {Object} options.metadata - Optional extra data (e.g. appointment_id)
 */
exports.notify = async ({ userId, type, title, message, metadata = {} }) => {
  try {
    // 1. Create DB Notification
    const notification = await Notification.create({
      user_id: userId,
      type,
      title,
      message,
      metadata
    });

    // 2. Fetch User Data
    const user = await User.findByPk(userId);
    if (!user) return notification;

    // 📩 3. Send Email
    if (user.email) {
      await sendMail({
        to: user.email,
        subject: `GargoBarb: ${title}`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
            <div style="background-color: #0b0f14; padding: 30px; text-align: center; border-bottom: 4px solid #facc15;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px;">GARGO<span style="color: #facc15;">BARB</span></h1>
            </div>
            <div style="padding: 40px 30px;">
              <h2 style="color: #111827; font-size: 20px; margin-top: 0;">${title}</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${message}</p>
              <div style="margin-top: 30px; padding: 20px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #facc15;">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">Puedes ver más detalles iniciando sesión en tu cuenta de GargoBarb.</p>
              </div>
            </div>
            <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">© 2026 GargoBarb Platform. Todos los derechos reservados.</p>
            </div>
          </div>
        `
      });
    }

    // 📲 4. Send SMS
    if (user.phone) {
      const smsBody = `GargoBarb: ${title}. ${message}`.substring(0, 160);
      await sendSMS(user.phone, smsBody);
    }

    return notification;
  } catch (error) {
    console.error("❌ Notification Service Error:", error);
    // Silent fail to not break main flow
  }
};
