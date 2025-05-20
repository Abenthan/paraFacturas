import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getSuscripciones, createSuscripcion, getSuscripcion, updateSuscripcion } from "../controllers/suscripciones.controller.js";
const router = Router();

router.get("/suscripciones/:id", authRequired, getSuscripciones);
router.post("/suscripcion", authRequired, createSuscripcion);
router.get("/suscripcion/:id", authRequired, getSuscripcion);
router.put("/suscripcion/:id", authRequired, updateSuscripcion);

export default router;
