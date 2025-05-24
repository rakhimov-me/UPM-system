import "reflect-metadata";
import express, { Request, Response, NextFunction, RequestHandler } from "express";
import cors from "cors";
import http from "http";
import { DataSource } from "typeorm";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";

import { Zone }  from "./entity/Zone";
import { Pilot } from "./entity/Pilot";
import { Drone } from "./entity/Drone";
import { FlightRequest } from "./entity/FlightRequest";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [__dirname + "/entity/*.{ts,js}"],
});

async function bootstrap() {
  await AppDataSource.initialize();

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Универсальный wrap, чтобы гарантировать catch для промисов
  const wrap =
    (fn: RequestHandler): RequestHandler =>
    (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };

  //
  // Pilots
  //
  app.get(
    "/api/pilots",
    wrap(async (_req, res) => {
      const pilots = await AppDataSource.getRepository(Pilot).find({ order: { id: "ASC" } });
      res.json(pilots);
    })
  );

  app.post(
    "/api/pilots",
    wrap(async (req, res) => {
      const { lastName, firstName, middleName, email, phone } = req.body;
      if (!lastName || !firstName) {
        res.status(400).json({ error: "lastName и firstName обязательны" });
        return;
      }
      const repo = AppDataSource.getRepository(Pilot);
      const pilot = repo.create({
        last_name: lastName,
        first_name: firstName,
        middle_name: middleName,
        email,
        phone,
      });
      await repo.save(pilot);
      res.status(201).json(pilot);
    })
  );

  //
  // Drones
  //
  app.get(
    "/api/drones",
    wrap(async (_req, res) => {
      const drones = await AppDataSource.getRepository(Drone).find({
        relations: ["pilot"],
        order: { id: "ASC" },
      });
      res.json(drones);
    })
  );

  app.post(
    "/api/drones",
    wrap(async (req, res) => {
      const { brand, model, serial_number, pilotId } = req.body;
      if (!brand || !model || !serial_number || pilotId == null) {
        res
          .status(400)
          .json({ error: "brand, model, serial_number и pilotId обязательны" });
        return;
      }
      const pilot = await AppDataSource.getRepository(Pilot).findOneBy({ id: Number(pilotId) });
      if (!pilot) {
        res.status(404).json({ error: "Pilot not found" });
        return;
      }
      const repo = AppDataSource.getRepository(Drone);
      const drone = repo.create({ brand, model, serial_number, pilot });
      await repo.save(drone);
      res.status(201).json(drone);
    })
  );

  //
  // Zones
  //
  app.get(
    "/api/zones",
    wrap(async (_req, res) => {
      const zones = await AppDataSource.getRepository(Zone).find({ order: { id: "ASC" } });
      res.json(zones);
    })
  );

  app.post(
    "/api/zones",
    wrap(async (req, res) => {
      const { name, geom } = req.body;
      if (!name || !geom) {
        res.status(400).json({ error: "name и geom обязательны" });
        return;
      }
      const repo = AppDataSource.getRepository(Zone);
      const zone = repo.create({ name, geom });
      await repo.save(zone);
      res.status(201).json(zone);
    })
  );

  app.delete(
    "/api/zones/:id",
    wrap(async (req, res) => {
      await AppDataSource.getRepository(Zone).delete(Number(req.params.id));
      res.sendStatus(204);
    })
  );

  //
  // FlightRequest
  //
  app.get(
    "/api/flight-requests",
    wrap(async (_req, res) => {
      const list = await AppDataSource.getRepository(FlightRequest).find({
        relations: ["drone"],
        order: { id: "ASC" },
      });
      res.json(list);
    })
  );

  // POST /api/flight-requests — создать новую заявку
  app.post(
    "/api/flight-requests",
    wrap(async (req, res) => {
      const { droneId, route, scheduledAt } = req.body;
      // валидация
      if (!droneId || !route || !scheduledAt) {
        res.status(400).json({ error: "droneId, route и scheduledAt обязательны" });
        return;
      }
      // проверяем дрон
      const drone = await AppDataSource.getRepository(Drone).findOneBy({ id: Number(droneId) });
      if (!drone) {
        res.status(404).json({ error: "Drone not found" });
        return;
      }
      // проверяем пересечение маршрута с запретными зонами
      const intersects = await AppDataSource.query(
        `SELECT 1
          FROM public.zone z
          WHERE ST_Intersects(
                  z.geom,
                  ST_SetSRID(ST_GeomFromGeoJSON($1::jsonb), 4326)
                )`,
        [JSON.stringify(route)]
      );
      if (intersects.length) {
        res.status(400).json({ error: "Маршрут пересекает запретную зону" });
        return;
      }
      // сохраняем заявку
      const repo = AppDataSource.getRepository(FlightRequest);
      const fr = repo.create({
        drone,
        route,
        scheduled_at: new Date(scheduledAt),
        status: "pending",
      });
      await repo.save(fr);
      res.status(201).json(fr);
    })
  );

  //
  // Health-check
  //
  app.get("/health", (_req, res) => {
    res.json({ status: "OK" });
  });

  //
  // Error handler
  //
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  });

  //
  // HTTP + WebSocket
  //
  const server = http.createServer(app);
  const io = new SocketIOServer(server, { cors: { origin: "*" } });
  io.on("connection", (socket) => {
    console.log("WS connected:", socket.id);
    // здесь можно добавить логику телеметрии
  });

  //
  // Старт
  //
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

bootstrap().catch(console.error);
