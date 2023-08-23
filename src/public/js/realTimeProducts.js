//DESDE CLIENTE AL SERVER
const socket = io();
const content = document.getElementById("content");

socket.on("realTimeProducts", (data) => {
  let salida = ``;

  data.forEach((item) => {
    salida += `   <div class="col-md-6">
    <div class="card border-black mb-5">
      <h3 class="text-light bg-black">${item.title}</h3>
      <img
        src="${item.thumbnail}"
        class="img-fluid"
        alt="imagen del producto"
      />
      <div class="card-body text-center">
        <h4 class="text-danger">Precio: ${item.price}</h4>
        <h6>${item.description}</h6>
        <p>ID: ${item.id}</p>
      </div>
      <p> ----------------------------------------------------</p>
    </div>
  </div>`;
  });

  content.innerHTML = salida;
});

// ADD PRODUCT
const btnAgregarProducto = document.getElementById("miFormularioPost");
btnAgregarProducto.addEventListener("click", async (event) => {
  event.preventDefault();
  try {
    const title = document.getElementById("title").value;
    const thumbnail = document.getElementById("thumbnail").value.split(" ");
    const description = document.getElementById("description").value;
    const price = parseInt(document.getElementById("price").value);
    const code = document.getElementById("code").value;
    const stock = parseInt(document.getElementById("stock").value);
    const formProduct = {
      title: title,
      thumbnail: thumbnail,
      price: price,
      description: description,
      code: code,
      category: category,
      stock: stock,
    };
    socket.emit("mensajeKey", formProduct);
  } catch (error) {
    console.log("error.message");
  } finally {
    btnAgregarProducto.reset();
  }
});
socket.on("mensajeKey", (data) => {
  console.log("Se agrego un nuevo producto");
});

// DELETE PRODUCT
const btnEliminarProducto = document.getElementById("btnEliminarProducto");
btnEliminarProducto.addEventListener("click", async (event) => {
  try {
    const id = parseInt(document.getElementById("id").value);
    socket.emit("mensajeID", id);
  } catch (error) {
    console.log(error.message);
  } finally {
    document.getElementById("id").value == "";
  }
});

socket;
socket.on("msgServer", (data) => {
  console.log(data);
});

socket.on("eventoTodos", (data) => {
  console.log(data);
});
