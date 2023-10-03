import bcrypt from "bcrypt";

//CREA EL HASH
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//VALIDACION DE CONTRASEÑA
export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);
