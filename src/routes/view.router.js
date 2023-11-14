import express from "express";
import ProductManager from "../dao/ProductManager.js";
import CartManager from "../dao/CartManager.js";
import cartController from "../controllers/cart.controller.js";
import { userModel } from "../dao/models/user.model.js";
import { checkSession, checkAlreadyLoggedIn } from "../middleware/checkLogin.js";

const viewsRouter = express.Router();
const PM = new ProductManager();
const CM = new CartManager();


// HOME
viewsRouter.get("/", checkSession, async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//REAL TIME PRODUCTS
viewsRouter.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realtimeproducts");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//PRODUCTS
viewsRouter.get("/products", checkSession, async (req, res) => {
  try {
    const getProducts = await PM.getProducts(req.query);
    const user = req.session.user;  
    req.logger.info(user);
    res.render("products", { getProducts, user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//PRODUCT
viewsRouter.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const getProducts = await PM.getProductsById(pid);
    res.render("product", { getProducts });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// CARTS
viewsRouter.get("/carts/:cid", async (req, res) => {
  const cid = req.params.cid;
  req.logger.info(cid);  
  const cart = await CM.getCartById(cid);
  if(cart) {
    req.logger.info(JSON.stringify(cart, null, 4));
    res.render("cart", {products: cart.products});
  } else {
    res.status(400).send({status:"error", message: "Error! No se encuentra el ID de Carrito!"})
  }
})

// CART PURCHASE
viewsRouter.post("/carts/:cid/purchase", async (req, res) => {
  const cid = req.params.cid;
  cartController.getPurchase(req, res, cid);
});

//CHAT
viewsRouter.get("/chat",checkSession, async (req, res) => {
  try {
    res.render("chat");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//LOGIN
viewsRouter.get("/login", checkAlreadyLoggedIn, async (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

//REGISTRARSE
viewsRouter.get("/register", checkAlreadyLoggedIn, async (req, res) => {
  try {
    res.render("register");
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

//PERFIL DEL USUARIO
viewsRouter.get("/profile", checkSession, (req, res) => {
  try {
    const userData = req.session.user;
    res.render("profile", { user: userData });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

//RESTORE (ACTUALIZAR CONTRASEÑA)
viewsRouter.get("/restore", async (req, res) => {
  res.render("restore");
});

//RECUPERAR CONTRASEÑA
viewsRouter.get("/newPassword/:token", async (req, res) => {
  const { token } = req.params;
  const user = await userModel.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.redirect('/restore');
  }
  res.render('newPassword', { token });
});

//ERROR AL INGRESAR
viewsRouter.get("/faillogin", (req, res) =>{
  res.status(401).json({status:"error", message: "Error en el ingreso al sitio con ese mail y contraseña"});
})

//ERROR AL REGISTRARSE
viewsRouter.get("/failregister", async (req, res) =>{
  res.send({status: "Error", message: "Error! No se pudo registar el Usuario!"});
})


export default viewsRouter;
