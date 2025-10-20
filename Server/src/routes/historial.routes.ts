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

const router = express.Router();
router.post("/CreateHistorial", CreateHistorial);
router.get("/GetHistoriales", GetHistoriales);
router.get("/GetHistorialesByCliente/:idCliente", GetHistorialesByCliente);
router.get("/GetHistorialesByEmpresa/:idEmpresa", GetHistorialesByEmpresa);
router.get("/GetHistorialById/:id_historial", GetHistorialById);
router.put("/EditHistorial/:id_historial", EditHistorial);
router.delete("/DeleteHistorial/:id_historial", DeleteHistorial);

export default router;
