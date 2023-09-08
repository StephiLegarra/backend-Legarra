//MIDDLEWARE PARA VERIFICAR LA SESION
//si se intenta ingresar a alguna de las otras rutas te trae directamente a esta
export function checkSession(request, response, next) {
  if (!request.session.user) {
    // La sesión ha expirado o el usuario no ha iniciado sesión, redirige a la página de inicio de sesión
    response.clearCookie("connect.sid");
    return response.redirect("/login");
  }
  next(); // Continúa con la siguiente función de middleware o ruta
}
