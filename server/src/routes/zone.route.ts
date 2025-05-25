import { Router } from 'express';
import { wrap } from '../utils/wrap';
import { ZoneController } from '../controllers/zone.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// публичные
router.get('/',    wrap(ZoneController.list));
router.get('/:id', wrap(ZoneController.getById));

// защищённые
router.post('/',      authMiddleware, wrap(ZoneController.create));
router.delete('/:id', authMiddleware, wrap(ZoneController.remove));

export default router;
