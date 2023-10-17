import CartServices from "../services/cart.service.js";
import ProductsServices from "../services/products.service.js";

class CartsControl {
    constructor(){
        this.cartServices = new CartServices();
        this.productsServices = new ProductsServices();
    }

    //CREAR CARRITO
    async createNewCart(req, res){
        try {
            const newCart = await this.cartServices.createNewCart();
            res.status(200).send({ newCart, message: "El carrito ha sido creado" }); 
        } catch (error) {
            res.status(500).send({status: "error", message: "Error! No se pudo crear el Carrito!"});
        }
    }

    //VER CARRITO
    async getCarts(req, res){
        try {
            const getCarts = await this.cartServices.getCarts();
            res.status(200).send(getCarts);
        } catch (error) {
            res.status(500).send({status: "error", message: "Error! No se ha encontrado ningun producto en ningun carrito!"});
        }
    }

     //VER PRODUCTOS DEL CARRITO
    async getCartByID(req,res){
        const { cid } = req.params;
        try {
            const getCart = await this.cartServices.getByID(parseInt(cid));
            if (!getCart) {
              return res.status(404).send({error: "El id del carrito no ha sido encontrado"});
            }
            res.status(200).send(getCart);
          } catch (error) {
            res.status(500).send({status: "error", message: "Error! No se han encontrado productos en el carrito!"});
          }
    }

      //AGREGAR PRODUCTOS AL CARRITO
    async addProduct(req,res){
        const { cid, pid } = req.params;
        try {
            const getProduct = await this.productsServices.getPbyID(parseInt(pid));
            const getCart = await this.cartServices.getByID(parseInt(cid));
        
            if (!getCart) {
              return res.status(404).send({error: "El id del carrito no ha sido encontrado"});
            }
        
            if (!getProduct) {
              return res.status(404).send({error: "El id del producto no ha sido encontrado"});
            }
        
            await this.cartServices.addNewProduct(parseInt(cid), parseInt(pid));
            res.status(200).send({status: "ok", message: "El producto se agregó correctamente!"});
        } catch (error) {
            res.status(500).send({status: "error", message: "Error! No se pudo agregar el producto al carrito!"});
        }
    }

    //ACTUALIZAR EL CARRITO CON UN ARRAY DE PRODCUTOS
    async newArrayCart(req,res){
        const { body } = req;
        const { cid } = req.params;
        try {
            const getCart = this.cartServices.getByID(parseInt(cid));

            if (!getCart) {
                return res.status(404).send({error: "El id del carrito no ha sido encontrado"});
              }
              console.log(body);
              body.forEach(async (item) => {
                const getProduct = await this.productsServices.getPbyID(parseInt(item.id));
                if (!getProduct) {
                  return res.status(404).send({error: "El id del producto no ha sido encontrado"});
                }
              });
              const newCart = await this.cartServices.addArrayProducts(parseInt(cid), body);
              res.status(200).send({status:"ok", message: "Se ha pisado el carrito con nuevos productos exitosamente!"});
        } catch (error) {
            res.status(500).send({status:"error", message: "Error! No se pudo modificar el carrito!"});
        }
    }

    //ACTUALIZAR CANTIDAD DE EJEMPLARES DEL PRODUCTO EN EL CARRITO
    async updateQuantity(req,res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
      try {
        const getProduct = await this.productsServices.getPbyID(parseInt(pid));
        const getCart = await this.cartServices.getByID(parseInt(cid));
    
        if (!getCart) {
          return res.status(404).send({error: "El id del carrito no ha sido encontrado"});
        }
    
        if (!getProduct) {
          return res.status(404).send({error: "El id del producto no ha sido encontrado"});
        }
    
        await this.cartServices.updateQuantity(parseInt(cid),parseInt(pid),parseInt(quantity));
    
        res.status(200).send({status: "ok", message:"La cantidad de ejemplares del producto se actualizó correctamente!"});
      } catch (error) {
        res.status(500).send({status: "error", message: "Error! No se pudo actualizar la cantidad del producto en el carrito!"});
      }
    }

