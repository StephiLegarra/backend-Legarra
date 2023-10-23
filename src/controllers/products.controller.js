import ProductsServices from "../services/products.service.js";

class ProductController{
    constructor(){
        this.productServices = new ProductsServices();
    }
    
    //OBTENER PRODUCTOS
    async getProducts (req,res){
        try {
            const products = await this.productServices.getProducts(req.query);
            res.status(200).send({ products })
            const userSession = req.session.email;
            const userSessionisAdmin = req.session.isAdmin;
            const cart = req.session.cart;
            return res.status(200).render('products', {products, userSession, userSessionisAdmin, cart});
        } catch (error) {
            res.status(500).send({status:"error", message: "Error al obtener productos"});
        }
    }
    
    //OBTENER PRODUCTO POR ID
    async getByID (req, res){
        try {
            const { pid } = req.params;
            const product = await this.productServices.getPbyID(pid);
            if (product) {
                res.json(product);
                return;
              } else {
                res.status(404).send({ status: "error", message: "El producto no fue encontrado!" });
                return;
              }
        } catch (error) {
            res.status(500).send({status:"error", message:"Error al buscar el producto por su ID"});
            return;
        }
    }

    //AGREGAR PRODUCTOS
    async addProduct(req, res){
        const { title, description, price, thumbnail, code, stock, category } = req.body;
      
        try {
            if (!title || !description || !price || !code || !stock || !category || !thumbnail) {
                res.status(400).send({status: "error", message: "Error! Se deben completar todos los campos obligatorios"});
                return false;
              }
          
              if (!Array.isArray(thumbnail) || thumbnail.length == 0) {
                res.status(400).send({status: "error",message: "Error! Debe subir una imagen!"});
                return false;
              }

              const product = {title,description,price,thumbnail,code,stock,category};
               product.status = true;
               await this.productServices.addProduct(product);
               res.status(200).send({product, message: "el producto ha sido agregado correctamente"});
        } catch (error) {
            res.status(500).send({status: "error", message: "Error interno"});
        }
    }

    //ACTUALIZAR PRODUCTOS
    async updateProduct(req, res){
        const { pid } = req.params;
        const { title, description, price, thumbnail, code, stock, category } = req.body;
         
        try {
            const getProducts = await this.productServices.getPbyID(pid);
            if (!getProducts) {
              return res.status(404).send({status: "error", message: "Error! no se encontró el producto"});
            }
        
            if (!title || !description || !price || !code || !stock || !category || !thumbnail) {
              res.status(400).send({status: "error", message: "Error! Se deben completar todos los campos obligatorios"});
              return false;
            }
        
            if (!Array.isArray(thumbnail) || thumbnail.length == 0) { res.status(400).send({status: "error",message: "Error! Debe subir una imagen!"});
              return false;
            }
        
            const actProduct = {title,description,price,thumbnail,code,stock,category};
            actProduct.status = true;
            await this.productServices.updateProduct(parseInt(id), actProduct);
            res.status(200).send({ actProduct, message: "el producto ha sido actualizado" });     
         } catch (error) {
            console.log(error);
            res.status(500).send({status: "error", message: "Error Interno"});
         }
    }

    //ELIMINAR PRODUCTO
    async deleteProduct (req, res){
        const { pid } = req.params;
        try {
            if (!mongoose.Types.ObjectId.isValid(pid)) {
                console.log("ID del producto no válido");
                res.status(400).send({status: "error", message: "ID del producto no válido"});
                return;
              }
            const getProducts = await this.productServices.getPbyID(pid);
            if (!getProducts) {
              return res.status(404).send({status: "error", message: "Error! no se encontró el producto"});
            }
          const deleted = await this.productServices.deleteProduct(pid);
          if(deleted) {
            console.log("El producto fue eliminado correctamente!");
             res.status(200).send({ status: "ok", message: "el producto ha sido eliminado" });
             socketServer.emit("product_deleted", { _id: pid });
          } else {
            console.log("Error al intentar eliminar el producto");
            res.status(500).send({status: "error", message: "Error eliminando el producto"});
          }
        } catch (error) {
            res.status(500).send({status: "error", message: "Error Interno"});
        }
    }
}

export default new ProductController();