import passport from "passport";
import local from "passport-local";
import { userModel } from "../dao/models/user.model.js";
import { isValidPassword, createHash } from "./bcrypt.js";
import jwt from "passport-jwt";
import { ADMIN_PASS, ADMIN_USER, JWT_KEY, PREMIUM_EMAIL, PREMIUM_PASSWORD } from "../config/config.js";
import CartServices from "../services/cart.service.js";
import UserService from "../services/user.service.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const LocalStrategy = local.Strategy;
const cartService = new CartServices();
const userService = new UserService();

//ESTRATEGIAS DE PASSPORT
const initializePassport = ()=>{
passport.use("login", new LocalStrategy({passwordField:"password",usernameField:"email"},
        async (username, password, done) => {
          req.logger.info("authenticate user:", username);
  
          try {
            let user = await userModel.findOne({ email: username });
  
            if (!user) {
              return done(null, false, { message: "Error! El usuario es incorrecto!" });
            }
            if (!isValidPassword(user, password)) {
              return done(null, false, { message: "Error! La contraseña es incorrecta!" });
            }

            if (!user.cart) {
              const cart = await cartService.createCart()
              user.cart = cart._id;
              await userService.updateUser(username, user)
          }
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
    
  passport.use("register", new LocalStrategy({passReqToCallback:true, usernameField:"email"}, 
  async (req, username, password, done) => {
          const {first_name, last_name, email, age, adminRol, premiumRol} = req.body;
          try {
              let user = await userModel.findOne({email:username})
              if (user){
                req.logger.error("El usuario " + email + " ya se encuentra registrado!");
                  return done(null, false);
              }

              let cart = {}
              if(!adminRol){
                  cart = await cartService.addCart();
              }

              user = {first_name, 
                      last_name, email, 
                      age, 
                      password: createHash(password),
                      cartId: cart._id? cart._id : null,
                      rol: adminRol? 'admin' : premiumRol? 'premium' : 'user'};

              let resultado = await userModel.create(user);
              req.logger.info("Usuario registrado correctamente! " + resultado);
              if (resultado) {
                  return done (null, resultado);
              }
          } catch (error) {
              req.logger.fatal("Error en el registro", error);
              return done(error);
           }
  }))
  
  passport.use("jwt", new JWTStrategy ({jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), 
      secretOrKey:JWT_KEY}, 
      async(jwt_payload, done) => {
          try {
              const user = await userModel.findOne({email: jwt_payload.email});
              if(!user){
                  return done (null, false, {message: "El usuario no pudo ser encontrado en nuestra base de datos"})
              }
              return done (null, user);
          } catch (error) {
              return done (error)
          }
      }))
  }

//SERIALIZE
passport.serializeUser((user, done) => {
  done(null, user._id)
})

//DESERIALIZE
passport.deserializeUser(async(id, done) => {
  let user = await userModel.findById(id)
  done(null, user)
})

//COOKIEEXTRACTOR
const cookieExtractor = (req) => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies["coderCookieToken"];
  }

  return token;
};

export default initializePassport;
