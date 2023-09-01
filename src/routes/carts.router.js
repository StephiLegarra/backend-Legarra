import { Router } from "express";
import CartManager from "../dao/CartManager.js";
import ProductManager from "../dao/ProductManager.js";

const cartsRouter = Router();
const carts = new CartManager();
const products = new ProductManager();

// CREAR CARRITO
cartsRouter.post("/", async (request, response) => {
  try {
    const newCart = await carts.newCart();
    response
      .status(200)
      .send({ newCart, message: "El carrito ha sido creado" });
  } catch (error) {
    response.status(500).send({
      status: "error",
      message: "Error! No se pudo crear el Carrito!",
    });
  }
});

// VER PRODUCTOS DEL CARRITO
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
    response.status(500).send({
      status: "error",
      message: "Error! No se han encontrado productos en el carrito!",
    });
  }
});

// AGREGAR PRODUCTOS AL CARRITO
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

    response.status(200).send({
      status: "ok",
      message: "El producto se agregó correctamente!",
    });
  } catch (error) {
    response.status(500).send({
      status: "error",
      message: "Error! No se pudo agregar el producto al carrito!",
    });
  }
});

// ACTUALIZAR EL CARRITO CON UN ARRAY DE PRODUCTOS
cartsRouter.put("/:cid", async (request, response) => {
  const { body } = request;
  const { cid } = request.params;

  try {
    const getCart = carts.getCartById(parseInt(cid));

    if (!getCart) {
      return response
        .status(404)
        .send({ error: "El id del carrito no ha sido encontrado" });
    }

    body.forEach(async (item) => {
      const getProduct = await products.getProductsById(parseInt(item.id));
      if (!getProduct) {
        return response
          .status(404)
          .send({ error: "El id del producto no ha sido encontrado" });
      }
    });

    const newCart = await carts.addArrayProducts(parseInt(cid), body);
    response.status(200).send(newCart);
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

//ACTUALIZAR CANTIDAD DE EJEMPLARES DEL PRODUCTO EN EL CARRITO
cartsRouter.put("/:cid/products/:pid", async (request, response) => {
  const { cid, pid } = request.params;
  const { quantity } = request.body;

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

    await carts.updateQuantityProductFromCart(
      parseInt(cid),
      parseInt(pid),
      parseInt(quantity)
    );

    response.status(200).send({
      status: "ok",
      message:
        "La cantidad de ejemplares del producto se actualizó correctamente!",
    });
  } catch (error) {
    response.status(500).send({
      status: "error",
      message: "Error! No se pudo actualizar el producto del carrito!",
    });
  }
});

// ELIMINAR PRODUCTOS DEL CARRITO
cartsRouter.delete("/:cid/products/:pid", async (request, response) => {
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

    await carts.deleteProductFromCart(parseInt(cid), parseInt(pid));

    response.status(200).send({
      status: "ok",
      message: "Se ha eliminado el producto del carrito correctamente!!",
    });
  } catch (error) {
    response.status(500).send({
      status: "error",
      message: "Error! No se pudo eliminar el producto del carrito!",
    });
  }
});

// VACIAR CARRITO
cartsRouter.delete("/:cid", async (request, response) => {
  const { cid } = request.params;

  try {
    const getCart = await carts.getCartById(parseInt(cid));

    if (!getCart) {
      return response
        .status(404)
        .send({ error: "El id del carrito no ha sido encontrado" });
    }

    await carts.emptyCart(parseInt(cid));

    response.status(200).send({
      status: "ok",
      message: "Se ha vaciado el carrito correctamente!!",
    });
  } catch (error) {
    response.status(500).send({
      status: "error",
      message: "Error! No se pudo vaciar el carrito!",
    });
  }
});

export default cartsRouter;
