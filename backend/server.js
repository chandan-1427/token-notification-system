import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { Server as SocketIoServer } from "socket.io";
import connectDB from "./config/database.js";
import tokenRoutes from "./routes/tokenRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { requestId } from "./middleware/requestId.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());
app.use(morgan("dev"));
app.use(requestId);

const server = http.createServer(app); // wrap express in http server

const io = new SocketIoServer(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);
  socket.on("disconnect", () => console.log("🔌 Client disconnected:", socket.id));
});

// make io accessible in controllers
app.set("io", io);

app.use("/api/tokens", tokenRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);

export { app, server, io };