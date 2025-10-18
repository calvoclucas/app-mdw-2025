import express from "express";
import {
  GetProductos,
  GetProductoById,
  CreateProducto,
  EditProducto,
  DeleteProducto,
} from "../controllers/producto.controller";

const router = express.Router();

router.get("/GetProductos", GetProductos);
router.get("/GetProducto/:id", GetProductoById);
router.post("/CreateProducto", CreateProducto);
router.put("/EditProducto/:id", EditProducto);
router.delete("/DeleteProducto/:id", DeleteProducto);

export default router;
