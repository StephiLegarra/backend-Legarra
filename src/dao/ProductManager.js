// Stephanie Legarra - Curso Backend - Comisión: 55305
import { productModel } from "./models/product.model.js";

class ProductManager {
  constructor() {
    this.products = [];
  }

  static id = 1;

   //AGREGAR PRODUCTOS
  async addProduct(product) {
    try {
      const { title, description, price, thumbnail, code, stock, category } = product;

      if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
        return console.log("Debes completar todos los datos!");
      }

      const exists = await productModel.findOne({code});
      if (exists) {
        console.log("Este código ya fue ingresado anteriormente!");
        return null;
      }

        const products = await productModel.find();
        this.products = products;

     /*   if (this.products.length !== 0) {
          const max = Math.max(...this.products.map((item) => item.id)) + 1;
          ProductManager.id = max;
        }
        product.id = ProductManager.id++; */
        await productModel.create(product);
        console.log("El producto fue agregado correctamente");
        return true;
    } catch (err) {
      console.error("Error al agregar el producto:", err);
      return false;
    }
  }

  //VALIDAR CODIGO
  async validateCode(code) {
    try {
      return await productModel.exists({ code: code });
    } catch (err) {
      console.error("Error al validar el código del producto! ", err);
      return false;
    }
  }

   //FORMULARIO DESDE LA VISTA
  async getProductsViews() {
    try {
        return await productModel.find().lean();
    } catch (err) {
        return err
    }
  }

   //OBTENER PRODUCTOS
  async getProducts(params = {}) {
    let { limit = 10, page = 1, query = {}, sort = {} } = params;
    console.log("Query object:", query, "Type:", typeof query);
    sort = sort ? (sort === "asc" ? { price: 1 } : { price: -1 }) : {};

    try {
      let products = await productModel.paginate(query, {
        limit: limit,
        page: page,
        sort: sort,
        lean: true,
      });

      let status = products ? "success" : "error";
      let prevLink = products.hasPrevPage ? "http://localhost:8080/products?limit=" + limit + "&page=" + products.prevPage : null;
      let nextLink = products.hasNextPage ? "http://localhost:8080/products?limit=" + limit + "&page=" + products.nextPage : null;

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
      console.error("Error al obtener los productos: ", err);
      return {status: "error",payload: []};
    }
  }

  async getProductsById(id) {
    try {
      return await productModel.findById(id).lean();
    } catch (err) {
      console.error("Error al obtener los productos por ID: ", err);
      return null;
    }
  }

  async updateProduct(id, product) {
    try {
      const updatedProduct = await productModel.findByIdAndUpdate(id, product, {
        new: true,
      });
      if (updatedProduct) {
        console.log("El producto fue actualizado!");
        return true;
      } else {
        console.log("El producto no fue encontrado!");
        return false;
      }
    } catch (err) {
      console.error("Error al actualizar el producto: ", err);
      return false;    
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await productModel.findByIdAndDelete(id);
        if (deletedProduct) {
            console.log("El producto eliminado correctamente: ", deletedProduct);
            return true;
        } else {
            console.log("El producto no fue encontrado: ", id);
            return false;
        }
      } catch (err) {
        console.error('Error eliminando producto:', err);
        return false;
    }
  }

  async updateProduct(pid, updateData) {
    try {
      const updatedProduct = await productModel.findByIdAndUpdate(pid, updateData, {
        new: true,
      });
      return updatedProduct ? true : false;
    } catch (err) {
      console.error("Error al actualizar el producto: ", err);
      return false;
    }
  }

}

export default ProductManager;
