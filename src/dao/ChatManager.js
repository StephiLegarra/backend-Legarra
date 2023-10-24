import { messageModel } from "./models/message.model.js";

class ChatManager {
  //VER MENSAJES
  async getMessages() {
    try {
      return await messageModel.find().lean().exec();
    } catch (error) {
      console.log(error.message);
    }
  }
   //CREAR MENSAJE
  async createMessage(message) {
    if (message.user.trim() === '' || message.message.trim() === ''){
      return null;
    }
    try {
      return await messageModel.create(message);
    } catch (error) {
      console.log(error.message);
    }
  }

  //ELIMINAR LOS MENSAJES
  deleteAllMessages = async() =>{
    try{
       console.log("Borrando todos los mensajes...");
       const result = await messageModel.deleteMany({});
       console.log("Mensajes borrados" + result);
       return result;
    }catch(error){
      console.log(error.message);
    }
    }
}

export default ChatManager;
