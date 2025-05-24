// src/index.ts
import dotenv from "dotenv";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "./app";
import { AppDataSource } from "./config/db";

dotenv.config();

async function bootstrap() {
  await AppDataSource.initialize();
  console.log("DB initialized");

  const server = http.createServer(app);
  const io     = new SocketIOServer(server, { cors: { origin: "*" } });
  io.on("connection", socket => console.log("WS connected:", socket.id));

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});
