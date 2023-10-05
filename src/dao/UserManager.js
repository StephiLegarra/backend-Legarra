// Stephanie Legarra - Curso Backend - Comisión: 55305
import { userModel } from "./models/user.model.js";
import { isValidPassword, createHash } from "../middleware/bcrypt.js";

class UserManager {
  //NUEVO USUARIO
  async addUser({first_name, last_name, email, age, password, rol}) {
    try {
        const exists = await userModel.findOne({email});
        if(exists){
            console.log("Este usuario ya existe");
            return null;
        }
        const hash = createHash(password); 
       
        const user = await userModel.create({
            first_name,
            last_name,
            email,
            age,
            password:hash,
            rol
        });
       
        console.log("Usuario agregado", user);
        return user;
    } catch (error) {
        console.error("Error al agregar al usuario ", error);
        throw error;
    }
}

  //LOGIN
  async login(user, pass) {
    try {
      const userLogged = await userModel.findOne({ email: user });

      if (userLogged && isValidPassword(userLogged, pass)) {
        const rol =
          userLogged.email === "adminCoder@coder.com" ? "admin" : "usuario";

        return userLogged;
      }
      return null;
    } catch (error) {
      console.error("Error durante el login:", error);
      throw error;
    }
  }

  //TRAER USUARIO POR MAIL
  async getUserByEmail(user) {
    try {
      const userRegisteredBefore = (await userModel.findOne([{ email: user }])) || null;
      if (userRegisteredBefore) {
        console.log("Mail registrado anteriormente");
        return user;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  //REESTABLECER CONTRASEÑA
  async restorePassword(email, hashP) {
    try {
        const userLogged = await userModel.updateOne({email:email}, {password:hashP}) || null;
        
        if (userLogged) {
            console.log("Password Restored!");
            return ({status:200, redirect:"/profile"});
        }
        return false;
    } catch (error) {
        return false;
    }
  }

}

export default UserManager;
