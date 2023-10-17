import { ticketModel } from "./models/tickets.model";

class TicketManager {
   async getAll() {
        try {
            const tickets = await ticketModel.find();
            if(tickets.length > 0) {
                return tickets;
            }
            else {
                throw Error("Tickets no encontrados!");
            }
        } catch (error) {
            throw {
                code: 404,
                message: 'Error getting tickets',
                detail: error.message
            };
        }
    }

    async getTicketById(id) {
        try {
            const ticket = await ticketModel.findById(id);
            if(ticket) {
                return ticket;
            }
            else {
                throw Error("Tickets no encontrados!");
            }
        }
        catch (error) {
            throw {
                code: 404,
                message: `Error getting ticket with ID: ${id}.`,
                detail: error.message
            };
        }
    }

   async createTicket(ticket){
        try {
            ticket.status = "pending";
            if(!obj.code || !obj.purchase_datetime || !obj.amount || !obj.purchaser){
                console.log("Falta información: ", obj);
                throw new error ('Información insuficiente, revisar')
            }
            let resultTicket = await ticketModel.create(ticket);
            if(resultTicket){ 
                return resultTicket;
            }
            else {
                throw {
                    code: 404,
                    message: "No se pudo encontrar el ticket!"
                }
            }
        } catch (error) {
            throw {
                code: 400,
                message: "Error al crear el nuevo ticket!",
                detail: error.message
            };
        }
       
    }

    async resolveTicket(tid,order) {
        try {
            let result = await ticketModel.updateOne({_id: tid}, {$set:order});
            if(result.modifiedCount > 0){
                let ticket = await this.getTicketById(pid);
                return ticket;
            }
            else {
                throw Error("No se pudo resolver el ticket.")
            }
        }
        catch (error) {
            throw {
                code: 400,
                message: 'Error al agregar al carrito.',
                detail: error.message
            } 
        }
    }

    async deleteTicket(id)  {
        try {
            if(id) {
                let result = await ticketModel.deleteOne({_id: id});
                if(result.deletedCount > 0) {
                    return true;
                }
                else {
                    let cart = await this.getTicketById(id)
                    if(cart) {
                        throw Error("No se pudo borrar el carrito!")
                    }
                    else {
                        throw {
                            code: 404,
                            detail: "No se encontró el carrito!"
                        } 
                    }
                }
            }
            else {
                throw {
                    code: 400,
                    detail: "Valor id vacío"
                }
            }
        }
        catch (error) {
            throw {
                code: error.code,
                message: error.message? error.message : 'Error eliminando carrito',
                detail: error.detail? error.detail : error.message 
            }
        }
    }

}

export default TicketManager;