const registerUser = async () => {
  let first_name = document.getElementById("first_name").value;
  let last_name = document.getElementById("last_name").value;
  let email = document.getElementById("email").value;
  let age = document.getElementById("age").value;
  let password = document.getElementById("password").value;

  const user = { first_name, last_name, email, age, password };

  const response = await fetch("/api/sessions/register", {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify(user),
  });
  const data = await response.json();
  //console.log(data);

  if (data) {
    console.log("El usuario ha sido registrado con exito");
  } else {
    console.log("Error, no se ha podido registrar el usuario");
  }
};

document.getElementById("btnRegister").onclick = registerUser;
