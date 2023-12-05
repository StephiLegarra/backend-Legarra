// Stephanie Legarra - Curso Backend - Comisión: 55305
import { userModel } from "./models/user.model.js";
import { isValidPassword, createHash } from "../middleware/bcrypt.js";


class UserManager {
  //NUEVO USUARIO
  async addUser({first_name, last_name, email, age, password, rol, last_connection}) {
    try {
        const exists = await userModel.findOne({email});
        if(exists){
            console.log("Este usuario ya existe");
            return null;
        }
        const hashedPassword = createHash(password); 
        const user = await userModel.create({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            rol,
            last_connection: new Date(),
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
        const rol = userLogged.email === "adminCoder@coder.com" ? "admin" : "user";
        return userLogged;
      }
      return null;
    } catch (error) {
      console.error("Error al intentar el login:", error);
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
  async restorePassword(email, hashedPassword) {
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        console.log("El usuario no fue encontrado!");
        return false;
      }
      user.password = hashedPassword;
      await user.save();
      console.log("Contraseña actualizada correctamente!");
      return true;
    } catch (error) {
        console.error("Error al intentar el cambio de contraseña! ", error);
        return false;
    }
  }

}

export default UserManager;
