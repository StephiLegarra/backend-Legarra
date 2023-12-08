import { createHash } from "../middleware/bcrypt.js";
import UserService from "../services/user.service.js";
import UserResponse from "../dao/dtos/user.response.js";
import { generateUserError } from "../services/errors/errorMessages/user.creation.error.js";
import EErrors from "../services/errors/errorsEnum.js";
import CustomeError from "../services/errors/customeError.js";
import { userModel } from "../dao/models/user.model.js";

class UserController {
    constructor (){
        this.userService = new UserService();
    }
    
    async register(req, res, next) {
        try{
        const { first_name, last_name, email, age, password, rol, last_connection} = req.body;
      
        if( !first_name || !email || !age || !password){
            const customeError = new CustomeError({
              name: "User creation error",
              cause: generateUserError({
                first_name, last_name, email, age, password}),
              message: "Error al intentar registrar al usuario",
              code:400,
            });
            return next(customeError);
          }

        const response = await this.userService.register({
          first_name,
          last_name,
          email,
          age,
          password,
          rol, 
          last_connection,
        });
    
        return res.status(response.status === "success" ? 200 : 400).json({
            status: response.status,
            data: response.user,
            redirect: response.redirect,
          });
        } catch (error) {
          return next(error);
        }
      }

    async restorePassword(req, res, next){
        const {user, pass} = req.query;
        try {
            const passwordRestored = await this.userService.restorePassword(user,createHash(pass));
            if (passwordRestored) {
              return res.send({status: "OK", message: "La contraseña se ha actualizado correctamente!"});
            } else {
                const customeError = new CustomeError({
                    name: "Restore Error",
                    massage: "No fue posible actualizar la contraseña",
                    code: EErrors.PASSWORD_RESTORATION_ERROR,
                  });
                  return next(customeError);  
            }
        } catch (error) {
           req.logger.fatal(error);
           return next(error);
        }
    }
    
    current(req, res, next){
        if(req.session.user){
            return res.send({status:"ok", payload:new UserResponse(req.session.user)});
        }else{
            const customeError = new CustomeError({
                name: "Auth Error",
                massage: "No fue posible acceder a Current",
                code: EErrors.AUTHORIZATION_ERROR,
              });
              return next(customeError);  
        }
    }

    async uploadFiles (req, res){
      try{
        const userId = req.params.uid;
        const files = req.files;
        const userUpdate = {};
        if(files.profiles){
          userUpdate.profileImage = files.profiles[0].path;
        }
        if(files.products){
          userUpdate.productImage = files.products[0].path;
        }
        if(files.document){
          userUpdate.documents = files.document.map((doc) => ({
            name: doc.originalname,
            reference: doc.path,
            status: "Uploaded",
          }));
        }
        await userModel.findByIdAndUpdate(userId, userUpdate);
        res.status(200).send("Subido con éxito!")
      } catch(error) {
        res.status(500).send(error.message)
      }
     
    }
    async updateUserDocuments(req, res){
      try {
        const userId = req.params.uid;
        const file = req.file;
        if(!file){
          return res.status(400).send("No se ha subido nada!")
        }
        const document = {
          name: file.originalname,
          string: file.path,
        }
        await userModel.findByIdAndUpdate(userId, {
          $push:{documents:document},
          $set:{last_connection: new Date()},
        });
        res.status(200).send("Documentos subidos con éxito!")
      } catch (error) {
        res.status(500).send(error.message)
      }
    }
    
    async upgradeToPremium (req, res){
      try {
        const userId = req.params.uid;
        const user = await userModel.findById(userId);
        if(!user){
          return res.status(404).send("Usuario no encontrado!")
        }
        const requieredDocs = [
          "identificationDocument",
          "domicileProofDocument",
          "accountStatementDocument",
        ];
        const hasAllDocuments = requieredDocs.every((docName)=> user.documents.some(
          (doc) => doc.name === docName && doc.status === "Uploaded"
        ))
        if(hasAllDocuments){
          user.isPremium = true;
          user.rol = "premium";
          await user.save();
          res.status(200).send("Actualizado a Premium!")
        } else {
          res.status(400).send("Falta algún documento requerido o están incompletos!")
        }
      } catch (error) {
        console.error(error);
        res.status(500).send("Error interno")
      }
    }
  
    async uploadPremiumDocuments(req, res){
      try {
        const userId = req.params.uid;
        const files = req.files;
        const user = await userModel.findById(userId);
        if(!user){
          return res.status(404).send("Usuario no encontrado!")
        }
        const updateOrAddDocs = (docName, file) => {
          const existingDocIndex = user.documents.findIndex((doc)=>doc.name === docName);
          const documentData = {
            name: docName,
            reference: file.path,
            status: "Uploaded",
          }
          if(existingDocIndex >= 0){
            user.documents[existingDocIndex]=documentData;
          } else {
            user.documents.push(documentData);
          }
        }
        if(files.identificationDocument){
          updateOrAddDocs("identificationDocument", files.identificationDocument[0]);
        }
        if(files.domicileProofDocument){
          updateOrAddDocs("domicileProofDocument", files.domicileProofDocument[0]);
        }
        if(files.accountStatementDocument){
          updateOrAddDocs("accountStatementDocument", files.accountStatementDocument[0]);
        }
        await user.save();
        res.status(200).send("Documentación premium cargada correctamente!");
  
      } catch (error) {
        console.error(error);
        res.status(500).send("Error interno");
      }
    }

}

export default UserController;
