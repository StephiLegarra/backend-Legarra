// 1 PRE ENTREGA Stephanie Legarra - Curso Backend - Comisión: 55305

// FILE SYSTEM
import fs from "fs/promises";

class CartManagerFS {
  constructor() {
    this.carts = [];
    this.path = "./Carts.json";
  }

  static id = 1;

  //recorre los productos que existen en el json para evitar subidas duplicadas
  async initialize() {
    try {
      await fs.access(this.path); // acces verifica si existe.
      const carts = await fs.readFile(this.path, "utf-8");
      const cartParse = JSON.parse(carts);

      if (cartParse.length !== 0) {
        const cartsParse = await this.getCartGeneral();
        this.carts = cartsParse;
        CartManager.id = Math.max(...this.carts.map((item) => item.id)) + 1;
      } else {
        await this.createFile();
      }
    } catch (err) {
      // Si el archivo no existe, lo creo con un array vacío
      await this.createFile();
    }
  }

  async newCart() {
    try {
      const newCart = { id: CartManager.id++, carts: [] };

      this.carts.push(newCart);
      await this.createFile();
      return console.log("El carrito ha sido creado");
    } catch (err) {
      console.log(err.message);
    }
  }

  async getCart(id) {
    try {
      const cart = await this.carts.find((item) => item.id === id);
      if (!cart) {
        return console.log("no se encontró el producto en el carrito");
      }
      return cart;
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

      await this.createFile();
    } catch (err) {
      console.log(err.message);
    }
  }

  async createFile() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    } catch (err) {
      console.log(err.message);
    }
  }

  async getCartGeneral() {
    try {
      const getCart = await fs.readFile(this.path, "utf-8");
      const getCartParse = JSON.parse(getCart);
      return getCartParse;
    } catch (err) {
      console.log(err.message);
    }
  }

  async getCart() {
    try {
      const products = await this.getCartGeneral();
      return products;
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

export default CartManagerFS;
