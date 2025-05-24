import { Request, Response, NextFunction } from 'express';
import { PilotService } from '../services/pilotService';

export class PilotController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const pilots = await PilotService.getAll();
      res.json(pilots);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    const { lastName, firstName, middleName, email, phone } = req.body;

    if (!lastName || !firstName) {
      return res.status(400).json({ error: 'Поле lastName и firstName обязательны' });
    }

    try {
      const pilot = await PilotService.create({
        lastName,
        firstName,
        middleName,
        email,
        phone,
      });
      res.status(201).json(pilot);
    } catch (err) {
      next(err);
    }
  }
}
