import mongoose from "mongoose";
import { MONGODB_URL} from "../config/config.js";
import { devLogger } from "../config/logger.js";

const URI = MONGODB_URL

try {
    await mongoose.connect(URI,({
        useNewUrlParser: true,
        useUnifiedTopology: true
      }))
    devLogger.info("Conectado a MongoDB");
} catch (error) {
    devLogger.fatal(error);
}