import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getSuscripcionesCliente,
  getSuscripciones,
  createSuscripcion,
  getSuscripcion,
  updateSuscripcion,
  suspenderSuscripcion,
} from "../controllers/suscripciones.controller.js";

const router = Router();

router.get("/suscripciones/:id", authRequired, getSuscripcionesCliente);
router.get("/suscripciones", authRequired, getSuscripciones);
router.post("/suscripcion", authRequired, createSuscripcion);
router.get("/suscripcion/:id", authRequired, getSuscripcion);
router.put("/suscripcion/:id", authRequired, updateSuscripcion);
router.put("/suspenderSuscripcion/:id", authRequired, suspenderSuscripcion);

export default router;
