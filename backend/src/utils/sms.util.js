const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

// Si falta alguna configuración, el cliente no se inicializa para evitar crasheos
let client = null;
if (accountSid && authToken && accountSid !== "your_account_sid_here") {
  client = twilio(accountSid, authToken);
}

/**
 * 📲 Utility for sending SMS via Twilio
 * @param {string} to - Recipient phone number (e.g. +573001234567)
 * @param {string} body - Message body
 */
exports.sendSMS = async (to, body) => {
  try {
    if (!client) {
      console.warn("⚠️ Twilio client not configured. SMS not sent.");
      return null;
    }

    if (!to) {
       console.warn("⚠️ Recipient phone number missing.");
       return null;
    }

    // Ensure 'to' has a plus sign (international format)
    const formattedTo = to.startsWith("+") ? to : `+${to}`;

    const message = await client.messages.create({
      body: body,
      from: twilioNumber,
      to: formattedTo
    });

    console.log(`✅ SMS sent successfully to ${formattedTo}. SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error("❌ Twilio SMS Error:", error.message);
    // Return null instead of throwing to not break the main flow
    return null;
  }
};
