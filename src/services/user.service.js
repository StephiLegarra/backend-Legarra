import {UserManager} from "../dao/factory.js"
import { ADMIN_USER, ADMIN_PASS, PREMIUM_EMAIL, PREMIUM_PASSWORD } from "../config/config.js";
import CartManager from "../dao/CartManager.js";

class UserService {
    constructor(){
        this.usersManager = new UserManager();
        this.cartManager = new CartManager();
    }

    async register({ first_name, last_name, email, age, password, rol}) {
      try {

        const cartResponse = await this.cartManager.newCart();
        console.log("Cart response:", cartResponse);
        if (cartResponse.status !== "ok") {
          return { status: "error", message: "Error al crear el carrito" };
        }

        const rol = email == ADMIN_USER && password === ADMIN_PASS ? "admin" 
        : email == PREMIUM_EMAIL && password == PREMIUM_PASSWORD ? "premium" 
        : "user";

        const cartId = cartResponse.id;
        console.log("Cart ID:", cartId);
        
        const user = await this.usersManager.addUser({
          first_name,
          last_name,
          email,
          age,
          password,
          rol,
          cart: cartId,
        });
  
        if (user) {
          return { status: "success", user, redirect: "/login" };
        } else {
          return { status: "error", message: "User already exists" };
        }
      } catch (error) {
        console.error("Error registering user:", error);
        return { status: "error", message: "Internal Server Error" };
      }
    }
    
    async restorePassword(user, hashedPassword) {
      return await this.usersManager.restorePassword(user, hashedPassword);
    }

    async update(userId, userToReplace) {
      const result = await this.userManager.update(userId, userToReplace);
      return result;
  }
}

export default UserService;