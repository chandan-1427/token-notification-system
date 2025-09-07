import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // dayKey: "YYYY-MM-DD" in your TZ
    seq: { type: Number, default: 0 },
  },
  { versionKey: false }
);

export default mongoose.model("Counter", counterSchema, "token_counters");
