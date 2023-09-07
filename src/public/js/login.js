const loginUser = async () => {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  const user = { email, password };

  const response = await fetch(
    `/api/sessions/login?user=${email}&pass=${password}`
  );
  const data = await response.json();
  if (data.status === "OK") {
    location.href = "/products";
  }
};

document.getElementById("btnLogin").onclick = loginUser;