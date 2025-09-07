import { jest } from "@jest/globals";
import request from "supertest";
import { app, server, io } from "../server.js";
import mongoose from "mongoose";
import Token from "../models/Token.js";

jest.setTimeout(20000); // increase timeout for slow DB ops

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Token.deleteMany(); // clean slate
});

afterAll(async () => {
  io.close(); // close sockets
  await mongoose.disconnect();
  await new Promise((resolve) => server.close(resolve));
});

describe("Token API", () => {
  let tokenId;

  it("should return 200 on GET /api/tokens", async () => {
    const res = await request(app).get("/api/tokens");
    expect(res.status).toBe(200);
  });

  it("POST /api/tokens → should create a new token", async () => {
    const res = await request(app).post("/api/tokens").send({
      name: "Test User",
      contact: "9999999999",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.tokenNumber).toBeDefined();
    tokenId = res.body._id;
  });

  it("GET /api/tokens → should list waiting tokens", async () => {
    const res = await request(app).get("/api/tokens");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("PUT /api/tokens/:id/serve → should mark as served", async () => {
    const res = await request(app).put(`/api/tokens/${tokenId}/serve`);
    expect(res.statusCode).toBe(200);
    expect(res.body.token.status).toBe("served");
  });
});
