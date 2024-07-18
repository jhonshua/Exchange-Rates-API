import { Router } from 'express';
import { verifyApiKey } from '../middlewares/validateApikey.js';
import { getPriceUsd } from '../controllers/controller_services/usdPrice.controller.js';
import { getPriceRub } from '../controllers/controller_services/rubPrice.controller.js';
import { getPriceEur } from '../controllers/controller_services/eurPrice.controller.js';
import { GetPrecioNational } from '../controllers/controller_services/sistemaNationalPrice.controller.js';
import { GetPriceCripto } from '../controllers/controller_services/criptoPrice.controller.js'

const router = Router();

router.get('/GetPrecioUsd/:apiKey', verifyApiKey, getPriceUsd);
router.get('/GetPrecioRub/:apiKey', verifyApiKey, getPriceRub);
router.get('/GetPrecioEur/:apiKey', verifyApiKey, getPriceEur);
router.get('/GetPrecioNational/:apiKey', verifyApiKey, GetPrecioNational);
router.get('/GetCripto/:apikey', verifyApiKey,  GetPriceCripto);


export default router;