import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getClientes,
  createCliente,
  getCliente
} from "../controllers/clientes.controller.js";
const router = Router();

//clientes
router.get("/clientes", getClientes);

//nuevocliente 
router.post("/nuevoCliente", authRequired, createCliente);

//cliente
router.get("/cliente/:id", getCliente);

export default router;

