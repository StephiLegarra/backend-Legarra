// Stephanie Legarra - Curso Backend - Comisión: 55305
import { userModel } from "./models/user.model.js";

class UserManager {
  //NUEVO USUARIO
  async addUser(user) {
    try {
      await userModel.create(user);
      console.log("User added!");

      return true;
    } catch (error) {
      return false;
    }
  }

  //LOGIN
  async login(user, pass, request) {
    try {
      const userLogged =
        (await userModel.findOne({ email: user, password: pass })) || null;

      if (userLogged) {
        if (userLogged) {
          const role =
            userLogged.email === "stephanielegarra@gmail.com"
              ? "admin"
              : "usuario";

          request.session.user = {
            id: userLogged._id,
            email: userLogged.email,
            first_name: userLogged.first_name,
            last_name: userLogged.last_name,
            role: role,
          };

          console.log(
            "Valor de request.session.user después de la autenticación:",
            request.session.user
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

  //GET USERS
  /*
  async getUsers() {
    try {
      const users = await userModel.find({}).lean();

      if (!users) {
        console.log("No hay usuarios registrados");
      }
      return users;
    } catch (error) {
      return false;
    }
  }
  */

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
}

export default UserManager;
