import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";
import productControl from "../controllers/products.controller.js"

const productsRouter = Router();
const PM = new ProductManager();

// OBTENER PRODUCTOS
productsRouter.get("/", productControl.getProducts.bind(productControl));

// OBTENER PRODUCTO POR ID
productsRouter.get("/:id", productControl.getByID.bind(productControl));

// AGREGAR PRODUCTOS
productsRouter.post("/", productControl.addProduct.bind(productControl));

// ACTUALIZAR PRODUCTOS
productsRouter.put("/:id", productControl.updateProd.bind(productControl));

// ELIMINAR PRODUCTO
productsRouter.delete("/:id", productControl.deleteProd.bind(productControl));


export default productsRouter;
