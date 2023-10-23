import { Router } from "express";
import productController from "../controllers/products.controller.js"
import { isAdmin } from "../middleware/authorization.js";

const productsRouter = Router();

// OBTENER PRODUCTOS
productsRouter.get("/", isAdmin, productController.getProducts.bind(productController));

// OBTENER PRODUCTO POR ID
productsRouter.get("/:pid", isAdmin, productController.getByID.bind(productController));

// AGREGAR PRODUCTOS
productsRouter.post("/", isAdmin, productController.addProduct.bind(productController));

// ACTUALIZAR PRODUCTOS
productsRouter.put("/:id", isAdmin, productController.updateProd.bind(productController));

// ELIMINAR PRODUCTO
productsRouter.delete("/:id", isAdmin, productController.deleteProd.bind(productController));


export default productsRouter;
