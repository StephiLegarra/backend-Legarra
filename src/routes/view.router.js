import express from "express";
import ProductManager from "../dao/ProductManager.js";
import CartManager from "../dao/CartManager.js";

const router = express.Router();
const products = new ProductManager();
const carts = new CartManager();

// HOME
router.get("/", async (request, response) => {
  try {
    const getProducts = await products.getProducts(request.query);
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
  //const { limit, page, sort, query } = request.query;
  try {
    const getProducts = await products.getProducts(request.query);
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
    response.render("product", { getProducts });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

// CARTS
router.get("/carts/:cid", async (request, response) => {
  const { cid } = request.params;
  try {
    const cart = await carts.getCartById(parseInt(cid));
    if (!cart) {
      return response.status(404).send({ error: "El carrito no existe" });
    }

    response.render("cart", { cart });
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

//LOGIN
router.get("/login", (request, response) => {
  response.render("login");
});

//REGISTRARSE
router.get("/register", (request, response) => {
  response.render("register");
});

//PERFIL DEL USUARIO
router.get("/profile", (request, response) => {
  res.render("profile", {
    user: req.session.user,
  });
});

export default router;
