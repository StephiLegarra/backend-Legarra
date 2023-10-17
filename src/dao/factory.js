import { PERSISTENCE,MONGODB_URL } from "../config/config.js";
import mongoose from "mongoose";

//let Users;
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
        
        console.log("Servicio de persistencia en MONGO DB activo");
        break;

    case "FILESYSTEM":  
        const {default:UserManagerFS} = await import("./fs/UserManagerFS.js");
        Users = UserManagerFS;
        break;  
    
    default: 
        console.error("Método de persistencia inválido o inexistente!");
        process.exit(1);
}

export { ProductManager, CartManager, UserManager }


