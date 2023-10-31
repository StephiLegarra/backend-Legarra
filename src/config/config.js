import dotenv from "dotenv";
import {Command} from 'commander';

const program = new Command();

program
    .option('-d', 'Variable para debug', false)
    .option('-p <port>', 'Puerto del servidor', 8080)
    .option('--mode <mode>', 'Modo de trabajo', 'develop')
program.parse();

console.log("Mode Option: ", program.opts().mode);

const environment = program.opts().mode;

dotenv.config({
    path: environment === "develop" ? "./config/.env.develop" : "./config/.env.production"});

export const PORT=process.env.PORT
export const MONGODB_URL=process.env.MONGODB_URL
export const ADMIN_USER=process.env.ADMIN_USER 
export const ADMIN_PASS=process.env.ADMIN_PASS
export const SECRET_SESSIONS=process.env.SECRET_SESSIONS
export const CLIENT_ID_GITHUB=process.env.CLIENT_ID_GITHUB
export const CLIENT_SECRET_GITHUB=process.env.CLIENT_SECRET_GITHUB
export const JWT_KEY=process.env.JWT_KEY
export const PERSISTENCE = process.env.PERSISTENCE
export const GMAIL_USER = process.env.GMAIL_USER
export const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD
export const TWILIO_SID = process.env.TWILIO_SID
export const TWILIO_AUTH = process.env.TWILIO_AUTH
export const TWILIO_NUMBER = process.env.TWILIO_NUMBER
export const ENVIRONMENT = process.env.ENVIRONMENT
