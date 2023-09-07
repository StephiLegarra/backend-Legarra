export function permission(request, response, next) {
  if (request.session.user.rol === "user") {
    const requestedUrl = request.originalUrl;

    // Redirige al usuario a la página de inicio con un mensaje de error que incluye la URL
    return response.redirect(
      `/home?message=No%20tienes%20permisos%20para%20ingresar%20a%20${requestedUrl}.`
    );
  }
  next();
}
