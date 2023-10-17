import {ProductManager} from "../dao/factory.js";

class ProductsServices{
    constructor(){
        this.productManager = new ProductManager();
    }

    async addProduct(product){
        return await this.productManager.addProduct(product);
    }

    async getProducts(obj){
        return await this.productManager.getProducts(obj);
    }

    async getPbyID (id){
        return await this.productManager.getProductsById(id);
    }

    async updateProd(id, product){
        return await this.productManager.updateProduct(id, product);
    }

    async deleteProd(id){
        return await this.productManager.deleteProduct(id);
    }

    async validateStock(id, quantity){
        return await this.productManager.validateStock(id, quantity);
    }
}

export default ProductsServices;