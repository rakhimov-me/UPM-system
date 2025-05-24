import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source';
import { Drone } from '../entities/Drone';
import { Pilot } from '../entities/Pilot';

export class DroneController {
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    const drones = await AppDataSource
      .getRepository(Drone)
      .find({ relations: ['pilot'], order: { id: 'ASC' } });
    res.json(drones);
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = Number(req.params.id);
    const drone = await AppDataSource
      .getRepository(Drone)
      .findOne({ where: { id }, relations: ['pilot'] });
    if (!drone) {
      res.status(404).json({ error: 'Drone not found' });
      return;
    }
    res.json(drone);
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { brand, model, serial_number, pilotId } = req.body;
    if (!brand || !model || !serial_number || pilotId == null) {
      res.status(400).json({ error: 'brand, model, serial_number и pilotId обязательны' });
      return;
    }
    const pilot = await AppDataSource.getRepository(Pilot).findOneBy({ id: +pilotId });
    if (!pilot) {
      res.status(404).json({ error: 'Pilot not found' });
      return;
    }
    const repo = AppDataSource.getRepository(Drone);
    const drone = repo.create({ brand, model, serial_number, pilot });
    await repo.save(drone);
    res.status(201).json(drone);
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = Number(req.params.id);
    const repo = AppDataSource.getRepository(Drone);
    const existing = await repo.findOneBy({ id });
    if (!existing) {
      res.status(404).json({ error: 'Drone not found' });
      return;
    }

    const { brand, model, serial_number, pilotId, is_active } = req.body;
    if (brand != null)          existing.brand        = brand;
    if (model != null)          existing.model        = model;
    if (serial_number != null)  existing.serial_number = serial_number;
    if (is_active != null)      existing.is_active    = is_active;

    if (pilotId != null) {
      const pilot = await AppDataSource.getRepository(Pilot).findOneBy({ id: +pilotId });
      if (!pilot) {
        res.status(404).json({ error: 'Pilot not found' });
        return;
      }
      existing.pilot = pilot;
    }

    await repo.save(existing);
    res.json(existing);
  }

  static async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = Number(req.params.id);
    const result = await AppDataSource.getRepository(Drone).delete(id);
    if (result.affected === 0) {
      res.status(404).json({ error: 'Drone not found' });
      return;
    }
    res.sendStatus(204);
  }
}
