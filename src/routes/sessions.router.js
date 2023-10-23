import { Router } from "express";
import passport from "passport";
import { passportCall, authorization } from "../middleware/passportAuthorization.js";
import UserController from "../controllers/user.controller.js";
import AuthController from "../controllers/auth.controller.js";
import { isUser } from "../middleware/authorization.js";

const sessionsRouter = Router();
const userController = new UserController();
const authController = new AuthController();

//LOGIN DE USUARIO
sessionsRouter.post("/login", (req,res) => authController.login(req,res));

//REGISTRO DE USUARIO
sessionsRouter.post("/register", userController.register.bind(userController));

//LOGOUT DE USUARIO - CERRAR SESION
sessionsRouter.post("/logout", (req,res) => authController.logout(req,res));

//RESTORE PASS - ACTUALIZAR CONTRASEÑA
sessionsRouter.get("/restore", userController.restore.bind(userController));

//LOGIN CON GITHUB
sessionsRouter.get("/github", passport.authenticate("github", {scope:["user:email"]}), async (req,res) => {});

//Callback -de github
sessionsRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    console.log("GitHub Callback Route");
    authController.githubCallback(req, res);
  }
);

//CURRENT
sessionsRouter.get("/current", passportCall("jwt"), authorization("user"), (req, res) => {
 userController.current(req,res)
});

//PROFILE
sessionsRouter.get("/profile", isUser, authController.perfil);


export default sessionsRouter;
