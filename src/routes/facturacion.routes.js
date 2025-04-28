import { Router } from "express";
import {
  getFacturasPendientes,
  crearFacturas,
} from "../controllers/facturacion.controller.js";

const router = Router();

router.get("/prefacturacion", getFacturasPendientes);

router.post("/facturas", crearFacturas);

export default router;
