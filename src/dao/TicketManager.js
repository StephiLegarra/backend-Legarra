import { ticketModel } from "./models/ticket.model.js";

export default class TicketManager {
    async getAll(){
        try {
            const tickets = await ticketModel.find()
            return tickets
        } catch (error) {
            req.logger.fatal(error);
        }
    }

    async create(obj){
        try {
            req.logger.info("Crear un nuevo ticket: ", obj);
            if(!obj.code || !obj.purchase_datetime || !obj.amount || !obj.purchaser){
                req.logger.error("Informacion insuficiente: ", obj);
                throw new error ('Por favor revise la información ya es que es insuficiente')
            }
            const newTicket = await ticketModel.create(obj)
            return newTicket
        } catch (error) {
            req.logger.fatal(error);
        }
    }
}
