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

    async updateCart(cartId, products) {
      return await this.cartManager.updateProducts(cartId, products);
    }

    async updateQuantity(cartId, productId, quantity){
        return await this.cartManager.updateQuantityProductFromCart(cartId, productId, quantity);
    };

    async deleteProduct(cartId, productId){
    return await this.cartManager.deleteProductFromCart(cartId,productId);
    };

    async cleanCart(cartId){
      return await this.cartManager.emptyCart(cartId);
    };


}

export default CartServices;