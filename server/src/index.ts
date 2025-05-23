import "reflect-metadata";
import express from "express";
import cors from "cors";
import http from "http";
import { DataSource } from "typeorm";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import { Zone } from "./entity/Zone";

// Загружаем .env
dotenv.config();

// 1) Настроить подключение к БД
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,            // для MVP: авто-создание таблиц
  entities: [__dirname + "/entity/*.{ts,js}"],
});

async function bootstrap() {
  // 2) Инициализируем БД
  await AppDataSource.initialize();

  // 3) Создаём Express + HTTP сервер
  const app = express();
  app.use(cors());
  app.use(express.json());

  // 4) Базовый REST-эндпоинт
  app.get("/health", (_req, res) => {
    res.json({ status: "OK" });
  });

  // 5) Эндпоинты для зон — теперь внутри того же блока, где объявлен app
  app.get("/zones", async (_req, res) => {
    const zones = await AppDataSource.getRepository(Zone).find();
    res.json(zones);
  });

  app.post("/zones", async (req, res) => {
    const repo = AppDataSource.getRepository(Zone);
    const zone = repo.create(req.body);
    await repo.save(zone);
    res.status(201).json(zone);
  });

  // 6) Подключаем Socket.IO поверх HTTP-сервера
  const server = http.createServer(app);
  const io = new SocketIOServer(server, { cors: { origin: "*" } });
  io.on("connection", (socket) => {
    console.log("WS connected:", socket.id);
  });

  // 7) Запуск
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

bootstrap().catch(console.error);
  