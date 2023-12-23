import { Router } from "express";
import CartManager from "../dao/CartManager.js";
import cartController from "../controllers/cart.controller.js";
import { authorization, passportCall } from "../middleware/passportAuthorization.js";
import { userModel } from "../dao/models/user.model.js";
import Stripe from "stripe";

const stripe = new Stripe("sk_test_51OLT0UF5lgdLr2ilfbiUNO90CGlkKYYzCngVzzDMhrgJ2W9l6JqqmL98DkpJmCWztoRdUUePafbAu5wioNRemecT00IH5zkg5M");

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


cartsRouter.get("/usuario/carrito", passportCall('jwt'), authorization(['user']), async (req, res) => {
    try {
      const userId = req.user._id; 
      const user = await userModel.findById(userId); 

      if (!user || !user.cart) {
        return res.status(404).json({ error: "El carrito no pudo ser encontrado" });
      }
      return res.json({ id: user.cart });
    } catch (error) {
      req.logger.error("Error obteniendo el carrito del usuario:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  });

export default cartsRouter;


