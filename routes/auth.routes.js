import { Router } from 'express';
import {login, logout} from '../controllers/controller_auth/auth.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import {validateUserlogin, validateReqBody } from '../middlewares/validation.js';

const router = Router();
router.post('/auth', validateReqBody, validateUserlogin, login);
router.post('/logout', authRequired, logout);
router.post('/reset', logout);

export default router
