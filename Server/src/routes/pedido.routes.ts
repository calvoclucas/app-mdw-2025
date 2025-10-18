import { Router } from "express";
import {
  CreatePedido,
  GetPedidosByCliente,
  GetPedidosByEmpresa,
  GetPedidoById,
  EditPedido,
  DeletePedido,
} from "../controllers/pedido.controller";

const router = Router();

router.post("/CreatePedido", CreatePedido);
router.get("/GetPedidosByCliente/:id_cliente", GetPedidosByCliente);
router.get("/GetPedidosByEmpresa/:id_empresa", GetPedidosByEmpresa);
router.get("/GetPedidoById/:id", GetPedidoById);
router.put("/EditPedido/:id", EditPedido);
router.delete("/DeletePedido/:id", DeletePedido);

export default router;
