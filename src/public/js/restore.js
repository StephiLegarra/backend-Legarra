const restorePassword = async () => {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  const response = await fetch(`/api/sessions/restore?user=${email}&pass=${password}`);
  const data = await response.json();
  
  if (data.status === "OK") {
    window.location.href= "/profile";
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Contraseña actualizada con exito',
      showConfirmButton: false,
      timer: 2000
    })
  }
};

document.getElementById("btnRestore").onclick = restorePassword;

