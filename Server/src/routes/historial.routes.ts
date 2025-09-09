import express from "express";
import {
  GetHistoriales,
  GetHistorialById,
  CreateHistorial,
  EditHistorial,
  DeleteHistorial,
} from "../controllers/historial.controller";

const router = express.Router();
router.post("/CreateHistorial", CreateHistorial);
router.get("/GetHistoriales", GetHistoriales);
router.get("/GetHistorialById/:id_historial", GetHistorialById);
router.put("/EditHistorial/:id_historial", EditHistorial);
router.delete("/DeleteHistorial/:id_historial", DeleteHistorial);

export default router;
