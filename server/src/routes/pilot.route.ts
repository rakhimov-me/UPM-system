import { Router } from 'express'
import { wrap } from '../utils/wrap'
import { FlightRequestController } from '../controllers/flight-request.controller'

const router = Router()

// GET  /api/flight-requests       — все заявки
router.get('/', wrap(FlightRequestController.list))
// POST /api/flight-requests       — создать новую заявку
router.post('/', wrap(FlightRequestController.create))
// GET  /api/flight-requests/:id   — одна заявка по ID
router.get('/:id', wrap(FlightRequestController.getById))
// PATCH/PUT /api/flight-requests/:id — обновить статус/дату
router.patch('/:id', wrap(FlightRequestController.update))
// DELETE /api/flight-requests/:id — удалить заявку
router.delete('/:id', wrap(FlightRequestController.remove))

export default router
