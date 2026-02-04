import express from "express";
import { handleGetBalance, handleCreateAccount, hanldeTransferAmount, handleGetUsers } from "../controller.js/bankController.js";

const router = express.Router();

router.get('/balance', handleGetBalance);
router.post('/create-account', handleCreateAccount);
router.post('/transfer', hanldeTransferAmount);
router.get('/users', handleGetUsers);


export default router;