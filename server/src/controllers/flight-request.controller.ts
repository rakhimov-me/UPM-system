// src/controllers/flight-request.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source';
import { FlightRequest } from '../entities/FlightRequest';
import { Drone } from '../entities/Drone';

export class FlightRequestController {
  private static frRepo = AppDataSource.getRepository(FlightRequest);
  private static droneRepo = AppDataSource.getRepository(Drone);

  /** GET /api/flight-requests */
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const list = FlightRequestController.frRepo.find({
        relations: ['drone'],
        order: { id: 'ASC' },
      });
      res.json(list);
    } catch (err) {
      next(err);
    }
  }

  /** GET /api/flight-requests/:id */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const fr = await this.frRepo.findOne({
        where: { id },
        relations: ['drone'],
      });
      if (!fr) {
        return res.status(404).json({ error: 'FlightRequest не найден' });
      }
      res.json(fr);
    } catch (err) {
      next(err);
    }
  }

  /** POST /api/flight-requests */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { droneId, route, scheduledAt } = req.body;
      if (!droneId || !route || !scheduledAt) {
        return res
          .status(400)
          .json({ error: 'droneId, route и scheduledAt обязательны' });
      }

      const drone = await this.droneRepo.findOneBy({ id: Number(droneId) });
      if (!drone) {
        return res.status(404).json({ error: 'Drone не найден' });
      }

      // Проверяем пересечение маршрута с зонами
      const intersects = await AppDataSource.query(
        `SELECT 1 FROM public.zone z
         WHERE ST_Intersects(
           z.geom,
           ST_SetSRID(ST_GeomFromGeoJSON($1::jsonb), 4326)
         )`,
        [JSON.stringify(route)]
      );
      if (intersects.length > 0) {
        return res
          .status(400)
          .json({ error: 'Маршрут пересекает запретную зону' });
      }

      // Создаём сущность, передавая поля точно так, как они объявлены в FlightRequest.ts
      const fr = this.frRepo.create({
        drone,                        // <-- relation
        route,
        scheduledAt: new Date(scheduledAt),
        status: 'pending',
      });
      await this.frRepo.save(fr);

      res.status(201).json(fr);
    } catch (err) {
      next(err);
    }
  }

  /** PATCH /api/flight-requests/:id */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const data = req.body;  // здесь data может содержать route, scheduledAt, status и т.п.
      await this.frRepo.update(id, data);
      const updated = await this.frRepo.findOneBy({ id });
      if (!updated) {
        return res.status(404).json({ error: 'FlightRequest не найден' });
      }
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  /** DELETE /api/flight-requests/:id */
  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const result = await this.frRepo.delete(id);
      if (result.affected === 0) {
        return res.status(404).json({ error: 'FlightRequest не найден' });
      }
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
}
