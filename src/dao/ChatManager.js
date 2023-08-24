import { messageModel } from "./models/message.model.js";

class ChatManager {
  async getMessages() {
    try {
      return await messageModel.find().lean();
    } catch (error) {
      console.log(error.message);
    }
  }

  async createMessage(message) {
    try {
      return await messageModel.create(message);
    } catch (error) {
      console.log(error.message);
    }
  }
}

export default ChatManager;
