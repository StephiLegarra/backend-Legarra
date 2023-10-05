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
}

export default new CartsControl();