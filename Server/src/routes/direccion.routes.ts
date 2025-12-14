import express from "express";
import {
  GetDirecciones,
  GetDireccionByUser,
  CreateDireccion,
  EditDireccion,
  DeleteDireccion,
} from "../controllers/direccion.controller";
import { authOptional } from "../middlewares/authoptional";
import { authRequired } from "../middlewares/authrequiered";
import { rolesGuard } from "../middlewares/rolesguard";

const router = express.Router();

router.get("/GetDirecciones",authRequired,rolesGuard(["cliente"]),GetDirecciones);
router.get("/GetDireccionByUser/:id",authRequired,rolesGuard(["cliente"]),GetDireccionByUser);
router.post("/CreateDireccion",authRequired,rolesGuard(["cliente"]),CreateDireccion);
router.put("/EditDireccion/:id",authRequired,rolesGuard(["cliente"]),EditDireccion);
router.delete("/DeleteDireccion/:id",authRequired,rolesGuard(["cliente"]),DeleteDireccion);

export default router;
