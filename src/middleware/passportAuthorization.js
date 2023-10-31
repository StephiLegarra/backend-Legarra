import passport from "passport";

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (error, user, info) {
      if (error) {
        req.logger.error('Error durante la autenticación', error);
        return next(error);
      }

      if (!user) {
        return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorization = (rol) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({ status: "error", message: "Unauthorizated" });
    }

    if (!rol.includes(req.user.rol)) {
      req.logger.error('El usuario no tiene el rol necesario'); 
      return res.status(400).send({ status: "error", message: "No permissions" });
    }
    next();
  };
};
