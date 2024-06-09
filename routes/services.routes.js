import { Router } from 'express';
import { verifyApiKey } from '../middlewares/validateApikey.js';
import { getPriceUsd } from '../controllers/services/usdPrice.controller.js';
import { getPriceRub } from '../controllers/services/rubPrice.controller.js';
import { getPriceEur } from '../controllers/services/eurPrice.controller.js';

const router = Router();

router.get('/GetPrecioUsd/:apiKey',  verifyApiKey, getPriceUsd );
router.get('/GetPrecioRub/:apiKey',  verifyApiKey, getPriceRub );
router.get('/GetPrecioEur/:apiKey',  verifyApiKey, getPriceEur );

export default router;