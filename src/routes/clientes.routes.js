import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getClientes,
  createCliente,
} from "../controllers/clientes.controller.js";
const router = Router();

router.get("/clientes", getClientes);

router.post("/nuevoCliente", createCliente);

export default router;

