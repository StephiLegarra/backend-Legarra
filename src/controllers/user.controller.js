import { createHash } from "../middleware/bcrypt.js";
import UserService from "../services/user.service.js";

class UserController {
    constructor (){
        this.userService = new UserService();
    }
    async register(req, res) {
        const { first_name, last_name, email, age, password, rol } = req.body;
        const response = await this.userService.register({
          first_name,
          last_name,
          email,
          age,
          password,
          rol
        });
    
        return res.status(response.status === "success" ? 200 : 400).json(response);
      }

    async restore(req, res){
        const {user, pass} = req.query;
        try {
            const newPass = await this.userService.restorePass(user, createHash(pass));
            if(newPass){
                return res.send({status:"ok", message: "Contraseña actualizada correctamente"});
                location.href = "/profile"
            }else{
                return res.status(401).send({status:"error", message:"No se pudo actualizar la contraseña"});

            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({status:"error", message:"Error Interno"})
        }
    }
    
    current(req, res){
        if(req.user){
            return res.send({status:"ok", payload:req.user});
        }else{
            return res.status(401).send({status:"error", message: "No tiene autoriacion para acceder"})
        }
    }
}

export default UserController;
