import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getSuscripcionesCliente,
  getSuscripciones,
  createSuscripcion,
  getSuscripcion,
  updateSuscripcion,
  suspenderSuscripcion,
  reconexionSuscripcion,
  getNovedadesSuscripcion,
} from "../controllers/suscripciones.controller.js";

const router = Router();

router.get("/suscripcionesCliente/:id", authRequired, getSuscripcionesCliente);
router.get("/suscripciones", authRequired, getSuscripciones);
router.post("/suscripcion", authRequired, createSuscripcion);
router.get("/suscripcion/:id", authRequired, getSuscripcion);
router.put("/suscripcion/:id", authRequired, updateSuscripcion);
router.put("/suspenderSuscripcion/:id", authRequired, suspenderSuscripcion);
router.post("/reconexionSuscripcion", authRequired, reconexionSuscripcion);
router.get("/suscripciones/novedades/:idSuscripcion", authRequired, getNovedadesSuscripcion);

export default router;
