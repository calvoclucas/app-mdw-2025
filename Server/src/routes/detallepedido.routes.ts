import express from "express";
import {
  GetDetallesPedido,
  GetDetallePedidoById,
  CreateDetallePedido,
  EditDetallePedido,
  DeleteDetallePedido,
  GetDetallesByPedido,
} from "../controllers/detallepedido.controller";
import { authOptional } from "../middlewares/authoptional";
import { authRequired } from "../middlewares/authrequiered";

const router = express.Router();

router.post("/CreateDetallePedido",authRequired, CreateDetallePedido);
router.get("/GetDetallesPedido",authRequired, GetDetallesPedido);
router.get("/GetDetallePedidoById/:id",authRequired, GetDetallePedidoById);
router.put("/EditDetallePedido/:id_detalle",authRequired, EditDetallePedido);
router.delete("/DeleteDetallePedido/:id",authRequired, DeleteDetallePedido);
router.get("/GetDetallesByPedido/:id_pedido",authRequired, GetDetallesByPedido);

export default router;
