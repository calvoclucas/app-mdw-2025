import express from "express";
import {
  GetDetallesPedido,
  GetDetallePedidoById,
  CreateDetallePedido,
  EditDetallePedido,
  DeleteDetallePedido,
  GetDetallesByPedido,
} from "../controllers/detallepedido.controller";

const router = express.Router();

router.post("/CreateDetallePedido", CreateDetallePedido);
router.get("/GetDetallesPedido", GetDetallesPedido);
router.get("/GetDetallePedidoById/:id_detalle", GetDetallePedidoById);
router.put("/EditDetallePedido/:id_detalle", EditDetallePedido);
router.delete("/DeleteDetallePedido/:id_detalle", DeleteDetallePedido);
router.get("/GetDetallesByPedido/:id_pedido", GetDetallesByPedido);

export default router;
