export const generateUserError= (user)=>{
    return `Un dato o varios fueron ingresados incorrectamente o falta algún dato.
            Datos requeridos:
                * first_name: type String, recibido: ${user.first_name}
                * last_name: type String, recibido: ${user.last_name}
                * email: type String, recibido: ${user.email}
                * age: type Number, recibido: ${user.age}
                * password: type String, recibido: ${user.password}`;
};