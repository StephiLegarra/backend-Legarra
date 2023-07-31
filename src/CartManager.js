// 1 PRE ENTREGA Stephanie Legarra - Curso Backend - Comisión: 55305

// FILE SYSTEM
import fs from "fs/promises";

class CartManager {
  constructor() {
    this.carts = [];
    this.path = "./Carts.json";
  }

  static id = 0;

  //recorre los productos que existen en el json para evitar subidas duplicadas
  async initialize() {
    try {
      await fs.access(this.path); // acces verifica si existe.
      const carts = await fs.readFile(this.path, "utf-8");
      const cartParse = JSON.parse(carts);

      if (cartParse.length !== 0) {
        const cartsParse = await this.getProductsGeneral();
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
      this.carts.push({ id: this.getProductsById(), carts: [] });

      await this.createFile();
      return console.log("El carrito ah sido creado");
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

  async addCart(product) {
    try {
      const { title, description, price, thumbnail, code, stock, category } =
        product;
      const codeExists = this.products.some((item) => item.code === code);
      if (codeExists) {
        return console.log("el código ya existe");
      }

      if (
        !title ||
        !description ||
        !price ||
        !thumbnail ||
        !code ||
        !stock ||
        !category
      ) {
        return console.log("faltan datos");
      }

      product.id = CartManager.id++;
      this.products.push(product);

      await this.createFile();
    } catch (err) {
      console.log(err.message);
    }
  }

  async addProductToCart(cid, pid) {
    try {
      this.carts = this.getCarts;
      const cart = this.carts.find((item) => item.id === cid);
      const product = cart.products.find((item) => item.product === pid);
      if (product) {
        product.quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }
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
      const getProducts = await fs.readFile(this.path, "utf-8");
      const getProductsParse = JSON.parse(getProducts);
      return getProductsParse;
    } catch (err) {
      console.log(err.message);
    }
  }

  async getCart() {
    try {
      const products = await this.getProductsGeneral();
      console.log(products);
    } catch (err) {
      console.log(err.message);
    }
  }

  async deleteCart(id) {
    try {
      const readParse = await this.getProductsGeneral();
      const deleteProduct = readParse.filter((item) => item.id !== id);
      await fs.writeFile(this.path, JSON.stringify(deleteProduct, null, 2));
    } catch (err) {
      console.log(err.message);
    }
  }

  async getProductsById(id) {
    try {
      const product = await this.products.find((item) => item.id === id);
      if (!product) {
        return console.log("no se encontró el producto");
      }
      return product;
    } catch (err) {
      console.log(err.message);
    }
  }
}

export default CartManager;
