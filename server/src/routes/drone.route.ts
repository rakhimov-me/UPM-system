import { Router } from 'express';
import { wrap } from '../utils/wrap';
import { DroneController } from '../controllers/drone.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Все CRUD-роуты для дронов под JWT-авторизацией
router.get(    '/',      authMiddleware, wrap(DroneController.list));
router.get(    '/:id',   authMiddleware, wrap(DroneController.getById));
router.post(   '/',      authMiddleware, wrap(DroneController.create));
router.put(    '/:id',   authMiddleware, wrap(DroneController.update));
router.delete( '/:id',   authMiddleware, wrap(DroneController.remove));

export default router;
