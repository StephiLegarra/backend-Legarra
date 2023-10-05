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
const PM = new ProductManager();

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
  const allProducts = await PM.getProducts();
  socket.emit("realTimeProducts", allProducts);

  // CREAR PRODUCTO
  socket.on("nuevoProducto", async (obj) => {
    await PM.addProduct(obj);
    const productsList = await PM.getProductsViews();
    socketServer.emit("envioDeProductos", productsList);
  });

  //ELIMINAR PRODUCTO POR ID
  socket.on("deleteProduct",async(id)=>{
    const productsList = await PM.getProductsViews();
    await PM.deleteProduct(id);
    socketServer.emit("envioDeProductos", productsList);
    });

  socket.on("eliminarProducto", (data)=>{
    PM.deleteProduct(parseInt(data));
    const productsList = PM.getProducts();
    socketServer.emit("envioDeProductos", productsList);
  });

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
