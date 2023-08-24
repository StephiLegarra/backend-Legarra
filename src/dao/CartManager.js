//Stephanie Legarra - Curso Backend - Comisión: 55305

import { cartModel } from "./models/cart.model.js";
import { productModel } from "./models/product.model.js";

class CartManager {
  constructor() {
    this.carts = [];
  }

  static id = 1;

  async newCart() {
    try {
      await cartModel.create({ id: CartManager.id++ }, { products: [] });
      return console.log("El carrito ha sido creado");
    } catch (err) {
      console.log(err.message);
    }
  }

  async getCart(id) {
    try {
      if (this.getCartById(id)) {
        return (await cartModel.findOne({ id: id }).lean()) || null;
      } else {
        console.log("no se encontró este carrito");
        return null;
      }
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

  async getCartById(id) {
    try {
      const cart = await cartModel.findOne({ id: id }).lean();
      if (!cart) {
        return console.log("no se encontró el carrito");
      }
      return cart;
    } catch (err) {
      console.log(err.message);
    }
  }

  async addProductToCart(cid, pid) {
    try {
      if (this.getCartById(parseInt(cid))) {
        const cart = await this.getCart(cid);
        console.log(cart);
        const product = cart.products.find((item) => item.product === pid);
        // const product = await productModel.findOne({id:pid}).lean()
        if (!product) {
          cart.products.push({ product: pid, quantity: 1 });
        } else {
          product.quantity += 1;
        }
      }
      await cartModel.updateOne({ id: cid }, { products: cart.products });
      console.log("El producto fue agregado al carrito!");
      return true;
    } catch (err) {
      console.log(err.message);
    }
  }
}

export default CartManager;
