import { generateMockProduct } from "./utils.moking.js";

//OBTENGO 100 PRODUCTOS USANDO EL MOCK DE FAKER
export const getMockProducts = async (req, res) => {
    try {
        let products = [];
        for (let i = 0; i < 101; i++) {
            products.push(generateMockProduct());
        }
        res.send({status: "success", payload: products});
    } catch (error) {
        console.error(error);
        res.status(500).send({error:  error, message: "Lo siento! No se pudieron obtener los productos!"});
    }
};