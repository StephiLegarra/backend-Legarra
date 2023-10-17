//import BusinessService from "../services/dao/business.dao.js";
import config from "../config/config.js";
import twilio from 'twilio';                //traemos la libreria de twilio

const twilioClient = twilio(config.twilioAccountSID, config.twilioAuthToken);  //iniciamos el twilioclient donde le pasamos SID y TOKEN
const twilioSMSOptions = {   //aca desarrollamos el sms
    body: "Esto es un mensaje SMS de prueba usando Twilio desde Coderhouse. Hola mi amor te llego?",
    from: config.twilioSmsNumber,   //del nro que tenemos en .env
    to: "+542494322040"    //modificar a quien le mandamos
}

export const sendSMS = async (req, res) => {
    try {
        console.log("Enviando SMS using Twilio account.");
        console.log(twilioClient);
        const result = await twilioClient.messages.create(twilioSMSOptions);  //llamamos a twilioclient y le creamos el mensaje
        res.send({message: "Success!", payload: result});
    } catch (error) {
        console.error("Hubo un problema enviando el SMS usando Twilio.");
        res.status(500).send({error: error});
    }
}