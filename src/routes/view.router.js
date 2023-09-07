import express from "express";
import ProductManager from "../dao/ProductManager.js";
import CartManager from "../dao/CartManager.js";
import { checkSession } from "../Middleware/checkSessionMiddleware.js";
import { permission } from "../Middleware/permission.js";
import { sessionExist } from "../Middleware/sessionExist.js";

const router = express.Router();
const products = new ProductManager();
const carts = new CartManager();

// HOME
router.get("/", checkSession, async (request, response) => {
  const user = req.session.user;
  const { message } = req.query;
  const exist = parseInt(req.cookies[user.first_name]) > 1 ? true : false;

  try {
    const getProducts = await products.getProducts(request.query);
    response.render("home", {
      getProducts,
      isHome: true,
      user,
      message,
      exist,
    });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

//REAL TIME PRODUCTS
router.get(
  "/realtimeproducts",
  checkSession,
  permission,
  async (request, response) => {
    try {
      response.render("realtimeproducts");
    } catch (error) {
      response.status(500).send({ error: error.message });
    }
  }
);

//PRODUCTS
router.get("/products", checkSession, async (request, response) => {
  //const { limit, page, sort, query } = request.query;
  try {
    const getProducts = await products.getProducts(request.query);
    response.render("products", { getProducts });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

//PRODUCT
router.get("/products/:id", checkSession, async (request, response) => {
  const { id } = request.params;
  try {
    const getProducts = await products.getProductsById(parseInt(id));
    response.render("product", { getProducts });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

// CARTS
router.get(
  "/carts/:cid",
  checkSession,
  permission,
  async (request, response) => {
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
  }
);

//CHAT
router.get("/chat", checkSession, async (request, response) => {
  try {
    response.render("chat");
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

//REDIRECT
router.get("/", async (request, response) => {
  try {
    response.status(200).redirect("/login");
  } catch (err) {
    response.status(400).send({ error: err.message });
  }
});

//LOGIN
router.get("/login", sessionExist, (request, response) => {
  const { message } = request.query;
  try {
    response.render("login", { message, tittle: "Log in" });
  } catch (err) {
    response.status(500).send({ error: err.message });
  }
});

//REGISTRARSE
router.get("/register", sessionExist, (request, response) => {
  try {
    response.render("register", { tittle: "Register" });
  } catch (err) {
    response.status(500).send({ error: err.message });
  }
});

//PERFIL DEL USUARIO
router.get("/profile", checkSession, (request, response) => {
  try {
    const user = request.session.user;

    response.render("profile", { user, tittle: "Profile" });
  } catch (err) {
    response.status(500).send({ error: err.message });
  }
});

//CONFIRMA CREACION DE LA CUENTA Y REDIRIGIR AL PERFIL
router.get("/success", async (request, response) => {
  try {
    response.render("success", { tittle: "Success" });
  } catch (err) {
    response.status(500).send({ error: err.message });
  }
});

export default router;
