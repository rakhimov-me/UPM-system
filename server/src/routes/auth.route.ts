import { Router, Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { authMiddleware } from '../middleware/auth'

interface AuthRequest extends Request {
  userId?: string
}

const router = Router()

router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body
      // …аутентификация…
      const userId = 'some-user-id'
      const secret = process.env.JWT_SECRET!
      const token = jwt.sign({ userId }, secret, { expiresIn: '1h' })
      res.json({ token })
    } catch (err) {
      next(err)
    }
  }
)

router.get(
  '/me',
  authMiddleware,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    res.json({ userId: req.userId })
  }
)

export default router
