import { TWILIO_AUTH, TWILIO_SID, TWILIO_NUMBER } from '../config/config.js';
import twilio from "twilio";            

const twilioClient = twilio(TWILIO_SID, TWILIO_AUTH);  
const twilioSMSOptions = {  
    body: "No te pierdas nuestras ofertas! visita nuestro sitio web y aprovecha a llevarte el peluche más lindo!",
    from: TWILIO_NUMBER, 
    to: "+542494676598"    
}

export const sendSMS = async (req, res) => {
    try {
        console.log("Enviando un SMS usando la cuenta de Twilio!");
        console.log(twilioClient);
        const result = await twilioClient.messages.create(twilioSMSOptions); 
        res.send({message: "Success!", payload: result});
    } catch (error) {
        console.error("Hubo un problema enviando el SMS usando Twilio!");
        res.status(500).send({error: error});
    }
}