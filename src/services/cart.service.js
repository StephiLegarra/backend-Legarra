import CartManager from "../dao/CartManager.js";

class CartServices{
    constructor(){
       this.cartManager = new CartManager();
    }

    async createNewCart (){
        return await this.cartManager.newCart();
    }

    async getCarts() {
        return await this.cartManager.getCarts();
    }

    async getByID(id){
        return await this.cartManager.getCartById(id);
    }

    async addNewProduct(cid,pid){
        return await this.cartManager.addProductToCart(cid,pid);
    }

    async addArrayProducts(cid,body) {
        return await this.cartManager.addArrayProducts(cid, body);
    }

    async updateQuantity(cid, pid, quantity){
        return await this.cartManager.updateQuantityProductFromCart(cid, pid, quantity);
    };

    async deleteProduct(cid, pid){
        return await this.cartManager.deleteProductFromCart(cid,pid);
    };

    async cleanCart(cid){
        return await this.cartManager.emptyCart(cid);
    };

}

export default CartServices;