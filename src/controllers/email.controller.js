import nodemailer from 'nodemailer';
import config from '../config/config.js';
import __dirname from '../utils.js'

//Comunicacion del nodemailer con el servicio de gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmailAccount,    //tu gmail
        pass: config.gmailAppPassword   //la contraseña de aplicacion
    }
});

//VALIDAR SI SE VERIFICA LA CUENTA O HUBO UN ERROR
transporter.verify(function(error, success) {
    if (error) {
          console.log(error);   //si hay error
    } else {
          console.log('Server is ready to take our messages');   //si se valido la cuenta
    }
  });

  //EMAIL A ENVIAR
const mailOptions = {
    from: "Coder Test " + config.gmailAccount,   //de quien
    to: config.gmailAccount,   // a quien
    subject: "Correo de prueba Coderhouse Programacion Backend clase 30.",   //asunto del correo
    html: "<div><h1>Esto es un Test de envio de correos con Nodemailer!</h1></div>",  //plantilla con info - CUERPO DEL MAIL
    attachments: []  //imagenes
}

//EMAIL A ENVIAR CON ATTACHMENTS(FOTOS)
const mailOptionsWithAttachments = {
    from: "Coder Test " + config.gmailAccount,
    to: config.gmailAccount,
    subject: "Correo de prueba Coderhouse Programacion Backend clase 30.",
    //EN EL HTML PONEMOS EL IMG CON EL SRC Y LE DAMOS UN CID
    html: `<div>
                <h1>Esto es un Test de envio de correos con Nodemailer!</h1>
                <p>Ahora usando imagenes: </p>
                <img src="cid:meme"/>   
            </div>`,
    //EN EL ATTACHMENTS LE DAMOS UN NOMBRE, LA RUTA Y EL PEGAMOS EL MISMO CID (es como un id)
    attachments: [
        {
            filename: 'Meme de Programacion',
            path: __dirname+'/public/images/meme.jpg',
            cid: 'meme'
        }
    ]
}

//FUNCION ENVIAR EMAIL 
export const sendEmail = (req, res) => {
    try {
        let result = transporter.sendMail(mailOptions, (error, info) => {   //mailOptions es el mail q lo pusimos arriba
            if (error) {
                console.log(error);
                res.status(400).send({message: "Error", payload: error});  //si hay un error
            }
            console.log('Message sent: %s', info.messageId);   //mensaje enviado
            res.send({message: "Success!", payload: info});   //okkkkkk
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({error:  error, message: "No se pudo enviar el email desde:" + config.gmailAccount});
    }
};

//FUNCION ENVIAR EMAIL CON IMAGENES: Attachments 
export const sendEmailWithAttachments = (req, res) => {
    try {
        let result = transporter.sendMail(mailOptionsWithAttachments, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).send({message: "Error", payload: error});
            }
            console.log('Message sent: %s', info.messageId);
            res.send({message: "Success!", payload: info});
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({error:  error, message: "No se pudo enviar el email desde:" + config.gmailAccount});
    }
    
}