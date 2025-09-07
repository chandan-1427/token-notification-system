// backfillDayKey.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import Token from "./models/Token.js"; // adjust path if needed

dotenv.config();
dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = process.env.TIMEZONE || "Asia/Kolkata";

async function backfillDayKey() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("✅ Connected to MongoDB");

  const cursor = Token.find({ dayKey: { $exists: false } }).cursor();
  let count = 0;

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    const created = dayjs(doc.createdAt).tz(TIMEZONE);
    const dayKey = created.format("YYYY-MM-DD");

    doc.dayKey = dayKey;
    await doc.save();
    count++;
  }

  console.log(`🎉 Backfilled ${count} documents`);
  await mongoose.disconnect();
}

backfillDayKey().catch((err) => {
  console.error("❌ Error in backfill:", err);
  process.exit(1);
});
