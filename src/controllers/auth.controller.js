import AuthenticationService from "../services/auth.service.js";

class AuthController {
    constructor(){
        this.authService = new AuthenticationService();
    }

    async login (req, res){
        const {email, password} = req.body;
        const userData = await this.authService.login(email, password);
        console.log("Información de usuario: ", userData);
        if(!userData || !userData.user){
         return res.status(401).json({status:"error", message:"La información es inválida"});
        }

        req.session.user = {
            id: userData.user._id || userData.user._id, 
            email: userData.user.email,
            first_name: userData.user.first_name,
            last_name: userData.user.last_name,
            age: userData.user.age,
            rol: userData.user.rol,
            isAdmin: userData.user.isAdmin,
            cart: userData.user.cart
        }

        res.cookie("coderCookieToken", userData.token, {httpOnly: true,secure: false});
        console.log("Todo salió bien! lo estamos redirigiendo..!");
        return res.status(200).json({ status: "success", user: userData.user, redirect: "/products" });
    }

    async githubCallback(req, res){
        console.log("Contolando acceso con GitHub");
        try {
            if(req.user){
                req.session.user = req.user;
                req.session.loggedIn = true;
                req.session.email = req.user.email;
                req.session.isAdmin = req.user.isAdmin;
                req.session.cart = req.user.cart;
                return res.redirect("/products");
            }else{
                return res.redirect("/login");
            }
        } catch (error) {
            console.error("Algo salio mal!", error);
            return res.redirect("/login")
        }
    }
    
    async profile(req,res){
        const user = { email: req.session.email, isAdmin: req.session.isAdmin, cart: req.session.cart };
        return res.render('profile', {user:user});
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