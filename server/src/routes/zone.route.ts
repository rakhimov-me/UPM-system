// server/src/routes/zone.route.ts
import { Router } from 'express';
import { wrap } from '../utils/wrap';
import { ZoneController } from '../controllers/zone.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/',            authMiddleware, wrap(ZoneController.list));
router.get('/:id',         authMiddleware, wrap(ZoneController.getById));
router.post('/',           authMiddleware, wrap(ZoneController.create));
router.delete('/:id',      authMiddleware, wrap(ZoneController.remove));

export default router;
