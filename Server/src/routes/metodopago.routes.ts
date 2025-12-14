import express from "express";
import {
  GetMetodosPago,
  GetMetodoPagoById,
  CreateMetodoPago,
  EditMetodoPago,
  DeleteMetodoPago,
} from "../controllers/metodopago.controller";
import { authOptional } from "../middlewares/authoptional";
import { authRequired } from "../middlewares/authrequiered";
import { rolesGuard } from "../middlewares/rolesguard";

const router = express.Router();

router.post("/CreateMetodoPago",  authOptional, authRequired,rolesGuard(["empresa"]) ,CreateMetodoPago);
router.get("/GetMetodosPago", authOptional,GetMetodosPago);
router.get("/GetMetodoPagoById/:id", authOptional,GetMetodoPagoById);
router.put("/EditMetodoPago/:id_metodo_pago", authOptional, authRequired, rolesGuard(["empresa"]), EditMetodoPago);
router.delete("/DeleteMetodoPago/:id_metodo_pago", authOptional, authRequired, rolesGuard(["empresa"]), DeleteMetodoPago);

export default router;
