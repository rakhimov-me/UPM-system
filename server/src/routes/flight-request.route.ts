import { Router } from "express";
import { wrap } from "../utils/wrap";
import { authMiddleware } from "../middleware/auth";
import { FlightRequestController as C } from "../controllers/flight-request.controller";

const router = Router();

router.use(authMiddleware);          // ⬅ все ниже требуют JWT

router.get   ("/",      wrap(C.list));
router.post  ("/",      wrap(C.create));
router.get   ("/:id",   wrap(C.getById));
router.patch ("/:id",   wrap(C.update));
router.delete("/:id",   wrap(C.remove));

export default router;