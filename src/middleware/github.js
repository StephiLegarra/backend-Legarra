import passport from "passport";
import GitHubStrategy from "passport-github2";
import { userModel } from "../dao/models/user.model.js";
import { CLIENT_SECRET_GITHUB, CLIENT_ID_GITHUB } from "../config/config.js";

//INICIAR SESION CON GIHTUB
const initializeGitHubPassport = () => {
  passport.use("github", new GitHubStrategy({
        clientID: CLIENT_ID_GITHUB,
        clientSecret: CLIENT_SECRET_GITHUB,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      }, async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          let user = await userModel.findOne({ email: profile._json.email });

          if (user) {
            return done(null, user);
          } else {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              email: profile._json.email,
              age: 100,
              password: "",
            };

            let result = await userModel.create(newUser);
            return done(null, result);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializeGitHubPassport;
