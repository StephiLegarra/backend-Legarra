import express from "express";
import ProductManager from "../dao/ProductManager.js";
import CartManager from "../dao/CartManager.js";

const router = express.Router();
const products = new ProductManager();
const carts = new CartManager();

//CHECKSESSION
//Control de acceso
const checkSession = (req, res, next) => {
  console.log(
    "Verificando req.session.user en checkSession:",
    req.session.user
  );
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

const checkAlreadyLoggedIn = (req, res, next) => {
  console.log("Verificando req.session en checkAlreadyLoggedIn:", req.session);
  console.log(
    "Verificando req.session.user en checkAlreadyLoggedIn:",
    req.session.user
  );
  if (req.session && req.session.user) {
    console.log("Usuario ya autenticado, redirigiendo a /profile");
    res.redirect("/profile");
  } else {
    console.log("Usuario no autenticado, procediendo...");
    next();
  }
};

// HOME
router.get("/", async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//REAL TIME PRODUCTS
router.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realtimeproducts");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//PRODUCTS
router.get("/products", checkSession, async (req, res) => {
  try {
    const getProducts = await products.getProducts(req.query);
    const user = req.session.user;
    res.render("products", { getProducts, user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//PRODUCT
router.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getProducts = await products.getProductsById(parseInt(id));
    res.render("product", { getProducts });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// CARTS
router.get("/carts/:cid", checkSession, async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await carts.getCartById(parseInt(cid));
    if (!cart) {
      return res.status(404).send({ error: "El carrito no existe" });
    }

    res.render("cart", { cart });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//CHAT
router.get("/chat", checkSession, async (req, res) => {
  try {
    res.render("chat");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//REDIRECT
router.get("/", async (req, res) => {
  try {
    res.status(200).redirect("/login");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

//LOGIN
router.get("/login", checkAlreadyLoggedIn, (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

//REGISTRARSE
router.get("/register", checkAlreadyLoggedIn, (req, res) => {
  try {
    res.render("register");
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

//PERFIL DEL USUARIO
router.get("/profile", checkSession, (req, res) => {
  try {
    const userData = req.session.user;
    res.render("profile", { user: userData });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

//RESTORE (ACTUALIZAR CONTRASEÑA)
router.get("/restore", checkSession, (req, res) => {
  res.render("restore");
});

export default router;
