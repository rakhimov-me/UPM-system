// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { Pilot } from '../entities/Pilot';

export class AuthController {
  private static repo = AppDataSource.getRepository(Pilot);

  /** POST /api/auth/register */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { lastName, firstName, middleName, email, phone, password } = req.body;
      if (!lastName || !firstName || !email || !password) {
        return res
          .status(400)
          .json({ error: 'lastName, firstName, email и password обязательны' });
      }

      const exists = await this.repo.findOneBy({ email });
      if (exists) {
        return res.status(409).json({ error: 'Email уже занят' });
      }

      const hash = await bcrypt.hash(password, 10);
      const pilot = this.repo.create({
        // тут — точные имена полей из Pilot.ts
        last_name:     lastName,
        first_name:    firstName,
        middle_name:   middleName,
        email,
        phone,
        password_hash: hash,
      });
      await this.repo.save(pilot);

      return res.status(201).json({ id: pilot.id });
    } catch (err) {
      next(err);
    }
  }

  /** POST /api/auth/login */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'email и password обязательны' });
      }

      const user = await this.repo.findOneBy({ email });
      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }

      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) {
        return res.status(401).json({ error: 'Неверный пароль' });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );
      return res.json({ token });
    } catch (err) {
      next(err);
    }
  }

  /** GET /api/auth/me */
  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      if (!userId) {
        return res.status(401).json({ error: 'Неавторизованный запрос' });
      }

      const user = await this.repo.findOneBy({ id: userId });
      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }

      // Убираем пароль из ответа
      // @ts-ignore
      const { password_hash, ...safeUser } = user;
      return res.json(safeUser);
    } catch (err) {
      next(err);
    }
  }
}
