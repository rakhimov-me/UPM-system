import { Router } from 'express';
import { wrap } from '../utils/wrap';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', wrap(AuthController.register, AuthController));
router.post('/login',    wrap(AuthController.login,    AuthController));
router.get ('/me',       authMiddleware, wrap(AuthController.me, AuthController));

export default router;