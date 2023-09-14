// Stephanie Legarra - Curso Backend - Comisión: 55305
import { userModel } from "./models/user.model.js";

class UserManager {
  //NUEVO USUARIO
  async addUser(user) {
    try {
      if (user.email == "adminCoder@coder") {
        ures.rol = "admin";
      }

      await userModel.create(user);
      console.log("User added!");

      return true;
    } catch (error) {
      return false;
    }
  }

  //LOGIN
  async login(user) {
    try {
      const userLogged =
        (await userModel.findOne({ email: user, password: pass })) || null;

      if (userLogged) {
        if (userLogged) {
          const rol =
            userLogged.email === "adminCoder@coder.com" ? "admin" : "usuario";

          req.session.user = {
            id: userLogged._id,
            email: userLogged.email,
            first_name: userLogged.first_name,
            last_name: userLogged.last_name,
            rol: rol,
          };

          console.log(
            "Valor de req.session.user después de la autenticación:",
            req.session.user
          );

          const userToReturn = userLogged;
          console.log("Valor de userToReturn:", JSON.stringify(userToReturn));
          return userToReturn;
        }
        console.log(
          "Valor de userLogged antes de devolver falso:",
          JSON.stringify(userLogged)
        );
        return false;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  //TRAER USUARIO POR MAIL
  async getUserByEmail(user) {
    try {
      const userRegisteredBefore =
        (await userModel.findOne([{ email: user }])) || null;
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
  async restorePassword(user, pass) {
    try {
      const userLogged =
        (await userModel.updateOne({ email: user }, { password: pass })) ||
        null;

      if (userLogged) {
        console.log("Password Restored!");
        return userLogged;
      }

      return false;
    } catch (error) {
      return false;
    }
  }
}

export default UserManager;
