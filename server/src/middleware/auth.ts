import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data-source";
import { Pilot } from "../entities/Pilot";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json({ error: "No auth header" });
    return;
  }

  const token = header.split(" ")[1];
  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
    
    const pilotRepo = AppDataSource.getRepository(Pilot);
    const exists = await pilotRepo.findOneBy({ id: payload.userId });
    if (!exists) {
      res.status(401).json({ error: "User does not exist" });
      return;
    }

    (req as any).userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}