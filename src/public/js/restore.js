const restorePassword = async () => {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  try{
  const response = await fetch(`/api/sessions/restore?user=${email}&pass=${password}`, {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ email: email, password: password }),
  });

  const data = await response.json();
  if (data.status === 200) {
    window.location.href = data.redirect;
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Contraseña actualizada con exito',
      showConfirmButton: false,
      timer: 2000
    })
  }
} catch (error) {
  console.error("Hubo un error al actualizar la contraseña:", error);
}
};

document.getElementById("btnRestore").onclick = restorePassword;
