    import { Router } from "express";
    import { wrap } from "../utils/wrap";
    import { DroneController } from "../controllers/drone.controller";
    import { authMiddleware } from "../middleware/auth";

    const router = Router();

    // Пример: все роуты дронов защищены авторизацией
    router.get("/",        authMiddleware, wrap(DroneController.getAll));
    router.post("/",       authMiddleware, wrap(DroneController.create));
    // … и т.д.

    export default router;
