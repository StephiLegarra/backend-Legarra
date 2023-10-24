import UserManager from "../dao/UserManager.js";
import { userModel } from "../dao/models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_KEY } from "../config/config.js";

class AuthenticationService {
    constructor() {
        this.userManager = new UserManager();
        this.secretKey = JWT_KEY;
    }
    
    async login(email,password) {
            const user = await this.userManager.login(email, password);
            if(!user){
                return null;
            }
            const token = jwt.sign({id:user._id, email: user.email, rol: user.rol}, this.secretKey, {expiresIn:'24h'});
            return {user, token}
    }
    
    async githubCallback(profile){
        try {
            if(!profile||!profile._json){
                throw new Error("La informacion de profile esta incompleta");
            }
            if(!profile._json.email){
                console.warn('Email nulo');
                profile._json.email = 'sinemail@ejemplo.com';
            }

            let user = await userModel.findOne({email:profile._json.email});
            if (!user){
                user = await userModel.create({
                    first_name:profile._json.name || "GitHubUser",
                    last_name:"",
                    email:profile._json.email,
                    age:100,
                    password:"",
                    rol: "user"
                })
            } 
            return user;
        } catch (error) {
            console.error("Algo salió mal! ", error);
            throw error;
        }
    }
}

export default AuthenticationService;