    //ELIMINAR PRODUCTOS DEL CARRITO
    async deleteThisProduct(req,res){
        const { cid, pid } = req.params;
        try {
            const getProduct = await this.productsServices.getPbyID(parseInt(pid));
            const getCart = await this.cartServices.getByID(parseInt(cid));
        
            if (!getCart) {
              return res.status(404).send({error: "El id del carrito no ha sido encontrado"});
            }
        
            if (!getProduct) {
              return res.status(404).send({error: "El id del producto no ha sido encontrado"});
            }
        
            await this.cartServices.deleteProduct(parseInt(cid), parseInt(pid));
            res.status(200).send({status: "ok", message: "Se ha eliminado el producto del carrito correctamente!!"});
        } catch (error) {
          res.status(500).send({status:"error", message: "Error! No se pudo eliminar el producto del carrito"});
        }
    }

    //VACIAR CARRITO
    async cleanCart(req,res){
        const { cid } = req.params;
        try {
            const getCart = await this.cartServices.getByID(parseInt(cid));

            if (!getCart) {
              return res.status(404).send({error: "El id del carrito no ha sido encontrado"});
            }
        
            await this.cartServices.cleanCart(parseInt(cid));
            res.status(200).send({status: "ok", message: "Se ha vaciado el carrito correctamente!!"});
        } catch (error) {
            res.status(500).send({status: "error", message: "Error! No se pudo vaciar el carrito!"});
        }
    }

    async purchaseTicket (req, res){
      try {
        if (!req.user || !req.user.id) {
          console.error("req.user no está definido");
          return res.status(400).json({ error: "Usuario no definido" });
        }
  
        const cart = await this.cartServices.getByID(req.params.cid);
  
        if (!cart) {
          return res.status(404).json({ error: "Carrito no encontrado" });
        }
  
        console.log("Productos en el carrito:", cart.products);
  
        const productManager = new ProductManager();
        const failedProducts = [];
        const successfulProducts = [];
  
        for (const item of cart.products) {
          const product = await productManager.getProductById(item.product);
  
          if (!product) {
            console.error(`Producto ${item.product} no encontrado`);
            failedProducts.push(item);
            continue;
          }
  
          if (product.stock < item.quantity) {
            console.error(
              `Stock insuficiente para el producto ${JSON.stringify(
                item.product
              )}`
            );
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
          return res.status(400).json({
            error: "No se pudo comprar ningun producto",
            failedProducts,
          });
        }
  
        const totalAmount = successfulProducts.reduce((total, product) => {
          return total + product.product.price * product.quantity;
        }, 0);
  
        console.log("Total Amount calculado:", totalAmount);
  
        const ticketData = {
          code: uuidv4(),
          purchase_datetime: new Date(),
          amount: totalAmount,
          purchaser: req.user.email,
        };
  
        console.log("Ticket Data justo antes de crear el ticket:", ticketData);
        const ticketCreated = await createTicket({
          body: ticketData,
        });
        console.log("Ticket Creado:", ticketCreated);
  
        res.json({
          status: "success",
          message: "Compra realizada con éxito",
          ticket: ticketCreated,
          failedProducts: failedProducts.length > 0 ? failedProducts : undefined,
        });
      } catch (error) {
        console.error("Error específico al crear el ticket de compra:", error);
        res.status(500).json({ error: "Error al crear el ticket de compra" });
      }
  }

    //PURCHASE
    async getPurchase(req, res){
      const { cid } = req.params;
      try {
          const compra = await this.cartServices.getByID(parseInt(cid));
          if(compra){
          res.json({status:"success", data: compra})
          } else {
              res.status(404).json({status: "error", message: "Compra no encontrada!"})
          }
      } catch (error) {
          console.error(error);
          res.status(500).json({status: "error", message: "Error! No se pudo procesar la compra!"})
      }
  }


}

export default new CartsControl();