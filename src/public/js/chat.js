const socket = io();

const messages = document.getElementById("messages");
socket.on("messages", (data) => {
  messages.innerHTML = ``;
  let salida = ``;

  data.forEach((item) => {
    salida += `<p class="card-text"><b>${item.user}:</b> <span class="fw-light">${item.message}</span></p>`;
  });

  messages.innerHTML = salida;
});

const sendMessage = () => {
  const user = document.getElementById("user");
  const message = document.getElementById("message");
  socket.emit("mensajeChat", { user: user.value, message: message.value });
  user.value = "";
  message.value = "";
};

const btnEnviarMensaje = document.getElementById("btnEnviarMensaje");
btnEnviarMensaje.onclick = sendMessage;
