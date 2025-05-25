import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt     from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { Pilot }         from '../entities/Pilot';

export class AuthController {
  //--------------------------------------------------------------------------
  /** POST /api/auth/register */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { lastName, firstName, middleName, email, phone, password } = req.body;

      // валидация
      if (!lastName || !firstName || !email || !password) {
        return res.status(400).json({ error: 'lastName, firstName, email и password обязательны' });
      }

      const repo = AppDataSource.getRepository(Pilot);

      // проверка уникальности e‑mail
      if (await repo.findOneBy({ email })) {
        return res.status(409).json({ error: 'Email уже занят' });
      }

      // хешируем пароль и сохраняем
      const hash = await bcrypt.hash(password, 10);
      const pilot = repo.create({
        last_name:   lastName,
        first_name:  firstName,
        middle_name: middleName,
        email,
        phone,
        password_hash: hash,
      });
      await repo.save(pilot);

      // выдаём JWT сразу после успешной регистрации
      const token = jwt.sign({ userId: pilot.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
      res.status(201).json({ token });
    } catch (err) {
      next(err);
    }
  }

  //--------------------------------------------------------------------------
  /** POST /api/auth/login */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { loginId, password } = req.body;
      if (!loginId || !password) {
        return res.status(400).json({ error: 'loginId и password обязательны' });
      }

      const repo   = AppDataSource.getRepository(Pilot);
      const isMail = loginId.includes('@');
      const user   = isMail
        ? await repo.findOneBy({ email: loginId })
        : await repo.findOneBy({ phone: loginId });

      if (!user) return res.status(401).json({ error: 'Неверные учётные данные' });
      if (!(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json({ error: 'Неверные учётные данные' });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
      res.json({ token });
    } catch (err) {
      next(err);
    }
  }

  //--------------------------------------------------------------------------
  /** GET /api/auth/me */
  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId as number | undefined;
      if (!userId) return res.status(401).json({ error: 'Неавторизованный запрос' });

      const repo = AppDataSource.getRepository(Pilot);
      const user = await repo.findOneBy({ id: userId });
      if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

      // убираем password_hash из ответа
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...safeUser } = user as any;
      res.json(safeUser);
    } catch (err) {
      next(err);
    }
  }
}
