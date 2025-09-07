import mongoose from "mongoose";
import Token from "../models/Token.js";
import { nextTokenNumber } from "../utils/sequence.js";
import { getDayKey } from "../utils/dayKey.js";
import { log } from "../utils/logger.js";

// Emit helper (kept from your code)
const emitTokensChanged = async (req, action, token) => {
  try {
    const io = req.app.get("io");
    if (io) io.emit("tokens:changed", { action, tokenId: token?._id || null });
  } catch (e) {
    log(req, "WARN", "Socket emit failed", { error: e.message });
  }
};

// --- Validation helpers ---
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const sanitizeStr = (s) => (typeof s === "string" ? s.trim() : "");

// --- Add Token ---
export const addToken = async (req, res) => {
  try {
    let { name, contact, email } = req.body || {};
    name = sanitizeStr(name);
    contact = sanitizeStr(contact);
    email = sanitizeStr(email);

    if (!name || !contact) {
      log(req, "WARN", "Add token rejected: missing fields", { name, contact });
      return res.status(400).json({ message: "Name and contact are required" });
    }

    // Derive dayKey in configured timezone
    const dayKey = getDayKey();

    // Atomically get next number for this day
    const tokenNumber = await nextTokenNumber(dayKey);

    const token = await Token.create({
      name,
      contact,
      email,
      tokenNumber,
      dayKey,
    });

    log(req, "INFO", "Token created", { dayKey, tokenNumber, id: token._id.toString() });

    res.status(201).json(token);
    await emitTokensChanged(req, "created", token);
  } catch (error) {
    // If unique index ever collides (shouldn’t due to counters), retry once
    if (error?.code === 11000) {
      log(req, "WARN", "Duplicate token detected; retrying once");
      try {
        const dayKey = getDayKey();
        const tokenNumber = await nextTokenNumber(dayKey);
        const { name, contact, email } = req.body;
        const token = await Token.create({ name, contact, email, tokenNumber, dayKey });
        res.status(201).json(token);
        await emitTokensChanged(req, "created", token);
        return;
      } catch (e2) {
        log(req, "ERROR", "Retry failed", { error: e2.message });
        return res.status(500).json({ message: e2.message });
      }
    }
    log(req, "ERROR", "Add token failed", { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

// --- Get Tokens (with smart defaults & filters) ---
// Query params: ?day=today|YYYY-MM-DD (default today), &status=waiting|served|skipped|all (default: all), &q=searchText
export const getTokens = async (req, res) => {
  try {
    const dayParam = sanitizeStr(req.query.day);
    const status = sanitizeStr(req.query.status);
    const q = sanitizeStr(req.query.q);

    const dayKey = dayParam && dayParam !== "today" ? dayParam : getDayKey();

    const filter = { dayKey };
    if (status && status !== "all") filter.status = status;

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { contact: { $regex: q, $options: "i" } },
        { tokenNumber: Number.isFinite(+q) ? +q : -1 },
      ];
    }

    const tokens = await Token.find(filter, null, { lean: true })
      .sort({ tokenNumber: 1 })
      .exec();

    log(req, "INFO", "Tokens fetched", { dayKey, status: filter.status || "any", count: tokens.length });

    res.json(tokens);
  } catch (error) {
    log(req, "ERROR", "Get tokens failed", { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

// --- Serve Token (race-safe) ---
export const serveToken = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid token id" });

    // Only update if currently waiting
    const token = await Token.findOneAndUpdate(
      { _id: id, status: "waiting" },
      { $set: { status: "served", updatedAt: new Date() } },
      { new: true }
    ).lean();

    if (!token) {
      // Check existence for better error
      const exists = await Token.findById(id).lean();
      if (!exists) return res.status(404).json({ message: "Token not found" });
      return res.status(409).json({ message: `Token already ${exists.status}` });
    }

    log(req, "INFO", "Token served", {
      id,
      tokenNumber: token.tokenNumber,
      dayKey: token.dayKey,
    });

    res.json({ message: "Token served", token });
    await emitTokensChanged(req, "updated", token);
  } catch (error) {
    log(req, "ERROR", "Serve token failed", { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

// --- Skip Token (race-safe) ---
export const skipToken = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid token id" });

    const token = await Token.findOneAndUpdate(
      { _id: id, status: "waiting" },
      { $set: { status: "skipped", updatedAt: new Date() } },
      { new: true }
    ).lean();

    if (!token) {
      const exists = await Token.findById(id).lean();
      if (!exists) return res.status(404).json({ message: "Token not found" });
      return res.status(409).json({ message: `Token already ${exists.status}` });
    }

    log(req, "INFO", "Token skipped", {
      id,
      tokenNumber: token.tokenNumber,
      dayKey: token.dayKey,
    });

    res.json({ message: "Token skipped", token });
    await emitTokensChanged(req, "updated", token);
  } catch (error) {
    log(req, "ERROR", "Skip token failed", { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

// --- Delete Token ---
export const deleteToken = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid token id" });

    const token = await Token.findById(id);
    if (!token) return res.status(404).json({ message: "Token not found" });

    await token.deleteOne();
    log(req, "INFO", "Token deleted", { id, tokenNumber: token.tokenNumber, dayKey: token.dayKey });

    res.json({ message: "Token deleted" });
    await emitTokensChanged(req, "deleted", token);
  } catch (error) {
    log(req, "ERROR", "Delete token failed", { error: error.message });
    res.status(500).json({ message: error.message });
  }
};
