import { Router } from "express";
import CartManager from "../dao/CartManager.js";
import cartController from "../controllers/cart.controller.js";
import { authorization, passportCall } from "../middleware/passportAuthorization.js";

const cartsRouter = Router();
const CM = new CartManager();

// CREAR CARRITO
cartsRouter.post("/", cartController.createCart.bind(cartController));

//GET CARTS
cartsRouter.get("/", cartController.allCarts.bind(cartController));

// VER PRODUCTOS DEL CARRITO
cartsRouter.get("/:cid", cartController.getCart.bind(cartController));

// AGREGAR PRODUCTOS AL CARRITO
cartsRouter.post("/:cid/products/:pid", passportCall('jwt'), authorization(['user']), cartController.addProduct.bind(cartController));

// ACTUALIZAR EL CARRITO 
cartsRouter.put("/:cid", cartController.updateCart.bind(cartController));

//ACTUALIZAR CANTIDAD DE EJEMPLARES DEL PRODUCTO EN EL CARRITO
cartsRouter.put("/:cid/products/:pid", cartController.updateQuantity.bind(cartController));

// ELIMINAR PRODUCTOS DEL CARRITO
cartsRouter.delete("/:cid/products/:pid", cartController.deleteProduct.bind(cartController));

// VACIAR CARRITO
cartsRouter.delete("/:cid", cartController.cleanCart.bind(cartController));

//PROCESAR LA COMPRA
cartsRouter.post("/:cid/purchase", (req, res, next) => {
  req.logger.debug('Ruta de compra accedida');
    next();
  }, passportCall("jwt"), cartController.createPurchaseTicket.bind(cartController));

export default cartsRouter;


