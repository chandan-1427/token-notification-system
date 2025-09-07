// import Token from "../models/Token.js";
// import twilio from "twilio";
// import sgMail from "@sendgrid/mail";

// const enableSMS = String(process.env.ENABLE_SMS || "false") === "true";
// const enableEmail = String(process.env.ENABLE_EMAIL || "false") === "true";
// const defaultNotifyBefore = Number(process.env.NOTIFY_BEFORE || 1);

// // Twilio / SendGrid init
// let twilioClient = null;
// if (enableSMS) {
//   twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
// }
// if (enableEmail) {
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// }

// export const sendSMS = async (to, body) => {
//   if (!enableSMS || !twilioClient) return;
//   if (!to) return;
//   await twilioClient.messages.create({
//     to,
//     from: process.env.TWILIO_FROM,
//     body,
//   });
// };

// export const sendEmail = async (to, subject, text) => {
//   if (!enableEmail || !to) return;
//   const msg = { to, from: process.env.SENDGRID_FROM, subject, text };
//   await sgMail.send(msg);
// };

// /**
//  * Find the person to notify based on notifyBefore.
//  * Example: if notifyBefore=2 and waiting list is [A,B,C,D,...]
//  * when A is called (served), we notify C (index 2).
//  */
// export const notifyNextIfNeeded = async ({ notifyBefore }) => {
//   const N = Number(notifyBefore ?? defaultNotifyBefore);

//   // waiting list ordered by tokenNumber
//   const waiting = await Token.find({ status: "waiting" }).sort({ tokenNumber: 1 }).lean();

//   // If there aren’t enough people, nothing to notify
//   if (waiting.length <= N) return null;

//   const target = waiting[N]; // zero-based index
//   if (!target) return null;

//   // already notified?
//   if (target.notified) return null;

//   const message = `Reminder: Your turn is approaching (Token #${target.tokenNumber}). Please be ready.`;

//   // Send SMS/Email in parallel if enabled
//   await Promise.all([
//     sendSMS(target.contact, message),
//     sendEmail(target.email, "Your turn is approaching", message),
//   ]);

//   // mark notified
//   await Token.updateOne({ _id: target._id }, { $set: { notified: true, notifiedAt: new Date() } });
//   return target;
// };
