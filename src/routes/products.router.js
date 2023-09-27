import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";

const productsRouter = Router();
const products = new ProductManager();

// OBTENER PRODUCTOS
productsRouter.get("/", async (req, res) => {
  // const { limit, page, sort, query } = req.query;

  try {
    const getProducts = await products.getProducts(req.query);
    res.status(200).send({ getProducts });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// OBTENER PRODUCTO POR ID
productsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const getProducts = await products.getProductsById(parseInt(id));

    if (!getProducts) {
      return res.status(404).send({ error: "producto no encontrado" });
    }
    res.status(200).send({ getProducts });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// AGREGAR PRODUCTOS
productsRouter.post("/", async (req, res) => {
  const { title, description, price, thumbnail, code, stock, category } = req.body;

  try {
    if (!title || !description || !price || !code || !stock || !category || !thumbnail) {
      res.status(400).send({status: "error", message: "Error! Se deben completar todos los campos obligatorios"});
      return false;
    }

    if (!Array.isArray(thumbnail) || thumbnail.length == 0) {
      res.status(400).send({status: "error",message: "Error! Debe subir una imagen!"});
      return false;
    }

    const codeProd = await products.validateCode(code);
    if (codeProd) {res.status(400).send({status: "error", message: "Error! el código ingresado ya existe!"});
      return false;
    }

    const newProduct = {title,description,price,thumbnail,code,stock,category};
    newProduct.status = true;
    await products.addProduct(newProduct);
    res.status(200).send({newProduct, message: "el producto ha sido agregado correctamente"});
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// ACTUALIZAR PRODUCTOS
productsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;

  const { title, description, price, thumbnail, code, stock, category } = req.body;

  try {
    const getProducts = await products.getProductsById(parseInt(id));
    if (!getProducts) {
      return res.status(404).send({status: "error", message: "Error! no se encontró el producto"});
    }

    if (!title || !description || !price || !code || !stock || !category || !thumbnail) {
      res.status(400).send({status: "error", message: "Error! Se deben completar todos los campos obligatorios"});
      return false;
    }

    if (!Array.isArray(thumbnail) || thumbnail.length == 0) { res.status(400).send({status: "error",message: "Error! Debe subir una imagen!"});
      return false;
    }

    const actProduct = {title,description,price,thumbnail,code,stock,category};
    actProduct.status = true;
    await products.updateProduct(parseInt(id), actProduct);
    res.status(200).send({ actProduct, message: "el producto ha sido actualizado" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// ELIMINAR PRODUCTO
productsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const getProducts = await products.getProductsById(parseInt(id));
    if (!getProducts) {
      return res.status(404).send({status: "error", message: "Error! no se encontró el producto"});
    }

    products.deleteProduct(parseInt(id));
    res.status(200).send({ status: "ok", message: "el producto ha sido eliminado" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default productsRouter;
