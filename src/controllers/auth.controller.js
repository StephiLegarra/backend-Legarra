import AuthenticationService from "../services/auth.service.js";
import { authError } from "../services/errors/errorMessages/user.auth.error.js";
import CustomeError from "../services/errors/customeError.js";
import CartService from "../services/cart.service.js";
import UserService from "../services/user.service.js";

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
        console.log("Información de usuario: ", userData);

        if (!userData || !userData.user) {
        console.log("Credenciales inválidas!");
        const customeError = new CustomeError({
        name: "Auth Error",
        message: "Credenciales inválidas",
        code:401,
        cause: authError(email),
        });
        return next(customeError)
        }
    
        if (userData && userData.user) {
        console.log("Setting session and cookie");
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
        console.log(newCart);
      }
       res.cookie("coderCookieToken", userData.token, {httpOnly: true,secure: false});
       console.log("Todo salió bien! lo estamos redirigiendo..!");
       return res.status(200).json({ status: "success", user: userData.user, redirect: "/products" });
    } catch (error) {
        console.error("Ups! Algo salio mal!: ", error);
        return res.redirect("/login");
    }};

    async githubCallback(req, res){
        console.log("Contolando acceso con GitHub");
        try {
            if(req.user){
                req.session.user = req.user;
                req.session.loggedIn = true;
                return res.redirect("/products");
            }else{
                return res.redirect("/login");
            }
        } catch (error) {
            console.error("Ups! Algo salio mal!", error);
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
}
export default AuthController;