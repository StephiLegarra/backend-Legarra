// Stephanie Legarra - Curso Backend - Comisión: 55305
import { userModel } from "./models/user.model.js";
import { isValidPassword, createHash } from "../middleware/bcrypt.js";
import UserDTO from "./dtos/user.dto.js";
import mongoose from "mongoose";

class UserManager {
  //NUEVO USUARIO
  async addUser({first_name, last_name, email, age, password, rol, cart, last_connection}) {
    try {
        const exists = await userModel.findOne({email});
        if(exists){
            console.log("Este usuario ya existe");
            return null;
        }
        const hashedPassword = createHash(password); 
        const user = await userModel.create({
            _id: new mongoose.Types.ObjectId(),
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            rol,
            cart,
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
  async findUser(user) {
    try {
      const buscadito = await userModel.findOne({ email: user });
      if (buscadito) {
        const rol = buscadito.email === "adminCoder@coder.com" ? "admin" : "usuario";
        return buscadito;
      }
      return null;
    } catch (error) {
      console.error("Error al realizar la busqueda por email: ", error);
      throw error;
    }
  }

  async findOne(email) {
    const result = await userModel.findOne({ email }).lean();
    return result;
  };

  //TRAER USUARIO POR ID
  async getUserById(id) {
    try {
      return await userModel.findById(id).lean();
    } catch (error) {
      console.error("Error al realizar la busqueda por id: ", error);
      return null;
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

  //BORRAR USUARIO
  async deleteUser(uid) {
    try {
      const user = await userModel.findOne({ email: uid }).lean();
      console.log(email)
      console.log("//////DAO//////");
      console.log("UID");
      console.log(uid);
      console.log("user");
      console.log(user);
      await userModel.deleteOne({ email: uid });
      const userDTO = new UserDTO(user);
      return userDTO;
  } catch (error) {
      log.logger.console.warn(); (`Error deleting user: ${error}`);
  }
}
 
//ACTUALIZAR USUARIO
 async updateUser(userId, userToReplace) {
    const filter = { email: userId }
    const update = { $set: userToReplace };
    const result = await userModel.updateOne(filter, update);
    return result;
}

}


export default UserManager;
