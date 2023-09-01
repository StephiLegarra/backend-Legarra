import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";

const productsRouter = Router();
const products = new ProductManager();

// OBTENER PRODUCTOS
productsRouter.get("/", async (request, response) => {
  const { limit, page, sort, query } = request.query;

  try {
    const getProducts = await products.getProductsQuery(
      limit,
      page,
      sort,
      query
    );

    response.status(200).send({ getProducts });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

// OBTENER PRODUCTO POR ID
productsRouter.get("/:id", async (request, response) => {
  const { id } = request.params;

  try {
    const getProducts = await products.getProductsById(parseInt(id));

    if (!getProducts) {
      return response.status(404).send({ error: "producto no encontrado" });
    }
    response.status(200).send({ getProducts });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

// AGREGAR PRODUCTOS
productsRouter.post("/", async (request, response) => {
  const { title, description, price, thumbnail, code, stock, category } =
    request.body;
  try {
    if (
      !title ||
      !description ||
      !price ||
      !code ||
      !stock ||
      !category ||
      !thumbnail
    ) {
      response.status(400).send({
        status: "error",
        message: "Error! Se deben completar todos los campos obligatorios",
      });
      return false;
    }

    if (!Array.isArray(thumbnail) || thumbnail.length == 0) {
      response.status(400).send({
        status: "error",
        message: "Error! Debe subir una imagen!",
      });
      return false;
    }

    const codeProd = await products.validateCode(code);
    if (codeProd) {
      response.status(400).send({
        status: "error",
        message: "Error! el código ingresado ya existe!",
      });
      return false;
    }

    const newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
    };
    newProduct.status = true;
    await products.addProduct(newProduct);
    response.status(200).send({
      newProduct,
      message: "el producto ha sido agregado correctamente",
    });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

// ACTUALIZAR PRODUCTOS
productsRouter.put("/:id", async (request, response) => {
  const { id } = request.params;

  const { title, description, price, thumbnail, code, stock, category } =
    request.body;

  try {
    const getProducts = await products.getProductsById(parseInt(id));
    if (!getProducts) {
      return response.status(404).send({
        status: "error",
        message: "Error! no se encontró el producto",
      });
    }

    if (
      !title ||
      !description ||
      !price ||
      !code ||
      !stock ||
      !category ||
      !thumbnail
    ) {
      response.status(400).send({
        status: "error",
        message: "Error! Se deben completar todos los campos obligatorios",
      });
      return false;
    }

    if (!Array.isArray(thumbnail) || thumbnail.length == 0) {
      response.status(400).send({
        status: "error",
        message: "Error! Debe subir una imagen!",
      });
      return false;
    }

    const actProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
    };
    actProduct.status = true;
    await products.updateProduct(parseInt(id), actProduct);
    response
      .status(200)
      .send({ actProduct, message: "el producto ha sido actualizado" });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

// ELIMINAR PRODUCTO
productsRouter.delete("/:id", async (request, response) => {
  const { id } = request.params;

  try {
    const getProducts = await products.getProductsById(parseInt(id));
    if (!getProducts) {
      return response.status(404).send({
        status: "error",
        message: "Error! no se encontró el producto",
      });
    }

    products.deleteProduct(parseInt(id));
    response
      .status(200)
      .send({ status: "ok", message: "el producto ha sido eliminado" });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

export default productsRouter;
