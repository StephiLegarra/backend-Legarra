import AuthenticationService from "../services/auth.service.js";
import { authError } from "../services/errors/errorMessages/user.auth.error.js";
import CustomeError from "../services/errors/customeError.js";
import CartService from "../services/cart.service.js";
import UserService from "../services/user.service.js";
import { userModel } from "../dao/models/user.model.js";
import recoverPassword from "./recoverPassword.controller.js";
import { createHash, isValidPassword } from "../middleware/bcrypt.js";

class AuthController {
    constructor(){
        this.authService = new AuthenticationService();
        this.cartsService = new CartService();
        this.userService = new UserService();
    }

    async login (req, res, next){
        try {
        const {email, password} = req.body;
        const userData = await this.authService.login(email, password);
        req.logger.info("Información de usuario: ", userData);

        userData.user.last_connection = new Date();
        console.log("last_conection: ", userData.user.last_connection);

        if (!userData || !userData.user) {
        req.logger.fatal("Credenciales inválidas!");
        const customeError = new CustomeError({
        name: "Auth Error",
        message: "Credenciales inválidas",
        code:401,
        cause: authError(email),
        });
        return next(customeError)
        }
    
        if (userData && userData.user) {
        req.session.user = {
            id: userData.user._id || userData.user._id, 
            email: userData.user.email,
            first_name: userData.user.first_name,
            last_name: userData.user.last_name,
            age: userData.user.age,
            rol: userData.user.rol,
            cart: userData.user.cart
        }
        const newCart = await this.cartsService.createCart();
        req.logger.info(newCart);
      }
       res.cookie("coderCookieToken", userData.token, {httpOnly: true,secure: false});
       req.logger.info("Todo salió bien! lo estamos redirigiendo..!");
       return res.status(200).json({ status: "success", user: userData.user, redirect: "/products" });
    } catch (error) {
        req.logger.fatal("Ups! Algo salio mal!: ", error);
        return res.redirect("/login");
    }};

    async githubCallback(req, res){
        req.logger.debug("Contolando acceso con GitHub");
        try {
            if(req.user){
                req.session.user = req.user;
                req.session.loggedIn = true;
                return res.redirect("/products");
            }else{
                return res.redirect("/login");
            }
        } catch (error) {
            req.logger.fatal("Ups! Algo salio mal!", error);
            return res.redirect("/login")
        }
    }
    
    logout(req, res){
        req.session.destroy((error)=>{
            if(error){
                return res.redirect("/profile");
            }
            return res.redirect("/login")
        })
    }

    async restorePassword(req, res) {
        const { email } = req.body;
        try {
            await recoverPassword(email);
          res.send("Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico!");
        } catch (error) {
            console.error("Error al enviar el mail de restablecimiento de contraseña: ", error);
            res.status(500).send({error: error, message: "Hubo un error en la solicitud de recuperar la contraseña"});
        }
      }

      async newPassword(req,res) {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).send("Las contraseñas no coinciden!");
          }
        
          try {
            const user = await userModel.findOne({
              resetPasswordToken: token,
              resetPasswordExpires: { $gt: Date.now() },
            });
      
            if (!user) {
              return res.status(400).json({
                message: "El token de restablecimiento de contraseña es inválido o expiró",
                tokenExpired: true,
              });
            }
      
            const isSamePassword = isValidPassword(user, password);
      
            if (isSamePassword) {
              return res.status(400).send("La nueva contraseña debe ser diferente a la contraseña actual");
            }
      
            user.password = createHash(password);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
      
            await user.save();
           res.send("Tu contraseña ha sido actualizada con éxito");
        } catch (error) {
            console.error("Error al resetear la contraseña:", error);
            res.status(500).send("Error interno del servidor al intentar actualizar la contraseña");
        }   
      }

}

export default AuthController;