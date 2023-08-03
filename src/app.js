import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/view.router.js";
import { Server } from "socket.io";
import ProductManager from "./ProductManager.js";

const app = express();
const puerto = 8080;

// SERVER HTTP
const httpServer = app.listen(puerto, () => {
  console.log(`Servidor inicializado en puerto ${puerto}`);
});
// SOCKET SERVER
const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/", viewsRouter);

// APERTURA
socketServer.on("connection", (socket) => {
  console.log("Conexión establecida");

  // CREAR PRODUCTO
  socket.on("mensajeKey", (data) => {
    const productos = new ProductManager();

    console.log("Se agrego el producto");
    console.log(data);

    productos.addProduct(data);
    socket.emit("msgServer", "Nuevo producto agregado");
    socket.emit("msgServer", data);
  });

  //ELIMINAR PRODUCTO POR ID
  socket.on("mensajeID", (data) => {
    const productos = new ProductManager();
    console.log("Se envio ID");
    console.log(data);
    let ID = parseInt(data);

    productos.deleteProduct(ID);
    socket.emit("msgServer", "Producto eliminado");
  });

  socket.broadcast.emit(
    "mensajeKey",
    "Hay un nuevo producto en la base de datos"
  );
});
