import express from "express";
import Handlebars from "handlebars";
import expressHandlebars from "express-handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import viewsRouter from "./routes/view.router.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import initializePassport from "./middleware/passport.js"; 
import initializeGitHubPassport from "./middleware/github.js";
import { PORT, MONGODB_URL, SECRET_SESSIONS } from "./config/config.js";
import cors from "cors";

//EXPRESS
const app = express();

// SERVER HTTP
const httpServer = app.listen(PORT, () => {console.log(`Servidor inicializado en puerto ${PORT}`)});
// SOCKET SERVER
const socketServer = new Server(httpServer);
app.set("socketServer", socketServer);

app.engine("handlebars",
  expressHandlebars.engine({handlebars: allowInsecurePrototypeAccess(Handlebars)}));

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname));

//SESSION
app.use(cookieParser());
app.use(session({
    store: new MongoStore({
      mongoUrl: MONGODB_URL,
      collectionName:"sessions",
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 10000,
    }),
    secret: SECRET_SESSIONS,
    resave: false,
    saveUninitialized: false,
    cookie: {secure:false}
  }));
initializeGitHubPassport();
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/api/sessions/", sessionsRouter);
app.use("/", viewsRouter);

app.use(cors()); 

//IMPORT
import ProductManager from "./dao/ProductManager.js";
const productManager = new ProductManager();

import ChatManager from "./dao/ChatManager.js";
const chat = new ChatManager();

import CartManager from "./dao/CartManager.js";
const CM = new CartManager();

import UserManager from "./dao/UserManager.js";
const UM = new UserManager();

// CONECT MONGO DB
mongoose.connect(MONGODB_URL);
mongoose.connection.on("connected", () => {
  console.log("Conectado a MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.error("Error conectando a MongoDB:", err);
});

// APERTURA SOCKET ON
socketServer.on("connection", async (socket) => {
  console.log("Conexión establecida");

  // PRODUCTOS REAL TIME
  const products = await productManager.getProducts();
  socket.emit("realTimeProducts", products);

  // CREAR PRODUCTO
  socket.on("nuevoProducto", async (data) => {
    const product = {
      title: data.title,
      thumbnail: data.thumbnail,
      price: data.price,
      description: data.description,
      code: data.code,
      category: data.category,
      stock: data.stock,
      status: "",
    };
    productManager.addProduct(product);
    const products = productManager.getProducts();
    socket.emit("realTimeProducts", products);
  });
  /* socket.on("nuevoProducto", async (data) => {
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
  });*/

  //ELIMINAR PRODUCTO POR ID
  socket.on("mensajeID", async (data) => {
    try {
      const productos = new ProductManager();
      console.log("Se envio el ID a eliminar");
      console.log(data);
      let ID = parseInt(data);

      await productos.deleteProduct(ID);
      socket.emit("msgServer", "Producto eliminado");
    } catch (err) {
      socket.emit("error", { error: err.message });
    }
  });

  socket.broadcast.emit("mensajeKey","Hay un nuevo producto en la base de datos");

  //CHAT
  socket.on("mensajeChat", async (data) => {
    chat.createMessage(data);
    const messages = await chat.getMessages();
    const updateInterval = 2000;
    setInterval(() => {
      socket.emit("messages", messages);
    }, updateInterval);
  });
});
