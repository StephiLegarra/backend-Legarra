//import CartManager from "../dao/CartManager.js";
import {CartManager } from "../dao/factory.js";

class CartServices{
    constructor(){
       this.cartManager = new CartManager();
    }

    async createCart (){
        return await this.cartManager.newCart();
    }

    async allCarts() {
        return await this.cartManager.getCarts();
    }

    async getCart(id){
        return await this.cartManager.getCartById(id);
    }

    async addProduct(cid,pid){
        return await this.cartManager.addProductToCart(cid, pid);
    }

    async updateCart(cid,body) {
        const result = await this.cartManager.updateProducts(cartId, products);
        if (result) {
          return { status: "ok", message: "El carrito se actualizó correctamente" };
        } else {
          throw new Error("Error: No se pudo actualizar el carrito");
        }
    }

    async updateQuantity(cartId, productId, quantity){
        return await this.cartManager.updateQuantityProductFromCart(cartId, productId, quantity);
    };

    async deleteProduct(cartId, productId){
     //   return await this.cartManager.deleteProductFromCart(cartId,productId);
     const result = await this.cartManager.deleteProductFromCart(
        cartId,
        productId
      );
      if (result) {
        return { status: "ok", message: "El producto se eliminó correctamente" };
      } else {
        throw new Error("Error: No se pudo eliminar el producto del carrito");
      }
    };

    async cleanCart(cid){
      //  return await this.cartManager.emptyCart(cartId);
      const result = await this.cartManager.emptyCart(cartId);
      if (result) {
        return { status: "ok", message: "El carrito se vació correctamente!" };
      } else {
        throw new Error('Error! No se pudo vaciar el Carrito!');
      }
    };

}

export default CartServices;