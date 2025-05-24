import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization
  if (!header) {
    res.status(401).json({ error: 'No auth header' })
    return
  }

  const token = header.split(' ')[1]
  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!)
    ;(req as any).userId = payload.userId
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
    return
  }
}
