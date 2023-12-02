import ProductsServices from "../services/products.service.js";
import {socketServer} from "../app.js"
import mongoose from "mongoose";
import CustomeError from "../services/errors/customeError.js";
import { productError } from "../services/errors/errorMessages/product.error.js";

class ProductController{
    constructor(){
        this.productServices = new ProductsServices();
    }
    
    //OBTENER PRODUCTOS
    async getProducts (req,res){
        try {
            const products = await this.productServices.getProducts(req.query);
            res.status(200).send(products);
        } catch (error) {
          const productErr = new CustomeError({
            name: "Product Fetch Error",
            message: "Error al obtener los productos",
            code:500,
            cause:error.message,
          });
          req.logger.error(productErr);
            res.status(500).send({status:"error", message: "Error al obtener productos"});
        }
    }
    
    //OBTENER PRODUCTO POR ID
    async getByID (req, res, next){
        try {
            const { pid } = req.params;
            if(!mongoose.Types.ObjectId.isValid(pid)){
              throw new CustomeError({
                name: "Invalid ID",
                message: "El ID no es correcto",
                code:400,
                cause: productError(pid),
              });
            }
            const product = await this.productServices.getByID(pid);
            if (!product) {
              throw new CustomeError({
                name: "Product not found",
                message: "El producto no pudo ser encontrado",
                code:404,
              });
              } 
              res.status(200).json({ status: "success", data: product });
        return;   
        } catch (error) {
            next(error)
        }
    }

    //AGREGAR PRODUCTOS
    async addProduct(req, res){
        let { title, description, code, price, status, stock, category, thumbnail } = req.body;

        try {
            const owner = req.user_id;

            if (!title || !description || !code || !price || !stock || !category || !thumbnail) {
                status = !status && true;
                res.status(400).send({status: "error", message: "Error! Se deben completar todos los campos obligatorios"});
                return false;
              }

          /*  if (!Array.isArray(thumbnail) || thumbnail.length == 0) {
                res.status(400).send({status: "error",message: "Error! Debe subir una imagen!"});
                return false;
              }
              */
              
              
              const AddProduct = await this.productServices.addProduct({title,description,code,price,stock,category,thumbnail,owner});
              
               if (AddProduct && AddProduct._id) {
                req.logger.info("Producto añadido correctamente:", AddProduct);
                res.status(200).send({
                  status: "ok",
                  message: "El Producto se agregó correctamente!",
                  productId: AddProduct._id,
                });
                socketServer.emit("product_created", {
                  _id: AddProduct._id,
                  title,
                  description,
                  code,
                  price,
                  stock,
                  category,
                  thumbnail,
                  owner
                });
                return;
               } else {
                req.logger.error("Error al añadir producto:", AddProduct);
                res.status(500).send({
                status: "error",
                message: "Error! No se pudo agregar el Producto!",
                });
                return;
               }      
        } catch (error) {
          req.logger.error("Error en addProduct:", error, "Stack:", error.stack);
            res.status(500).send({status: "error", message: "Error interno"});
        }
    }

    //ACTUALIZAR PRODUCTOS
    async updateProduct(req, res){
        const { pid } = req.params;
        const { title, description, price, thumbnail, code, stock, category } = req.body;
         
        try {
            const getProducts = await this.productServices.getByID(pid);
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
            await this.productServices.updateProduct(pid, actProduct);
            if (actProduct) {
              res.status(200).send({status: "ok", message: "El Producto se actualizó correctamente!"});
              socketServer.emit("product_updated");
            } else {
              res.status(404).send({status: "error", message: "Error! No se pudo actualizar el Producto!"});
            }
         } catch (error) {
          req.logger.error(error);
            res.status(500).send({status: "error", message: "Error Interno"});
         }
    }

    //ELIMINAR PRODUCTO
    async deleteProduct (req, res){
        const { pid } = req.params;
        try {
            if (!mongoose.Types.ObjectId.isValid(pid)) {
                req.logger.error("ID del producto no válido");
                res.status(400).send({status: "error", message: "ID del producto no válido"});
                return;
              }

            const getProducts = await this.productServices.getByID(pid);
            if (!getProducts) {
              return res.status(404).send({status: "error", message: "Error! no se encontró el producto"});
            }

            if (!req.user || (req.user.rol !== "admin" &&
                (!product.owner || req.user._id.toString() !== product.owner.toString()))
            ) {
              req.logger.error("Operación no permitida: el usuario no tiene permiso para eliminar este producto");
              res.status(403).send({status:"error", message: "No tiene permiso para eliminar este producto"});
              return;
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
            console.error(error);
            res.status(500).send({status: "error", message: "Error Interno"});
        }
    }
}

export default new ProductController();