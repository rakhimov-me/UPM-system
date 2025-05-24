import { Request, Response, NextFunction } from 'express'
import { AppDataSource } from '../config/data-source'
import { FlightRequest } from '../entities/FlightRequest'
import { Drone } from '../entities/Drone'

export class FlightRequestController {
  static async list(req: Request, res: Response, next: NextFunction) {
    const list = await AppDataSource
      .getRepository(FlightRequest)
      .find({ relations: ['drone'], order: { id: 'ASC' } })
    res.json(list)
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id)
    const fr = await AppDataSource.getRepository(FlightRequest).findOne({
      where: { id },
      relations: ['drone'],
    })
    if (!fr) {
      res.status(404).json({ error: 'FlightRequest not found' })
      return
    }
    res.json(fr)
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    const { droneId, route, scheduledAt } = req.body
    if (!droneId || !route || !scheduledAt) {
      res.status(400).json({ error: 'droneId, route и scheduledAt обязательны' })
      return
    }
    const drone = await AppDataSource.getRepository(Drone).findOneBy({ id: +droneId })
    if (!drone) {
      res.status(404).json({ error: 'Drone not found' })
      return
    }
    const intersects = await AppDataSource.query(
      `SELECT 1 FROM public.zone z
       WHERE ST_Intersects(
         z.geom,
         ST_SetSRID(ST_GeomFromGeoJSON($1::jsonb), 4326)
       )`,
      [JSON.stringify(route)]
    )
    if (intersects.length) {
      res.status(400).json({ error: 'Маршрут пересекает запретную зону' })
      return
    }
    const repo = AppDataSource.getRepository(FlightRequest)
    const fr = repo.create({
      drone,
      route,
      scheduled_at: new Date(scheduledAt),
      status: 'pending',
    })
    await repo.save(fr)
    res.status(201).json(fr)
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id)
    const data = req.body
    await AppDataSource.getRepository(FlightRequest).update(id, data)
    const updated = await AppDataSource.getRepository(FlightRequest).findOneBy({ id })
    res.json(updated)
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id)
    await AppDataSource.getRepository(FlightRequest).delete(id)
    res.sendStatus(204)
  }
}

