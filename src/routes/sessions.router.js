import { Router } from "express";
import UserManager from "../dao/UserManager.js";

const sessionsRouter = Router();
const UM = new UserManager();

// VER USUARIOS
sessionsRouter.get("/", async (request, response) => {
  try {
    const getUsers = await UM.getUsers(request.query);
    response.status(200).send({ getUsers });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

// OBTENER USUARIO POR EMAIL
sessionsRouter.get("/:email", async (request, response) => {
  const { email } = request.params;

  try {
    const getUsers = await UM.getUsersByEmail(email);

    if (!getUsers) {
      return response
        .status(404)
        .send({ error: "El usuario no fue encontrado" });
    }
    response.status(200).send({ getUsers });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

//REGISTRO DE USUARIO
sessionsRouter.post("/register", async (request, response) => {
  const { first_name, last_name, email, age, password } = request.body;

  try {
    if (!first_name || !last_name || !email || !age || !password) {
      response.status(400).send({
        status: "error",
        message: "Error! Se deben completar todos los campos obligatorios",
      });
      return false;
    }

    const emailUser = await UM.validateEmail(email);
    if (emailUser) {
      response.status(400).send({
        status: "Error",
        message: "El usuario ya se encuentra registrado!",
      });
      return false;
    }

    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password,
    };
    await UM.addUser(newUser);
    response
      .status(200)
      .send({ newUser, message: "El usuario ha sido creado correctamente" });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

//LOGIN DE USUARIO
sessionsRouter.get("/login", async (request, response) => {
  const { user, pass } = request.query;
  try {
    const userLogged = await UM.login(user, pass);
    if (!userLogged) {
      return response
        .status(404)
        .send({ error: "El usuario y/o la clave son incorrectos" });
    }
    response.status(200).send({
      userLogged,
      message: "El usuario ha iniado sesión correctamente",
    });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

//LOGOUT DE USUARIO
sessionsRouter.post("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/profile");
    }
    res.redirect("/login");
  });
});

//ACTUALIZAR USUARIO
sessionsRouter.put("/:email", async (request, response) => {
  const { email } = request.params;
  const { first_name, last_name, age, password } = request.body;

  try {
    const getUsers = await UM.getUsersByEmail(email);
    if (!getUsers) {
      return response
        .status(404)
        .send({ error: "El usuario no fue encontrado" });
    }
    if (!first_name || !last_name || !email || !age || !password) {
      response.status(400).send({
        status: "error",
        message: "Error! Se deben completar todos los campos obligatorios",
      });
      return false;
    }

    const updateUser = {
      first_name,
      last_name,
      email,
      age,
      password,
    };
    await UM.updateUser(email, updateUser);
    response.status(200).send({
      updateUser,
      message: "Los datos del usuario han sido actualizados!",
    });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

//ELIMINAR USUARIO
sessionsRouter.delete("/:email", async (request, response) => {
  const { email } = request.params;

  try {
    const getUsers = await UM.getUsersByEmail(email);

    if (!getUsers) {
      return response.status(404).send({
        status: "error",
        message: "Error! no se encontró el usuario",
      });
    }
    UM.deleteUser(email);
    response
      .status(200)
      .send({ status: "ok", message: "El usuario ha sido eliminado" });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

export default sessionsRouter;
