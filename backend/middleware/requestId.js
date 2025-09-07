import crypto from "crypto";
export const requestId = (req, _res, next) => {
  req.id = crypto.randomBytes(4).toString("hex");
  next();
};