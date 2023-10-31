import { Router } from "express";
import { addLogger } from "../config/logger.js";

const loggerRouter = Router();

loggerRouter.get("/logger", addLogger);

 export default loggerRouter; 