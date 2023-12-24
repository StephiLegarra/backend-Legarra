import CartServices from "../services/cart.service.js";
import ProductManager from "../dao/ProductManager.js";
import { v4 as uuidv4 } from "uuid";
import ticketController from "./ticket.controller.js";
import { ADMIN_USER } from "../config/config.js";
import { transporter } from "./email.controller.js";

class CartController {
    constructor(){
        this.cartServices = new CartServices();
        this.productManager = new ProductManager();
    }

    //CREAR CARRITO
    async createCart(req, res){
        try {
            const newCart = await this.cartServices.createCart();
            res.status(200).json({
              status: "success",
              message: "El carrito fue creado correctamente",
              cartId: newCart._id, 
              payload: newCart,
            });
            req.logger.info("Carrito creado: ", newCart)
        } catch (error) {
            res.status(500).send({status: "error", message: error.message});
            req.logger.error("Error al crear el carrito: ", error);
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
            res.status(200).json({status: "success",cart: cart});
            req.logger.info("Carrito obtenido: ", cart)
          } catch (error) {
            res.status(500).send({status: "error", message: error.message});
            req.logger.error("Error al obtener el carrito: ", error)
          }
    }

    //TRAER CARRITO POR ID
    async getCartByID(cartId){
      try {
        const cart = await this.cartServices.getCart(cartId);
        if (!cart) {
          throw new Error("El carrito no fue encontrado!")
        };
        return cart;
      } catch (error) {
        console.error('Error obteniendo el carrito', cart);
        throw error;
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
            const result = await this.cartServices.updateCart(cid, products);
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
           const result = await this.cartServices.deleteProduct(cid, pid);
           res.send(result);
        } catch (error) {
          console.error(error);
        }
    }

    //VACIAR CARRITO
    async cleanCart(req,res){ 
        try {
            const { cid } = req.params;
            const result = await this.cartServices.cleanCart(cid);
            res.send(result); 
        } catch (error) {
          console.error(error);
        }
    }
   
    //CREAR TICKET DE COMPRA
    async createPurchaseTicket(cartId, userEmail){
      try {
        const cart = await this.cartServices.getCart(cartId);
  
        if (!cart) {
          return res.status(404).json({ error: "El carrito no pudo ser encontrado!" });
        }
  
        console.log("Productos en el carrito:", cart.products);
  
        const failedProducts = [];
        const successfulProducts = [];
  
        for (const item of cart.products) {
          const product = await this.productManager.getProductsById(item.product);
  
          if (!product) {
            console.error(`Producto ${item.product} no encontrado`);
            failedProducts.push(item);
            continue;
          }
  
          if (product.stock < item.quantity) {
            req.logger.error(`Stock insuficiente para el producto: ${JSON.stringify(item.product)}`);
            failedProducts.push(item);
          } else {
            successfulProducts.push(item);
            const newStock = product.stock - item.quantity;
            await this.productManager.updateProduct(item.product, { stock: newStock });
          }
        }
  
        if (successfulProducts.length === 0) {
          throw new Error("No se pudo comprar ningun producto");
        }
      
          const totalAmount = successfulProducts.reduce((total, item) => {
          const precioDelProducto = item.product.price;
          const cantidadP = item.quantity;
          if(typeof precioDelProducto !== "number" ||typeof cantidadP !== "number"){
            console.error("Error en cantidad o precio para: ", item.product);
            return total;
          }
          return total + precioDelProducto * cantidadP;
        }, 0);
        if(isNaN(totalAmount)){
          throw new Error("Error al calcular el monto total")
        }
  
        const ticketData = {
          code: uuidv4(),
          purchase_datetime: new Date(),
          amount: totalAmount,
          purchaser: userEmail,
        };
  
        const ticketCreated = await ticketController.createTicket(ticketData);
        const ticketCode = ticketData.code;
        console.log(ticketCode);
        const ticketOwner = ticketData.purchaser;
        console.log(ticketOwner);
     
      if (ticketCode) {
        console.log("Enviando aviso a owner: ", ticketOwner);
        const email = ticketOwner;

        const result = transporter.sendMail({
          from: ADMIN_USER,
          to: email,
          subject: `Ya emitimos tu ticket por la compra en Pokeshop`,
          html: `
          <p>Hola! Muchas gracias por tu compra en pokeshop! A continuación te brindamos tu ticket!</p>
          <br>
          <p>Esperamos volver a verte por nuestro sitio! Muchas gracias!</p>
          <br>
          <h2>Los datos de tu ticket de compra son: </h2>
          <br>
          <div style="display: flex; flex-direction: column; align-items: center">
          Monto: $\n${ticketData.amount}\n <br>
          Nro del ticket: \n${ticketData.code}\n <br>
          Hora de la compra: \n${ticketData.purchase_datetime}\n <br>
          </div>
          <br>
          <p>Ante cualquier problema, comunicate con nosotros, no contestes este mensaje porque es un email automático</p>
          `,
        });
      }
    await this.deleteProduct(cartId);
    return {success:true, ticketId: ticketCreated._id};
      } catch (error) {
        console.error("Error al crear el ticket de compra: ", error);
        throw new Error ("Error al crear el ticket de compra");
      }
    }
  
    //VER COMPRA
    async getPurchase(req, res) {
      try {
        const cid = req.params.cid;
        const purchase = await this.cartServices.getCart(cid);
  
        if (purchase) {
          res.json({ status: "success", data: purchase });
        } else {
          res.status(404).json({ status: "error", message: "La compra no pudo ser encontrada" });
        }
      } catch (error) {
        req.logger.error(error);
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
      }
    }
}

export default new CartController();