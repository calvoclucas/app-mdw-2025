import express from "express";
import {
  GetDirecciones,
  GetDireccionById,
  CreateDireccion,
  EditDireccion,
  DeleteDireccion,
} from "../controllers/direccion.controller";

const router = express.Router();

router.post("/CreateDireccion", CreateDireccion);
router.get("/GetDirecciones", GetDirecciones);
router.get("/GetDireccionById/:id_direccion", GetDireccionById);
router.put("/EditDireccion/:id_direccion", EditDireccion);
router.delete("/DeleteDireccion/:id_direccion", DeleteDireccion);

export default router;
