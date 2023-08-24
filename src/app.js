import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/view.router.js";
import { Server } from "socket.io";
import ProductManager from "./dao/ProductManager.js";
import ChatManager from "./dao/ChatManager.js";
import mongoose from "mongoose";

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

// CONECT DB
mongoose.connect(
  "mongodb+srv://stephanielegarra:Cluster2023@stephanielegarra.lxv1yij.mongodb.net/ecommerce?retryWrites=true&w=majority"
);

// APERTURA
socketServer.on("connection", async (socket) => {
  console.log("Conexión establecida");

  // PRODUCTOS REAL TIME
  const productManager = new ProductManager();
  const products = await productManager.getProducts();

  socket.emit("realTimeProducts", products);

  // CREAR PRODUCTO
  socket.on("addProduct", async (data) => {
    try {
      const productos = new ProductManager();
      console.log("Se agrego el producto");
      console.log(data);

      await productos.addProduct(data);
      socket.emit("msgServer", "Nuevo producto agregado");
      socket.emit("msgServer", data);
    } catch (err) {
      socket.emit("error", { error: err.message });
    }
  });

  //ELIMINAR PRODUCTO POR ID
  socket.on("mensajeID", (data) => {
    const productos = new ProductManager();
    console.log("Se envio el ID a eliminar");
    console.log(data);
    let ID = parseInt(data);

    productos.deleteProduct(ID);
    socket.emit("msgServer", "Producto eliminado");
  });

  socket.broadcast.emit(
    "mensajeKey",
    "Hay un nuevo producto en la base de datos"
  );

  //CHAT
  socket.on("mensajeChat", async (data) => {
    ChatManager.createMessage(data);
    const messages = await ChatManager.getMessages();
    socket.emit("messages", messages);
  });
});
