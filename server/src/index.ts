import "reflect-metadata";
import express, { Request, Response, NextFunction, RequestHandler, Router } from "express";
import cors from "cors";
import http from "http";
import { DataSource } from "typeorm";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Zone } from "./entity/Zone";
import { Pilot } from "./entity/Pilot";
import { Drone } from "./entity/Drone";
import { FlightRequest } from "./entity/FlightRequest";

dotenv.config();

// 1) Настройка DataSource
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

// 2) Middleware для JWT
function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "Authorization header missing" });
    return;
  }
  const [, token] = authHeader.split(" ");
  if (!token) {
    res.status(401).json({ error: "Token missing" });
    return;
  }
  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
}

// 3) Контроллеры auth
const authController = {
  register: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { lastName, firstName, middleName, email, phone, password } = req.body;
    if (!lastName || !firstName || !email || !password) {
      res.status(400).json({ error: "lastName, firstName, email и password обязательны" });
      return;
    }
    const repo = AppDataSource.getRepository(Pilot);
    const exists = await repo.findOneBy({ email });
    if (exists) {
      res.status(409).json({ error: "Email уже занят" });
      return;
    }
    const hash = await bcrypt.hash(password, 10);
    const pilot = repo.create({
      last_name: lastName,
      first_name: firstName,
      middle_name: middleName,
      email,
      phone,
      password_hash: hash,
    });
    await repo.save(pilot);
    res.status(201).json({ id: pilot.id });
  },

  login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "email и password обязательны" });
      return;
    }
    const repo = AppDataSource.getRepository(Pilot);
    const user = await repo.findOneBy({ email });
    if (!user) {
      res.status(404).json({ error: "Пользователь не найден" });
      return;
    }
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      res.status(401).json({ error: "Неверный пароль" });
      return;
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    res.json({ token });
  },

  me: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const repo = AppDataSource.getRepository(Pilot);
    const user = await repo.findOneBy({ id: (req as any).userId });
    if (!user) {
      res.status(404).json({ error: "Пользователь не найден" });
      return;
    }
    const { password_hash, ...safeUser } = user as any;
    res.json(safeUser);
  },
};

// 4) Обертка для async-обработчиков

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
const wrap = (fn: AsyncHandler): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// 5) Router auth
const authRouter = Router();
authRouter.post("/register", wrap(authController.register));
authRouter.post("/login", wrap(authController.login));
authRouter.get("/me", authMiddleware, wrap(authController.me));

// 6) Bootstrap приложения

async function bootstrap(): Promise<void> {
  await AppDataSource.initialize();
  console.log("Data Source has been initialized");

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Маршруты аутентификации
  app.use("/api/auth", authRouter);

  // Pilots CRUD
  app.get(
    "/api/pilots",
    wrap(async (req, res, next) => {
      const pilots = await AppDataSource.getRepository(Pilot).find({ order: { id: "ASC" } });
      res.json(pilots);
    })
  );

  app.post(
    "/api/pilots",
    wrap(async (req, res, next) => {
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

  // Drones CRUD
  app.get(
    "/api/drones",
    wrap(async (req, res, next) => {
      const drones = await AppDataSource.getRepository(Drone).find({
        relations: ["pilot"],
        order: { id: "ASC" },
      });
      res.json(drones);
    })
  );

  app.post(
    "/api/drones",
    wrap(async (req, res, next) => {
      const { brand, model, serial_number, pilotId } = req.body;
      if (!brand || !model || !serial_number || pilotId == null) {
        res.status(400).json({ error: "brand, model, serial_number и pilotId обязательны" });
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

  // Zones CRUD
  app.get(
    "/api/zones",
    wrap(async (req, res, next) => {
      const zones = await AppDataSource.getRepository(Zone).find({ order: { id: "ASC" } });
      res.json(zones);
    })
  );

  app.post(
    "/api/zones",
    wrap(async (req, res, next) => {
      const { name, geom } = req.body;
      if (!name || !geom) {
        res.status(400).json({ error: "name и geom обязательны" });
        return;
      }
      const zone = AppDataSource.getRepository(Zone).create({ name, geom });
      await AppDataSource.getRepository(Zone).save(zone);
      res.status(201).json(zone);
    })
  );

  app.delete(
    "/api/zones/:id",
    wrap(async (req, res, next) => {
      await AppDataSource.getRepository(Zone).delete(Number(req.params.id));
      res.sendStatus(204);
    })
  );

  // FlightRequests CRUD
  app.get(
    "/api/flight-requests",
    wrap(async (req, res, next) => {
      const list = await AppDataSource.getRepository(FlightRequest).find({
        relations: ["drone"],
        order: { id: "ASC" },
      });
      res.json(list);
    })
  );

  app.post(
    "/api/flight-requests",
    wrap(async (req, res, next) => {
      const { droneId, route, scheduledAt } = req.body;
      if (!droneId || !route || !scheduledAt) {
        res.status(400).json({ error: "droneId, route и scheduledAt обязательны" });
        return;
      }
      const drone = await AppDataSource.getRepository(Drone).findOneBy({ id: Number(droneId) });
      if (!drone) {
        res.status(404).json({ error: "Drone not found" });
        return;
      }
      const intersects = await AppDataSource.query(
        `SELECT 1 FROM public.zone z WHERE ST_Intersects(z.geom, ST_SetSRID(ST_GeomFromGeoJSON($1::jsonb), 4326))`,
        [JSON.stringify(route)]
      );
      if (intersects.length) {
        res.status(400).json({ error: "Маршрут пересекает запретную зону" });
        return;
      }
      const fr = AppDataSource.getRepository(FlightRequest).create({
        drone,
        route,
        scheduled_at: new Date(scheduledAt),
        status: "pending",
      });
      await AppDataSource.getRepository(FlightRequest).save(fr);
      res.status(201).json(fr);
    })
  );

  // Health-check
  app.get("/health", (_req, res) => {
    res.json({ status: "OK" });
  });

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction): void => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  });

  // HTTP + WebSocket
  const server = http.createServer(app);
  const io = new SocketIOServer(server, { cors: { origin: "*" } });
  io.on("connection", (socket) => {
    console.log("WS connected:", socket.id);
    // логика телеметрии
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
}

bootstrap().catch(console.error);
