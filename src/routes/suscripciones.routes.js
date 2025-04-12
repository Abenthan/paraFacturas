import { Router } from "express";
import { getSuscripciones, createSuscripcion } from "../controllers/suscripciones.controller.js";
const router = Router();

router.get("/suscripciones/:id", getSuscripciones);
router.post("/suscripcion", createSuscripcion);

export default router;
