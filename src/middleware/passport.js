import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { userModel } from "../dao/models/user.model.js";
import { isValidPassword } from "./bcrypt.js";

//ESTRATEGIA LOCAL
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      let user = await userModel.findOne({ email: email });

      if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
        user = {
          first_name: "coderhouse",
          email: email,
          password: password,
          rol: "admin",
        };
      }
      if (!user) {
        return done(error);
      }
      if (user.password != "adminCod3r123") {
        if (!isValidPassword(password, user.password)) {
          return done(error);
        }
      }
      if (user.password != "adminCod3r123") {
        delete user.password;
      }
      done(null, user);
    }
  )
);

passport.serializeUser((user, next) => {
  next(null, user["email"]);
});

passport.deserializeUser((username, next) => {
  const user = userModel.findOne({ email: username });
  next(null, user);
});

export const initializePassport = passport.initialize();
export const passportSession = passport.session();

export const autenticacionUserPass = passport.authenticate("local", {
  failWithError: true,
});
