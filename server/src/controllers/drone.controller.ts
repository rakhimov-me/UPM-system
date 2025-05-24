import { Request, Response, NextFunction } from 'express'
import { AppDataSource } from '../config/data-source'
import { Drone } from '../entities/Drone'
import { Pilot } from '../entities/Pilot'

export class DroneController {
  static async list(req: Request, res: Response, next: NextFunction) {
    const drones = await AppDataSource
      .getRepository(Drone)
      .find({ relations: ['pilot'], order: { id: 'ASC' } })
    res.json(drones)
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    const { brand, model, serial_number, pilotId } = req.body
    if (!brand || !model || !serial_number || pilotId == null) {
      res.status(400).json({ error: 'brand, model, serial_number и pilotId обязательны' })
      return
    }
    const pilot = await AppDataSource.getRepository(Pilot).findOneBy({ id: +pilotId })
    if (!pilot) {
      res.status(404).json({ error: 'Pilot not found' })
      return
    }
    const repo = AppDataSource.getRepository(Drone)
    const drone = repo.create({ brand, model, serial_number, pilot })
    await repo.save(drone)
    res.status(201).json(drone)
  }
}
