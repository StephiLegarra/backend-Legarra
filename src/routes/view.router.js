import express from "express";
import ProductManager from "../dao/ProductManager.js";

const router = express.Router();
const products = new ProductManager();

router.get("/", async (request, response) => {
  try {
    const getProducts = await products.getProducts();
    response.render("home", { getProducts });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

router.get("/realtimeproducts", async (request, response) => {
  try {
    const getProducts = await products.getProducts();
    response.render("realtimeproducts", { getProducts });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

router.get("/chat", async (request, response) => {
  try {
    response.render("chat");
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

export default router;
