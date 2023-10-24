const restorePassword = async () => {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  const response = await fetch(`/api/sessions/restore?user=${email}&pass=${password}`);
  const data = await response.json();
  
  if (data.status === "OK") {
    window.location.href= "/profile";
  }
};

document.getElementById("btnRestore").onclick = restorePassword;