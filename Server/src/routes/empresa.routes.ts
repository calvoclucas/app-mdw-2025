import express from "express";
import {
  GetEmpresas,
  GetEmpresaById,
  CreateEmpresa,
  EditEmpresa,
  DeleteEmpresa,
  GetEmpresasConUsuario,
  buscarEmpresasConProductos
} from "../controllers/empresa.controller";
import { authOptional } from "../middlewares/authoptional";
import { rolesGuard } from "../middlewares/rolesguard";
import { authRequired } from "../middlewares/authrequiered";

const router = express.Router();


router.get("/GetEmpresas", authOptional, GetEmpresas);
router.get("/GetEmpresaById/:id", authOptional, GetEmpresaById);
router.post("/CreateEmpresa",authRequired,rolesGuard(["empresa"]),CreateEmpresa);
router.put("/EditEmpresa/:id",authRequired,rolesGuard(["empresa"]),EditEmpresa);
router.delete("/DeleteEmpresa/:id",authRequired,rolesGuard(["empresa"]),DeleteEmpresa);
router.get("/GetEmpresasConUsuario",authRequired,rolesGuard(["empresa"]),GetEmpresasConUsuario);
router.get("/empresas/buscar", buscarEmpresasConProductos);
export default router;
