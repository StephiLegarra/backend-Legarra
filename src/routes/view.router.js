import express from "express";
import ProductManager from "../dao/ProductManager.js";
import CartManager from "../dao/CartManager.js";

const router = express.Router();
const products = new ProductManager();
const carts = new CartManager();

//CHECKSESSION
//Control de acceso
const checkSession = (request, response, next) => {
  console.log(
    "Verificando req.session.user en checkSession:",
    request.session.user
  );
  if (request.session && request.session.user) {
    next();
  } else {
    response.redirect("/login");
  }
};

const checkAlreadyLoggedIn = (request, response, next) => {
  console.log(
    "Verificando request.session en checkAlreadyLoggedIn:",
    request.session
  );
  console.log(
    "Verificando request.session.user en checkAlreadyLoggedIn:",
    request.session.user
  );
  if (request.session && request.session.user) {
    console.log("Usuario ya autenticado, redirigiendo a /profile");
    response.redirect("/profile");
  } else {
    console.log("Usuario no autenticado, procediendo...");
    next();
  }
};

// HOME
router.get("/", async (request, response) => {
  try {
    const getProducts = await products.getProducts(request.query);
    console.log(getProducts);
    response.render("login");
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
router.get("/products", checkSession, async (request, response) => {
  try {
    const getProducts = await products.getProducts(request.query);
    const user = request.session.user;
    response.render("products", { getProducts, user });
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
router.get("/carts/:cid", checkSession, async (request, response) => {
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
router.get("/login", checkAlreadyLoggedIn, (request, response) => {
  try {
    response.render("login");
  } catch (err) {
    response.status(500).send({ error: err.message });
  }
});

//REGISTRARSE
router.get("/register", checkAlreadyLoggedIn, (request, response) => {
  try {
    response.render("register");
  } catch (err) {
    response.status(500).send({ error: err.message });
  }
});

//PERFIL DEL USUARIO
router.get("/profile", checkSession, (request, response) => {
  try {
    const userData = request.session.user;
    response.render("profile", { user: userData });
  } catch (err) {
    response.status(500).send({ error: err.message });
  }
});

//CONFIRMA CREACION DE LA CUENTA Y REDIRIGIR AL PERFIL
router.get("/success", async (request, response) => {
  try {
    response.render("success");
  } catch (err) {
    response.status(500).send({ error: err.message });
  }
});

export default router;
