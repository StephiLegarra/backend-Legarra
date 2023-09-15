import { Router } from "express";
import UserManager from "../dao/UserManager.js";
import passport from "passport";
import { userModel } from "../dao/models/user.model.js";
import { createHash } from "../config/bcrypt.js";

const sessionsRouter = Router();
const UM = new UserManager();

//LOGIN DE USUARIO
sessionsRouter.get(
  "/login",
  passport.authenticate("local"),
  async (req, res) => {
    try {
      if (!req.user)
        return res.status(400).send({ status: "error", error: "Invalid" });

      const email = req.user.email;
      let user = await userModel.findOne({ email });
      if (user) {
        req.session.user = {
          name: `${user.first_name} ${user.last_name}`,
          email: req.user.email,
          age: req.user.age,
          rol: req.user.rol,
        };
      }
      if (user === "adminCoder@coder.com") {
        req.session.user = {
          rol: "admin",
        };
      }
      res.sendStatus(201);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

//REGISTRO DE USUARIO
sessionsRouter.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const existe = await UM.getUserByEmail({
      email,
    });
    if (existe) {
      return res.status(400).send({
        status: "error",
        error: "Este mail ya esta registrado",
      });
    }
    const user = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
    };

    let result = await UM.addUser(user);
    console.log(result);

    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      rol: "usuario",
    };

    console.log(req.session.user);

    res.redirect("/login");
    res.status(201).send({
      status: "success",
      message: "Usuario Registrado!",
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
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

//RESTORE PASS
sessionsRouter.get("/restore", async (req, res) => {
  let { user, pass } = req.query;
  pass = createHash(pass);
  const passwordRestored = await UM.restorePassword(user, pass);

  if (passwordRestored) {
    res.send({
      status: "OK",
      message: "La contraseña fue actualizada correctamente!",
    });
  } else {
    res.status(401).send({
      status: "Error",
      message: "No se pudo actualizar la contraseña!",
    });
  }
});

//LOGIN CON GITHUB
sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

//Callback -de github
sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.loggedIn = true;
    res.redirect("/profile");
  }
);

export default sessionsRouter;
