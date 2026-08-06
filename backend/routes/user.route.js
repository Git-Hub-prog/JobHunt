import express from "express";
import { getCurrentUser, getNotifications, login, logout, markAllNotificationsRead, markNotificationRead, register, updateProfile, toggleSaveJob } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { profileUpload, singleUpload } from "../middlewares/mutler.js";
 
const router = express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/me").get(isAuthenticated, getCurrentUser);
router.route("/notifications").get(isAuthenticated, getNotifications);
router.route("/notifications/:id/read").post(isAuthenticated, markNotificationRead);
router.route("/notifications/read-all").post(isAuthenticated, markAllNotificationsRead);
router.route("/save-job/:id").post(isAuthenticated, toggleSaveJob);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, profileUpload, updateProfile);

export default router;

