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
    async getProducts(params){
        return await this.productManager.getProducts(params);
    }
    async getPbyID (id){
        return await this.productManager.getProductById(id);
    }
    async updateProd(id, product){
        return await this.productManager.updateProduct(id, product);
    }
    async deleteProd(id){
        return await this.productManager.deleteProduct(id);
    }
}

export default ProductsServices;