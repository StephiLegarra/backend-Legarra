// 1 PRE ENTREGA Stephanie Legarra - Curso Backend - Comisión: 55305

// FILE SYSTEM
import fs from "fs/promises";

class ProductManager {
  constructor() {
    this.products = [];
    this.path = "./Products.json";
  }

  static id = 0;

  //recorre los productos que existen en el json para evitar subidas duplicadas
  async initialize() {
    try {
      await fs.access(this.path); // acces verifica si existe.
      const products = await fs.readFile(this.path, "utf-8");
      const productParse = JSON.parse(products);

      if (productParse.length !== 0) {
        const productsParse = await this.getProductsGeneral();
        this.products = productsParse;
        ProductManager.id =
          Math.max(...this.products.map((item) => item.id)) + 1;
      } else {
        await this.createFile();
      }
    } catch (err) {
      // Si el archivo no existe, lo creo con un array vacío
      await this.createFile();
    }
  }

  async addProduct(product) {
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

      product.id = ProductManager.id++;
      this.products.push(product);

      await this.createFile();
    } catch (err) {
      console.log(err.message);
    }
  }

  async createFile() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
    } catch (err) {
      console.log(err.message);
    }
  }

  async getProductsGeneral() {
    try {
      const getProducts = await fs.readFile(this.path, "utf-8");
      const getProductsParse = JSON.parse(getProducts);
      return getProductsParse;
    } catch (err) {
      console.log(err.message);
    }
  }

  async getProducts() {
    try {
      const products = await this.getProductsGeneral();
      console.log(products);
    } catch (err) {
      console.log(err.message);
    }
  }

  async deleteProduct(id) {
    try {
      const readParse = await this.getProductsGeneral();
      const deleteProduct = readParse.filter((item) => item.id !== id);
      await fs.writeFile(this.path, JSON.stringify(deleteProduct, null, 2));
    } catch (err) {
      console.log(err.message);
    }
  }

  async updateProduct(id, product) {
    try {
      const index = this.products.findIndex((item) => item.id === id);
      if (index === -1) {
        return console.log("no se encontró el producto");
      }
      this.products[index] = product;
      product.id = id;
      await this.createFile();

      return this.products[index];
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

export default ProductManager;
