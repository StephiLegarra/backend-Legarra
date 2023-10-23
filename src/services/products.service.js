import {ProductManager} from "../dao/factory.js";

class ProductsServices{
    constructor(){
        this.productManager = new ProductManager();
    }

    async addProduct(product){
        return await this.productManager.addProduct(product);
    }

    async getProducts(params){
        return await this.productManager.getProducts(params);
    }

    async getPbyID (id){
        return await this.productManager.getProductsById(id);
    }

    async updateProduct(id, product){
        return await this.productManager.updateProduct(id, product);
    }

    async deleteProduct(id){
        return await this.productManager.deleteProduct(id);
    }

}

export default ProductsServices;