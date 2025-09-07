import mongoose from "mongoose";
import Token from "../models/Token.js";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Database Integrity", () => {
    beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await Token.deleteMany();
    await Token.syncIndexes();   // ✅ ensure indexes exist in Mongo
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
  it("should enforce unique (dayKey, tokenNumber)", async () => {
    const dayKey = "2025-09-04";

    const token1 = new Token({ name: "Alice", contact: "123", tokenNumber: 1, dayKey });
    await token1.save();

    const token2 = new Token({ name: "Bob", contact: "456", tokenNumber: 1, dayKey });

    let error = null;
    try {
      await token2.save();
    } catch (err) {
      error = err;
    }

    expect(error).not.toBeNull();
    expect(error.code).toBe(11000); // Mongo duplicate key error
  });
});
