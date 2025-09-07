// Alternative for twilio but server/backend always has to connect to the whatsapp which isn't optimal

// import { Client } from "whatsapp-web.js";
// import qrcode from "qrcode-terminal";

// let whatsappClient;

// export const initWhatsApp = () => {
//   whatsappClient = new Client();

//   // Show QR in terminal for first-time authentication
//   whatsappClient.on("qr", qr => {
//     console.log("📱 Scan this QR code with your WhatsApp:");
//     qrcode.generate(qr, { small: true });
//   });

//   // Confirm when ready
//   whatsappClient.on("ready", () => {
//     console.log("✅ WhatsApp client is ready!");
//   });

//   whatsappClient.initialize();
// };

// // Send WhatsApp message
// export const sendWhatsApp = async (phoneNumber, message) => {
//   if (!whatsappClient) {
//     throw new Error("WhatsApp client not initialized");
//   }

//   // Format number → must end with @c.us
//   const chatId = phoneNumber.includes("@c.us")
//     ? phoneNumber
//     : phoneNumber.replace(/\D/g, "") + "@c.us";

//   try {
//     await whatsappClient.sendMessage(chatId, message);
//     console.log(`📨 WhatsApp message sent to ${phoneNumber}`);
//   } catch (err) {
//     console.error("❌ WhatsApp send error:", err.message);
//   }
// };
