import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true }, // keep free-form; you can enforce pattern later
    email: { type: String, trim: true },
    tokenNumber: { type: Number, required: true },
    dayKey: { type: String, required: true }, // "YYYY-MM-DD" in configured TZ
    status: {
      type: String,
      enum: ["waiting", "served", "skipped"],
      default: "waiting",
      index: true,
    },
    notified: { type: Boolean, default: false },
    notifiedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Uniqueness per day
tokenSchema.index({ dayKey: 1, tokenNumber: 1 }, { unique: true });
// Fast queue scans
tokenSchema.index({ dayKey: 1, status: 1, tokenNumber: 1 });

export default mongoose.model("Token", tokenSchema);
