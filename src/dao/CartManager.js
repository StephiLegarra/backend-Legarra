//Stephanie Legarra - Curso Backend - Comisión: 55305

import { cartModel } from "./models/cart.model.js";
import { productModel } from "./models/product.model.js";

class CartManager {
  constructor() {
    this.carts = [];
  }

  static id = 1;

  // CREAR CARRITO
  async newCart() {
    try {
      const carts = await cartModel.find();
      this.carts = carts;

      if (this.carts.length !== 0) {
        const max = Math.max(...this.carts.map((item) => item.id)) + 1;

        CartManager.id = max;
      }

      const newCart = {
        id: CartManager.id++,
        products: [],
      };

      await cartModel.create(newCart);
      console.log("El carrito ha sido creado");
      return newCart;
    } catch (err) {
      console.log(err.message);
    }
  }

  async getCart(id) {
    try {
      if (this.getCartById(id)) {
        return (await cartModel.findOne({ id: id }).lean()) || null;
      } else {
        console.log("No se encontró el carrito");
        return null;
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  async getCarts() {
    try {
      return await cartModel.find().lean();
    } catch (err) {
      console.log(err.message);
    }
  }

  // BUSCAR CARRITO POR ID
  async getCartById(id) {
    try {
      const cart = await cartModel.findOne({ id: id }).lean();
      if (!cart) {
        return console.log("no se encontró el carrito");
      }
      return cart;
    } catch (err) {
      console.log(err.message);
    }
  }

  // AGREGAR UN PRODUCTO AL CARRITO
  async addProductToCart(cid, pid) {
    try {
      const cart = await cartModel.findOne({ id: cid });
      const exist = cart.products.find((item) => item.id === pid);

      if (!exist) {
        const productAdd = { id: pid, quantity: 1 };
        await cartModel.updateOne(
          { id: cid },
          { $push: { products: productAdd } }
        );
        console.log("El producto ha sido agregado al carrito");
      } else {
        await cartModel.updateOne(
          { id: cid, "products.id": pid },
          { $inc: { "products.$.quantity": 1 } }
        );
        console.log("Se agrego una unidad más del producto al carrito");
      }
      return true;
    } catch (err) {
      console.log(err.message);
    }
  }

  // ACTUALIZAR EL CARRITO CON UN ARRAY DE PRODUCTOS
  async addArrayProducts(cid, body) {
    try {
      const array = [];
      for (const item of body) {
        const object = await products.getCartById(item.id);
        array.push({
          id: item.id,
          quantity: item.quantity,
          product: object._id,
        });
      }
      console.log(array);
      const filter = { id: cid };
      const update = { $set: { products: array } };

      const updateCart = await cartModel.findOneAndUpdate(filter, update, {
        new: true,
      });
      return updateCart;
    } catch (err) {
      console.log(err.message);
    }
  }

  // MODIFICAR CANTIDAD DE EJEMPLARES
  async updateQuantityProductFromCart(cid, pid, quantity) {
    try {
      const cart = await cartModel.findOne({ id: cid });
      const exist = cart.products.find((item) => item.id === pid);
      exist.quantity = quantity;

      if (exist) {
        await cartModel.updateOne({ id: cid }, { products: cart.products });
        console.log("Se actualizo la cantidad de ejemplares del producto");
      } else {
        console.log("No ha sigo encontrado el producto en el carrito");
      }
      return true;
    } catch (err) {
      console.log(err.message);
    }
  }

  // ELIMINAR UN PRODUCTO DEL CARRITO
  async deleteProductFromCart(cid, pid) {
    try {
      const cart = await cartModel.findOne({ id: cid });
      const exist = cart.products.filter((item) => item.id !== pid);

      if (exist) {
        await cartModel.updateOne({ id: cid }, { products: exist });
        console.log("El producto ha sido eliminado!");
        return true;
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
      const cart = await cartModel.findOne({ id: cid });

      if (cart) {
        await cartModel.updateOne({ id: cid }, { products: [] });
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
