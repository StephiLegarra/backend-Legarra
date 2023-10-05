import { Router } from "express";
import CartManager from "../dao/CartManager.js";
import ProductManager from "../dao/ProductManager.js";
import cartsControl from "../controllers/cart.controller.js";

const cartsRouter = Router();
const CM = new CartManager();
const PM = new ProductManager();

// CREAR CARRITO
cartsRouter.post("/", cartsControl.createNewCart.bind(cartsControl));

//GET CARTS
cartsRouter.get("/", cartsControl.getCarts.bind(cartsControl))

// VER PRODUCTOS DEL CARRITO
cartsRouter.get("/:cid", cartsControl.getCartByID.bind(cartsControl));

// AGREGAR PRODUCTOS AL CARRITO
cartsRouter.post("/:cid/products/:pid", cartsControl.addProduct.bind(cartsControl));

// ACTUALIZAR EL CARRITO CON UN ARRAY DE PRODUCTOS
cartsRouter.put("/:cid", cartsControl.newArrayCart.bind(cartsControl));

//ACTUALIZAR CANTIDAD DE EJEMPLARES DEL PRODUCTO EN EL CARRITO
cartsRouter.put("/:cid/products/:pid", cartsControl.updateQuantity.bind(cartsControl));

// ELIMINAR PRODUCTOS DEL CARRITO
cartsRouter.delete("/:cid/products/:pid", cartsControl.deleteThisProduct.bind(cartsControl));

// VACIAR CARRITO
cartsRouter.delete("/:cid", cartsControl.cleanCart.bind(cartsControl));


export default cartsRouter;
