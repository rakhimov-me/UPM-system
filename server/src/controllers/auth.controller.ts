// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/db";
import { Pilot } from "../entities/Pilot";

export const AuthController = {
  register: async (req: Request, res: Response) => {
    const { lastName, firstName, middleName, email, phone, password } = req.body;
    if (!lastName || !firstName || !email || !password) {
      return res
        .status(400)
        .json({ error: "lastName, firstName, email и password обязательны" });
    }

    const repo = AppDataSource.getRepository(Pilot);
    const exists = await repo.findOneBy({ email });
    if (exists) {
      return res.status(409).json({ error: "Email уже занят" });
    }

    const hash = await bcrypt.hash(password, 10);
    const pilot = repo.create({
      last_name:     lastName,
      first_name:    firstName,
      middle_name:   middleName,
      email,
      phone,
      password_hash: hash,
    });
    await repo.save(pilot);

    return res.status(201).json({ id: pilot.id });
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email и password обязательны" });
    }

    const repo = AppDataSource.getRepository(Pilot);
    const user = await repo.findOneBy({ email });
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Неверный пароль" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
    return res.json({ token });
  },

  me: async (req: Request, res: Response) => {
    // userId должен быть установлен в req в JWT-middleware
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ error: "Неавторизованный запрос" });
    }

    const repo = AppDataSource.getRepository(Pilot);
    const user = await repo.findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    // убираем поля, которые не нужно возвращать
    const { password_hash, ...safeUser } = user as any;
    return res.json(safeUser);
  },
};
