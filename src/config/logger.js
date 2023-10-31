import winston, { transports } from "winston";  
import config from "./config.js";

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',  
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        debug: 'white'
    }
};

//LOGGER DEVELOP
const devLogger = winston.createLogger({ 
    levels: customLevelsOptions.levels, 
    transports: [
        new winston.transports.Console(
            { 
                level: "debug",  
                format: winston.format.combine(
                    winston.format.colorize({colors: customLevelsOptions.colors}),
                    winston.format.simple()
                )
            }
        ),
    ]
});

//LOGGER PRODUCTION
const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels, 
    transports: [
        new winston.transports.Console(
            {
                level: "info",
                format: winston.format.combine(
                    winston.format.colorize({colors: customLevelsOptions.colors}),
                    winston.format.simple()
                )
            }
        ),
        new winston.transports.File(
            {
                filename: './errors.log', 
                level: 'error', 
                format: winston.format.simple()
            }
        )
    ]
});

//MIDDLEWARE DE LOGGER
export const addLogger = (req, res, next) => {
    if (config.environment === 'production'){
        req.logger = prodLogger;
    } else {
        req.logger = devLogger;
    }
    req.logger.debug(`${req.method} en ${req.url} - fecha y hora: ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    next(); 
};