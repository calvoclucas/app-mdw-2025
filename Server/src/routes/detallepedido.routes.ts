import express from "express";
import {
  GetDetallesPedido,
  GetDetallePedidoById,
  CreateDetallePedido,
  EditDetallePedido,
  DeleteDetallePedido,
} from "../controllers/detallepedido.controller";

const router = express.Router();

router.post("/CreateDetallePedido", CreateDetallePedido);
router.get("/GetDetallesPedido", GetDetallesPedido);
router.get("/GetDetallePedidoById/:id_detalle", GetDetallePedidoById);
router.put("/EditDetallePedido/:id_detalle", EditDetallePedido);
router.delete("/DeleteDetallePedido/:id_detalle", DeleteDetallePedido);

export default router;
