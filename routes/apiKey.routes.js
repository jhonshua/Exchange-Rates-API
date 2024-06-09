import { Router } from "express";
import { authRequired } from '../middlewares/validateToken.js';
import { validateReqBody } from '../middlewares/validation.js'
import { addApikey} from '../controllers/apiKey.controller.js'

const router = Router();

router.post('/asignar-clave-api', validateReqBody, authRequired, addApikey);

export default router;