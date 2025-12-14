import express from "express";
import {
  GetHistoriales,
  GetHistorialById,
  CreateHistorial,
  EditHistorial,
  DeleteHistorial,
  GetHistorialesByCliente,
  GetHistorialesByEmpresa,
} from "../controllers/historial.controller";
import { authOptional } from "../middlewares/authoptional";
import { authRequired } from "../middlewares/authrequiered";

const router = express.Router();
router.post("/CreateHistorial", authRequired, CreateHistorial);
router.get("/GetHistoriales", authOptional,GetHistoriales);
router.get("/GetHistorialesByCliente/:idCliente",  authRequired, GetHistorialesByCliente);
router.get("/GetHistorialesByEmpresa/:idEmpresa",   authRequired,GetHistorialesByEmpresa);
router.get("/GetHistorialById/:id_historial",  authRequired, GetHistorialById);
router.put("/EditHistorial/:id",  authRequired, EditHistorial);
router.delete("/DeleteHistorial/:id",   authRequired,DeleteHistorial);

export default router;
