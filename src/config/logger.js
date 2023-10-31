import winston from "winston";  
import { ENVIRONMENT } from "./config.js";


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
        info: 'cyan',
        http: 'blue',
        debug: 'green'
    }
};

//LOGGER DEVELOP
export const devLogger = winston.createLogger({ 
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
        )
    ]
});

//LOGGER PRODUCTION
export const prodLogger = winston.createLogger({
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
export const log = (message, req) => {
    return `${message}, ${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
}

//MIDDLEWARE DE LOGGER
export const addLogger = (req, res, next) => {
    if (ENVIRONMENT === 'develop'){
       req.logger = devLogger;
    } else {
        req.logger = prodLogger;
    }
    next(); 
};

