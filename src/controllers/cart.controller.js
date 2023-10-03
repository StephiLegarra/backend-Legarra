import CartServices from "../services/cart.service.js";

class CartsControl {
    constructor(){
        this.cartServices = new CartServices();
    }
    async createNewCart(req, res){
        try {
            const newCart = await this.cartServices.creatNewCart();
            res.send(newCart);
        } catch (error) {
            res.status(500).send({status:"error", message:error.message});
        }
    }
    async getThisCart(req, res){
        try {
            const carrito = await this.cartServices.getByID(req.params.cid);
            res.send({products:carrito.products});
        } catch (error) {
            res.status(400).send({status:"error", message: error.message});
        }
    }
    async addProduct(req,res){
        try {
            const{cid,pid}= req.params;
            const resultado = await this.cartServices.addNewProduct(cid, pid);
            res.send(resultado);
        } catch (error) {
            res.status(400).send({status:"error", message: error.message});
        }
    }
    async updateQuantity(req,res){
        try {
            const{cid,pid}= req.params;
            const quantity = req.body.quantity;
            const result = await this.cartServices.updateQuantityProductFromCart(cid, pid, quantity);
            res.send(result);
        } catch (error) {
            res.status(400).send({status:"error", message: error.message});
        }
    }
    async deleteThisProduct(req,res){
        try {
            const{cid,pid}= req.params;
            const result = await this.cartServices.deleteProduct(cid, pid);
            res.send(result);
        } catch (error) {
            res.status(400).send({status:"error", message: error.message});
        }
    }
    async cleanCart(req,res){
        try {
            const cid = req.params.cid;
            const result = await this.cartServices.cleanCart(cid);
            res.send(result);          
        } catch (error) {
            res.status(400).send({status:"error", message: error.message});
        }
    }
}

export default new CartsControl();