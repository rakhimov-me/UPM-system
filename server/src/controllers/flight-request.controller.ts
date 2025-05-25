import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/data-source";
import { FlightRequest } from "../entities/FlightRequest";
import { Drone } from "../entities/Drone";

const repo = () => AppDataSource.getRepository(FlightRequest);
const droneRepo = () => AppDataSource.getRepository(Drone);

export class FlightRequestController {
  /** GET /api/flight-requests */
 static async list(req: Request, res: Response, next: NextFunction) {
  try {
    const uid = (req as any).userId as number | undefined;
    if (!uid) return res.status(401).json({ error: "Auth required" });

    const list = await repo()
      .createQueryBuilder("fr")
      .leftJoinAndSelect("fr.drone", "d")
      .where("d.pilot_id = :uid", { uid })     // ← СТРОГО свои дроны
      .orderBy("fr.created_at", "DESC")
      .getMany();

    res.json(list);
  } catch (err) {
    console.error(err);
    next(err);
  }
}

  /** GET /api/flight-requests/:id */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const fr = await repo().findOne({
        where: { id: +req.params.id },
        relations: ["drone"],
      });
      if (!fr) return res.status(404).json({ error: "FlightRequest не найден" });
      res.json(fr);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  /** POST /api/flight-requests */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        droneId,
        name,
        startDate,
        endDate,
        takeoffTime,
        landingTime,
        geomType,
        route,
        maxAltitude,
        minAltitude = 0,
        uavType,
        purpose,
        vlos = true,
      } = req.body;

      const drone = await droneRepo().findOneBy({ id: +droneId });
      if (!drone) return res.status(404).json({ error: "Drone не найден" });

      const fr = repo().create({
        drone,
        name,
        startDate,
        endDate,
        takeoffTime,
        landingTime,
        geomType,
        route,
        maxAltitude,
        minAltitude,
        uavType,
        purpose,
        vlos,
        status: "pending",
      });

      await repo().save(fr);
      res.status(201).json(fr);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  /** PATCH /api/flight-requests/:id */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;
      await repo().update(id, req.body);
      const updated = await repo().findOne({ where: { id }, relations: ["drone"] });
      if (!updated) return res.status(404).json({ error: "FlightRequest не найден" });
      res.json(updated);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  /** DELETE /api/flight-requests/:id */
  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;
      const result = await repo().delete(id);
      if (!result.affected)
        return res.status(404).json({ error: "FlightRequest не найден" });
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
}