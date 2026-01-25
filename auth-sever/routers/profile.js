import express from "express";
import { handleForgotPassword, handlePasswordChange } from "../controller/profileController.js";
import { requireAuth } from "../middlewares/authMiddleWare.js";

const router = express.Router();

router.post('/change-password',requireAuth,handlePasswordChange);
router.post('/forgot-password',handleForgotPassword)



export default router;