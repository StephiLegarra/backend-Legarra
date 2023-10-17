import TicketManager from "../dao/TicketManager.js";

class TicketServices{
    constructor(){
        this.ticketManager = new TicketManager();
    }

    async getTickets(){
     try {
        const tickets = await ticketManager.getAll()
        return tickets
      } catch (error) {
        return error;
      }
    }

    async createNewTicket(){
        try {
            const newTicket = await ticketManager.create(obj)
            return newTicket
        } catch (error) {
            return error;
        }
    }


}

export default TicketServices;

