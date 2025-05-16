import { Router } from "express";
import { getSuscripciones, createSuscripcion, getSuscripcion, updateSuscripcion } from "../controllers/suscripciones.controller.js";
const router = Router();

router.get("/suscripciones/:id", getSuscripciones);
router.post("/suscripcion", createSuscripcion);
router.get("/suscripcion/:id", getSuscripcion);
router.put("/suscripcion/:id", updateSuscripcion);

export default router;
