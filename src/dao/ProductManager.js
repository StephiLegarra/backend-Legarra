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

      if (await this.validateCode(product.code)) {
        console.log("El código ingresado ya existe");
        return false;
      } else {
        product.id = ProductManager.id++;
        await productModel.create(product);
        console.log("El producto fue agregado correctamente");
        return true;
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  async validateCode(code) {
    return (await productModel.findOne({ code: code })) || false;
  }

  /* async getProducts(limit) {
    try {
      return (await limit)
        ? productModel.find().limit(limit).lean()
        : productModel.find().lean();
    } catch (err) {
      console.log(err.message);
    }
  }* */

  async getProducts(params) {
    try {
      let { limit, page, query, sort } = params;

      limit = limit ? limit : 10;
      page = page ? page : 1;
      query = query || {};
      sort = sort ? (sort == "asc" ? 1 : -1) : 0;

      let products = await productModel.paginate(query, {
        limit: limit,
        page: page,
        sort: { price: sort },
      });
      let status = products ? "success" : "error";

      let prevLink = products.hasPrevPage
        ? "http://localhost:8080/products?limit=" +
          limit +
          "&page=" +
          products.prevPage
        : null;
      let nextLink = products.hasNextPage
        ? "http://localhost:8080/products?limit=" +
          limit +
          "&page=" +
          products.nextPage
        : null;

      products = {
        status: status,
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: prevLink,
        nextLink: nextLink,
      };

      return products;
    } catch (err) {
      console.log(err.message);
    }
  }

  async getProductsById(id) {
    try {
      const product = await productModel.findOne({ id: id }).lean();
      if (!product) {
        return console.log("no se encontró el producto");
      }
      return product;
    } catch (err) {
      console.log(err.message);
    }
  }

  async updateProduct(id, product) {
    try {
      if (await this.getProductsById(id)) {
        await productModel.updateOne({ id: id }, product);
        console.log("El producto fue actualizado correctamente");
        return true;
      } else {
        console.log("no se encontró el producto");
        return false;
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  async deleteProduct(id) {
    try {
      if (await this.getProductsById(id)) {
        await productModel.deleteOne({ id: id });
        console.log("El producto fue eliminado correctamente");
        return true;
      } else {
        console.log("no se encontró el producto");
        return false;
      }
    } catch (err) {
      console.log(err.message);
    }
  }
}

export default ProductManager;
