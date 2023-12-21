import nodemailer from "nodemailer";
import {GMAIL_USER, GMAIL_PASSWORD} from "../config/config.js";
import __dirname from "../utils.js";

//COMUNICAR NODEMAILER - GMAIL
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: GMAIL_USER,    
        pass: GMAIL_PASSWORD  
    },
    tls: {
        rejectUnauthorized: false
      }
});

// VERIFICAR 
transporter.verify(function(error, success) {
    if (error) {
          req.logger.error(error); 
    } else {
         console.log("El servidor está listo para recibir mensajes!");   
    }
  });

  //EMAIL DE PRUEBA - PUBLICIDAD
const mailOptions = {
    from: "Coder Test " + GMAIL_USER,  
    to: GMAIL_USER, //Prueba enviandome el mail a mi misma
    subject: "OFERTAS IMPERDIBLES!",   
    html: `<div>
    <h1>Qué estás esperando para tener tu peluche favorito?</h1>
    <h2>No te pierdas la oportunidad! visita nuestro sitio ahora para aprovechar las mejores ofertas a precios increíbles! <h2>
    <p>Consulta por cuotas sin interés con nuestras tarjetas adheridas! </p>
    <img src="cid:pokemon"/>   
     </div>`,
    attachments: [
        {
            filename: 'Imagen de Pokemon',
            path: __dirname+'/public/images/pokemon.jpg',
            cid: 'pokemon'
        }
    ] 
}

//FUNCION ENVIAR EMAIL PRUEBA DE PUBLICIDAD
export const sendEmail = (req, res) => {
    try {
        let result = transporter.sendMail(mailOptions, (error, info) => {  
            if (error) {
                req.logger.error(error);
                res.status(400).send({message: "Error", payload: error}); 
            }
            req.logger.info('Mensaje enviado: ', info.messageId);   
            res.send({message: "Success!", payload: info});   
        });
    } catch (error) {
        req.logger.fatal(error);
        res.status(500).send({error: error, message: "No se pudo enviar el email desde:" + GMAIL_USER});
    }
};



