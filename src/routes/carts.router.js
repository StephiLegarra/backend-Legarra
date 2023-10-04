import { Router } from "express";
import cartsControl from "../controllers/cart.controller.js";

const cartsRouter = Router();
const CM = new CartManager();
const PM = new ProductManager();

// CREAR CARRITO
cartsRouter.post("/", cartsControl.createNewCart.bind(cartsControl));
/*
cartsRouter.post("/", async (req, res) => {
  try {
    const newCart = await carts.newCart();
    res.status(200).send({ newCart, message: "El carrito ha sido creado" });
  } catch (error) {
    res.status(500).send({status: "error", message: "Error! No se pudo crear el Carrito!"});
  }
});
*/

//GET CARTS
cartsRouter.get("/", cartsControl.getCarts.bind(cartsControl))
/*
cartsRouter.get("/", async (req, res) => {
  try {
    const getCarts = await carts.getCarts();
    res.status(200).send(getCarts);
  } catch (error) {
    res.status(500).send({status: "error", message: "Error! No se ha encontrado ningun producto en ningun carrito!"});
  }
});
*/

// VER PRODUCTOS DEL CARRITO
cartsRouter.get("/:cid", cartsControl.getCartByID.bind(cartsControl));
/*
cartsRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const getCart = await carts.getCartById(parseInt(cid));
    if (!getCart) {
      return res.status(404).send({error: "El id del carrito no ha sido encontrado"});
    }
    res.status(200).send(getCart);
  } catch (error) {
    res.status(500).send({status: "error", message: "Error! No se han encontrado productos en el carrito!"});
  }
});
*/

// AGREGAR PRODUCTOS AL CARRITO
cartsRouter.post("/:cid/products/:pid", cartsControl.addProduct.bind(cartsControl));
/*
cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const products = new ProductManager();
    const getProduct = await products.getProductsById(parseInt(pid));
    const getCart = await carts.getCartById(parseInt(cid));

    if (!getCart) {
      return res.status(404).send({error: "El id del carrito no ha sido encontrado"});
    }

    if (!getProduct) {
      return res.status(404).send({error: "El id del producto no ha sido encontrado"});
    }

    await carts.addProductToCart(parseInt(cid), parseInt(pid));

    res.status(200).send({status: "ok", message: "El producto se agregó correctamente!"});
  } catch (error) {
    res.status(500).send({status: "error", message: "Error! No se pudo agregar el producto al carrito!"});
  }
});
*/

// ACTUALIZAR EL CARRITO CON UN ARRAY DE PRODUCTOS
cartsRouter.put("/:cid", cartsControl.newArrayCart.bind(cartsControl));
/*
cartsRouter.put("/:cid", async (req, res) => {
  const { body } = req;
  const { cid } = req.params;

  try {
    const getCart = carts.getCartById(parseInt(cid));

    if (!getCart) {
      return res.status(404).send({error: "El id del carrito no ha sido encontrado"});
    }
    console.log(body);
    body.forEach(async (item) => {
      const getProduct = await products.getProductsById(parseInt(item.id));
      if (!getProduct) {
        return res.status(404).send({error: "El id del producto no ha sido encontrado"});
      }
    });

    const newCart = await carts.addArrayProducts(parseInt(cid), body);
    res.status(200).send(newCart);
  } catch (error) {
    res.status(500).send({error: error.message});
  }
});
*/

//ACTUALIZAR CANTIDAD DE EJEMPLARES DEL PRODUCTO EN EL CARRITO
cartsRouter.put("/:cid/products/:pid", cartsControl.updateQuantity.bind(cartsControl));
/*
cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const products = new ProductManager();
    const getProduct = await products.getProductsById(parseInt(pid));
    const getCart = await carts.getCartById(parseInt(cid));

    if (!getCart) {
      return res.status(404).send({error: "El id del carrito no ha sido encontrado"});
    }

    if (!getProduct) {
      return res.status(404).send({error: "El id del producto no ha sido encontrado"});
    }

    await carts.updateQuantityProductFromCart(parseInt(cid),parseInt(pid),parseInt(quantity));

    res.status(200).send({status: "ok", message:"La cantidad de ejemplares del producto se actualizó correctamente!"});
  } catch (error) {
    res.status(500).send({status: "error", message: "Error! No se pudo actualizar el producto del carrito!"});
  }
});
*/

// ELIMINAR PRODUCTOS DEL CARRITO
cartsRouter.delete("/:cid/products/:pid", cartsControl.deleteThisProduct.bind(cartsControl));
/*
cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const products = new ProductManager();
    const getProduct = await products.getProductsById(parseInt(pid));
    const getCart = await carts.getCartById(parseInt(cid));

    if (!getCart) {
      return res.status(404).send({error: "El id del carrito no ha sido encontrado"});
    }

    if (!getProduct) {
      return res.status(404).send({error: "El id del producto no ha sido encontrado"});
    }

    await carts.deleteProductFromCart(parseInt(cid), parseInt(pid));

    res.status(200).send({status: "ok", message: "Se ha eliminado el producto del carrito correctamente!!"});
  } catch (error) {
    res.status(500).send({status: "error", message: "Error! No se pudo eliminar el producto del carrito!"});
  }
});
*/

// VACIAR CARRITO
cartsRouter.delete("/:cid", cartsControl.cleanCart.bind(cartsControl));
/*
cartsRouter.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const getCart = await carts.getCartById(parseInt(cid));

    if (!getCart) {
      return res.status(404).send({error: "El id del carrito no ha sido encontrado"});
    }

    await carts.emptyCart(parseInt(cid));

    res.status(200).send({status: "ok", message: "Se ha vaciado el carrito correctamente!!"});
  } catch (error) {
    res.status(500).send({status: "error", message: "Error! No se pudo vaciar el carrito!"});
  }
});
*/
export default cartsRouter;
