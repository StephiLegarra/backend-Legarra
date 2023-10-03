import ProductsServices from "../services/products.service.js";
import { socketServer } from "../../app.js";

class ProductControl{
    constructor(){
        this.productServices = new ProductsServices();
    }
    async getProducts (req,res){
        try {
            const products = await this.productServices.getProducts(req.query);
            res.send(products);
        } catch (error) {
            res.status(500).send({status:"error", message: "Error al obtener productos"});
            console.log(error);
        }
    }
    async getByID (req, res){
        try {
            const pid =req.params.pid;
            console.log("Producto: ", pid);
            const product = await this.productServices.getPbyID(pid);
            if(product){
               res.json(product);
               return;

            }else{
               res.status(404).send({status:"error", message: "Producto no encontrado"});
               return;
            }

        } catch (error) {
            console.log("Error al encontrar producto por su ID", error);
            res.status(500).send({status:"error", message:"Error al buscar el producto por su ID"});
            return;
        }
    }
    async addProduct(req, res){
        let {title, description, code, price, status, stock, category, thumbnail} = req.body;
        console.log("Recived thumbnail: ", thumbnail);
        if(!title){
            res.status(400).send({status:"error", message:"Error no se cargo el campo Titulo"})
        }
        if(!description){
            res.status(400).send({status:"error", message:"Error no se cargo el campo Description"})
        }
        if(!code){
            res.status(400).send({status:"error", message:"Error no se cargo el campo Codigo"})
        }
        if(!price){
            res.status(400).send({status:"error", message:"Error no se cargo el campo Price"})
        }
        status = !status && true;
        if(!stock){
            res.status(400).send({status:"error", message:"Error no se cargo el campo Stock"})
        }
        if(!category){
            res.status(400).send({status:"error", message:"Error no se cargo el campo Category"})
        }
        if(!thumbnail){
            res.status(400).send({status:"error", message:"Error no se cargo el campo Thumbnail"})
        }
        try {
            const add = await this.productServices.addProduct({
                title, description, code, price, status, stock, category, thumbnail
            });
            if (add && add._id){
                console.log("Producto agregado correctamente: ", add);
                res.send({status:"ok", message: "Producto agregado correctamente"});
                socketServer.emit("addProduct", { 
                _id:add._id,
                title,
                description,
                stock,
                thumbnail,
                category,
                price,
                code});
                return;
            } else {
                console.log("Error al agregar el producto");
                res.status(500).send({status: "error", message: "No se pudo agregar el producto"});
                return;
            }
            
        } catch (error) {
            console.log("Error al agregar producto: " , error, "Stack: ", error.stack);
            res.status(500).send({status: "error", message: "Error Interno"});
            return;
        }
    }
    async updateProd(req, res){
         try {
            let {title, description, code, price, status, stock, category, thumbnail} = req.body;
            const pid = req.params.pid;
            const update = await this.productServices.updateProd(pid, {
                title, description, code, price, status, stock, category, thumbnail
            });
            if(update){
                res.send({status:"ok", message:"El producto se actualizo correctamente"});
            } else {
                res.status(500).send({status: "error", message: "No se pudo actualizar el producto"});
            }
         } catch (error) {
            console.log(error);
            res.status(500).send({status: "error", message: "Error Interno"});
         }
    }
    async deleteProd (req, res){
        try {
            const pid = req.params.pid;
            const deletedP = await this.productServices.deleteProd(pid);
            if(deletedP){
                res.send({status:"ok", message: "Producto eliminado con exito"});
                socketServer.emit("deleteProduct", {_id:pid});
            } else {
                res.status(500).send({status: "error", message: "No se pudo eliminar el producto"});
            }
        } catch (error) {
            res.status(500).send({status: "error", message: "Error Interno"});
        }
    }
}

export default new ProductControl();