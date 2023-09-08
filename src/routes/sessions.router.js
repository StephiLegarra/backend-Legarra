import { Router } from "express";
import UserManager from "../dao/UserManager.js";

const sessionsRouter = Router();
const UM = new UserManager();

//VER USUARIOS
/*
sessionsRouter.get("/sessions", async (request, response) => {
  try {
    const users = await UM.getUsers();
    response.send({ status: "ok", message: users });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});
*/

//LOGIN DE USUARIO
sessionsRouter.get("/login", async (request, response) => {
  console.log(`request.query: ${JSON.stringify(request.query)}`);
  const { user, pass } = request.query;
  try {
    const userLogged = await UM.login(user, pass, request);
    if (userLogged) {
      response.send({ status: "OK", message: userLogged });
    } else {
      console.log("Fallo al loguear en el servidor");
      response
        .status(401)
        .send({ status: "Error", message: "No se pudo loguear el Usuario!" });
    }
    console.log(`response.status: ${response.statusCode}`);
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

//REGISTRO DE USUARIO
sessionsRouter.post("/register", async (request, response) => {
  try {
    const userOnBD = await UM.getUserByEmail(request.params.email);

    if (userOnBD) {
      console.log("Mail ya esta registrado, usar otro");
      response.status(400).send({
        status: "error",
        message: "Email ya existente en base de datos",
      });
    } else {
      const userRegistered = await UM.addUser(request.body);
      if (userRegistered) {
        response.send({ status: "OK", message: userRegistered });
      } else {
        response.status(400).send({
          status: "error",
          message: "No se pudo registrar al usuario",
        });
      }
    }
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

//LOGOUT DE USUARIO
sessionsRouter.post("/logout", async (request, response) => {
  request.session.destroy((err) => {
    if (err) {
      return response.redirect("/profile");
    }
    response.redirect("/login");
  });
});

export default sessionsRouter;
