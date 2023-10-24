import CartServices from "../services/cart.service.js";
import { cartModel } from "../dao/models/cart.model.js";
import ProductManager from "../dao/ProductManager.js";
import { v4 as uuidv4 } from "uuid";
import ticketController from "./ticket.controller.js";

class CartController {
    constructor(){
        this.cartServices = new CartServices();
    }

    //CREAR CARRITO
    async createCart(req, res){
        try {
            const newCart = await this.cartServices.createCart();
            res.status(200).send(newCart); 
        } catch (error) {
            res.status(500).send({status: "error", message: error.message});
        }
    }

    //VER CARRITOS
    async allCarts(req, res){
        try {
            const getCarts = await this.cartServices.allCarts();
            res.status(200).send(getCarts);
        } catch (error) {
            res.status(500).send({status: "error", message: error.message});
        }
    }

     //VER CARRITO
    async getCart(req,res){
        try {
            const cart = await this.cartServices.getCart(req.params.cid);
            if (!cart) {
              return res.status(404).send({error: "Error! No se han encontrado productos en el carrito!"});
            }
            res.status(200).send({ products: cart.products });
          } catch (error) {
            res.status(500).send({status: "error", message: error.message});
          }
    }

      //AGREGAR PRODUCTOS AL CARRITO
    async addProduct(req,res){
        try {
            const { cid, pid } = req.params;
            const result = await this.cartServices.addProduct(cid,pid);
            if (!result) {
              return res.status(404).send({error: "Error! No se pudo agregar el producto al carrito!"});
            }
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({status: "error", message: error.message});
        }
    }

    //ACTUALIZAR EL CARRITO 
    async updateCart(req,res){
        try {
            const { cid } = req.params;
            const products = req.body.products;
            const result = await this.cartService.updateCart(cid, products);
            if (result) {
               res.status(200).send({status: "ok",message: "El producto se agregó correctamente!"});
            } else {
               res.status(404).send("Error: No se pudo actualizar el carrito!");
            }
            } catch (error) {
            res.status(500).send({status:"error", message: error.message});
        }
    }

    //ACTUALIZAR CANTIDAD DE EJEMPLARES DEL PRODUCTO EN EL CARRITO
    async updateQuantity(req,res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
      try {
        const result = await this.cartServices.updateQuantity(cid,pid,quantity);
        if (!result) {
          return res.status(404).send({error: "Error! No se pudo actualizar la cantidad del producto en el carrito!"});
        }
        res.status(200).send(result);
      } catch (error) {
        res.status(500).send({status: "error", message: error.message});
      }
    }

    //ELIMINAR PRODUCTOS DEL CARRITO
    async deleteProduct(req,res){
        try {
           const { cid, pid } = req.params;
           const result = await this.cartService.deleteProduct(cid, pid);
           res.status(200).send(result);
        } catch (error) {
           res.status(500).send({status:"error", message: error.message});
        }
    }

    //VACIAR CARRITO
    async cleanCart(req,res){ 
        try {
            const { cid } = req.params;
            const result = await this.cartServices.cleanCart(cid);
            res.status(200).send(result); 
        } catch (error) {
            res.status(500).send({status: "error", message: error.message});
        }
    }
   
    //CREAR TICKET DE COMPRA
    async createPurchaseTicket(req, res) {
      try {
        if (!req.user || !req.user.id) {
          console.error("req.user no está definido");
          return res.status(400).json({ error: "El usuario no está definido" });
        }
  
        const cart = await this.cartService.getCart(req.params.cid);
  
        if (!cart) {
          return res.status(404).json({ error: "El carrito no pudo ser encontrado!" });
        }
  
        console.log("Productos en el carrito:", cart.products);
  
        const productManager = new ProductManager();
        const failedProducts = [];
        const successfulProducts = [];
  
        for (const item of cart.products) {
          const product = await productManager.getProductsById(item.product);
  
          if (!product) {
            console.error(`Producto ${item.product} no encontrado`);
            failedProducts.push(item);
            continue;
          }
  
          if (product.stock < item.quantity) {
            console.error(`Stock insuficiente para el producto ${JSON.stringify(item.product)}`);
            failedProducts.push(item);
          } else {
            successfulProducts.push(item);
            const newStock = product.stock - item.quantity;
            await productManager.updateProduct(item.product, { stock: newStock });
          }
        }
  
        await cartModel.updateOne(
          { _id: req.params.cid },
          { products: failedProducts }
        );
  
        if (successfulProducts.length === 0) {
          return res.status(400).json({error: "No se pudo comprar ningun producto",failedProducts});
        }
  
        const totalAmount = successfulProducts.reduce((total, product) => {
          return total + product.product.price * product.quantity;
        }, 0);
  
        const ticketData = {
          code: uuidv4(),
          purchase_datetime: new Date(),
          amount: totalAmount,
          purchaser: req.user.email,
        };
  
        const ticketCreated = await ticketController.createTicket({body: ticketData});
        res.json({
          status: "success",
          message: "Compra realizada con éxito",
          ticket: ticketCreated,
          failedProducts: failedProducts.length > 0 ? failedProducts : undefined,
        });
      } catch (error) {
        console.error("Error al crear el ticket de compra:", error);
        res.status(500).json({ error: "Error al crear el ticket de compra" });
      }
    }
  
    //VER COMPRA
    async getPurchase(req, res) {
      try {
        const cid = req.params.cid;
        const purchase = await this.cartService.getCart(cid);
  
        if (purchase) {
          res.json({ status: "success", data: purchase });
        } else {
          res.status(404).json({ status: "error", message: "Compra no encontrada" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
      }
    }
}

export default new CartController();