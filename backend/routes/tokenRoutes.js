import express from "express";
import {
  addToken,
  getTokens,
  serveToken,
  skipToken,
  deleteToken,
} from "../controllers/tokenController.js";

const router = express.Router();

router.post("/", addToken);
router.get("/", getTokens);
router.put("/:id/serve", serveToken);
router.put("/:id/skip", skipToken);
router.delete("/:id", deleteToken);

export default router;
