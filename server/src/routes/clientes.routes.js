import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getClientes,
  createCliente,
  getCliente,
  updateCliente,
} from "../controllers/clientes.controller.js";
const router = Router();

//clientes
router.get("/clientes", authRequired, getClientes);

//nuevocliente 
router.post("/nuevoCliente", authRequired, createCliente);

//cliente
router.get("/cliente/:id", authRequired, getCliente);

//actualizar cliente
router.put("/cliente/:id", authRequired, updateCliente);

export default router;

