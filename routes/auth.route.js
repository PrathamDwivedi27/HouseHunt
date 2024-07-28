import express from 'express'
import { Router } from 'express'
import { login, logout, register } from '../controllers/auth_controller.js';


const router=express.Router();

router.post('/register',register);
router.post('/login',login);
router.post('/logout',logout);


export default router;