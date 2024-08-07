import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { validateReqBody } from '../middlewares/validation.js';
import {
	GetUserById,
	UpdateUser,
	GetAllUsers,
	DeleteUser,
	CreateUser
} from '../controllers/controller_user/user.controller.js';

const router = Router();

router.get('/users', authRequired, GetAllUsers);
router.get('/users/:id', authRequired, GetUserById);
router.delete('/DeleteUsers/:id', authRequired, DeleteUser);
router.post('/CreateUser', validateReqBody, CreateUser);
router.patch('/UpdateUsers/:id', authRequired, UpdateUser);

export default router;
