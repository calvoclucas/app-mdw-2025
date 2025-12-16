import express from "express";
import {
  GetProductos,
  GetProductoById,
  CreateProducto,
  EditProducto,
  DeleteProducto,
  GetProductosByEmpresa,
} from "../controllers/producto.controller";
import { authOptional } from "../middlewares/authoptional";
import { authRequired } from "../middlewares/authrequiered";
import { rolesGuard } from "../middlewares/rolesguard";
const router = express.Router();

router.get("/GetProductos", authOptional, GetProductos);
router.get("/GetProductosByEmpresa/:id_empresa", authOptional, GetProductosByEmpresa);
router.get("/GetProducto/:id", authOptional, GetProductoById);
router.post("/CreateProducto", authOptional, authRequired, rolesGuard(["empresa"]), CreateProducto);
router.put("/EditProducto/:id", authRequired, rolesGuard(["empresa"]), EditProducto);
router.delete("/DeleteProducto/:id", authRequired, rolesGuard(["empresa"]), DeleteProducto);

export default router;
