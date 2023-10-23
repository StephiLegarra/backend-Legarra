import {UserManager} from "../dao/factory.js"
import { ADMIN_USER, ADMIN_PASS } from "../config/config.js";
import CartManager from "../dao/CartManager.js";

class UserService {
    constructor(){
        this.usersManager = new UserManager();
        this.cartManager = new CartManager();
    }

    async register({ first_name, last_name, email, age, password, rol, isAdmin, cart}) {
      try {
        const rol = email == ADMIN_USER && password === ADMIN_PASS ? "admin" : "user";
        var cart = this.cartManager.newCart();
        const user = await this.usersManager.addUser({
          first_name,
          last_name,
          email,
          age,
          password,
          rol,
          isAdmin,
          cart
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
    
}

export default UserService;