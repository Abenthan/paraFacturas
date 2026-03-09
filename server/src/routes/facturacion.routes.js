import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getFacturasPendientes,
  crearFacturas,
  getFacturas,
  getFactura,
  registrarPago,
  getPagos,
  getPago,
  getCartera,
  getEstadoCuentaCliente,
  getCarteraSuscripcion,
  getFacturaReconexion,
  crearFacturaReconexion,
  crearFacturaTraslado,
} from "../controllers/facturacion.controller.js";

const router = Router();

router.get("/prefacturacion", authRequired, getFacturasPendientes);

router.post("/facturas", authRequired, crearFacturas);

router.get("/facturas", authRequired, getFacturas);

router.get("/factura/:id", authRequired, getFactura);

router.post("/pagarFactura", authRequired, registrarPago);

router.get("/pagos", authRequired, getPagos);

router.get("/pago/:id", authRequired, getPago);

router.get("/cartera", authRequired, getCartera);

router.get("/estadoCuentaCliente/:idCliente", authRequired, getEstadoCuentaCliente);

router.get("/carteraSuscripcion/:idSuscripcion", authRequired, getCarteraSuscripcion);

router.get("/facturaReconexion/:idSuscripcion", authRequired, getFacturaReconexion);

router.post("/facturaReconexion", authRequired, crearFacturaReconexion);

router.post("/facturaTraslado", authRequired, crearFacturaTraslado);

export default router;
