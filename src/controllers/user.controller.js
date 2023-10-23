import { createHash } from "../middleware/bcrypt.js";
import UserService from "../services/user.service.js";

class UserController {
    constructor (){
        this.userService = new UserService();
    }
    
    async register(req, res) {
        const { first_name, last_name, email, age, password, rol, isAdmin, cart} = req.body;
        const response = await this.userService.register({
          first_name,
          last_name,
          email,
          age,
          password,
          rol,
          isAdmin,
          cart
        });
    
        return res.status(response.status === "success" ? 200 : 400).json({
            status: response.status,
            data: response.user,
            redirect: response.redirect,
          });
      }

    async restorePassword(req, res){
        const {user, pass} = req.query;
        try {
            const newPass = await this.userService.restorePassword(user,createHash(pass));
            if(newPass){
                return res.send({status:"ok", message: "Contraseña actualizada correctamente"});
            }else{
                return res.status(401).send({status:"error", message:"No se pudo actualizar la contraseña"});
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({status:"error", message:"Error Interno"})
        }
    }
    
    current(req, res){
        if(req.session.user){
            return res.send({status:"ok", payload:new UserResponse(req.session.user)});
        }else{
            return res.status(401).send({status:"error", message: "No tiene autoriacion para acceder"})
        }
    }
}

export default UserController;
