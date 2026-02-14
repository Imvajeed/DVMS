import express from "express";
import { handleResetPasswordViewLink } from "../controller/resetPasswordController.js";


const router = express.Router();

router.get('/reset-link',handleResetPasswordViewLink)


export default router;