import { Router } from "express";
import { sendEmail } from "../controllers/email.controller.js";

const emailRouter = Router();

emailRouter.get("/", sendEmail);

export default emailRouter;

