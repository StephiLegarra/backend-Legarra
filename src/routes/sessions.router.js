import { Router } from "express";
import UserManager from "../dao/UserManager.js";
import passport from "passport";
// import { createHash } from "../middleware/bcrypt.js";
import { passportCall, authorization } from "../middleware/authorization.js";
//import jwt from "jsonwebtoken";
import UserController from "../controllers/user.controller.js";
import AuthControl from "../controllers/auth.controller.js";

//const PRIVATE_KEY = "3sUnS3cr3t0";
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

/*
//LOGIN DE USUARIO
sessionsRouter.post("/login", passport.authenticate("login", { failureRedirect: "/faillogin" }), async (req, res) => {
    try {
      if (!req.user)
      return res.status(401).send({status: "Error", message: "Usuario y/o contraseña incorrecto!"});
      
      const {email,password} = req.body;
  
      let token = jwt.sign({ email:email, password:password, rol:"user"}, PRIVATE_KEY,{expiresIn:"24h"});
      res.cookie("coderCookieToken", token, {maxAge:3600*1000, httpOnly:true});
  
      console.log("token", token);
  
      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        rol: req.user.rol
      };
      return res.status(200).json({ status: "success", redirect: "/products" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }});

//REGISTRO DE USUARIO
sessionsRouter.post("/register", (req,res, next) => {passport.authenticate("register", (err, user, info) => {
  if(err){
      return res.status(500).json({status:"error", message: "Error interno"})
  }
  if(!user){
      return res.status(401).json({status:"error", message: "Error al registarte bajo esos datos"})
  }
  req.logIn(user, (loginError)=>{
      if(loginError){
          return res.status(500).json({status:"error", message: "Error interno"})
      }
      return res.status(200).json({status:"success", redirect:"/login"})
  })
})(req, res, next); 
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
    res.send({status: "OK", message: "La contraseña fue actualizada correctamente!"});
  } else {
    res.status(401).send({status: "Error", message: "No se pudo actualizar la contraseña!"});
  }
});

//LOGIN CON GITHUB
sessionsRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }), 
  async (req, res) => {});

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
  res.send({status:"OK", payload:req.user});
});

*/
export default sessionsRouter;
