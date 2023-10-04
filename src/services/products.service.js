import ProductManager from "../dao/ProductManager.js";

class ProductsServices{
    constructor(){
        this.productManager = new ProductManager();
    }

    async addProduct(product){
        if(await this.productManager.validateCode(product.code)){
            console.log("Error codigo ya existente");
            return null;
        }
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
}

export default ProductsServices;