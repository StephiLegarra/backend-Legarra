import mongoose from "mongoose";
import { MONGODB_URL} from "../config/config.js";
import { devLogger } from "../config/logger.js";

const URI = MONGODB_URL

export default class MongoSingleton {
    static #instance;

    constructor(){
        this.#connectMongoDB();
    };

    static getInstance(){
        if (this.#instance) {
            console.log("Ya se ha abierto una conexion a MongoDB.");
        } else {
            this.#instance = new MongoSingleton();
        }
        return this.#instance;
    };

    #connectMongoDB = async ()=>{
        try {
            await mongoose.connect(URI,({
                useNewUrlParser: true,
                useUnifiedTopology: true
              }))
            devLogger.info("Conectado a MongoDB");
        } catch (error) {
            devLogger.fatal(error);
            process.exit();
        }
    };
};

