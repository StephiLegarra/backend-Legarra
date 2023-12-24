import CartManager from "../dao/CartManager.js";

//LOAD USER CART
async function loadUserCart(req, res, next) {
    if (req.session && req.session.user) {
      const cartId = req.session.user.cart;
      console.log("Cargando Cart ID:", cartId);
      const CM = new CartManager();
      const cart = await CM.getCartById(cartId);
      console.log("OK - Cart:", cart);
      req.cart = cart;
    }
    next();
  }
  
  export default loadUserCart;