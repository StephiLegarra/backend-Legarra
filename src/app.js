const ProductManager = require("./ProductManager");

const express = require("express");
const app = express();
const puerto = 8080;

app.get("/products", async (request, response) => {
  const { limit } = request.query;

  try {
    const products = new ProductManager();
    await products.initialize();

    const getProducts = await products.getProductsGeneral();

    if (limit > 0 && limit < getProducts.length) {
      const limitProducts = getProducts.slice(0, limit);
      return response.status(200).send(limitProducts);
    }

    response.status(200).send(getProducts);
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});
app.get("/products/:pid", async (request, response) => {
  const { pid } = request.params;

  try {
    const products = new ProductManager();
    await products.initialize();

    const getProducts = await products.getProductsGeneral();
    const product = getProducts.find((item) => item.id === parseInt(pid));
    if (!product) {
      return response.status(404).send({ error: "producto no encontrado" });
    }
    response.status(200).send(product);
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

app.listen(puerto, () => {
  console.log(`Servidor inicializado en puerto ${puerto}`);
});
