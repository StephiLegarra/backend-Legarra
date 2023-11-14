//CHECKSESSION
//Control de acceso
export const checkSession = (req, res, next) => {
    if (req.session && req.session.user) {
      req.logger.info("Chequeando sesion: ", req.session.user);
      next();
    } else {
      req.logger.warning("Error! Redireccionamos al login!");
      res.redirect("/login");
    }
  };
  
 export const checkAlreadyLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
      req.logger.info("Usuario ya autenticado, redirigiendo a /profile");
      res.redirect("/profile");
    } else {
      req.logger.error("Usuario no autenticado, procediendo...");
      next();
    }
  };