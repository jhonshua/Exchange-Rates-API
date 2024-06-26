import { Router } from 'express';
import {
	login,
	register,
	logout,
	deleteUser
} from '../controllers/auth.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import {
	validateUserlogin,
	validateReqBody,
	validateUserRegistration
} from '../middlewares/validation.js';

const router = Router();
router.post('/register', validateReqBody, validateUserRegistration, register);
router.post('/auth', validateReqBody, validateUserlogin, login);
router.post('/logout', logout);
router.delete('/deleteUser', validateReqBody, authRequired, deleteUser);

export default router
