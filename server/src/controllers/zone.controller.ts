import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source';
import { Zone } from '../entities/Zone';

export class ZoneController {
  private static zoneRepo = AppDataSource.getRepository(Zone);

  /** GET /api/zones */
  static async list(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const zones = await ZoneController.zoneRepo.find();
      res.json(zones);
    } catch (err) {
      next(err);
    }
  }

  /** GET /api/zones/:id */
  static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Number(req.params.id);
      const zone = await ZoneController.zoneRepo.findOneBy({ id });
      if (!zone) {
        res.status(404).json({ error: 'Зона не найдена' });
        return;
      }
      res.json(zone);
    } catch (err) {
      next(err);
    }
  }

  /** POST /api/zones */
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, geom } = req.body;
      if (!name || !geom) {
        res.status(400).json({ error: 'name и geom обязательны' });
        return;
      }
      const zone = ZoneController.zoneRepo.create({ name, geom });
      await ZoneController.zoneRepo.save(zone);
      res.status(201).json(zone);
    } catch (err) {
      next(err);
    }
  }

  /** DELETE /api/zones/:id */
  static async remove(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Number(req.params.id);
      const result = await ZoneController.zoneRepo.delete(id);
      if (result.affected === 0) {
        res.status(404).json({ error: 'Зона не найдена' });
        return;
      }
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
}
