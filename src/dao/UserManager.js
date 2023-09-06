// Stephanie Legarra - Curso Backend - Comisión: 55305

import { userModel } from "./models/user.model.js";

class UserManager {
  constructor() {
    this.user = [];
  }

  static id = 1;

  async addUser(user) {
    try {
      const { first_name, last_name, email, age, password } = user;

      if (!first_name || !last_name || !email || !age || !password) {
        return console.log(
          "Debes completar todos los datos para poder registrarte!"
        );
      } else {
        const users = await userModel.find();
        this.users = users;

        if (this.users.length !== 0) {
          const max = Math.max(...this.users.map((item) => item.id)) + 1;
          UserManager.id = max;
        }
        user.id = UserManager.id++;
        await userModel.create(user);
        console.log("El usuario fue creado correctamente");
        return true;
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  async login(user) {
    try {
      const userLogged = (await userModel.findOne({ email: user })) || null;

      if (userLogged) {
        console.log("Has iniciado sesión correctamente!");
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

  async getUsersById(id) {
    try {
      const user = await userModel.findOne({ id: id }).lean();
      if (!user) {
        return console.log("No se encontró el usuario");
      }
      return user;
    } catch (err) {
      console.log(err.message);
    }
  }

  async updateUser(id, user) {
    try {
      if (await this.getUsersById(id)) {
        await userModel.updateOne({ id: id }, user);
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

  async deleteUser(id) {
    try {
      if (await this.getUsersById(id)) {
        await userModel.deleteOne({ id: id });
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
