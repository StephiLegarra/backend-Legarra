import { PERSISTENCE,MONGODB_URL } from "../config/config.js";
import mongoose from "mongoose";

let ProductManager;
let CartManager;
let UserManager;

switch(PERSISTENCE){
    case "MONGO":
        // CONECT MONGO DB
       const connection = mongoose.connect(MONGODB_URL);

        const { default: ProductManagerMongo} = await import ("./ProductManager.js");
        ProductManager = ProductManagerMongo;
       
        const { default: CartManagerMongo} = await import ("./CartManager.js");
        CartManager = CartManagerMongo;

        const { default: UserManagerMongo} = await import ("./UserManager.js");
        UserManager = UserManagerMongo;
        
        break;

    case "FILESYSTEM": 
        const {default:ProductManagerFS} = await import("./fs/ProductManagerFS.js");
        ProductManager = ProductManagerFS;
   
        const {default:CartManagerFS} = await import("./fs/CartManagerFS.js");
        CartManager = CartManagerFS;
        break;  
    
    default: 
        req.logger.fatal("Método de persistencia inválido o inexistente!");
        process.exit(1);
}

export { ProductManager, CartManager, UserManager }


