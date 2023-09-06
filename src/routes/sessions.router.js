import express from "express";
import UserManager from "../dao/UserManager.js";

const router = express.Router();
const UM = new UserManager();

//LOGIN
router.get("/chat", async (request, response) => {
  try {
    response.render("chat");
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

//REGISTER
router.get("/chat", async (request, response) => {
  try {
    response.render("chat");
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

export default router;
