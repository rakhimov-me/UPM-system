import { Router } from 'express';
import { wrap } from '../utils/wrap';
import { getZones, createZone, deleteZone } from '../controllers/zone.controller';

const router = Router();
router.get('/',         wrap(getZones));
router.post('/',        wrap(createZone));
router.delete('/:id',   wrap(deleteZone));

export default router;
