import { Router } from "express";
import CartManager from "../dao/CartManager.js";
import ProductManager from "../dao/ProductManager.js";

const cartsRouter = Router();
const carts = new CartManager();

// CREAR CARRITO
cartsRouter.post("/", async (request, response) => {
  try {
    const newCart = await carts.newCart();
    response
      .status(200)
      .send({ newCart, message: "El carrito ha sido creado" });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

// PRODUCTOS DEL CARRITO
cartsRouter.get("/:cid", async (request, response) => {
  const { cid } = request.params;

  try {
    const getCart = await carts.getCartById(parseInt(cid));
    if (!getCart) {
      return response
        .status(404)
        .send({ error: "El id del carrito no ha sido encontrado" });
    }
    response.status(200).send(getCart);
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

cartsRouter.post("/:cid/products/:pid", async (request, response) => {
  const { cid, pid } = request.params;

  try {
    const products = new ProductManager();
    const getProduct = await products.getProductsById(parseInt(pid));
    const getCart = await carts.getCartById(parseInt(cid));

    if (!getCart) {
      return response
        .status(404)
        .send({ error: "El id del carrito no ha sido encontrado" });
    }

    if (!getProduct) {
      return response
        .status(404)
        .send({ error: "El id del producto no ha sido encontrado" });
    }

    await carts.addProductToCart(parseInt(cid), parseInt(pid));

    response.status(200).send(getProduct);
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

export default cartsRouter;
