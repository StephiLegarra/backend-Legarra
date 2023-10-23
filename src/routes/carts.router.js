import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import { authorization, passportCall } from "../middleware/passportAuthorization.js";

const cartsRouter = Router();

// CREAR CARRITO
cartsRouter.post("/", cartController.createCart.bind(cartController));

//GET CARTS
cartsRouter.get("/", cartController.allCarts.bind(cartController));

// VER PRODUCTOS DEL CARRITO
cartsRouter.get("/:cid", cartController.getCart.bind(cartController));

// AGREGAR PRODUCTOS AL CARRITO
cartsRouter.post("/:cid/products/:pid", passportCall('jwt'), authorization(['user']), cartController.addProduct.bind(cartController));

// ACTUALIZAR EL CARRITO CON UN ARRAY DE PRODUCTOS
cartsRouter.put("/:cid", cartController.newArrayCart.bind(cartController));

//ACTUALIZAR CANTIDAD DE EJEMPLARES DEL PRODUCTO EN EL CARRITO
cartsRouter.put("/:cid/products/:pid", cartController.updateQuantity.bind(cartController));

// ELIMINAR PRODUCTOS DEL CARRITO
cartsRouter.delete("/:cid/products/:pid", cartController.deleteThisProduct.bind(cartController));

// VACIAR CARRITO
cartsRouter.delete("/:cid", cartController.cleanCart.bind(cartController));

//PROCESAR LA COMPRA
cartsRouter.get("/:cid/purchase", cartController.purchase);
cartsRouter.get("/:cid/purchase/ticket", cartController.ticketEnd);

export default cartsRouter;
