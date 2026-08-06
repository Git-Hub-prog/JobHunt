import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/").get(isAuthenticated, getMessages);
router.route("/send").post(isAuthenticated, sendMessage);

export default router;
