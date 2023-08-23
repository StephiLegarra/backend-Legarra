// Stephanie Legarra - Curso Backend - Comisión: 55305
//MONGOOSE
import { productModel } from "./models/product.model.js";

class ProductManager {
  constructor() {
    this.products = [];
  }

  static id = 0;

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
        return console.log("Debes completar todos los datos!");
      }

      product.id = ProductManager.id++;
      await productModel.create(product);
      console.log("El producto fue agregado correctamente");
    } catch (err) {
      console.log(err.message);
    }
  }

  async getProducts(limit) {
    try {
      return (await limit)
        ? productModel.find().limit(limit).lean()
        : productModel.find().lean();
    } catch (err) {
      console.log(err.message);
    }
  }

  async deleteProduct(id) {
    try {
      const readParse = await this.getProducts();
      const deleteProduct = readParse.filter((item) => item.id !== id);
      await productModel.deleteOne({ id: id }, deleteProduct);
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
      await productModel.updateOne({ id: id }, product);
      console.log("El producto fue actualizado correctamente");

      return product;
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
