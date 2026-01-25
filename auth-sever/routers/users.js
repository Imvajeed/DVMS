import express from 'express';
import { handleRegisterUser, handleLoginUser, handleRefreshController } from '../controller/usersController.js';

const router = express.Router();

router.post('/register', handleRegisterUser);
router.post('/login', handleLoginUser);
router.get('/refreshtoken',handleRefreshController)


export default router;