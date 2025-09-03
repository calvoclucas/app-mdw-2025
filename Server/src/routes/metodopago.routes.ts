import express from "express";
import {
  GetMetodosPago,
  GetMetodoPagoById,
  CreateMetodoPago,
  EditMetodoPago,
  DeleteMetodoPago,
} from "../controllers/metodopago.controller";

const router = express.Router();

router.post("/CreateMetodoPago", CreateMetodoPago);
router.get("/GetMetodosPago", GetMetodosPago);
router.get("/GetMetodoPagoById/:id_metodo_pago", GetMetodoPagoById);
router.put("/EditMetodoPago/:id_metodo_pago", EditMetodoPago);
router.delete("/DeleteMetodoPago/:id_metodo_pago", DeleteMetodoPago);

export default router;
