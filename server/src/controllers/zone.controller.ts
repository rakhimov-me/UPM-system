import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source';
import { Zone } from '../entities/Zone';

export class ZoneController {
  // 1. Получить все зоны
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const zones = await AppDataSource
        .getRepository(Zone)
        .find({ order: { id: 'ASC' } });
      res.json(zones);
    } catch (err) {
      next(err);
    }
  }

  // 2. Получить зону по id
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const zone = await AppDataSource
        .getRepository(Zone)
        .findOneBy({ id });
      if (!zone) {
        res.status(404).json({ error: 'Zone not found' });
        return;
      }
      res.json(zone);
    } catch (err) {
      next(err);
    }
  }

  // 3. Создать новую зону
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { name, geom } = req.body;
    if (!name || !geom) {
      res.status(400).json({ error: 'name и geom обязательны' });
      return;
    }

    try {
      const repo = AppDataSource.getRepository(Zone);
      const zone = repo.create({ name, geom });
      await repo.save(zone);
      res.status(201).json(zone);
    } catch (err) {
      next(err);
    }
  }

  // 4. Удалить зону
  static async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const result = await AppDataSource.getRepository(Zone).delete(id);
      if (result.affected === 0) {
        res.status(404).json({ error: 'Zone not found' });
        return;
      }
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
}