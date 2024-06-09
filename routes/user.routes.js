import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { validateReqBody } from '../middlewares/validation.js';
import {
	GetUserById,
	UpdateUser,
	GetAllUsers,
	DeleteUser,
	CreateUser
} from '../controllers/user.controller.js';

const router = Router();

router.get('/users', validateReqBody, authRequired, GetAllUsers);
router.get('/users/:id', authRequired, GetUserById);
router.delete('/DeleteUsers/:id', authRequired, DeleteUser);
router.post('/CreateUser', authRequired, CreateUser);
router.patch('/UpdateUsers/:id', authRequired, UpdateUser);

export default router;
