import express from "express";
import {
  GetProductos,
  GetProductoById,
  CreateProducto,
  EditProducto,
  DeleteProducto,
  GetProductosByEmpresa,
} from "../controllers/producto.controller";

const router = express.Router();

router.get("/GetProductos", GetProductos);
router.get("/GetProductosByEmpresa/:id_empresa", GetProductosByEmpresa);
router.get("/GetProducto/:id", GetProductoById);
router.post("/CreateProducto", CreateProducto);
router.put("/EditProducto/:id", EditProducto);
router.delete("/DeleteProducto/:id", DeleteProducto);

export default router;
