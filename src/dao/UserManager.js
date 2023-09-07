// Stephanie Legarra - Curso Backend - Comisión: 55305

import { userModel } from "./models/user.model.js";

class UserManager {
  constructor() {
    this.user = [];
  }

  async addUser(user) {
    try {
      const { first_name, last_name, email, age, password } = user;

      if (!first_name || !last_name || !email || !age || !password) {
        return console.log(
          "Debes completar todos los datos para poder registrarte!"
        );
      }

      if (await this.validateEmail(user.email)) {
        console.log("El usuario ya se encuentra registrado!");
        return false;
      } else {
        const users = await userModel.find();
        this.users = users;

        await userModel.create(user);
        console.log("El usuario fue creado correctamente");
        return true;
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  async validateEmail(email) {
    return (await userModel.findOne({ email: email })) || false;
  }

  async login(user, pass) {
    try {
      const userLogged = await userModel.findOne({
        $and: [{ email: user }, { password: pass }],
      });

      /*        if (userLogged) {
          const role =
            userLogged.email === "stephanielegarra@gmail.com" ? "admin" : "usuario";
        }
        */

      if (userLogged) {
        console.log("Has iniciado sesión!");
        return userLogged;
      }
      return false;
    } catch (err) {
      console.log(err.message);
    }
  }

  async getUsers(params) {
    let { limit, page, query, sort } = params;
    limit = limit ? limit : 10;
    page = page ? page : 1;
    query = query || {};
    sort = sort ? (sort == "asc" ? 1 : -1) : 0;
    let users = await userModel.find({}).lean();

    return users;
  }

  async getUsersByEmail(email) {
    try {
      const user = await userModel.findOne({ email: email }).lean();
      if (!user) {
        return console.log("No se encontró el usuario");
      }
      return user;
    } catch (err) {
      console.log(err.message);
    }
  }

  async updateUser(email, user) {
    try {
      if (await this.getUsersByEmail(email)) {
        await userModel.updateOne({ email: email }, user);
        console.log("El usuario fue actualizado correctamente");
        return true;
      } else {
        console.log("No se encontró el usuario");
        return false;
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  async deleteUser(email) {
    try {
      if (await this.getUsersByEmail(email)) {
        await userModel.deleteOne({ email: email });
        console.log("El usuario fue eliminado correctamente");
        return true;
      } else {
        console.log("no se encontró el usuario");
        return false;
      }
    } catch (err) {
      console.log(err.message);
    }
  }
}

export default UserManager;
