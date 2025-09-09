import express from "express";
import {
  GetEmpresas,
  GetEmpresaById,
  CreateEmpresa,
  EditEmpresa,
  DeleteEmpresa,
} from "../controllers/empresa.controller";

const router = express.Router();

router.post("/CreateEmpresa", CreateEmpresa);
router.get("/GetEmpresas", GetEmpresas);
router.get("/GetEmpresaById/:id_empresa", GetEmpresaById);
router.put("/EditEmpresa/:id_empresa", EditEmpresa);
router.delete("/DeleteEmpresa/:id_empresa", DeleteEmpresa);

export default router;
