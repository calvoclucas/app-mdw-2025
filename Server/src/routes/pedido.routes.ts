import { Router } from "express";
import {
  CreatePedido,
  GetPedidosByCliente,
  GetPedidosByEmpresa,
  GetPedidoById,
  EditPedido,
  DeletePedido,
} from "../controllers/pedido.controller";
import { authOptional } from "../middlewares/authoptional";
import { authRequired } from "../middlewares/authrequiered";
import { rolesGuard } from "../middlewares/rolesguard";

const router = Router();

router.post("/CreatePedido", authRequired, CreatePedido);
router.get(
  "/GetPedidosByCliente/:id_cliente",
  authOptional,
  GetPedidosByCliente
);
router.get(
  "/GetPedidosByEmpresa/:id_empresa",
  authRequired,
  rolesGuard(["empresa"]),
  GetPedidosByEmpresa
);
router.get("/GetPedidoById/:id", authRequired, GetPedidoById);
router.put("/EditPedido/:id", authRequired, EditPedido);
router.delete("/DeletePedido/:id", authRequired, DeletePedido);

export default router;
