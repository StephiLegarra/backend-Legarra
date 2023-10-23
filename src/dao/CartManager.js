//Stephanie Legarra - Curso Backend - Comisión: 55305
import { cartModel } from "./models/cart.model.js";
import mongoose from "mongoose";
import ProductManager from "./ProductManager.js";

class CartManager {
  constructor() {
    this.productManager = new ProductManager();
  }

  // CREAR CARRITO
  async newCart() {
    try {
      let cart = await cartModel.create({ products: [] });
      console.log("Cart created:", cart);
      let id = cart._id;
      return {id};
    } catch (err) {
      console.log(err.message);
    }
  }

  // VER CARRITOS
  async getCarts() {
    try {
      return await cartModel.find().lean();
    } catch (err) {
      console.log(err.message);
    }
  }

  //VALIDAR ID
  validateId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  // BUSCAR CARRITO POR ID
  async getCartById(id) {
    try {
      if (this.validateId(id)){
        return (await cartModel.findOne({ _id: id }).lean());
      } else {
        console.log("no se encontró el carrito");
        return null;
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  // AGREGAR UN PRODUCTO AL CARRITO
  async addProductToCart(cid, pid, quantity) {
    try {
      console.log(`Agregar el producto ID: ${pid} al carrito: ${cid}`);

      if (
        mongoose.Types.ObjectId.isValid(cid) &&
        mongoose.Types.ObjectId.isValid(pid)
         ) {
        const product = await this.productManager.getProductById(pid);
        console.log("El stock del producto es: ", product.stock);
        
      if(!product) {
          console.log("Lo siento! ese producto no ha sido encontrado!");
          return {status: "error", message: "Lo siento! ese producto no ha sido encontrado!"};
        }

      if (product.stock < quantity) { 
          return { status: "error", message: "Lo siento! No hay suficientes unidades de este producto!" };
        }

      const updateResult = await cartModel.updateOne(
         { _id: cid, "products.product": pid },
         { $inc: { "products.$.quantity": 1 } }
        );
         console.log("Se agrego una unidad más del producto al carrito!", updateResult);

      if (updateResult.matchedCount === 0) {
          const pushResult = await cartModel.updateOne(
            { _id: cid },
            { $push: { products: { product: pid, quantity: 1 } } }
          );
          console.log("Productos agregados:", pushResult);
        }
        return {status: "ok", message: "El producto ha sido agregado al carrito"};
      } else {
        return {status: "error", message: "ID inválido!"};
       }
    } catch (err) {
      console.log(err.message);
    }
  }

  // ACTUALIZAR PRODUCTOS
  async updateProducts(cid, products) {
    try {
      await cartModel.updateOne(
        { _id: cid },
        { products: products },
        { new: true, upsert: true }
      );
      console.log("Product updated!");

      return true;
    } catch (err) {
      console.log(err.message);
    }
  }

  // MODIFICAR CANTIDAD DE EJEMPLARES
  async updateQuantityProductFromCart(cid, pid, quantity) {
    try {
      if (this.validateId(cid)) {
        const cart = await this.getCart(cid);
        if (!cart) {
          console.log("El carrito no fue encontrado!");
          return false;
        }

        console.log("PID:", pid);
        console.log("Cart products:",
          cart.products.map((item) =>
            item.product._id
              ? item.product._id.toString()
              : item.product.toString()
          )
        );

        const product = cart.products.find(
          (item) =>
            (item.product._id
              ? item.product._id.toString()
              : item.product.toString()) === pid.toString()
        );

        if (product) {
          product.quantity = quantity;
        await cartModel.updateOne({ _id: cid }, { products: cart.products });
          console.log("Se actualizo la cantidad de ejemplares del producto!");
          return true;
        } else {
          console.log("No ha sido podido actualizar la cantidad del producto en el carrito!");
          return false;
        }
      } else {
        console.log("No ha sido encontrado el producto en el carrito!");
        return false;
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  // ELIMINAR UN PRODUCTO DEL CARRITO
  async deleteProductFromCart(cid, pid) {
    try {
      if (mongoose.Types.ObjectId.isValid(cid)) {
        const updateResult = await cartModel.updateOne(
          { _id: cid },
          { $pull: { products: { product: pid } } }
        );

        if (updateResult.matchedCount > 0) {
          console.log("El producto ha sido eliminado!");
          return true;
        }
      } else {
        console.log("El producto en el carrito no ha sido encontrado");
        return false;
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  // VACIAR CARRITO
  async emptyCart(cid) {
    try {
      if (this.validateId(cid)) {
        const cart = await this.getCart(cid);
        await cartModel.updateOne({ _id: cid }, { products: [] });
        console.log("El carrito ha sido eliminado!");
        return true;
      } else {
        console.log("El carrito no ha sido encontrado");
        return false;
      }
    } catch (err) {
      console.log(err.message);
    }
  }
 
}

export default CartManager;
