import { Router } from "express";
import {
  getFacturasPendientes,
  crearFacturas,
  getFacturas,
} from "../controllers/facturacion.controller.js";

const router = Router();

router.get("/prefacturacion", getFacturasPendientes);

router.post("/facturas", crearFacturas);

router.get("/facturas", getFacturas);

export default router;
