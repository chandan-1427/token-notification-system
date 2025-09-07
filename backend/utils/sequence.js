import Counter from "../models/Counter.js";
import { getDayKey } from "./dayKey.js";

/**
 * Atomically increments and returns the next token number for the given dayKey.
 */
export const nextTokenNumber = async (dayKey = getDayKey()) => {
  const doc = await Counter.findOneAndUpdate(
    { _id: dayKey },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  ).lean();
  return doc.seq; // 1, 2, 3, ...
};
