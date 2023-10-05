import { Router } from "express";
import UserManager from "../dao/UserManager.js";
import passport from "passport";
import { passportCall, authorization } from "../middleware/authorization.js";
import UserController from "../controllers/user.controller.js";
import AuthControl from "../controllers/auth.controller.js";

const sessionsRouter = Router();
const UM = new UserManager();
const userController = new UserController();
const authControl = new AuthControl();

//LOGIN DE USUARIO
sessionsRouter.post("/login", (req,res) => authControl.login(req,res));

//REGISTRO DE USUARIO
sessionsRouter.post("/register", userController.register.bind(userController));

//LOGOUT DE USUARIO - CERRAR SESION
sessionsRouter.post("/logout", (req,res) => authControl.logout(req,res));

//RESTORE PASS - ACTUALIZAR CONTRASEÑA
sessionsRouter.get("/restore", userController.restore.bind(userController));

//LOGIN CON GITHUB
sessionsRouter.get("/github", passport.authenticate("github", {scope:["user:email"]}), async (req,res) => {});

//Callback -de github
sessionsRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.loggedIn = true;
    res.redirect("/profile");
  }
);

//CURRENT
sessionsRouter.get("/current", passportCall("jwt"), authorization("user"), (req, res) => {
 userController.current(req,res)
});


export default sessionsRouter;
