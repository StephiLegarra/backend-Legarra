import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import uploadConfig from "../multer/multer.js";
import { passportCall, authorization } from "../middleware/passportAuthorization.js";

const userRouter = Router();
const userController = new UserController();

userRouter.get('/', userController.getUsers);

userRouter.delete('/inactive', userController.deleteInactiveUsers);

userRouter.delete("/:uid", passportCall("jwt"), authorization(["admin"]), userController.deleteUser);

userRouter.put("/:uid/rol", passportCall("jwt"), authorization(["admin"]), userController.changeUserRol);

userRouter.post('/premium/:uid', userController.upgradeToPremium);

userRouter.post('/:uid/documents', uploadConfig.fields([
    {name:"profiles", maxCount:1},
    {name:"products", maxCount:1},
    {name:"document", maxCount:1},
]), userController.uploadFiles);

userRouter.post('/:uid/premium-documents', uploadConfig.fields([
    {name:"identificationDocument", maxCount:1},
    {name:"domicileProofDocument", maxCount:1},
    {name:"accountStatementDocument", maxCount:1},
]), userController.uploadPremiumDocuments);


export default userRouter;