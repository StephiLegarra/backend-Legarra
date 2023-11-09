import { Router } from "express";
import productController from "../controllers/products.controller.js"
import ProductsServices from "../services/products.service.js";
import ProductManager from "../dao/ProductManager.js";
import { passportCall, authorization } from "../middleware/passportAuthorization.js";
import errorHandler from "../services/errors/errorsHandler.js";

const productsRouter = Router();
const PM = new ProductManager();
const productService = new ProductsServices();

// OBTENER PRODUCTOS
productsRouter.get("/", passportCall('jwt'), authorization(['admin']), productController.getProducts.bind(productController));

// OBTENER PRODUCTO POR ID
productsRouter.get("/:pid", productController.getByID.bind(productController));

// AGREGAR PRODUCTOS
productsRouter.post("/", passportCall('jwt'), authorization(['admin', 'premium']), productController.addProduct.bind(productController));

// ACTUALIZAR PRODUCTOS
productsRouter.put("/:id", passportCall('jwt'), authorization(['admin']), productController.updateProduct.bind(productController));

// ELIMINAR PRODUCTO
productsRouter.delete("/:id", passportCall('jwt'), authorization(['admin', 'premium']), productController.deleteProduct.bind(productController));

productsRouter.use(errorHandler);
export default productsRouter;

