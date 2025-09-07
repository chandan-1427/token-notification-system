export const log = (req, level, msg, meta = {}) => {
  const rid = req?.id || "-";
  const base = { rid, ...meta };
  // Keep it simple; swap for pino later if you want.
  console.log(`[${level}]`, msg, Object.keys(base).length ? base : "");
};
