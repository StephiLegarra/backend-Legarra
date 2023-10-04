import ProductsServices from "../services/products.service.js";

class ProductControl{
    constructor(){
        this.productServices = new ProductsServices();
    }
    
    //OBTENER PRODUCTOS
    async getProducts (req,res){
        try {
            const getProducts = await this.productServices.getProducts(req.query);
            res.status(200).send({ getProducts })
        } catch (error) {
            res.status(500).send({status:"error", message: "Error al obtener productos"});
        }
    }
    
    //OBTENER PRODUCTO POR ID
    async getByID (req, res){
        try {
            const { id } = req.params;
            const getProducts = await this.productServices.getProductsById(parseInt(id));

           if (!getProducts) {
           return res.status(404).send({ error: "producto no encontrado" });
           }
            res.status(200).send({ getProducts });

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

              const codeProd = await products.validateCode(code);
                if (codeProd) {res.status(400).send({status: "error", message: "Error! el código ingresado ya existe!"});
                 return false;
              }

              const newProduct = {title,description,price,thumbnail,code,stock,category};
               newProduct.status = true;
               await this.productServices.addProduct(newProduct);
               res.status(200).send({newProduct, message: "el producto ha sido agregado correctamente"});
           
        } catch (error) {
            res.status(500).send({status: "error", message: "Error Interno"});
        }
    }

    //ACTUALIZAR PRODUCTOS
    async updateProd(req, res){
        const { id } = req.params;
        const { title, description, price, thumbnail, code, stock, category } = req.body;
         
        try {
            const getProducts = await this.productServices.getProductsById(parseInt(id));
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
    async deleteProd (req, res){
        const { id } = req.params;
        try {
            const getProducts = await this.productServices.getProductsById(parseInt(id));
            if (!getProducts) {
              return res.status(404).send({status: "error", message: "Error! no se encontró el producto"});
            }
        
            products.deleteProduct(parseInt(id));
            res.status(200).send({ status: "ok", message: "el producto ha sido eliminado" });
        } catch (error) {
            res.status(500).send({status: "error", message: "Error Interno"});
        }
    }
}

export default new ProductControl();