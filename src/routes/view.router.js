import express from "express";
import ProductManager from "../ProductManager.js";
const router = express.Router();

router.get("/", async (request, response) => {
  try {
    const products = new ProductManager();
    await products.initialize();

    const getProducts = await products.getProductsGeneral();
    response.render("home", {
      title: "Listado de productos - handlebars",
      products: getProducts,
    });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

router.get("/realtimeproducts", async (request, response) => {
  try {
    const products = new ProductManager();
    await products.initialize();

    const getProducts = await products.getProductsGeneral();
    response.render("realtimeproducts", {
      title: "Listado de productos - handlebars",
      products: getProducts,
    });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

export default router;
