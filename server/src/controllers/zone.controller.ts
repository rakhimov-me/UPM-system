import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source';
import { Zone } from '../entities/Zone';

export const getZones = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const zones = await AppDataSource.getRepository(Zone).find({ order: { id: 'ASC' } });
  res.json(zones);
};

export const createZone = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, geom } = req.body;
  if (!name || !geom) {
    res.status(400).json({ error: 'name и geom обязательны' });
    return;
  }
  const repo = AppDataSource.getRepository(Zone);
  const zone = repo.create({ name, geom });
  await repo.save(zone);
  res.status(201).json(zone);
};

export const deleteZone = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await AppDataSource.getRepository(Zone).delete(Number(req.params.id));
  res.sendStatus(204);
};
