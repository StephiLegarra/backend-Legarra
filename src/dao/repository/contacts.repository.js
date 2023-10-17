import UserDto from "../dtos/user.dto.js";
import UserResponse from "../dtos/user.response.js";

class ContactsRepository {
    constructor(dao){
        this.dao = dao;
    }

    getContacts = async () => {
        return await this.dao.get();
    }
   
    createContact = async (user)=>{
        const newContact =  new UserDto(user);
        const userDao =  await this.dao.insert(newContact);
        const isUser = new UserResponse(userDao);
        return isUser;
    }
}
export default ContactsRepository;