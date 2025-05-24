import { Router } from 'express';
import { PilotController } from '../controllers/pilotController';

const router = Router();

// GET  /api/pilots — список пилотов
router.get('/', PilotController.list);

// POST /api/pilots — добавить нового пилота
router.post('/', PilotController.create);

export default router;
