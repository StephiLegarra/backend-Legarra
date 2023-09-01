import express from "express";
import ProductManager from "../dao/ProductManager.js";
import CartManager from "../dao/CartManager.js";

const router = express.Router();
const products = new ProductManager();
const carts = new CartManager();

// HOME
router.get("/", async (request, response) => {
  try {
    const getProducts = await products.getProducts();
    response.render("home", { getProducts });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

//REAL TIME PRODUCTS
router.get("/realtimeproducts", async (request, response) => {
  try {
    response.render("realtimeproducts");
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

//PRODUCTS
router.get("/products", async (request, response) => {
  const { limit, page, sort, query } = request.query;
  try {
    const getProducts = await products.getProducts(limit, page, sort, query);
    response.render("products", { getProducts });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

//PRODUCT
router.get("/products/:id", async (request, response) => {
  const { id } = request.params;
  try {
    const getProducts = await products.getProductsById(parseInt(id));
    response.render("products", { getProducts });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

// CARTS
router.get("/carts/:cid", async (request, response) => {
  const { cid } = request.params;
  try {
    const getCarts = await carts.getCartById(parseInt(cid));
    if (!getCarts) {
      return response.status(404).send({ error: "El carrito no existe" });
    }
    response.render("carts", { getCarts });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

//CHAT
router.get("/chat", async (request, response) => {
  try {
    response.render("chat");
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

export default router;
