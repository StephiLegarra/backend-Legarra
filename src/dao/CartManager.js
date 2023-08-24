//Stephanie Legarra - Curso Backend - Comisión: 55305

import { cartModel } from "./models/cart.model.js";

class CartManager {
  constructor() {
    this.carts = [];
  }

  static id = 1;

  async newCart() {
    try {
      const newCart = { id: CartManager.id++, carts: [] };
      this.carts.push(newCart);
      await cartModel.create({ id: CartManager.id++ }, { products: [] });
      return console.log("El carrito ha sido creado");
    } catch (err) {
      console.log(err.message);
    }
  }

  async getCart(id) {
    try {
      const cart = await cartModel.findOne({ id: id }).lean();
      if (!cart) {
        return console.log("no se encontró el producto en el carrito");
      }
      return cart;
    } catch (err) {
      console.log(err.message);
    }
  }

  async getCarts() {
    try {
      return await cartModel.find().lean();
    } catch (err) {
      console.log(err.message);
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const cart = this.carts.find((item) => item.id === cid);

      console.log(cart);

      const product = cart.carts.find((item) => item.product === pid);

      if (!product) {
        cart.carts.push({ product: pid, quantity: 1 });
      } else {
        product.quantity += 1;
      }

      await cartModel.updateOne({ id: cid }, { products: cart.products });
    } catch (err) {
      console.log(err.message);
    }
  }

  async getCartById(id) {
    try {
      const cart = await this.carts.find((item) => item.id === id);
      if (!cart) {
        return console.log("no se encontró el producto");
      }
      return cart;
    } catch (err) {
      console.log(err.message);
    }
  }
}

export default CartManager;
