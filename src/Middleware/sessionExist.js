//Middleware para verificar si hay session activa y evitar acceder a login y register
export function sessionExist(request, response, next) {
  if (request.session.user) {
    // Si hay una sesión activa y el usuario intenta acceder a /login o /register,
    // redirige automáticamente a la página de inicio (por ejemplo, /home)
    return response.redirect("/home");
  }

  // Si la sesión no está activa, permite el acceso a /login y /register
  next();
}
