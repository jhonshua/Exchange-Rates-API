import { Router } from 'express';
import { verifyApiKey } from '../middlewares/validateApikey.js';
import { getPriceUsd,getPriceUsdDate } from '../controllers/controller_services/usdPrice.controller.js';
import { getPriceRub,getPriceRubDate } from '../controllers/controller_services/rubPrice.controller.js';
import { getPriceEur, getPriceEurDate } from '../controllers/controller_services/eurPrice.controller.js';
import { GetPrecioNational, GetPrecioNationalDate } from '../controllers/controller_services/sistemaNationalPrice.controller.js';
import { GetPriceCripto } from '../controllers/controller_services/criptoPrice.controller.js'

const router = Router();

router.get('/GetPrecioUsd/:apiKey', verifyApiKey, getPriceUsd);
router.get('/GetPrecioUsdDates/:apiKey', verifyApiKey, getPriceUsdDate);

router.get('/GetPrecioRub/:apiKey', verifyApiKey, getPriceRub);
router.get('/GetPrecioRubDates/:apiKey', verifyApiKey, getPriceRubDate);

router.get('/GetPrecioEur/:apiKey', verifyApiKey, getPriceEur);
router.get('/GetPrecioEurDates/:apiKey', verifyApiKey, getPriceEurDate);

router.get('/GetPrecioNational/:apiKey', verifyApiKey, GetPrecioNational);
router.get('/GetPrecioNationalDate/:apiKey', verifyApiKey, GetPrecioNationalDate);

router.get('/GetCripto/:apikey', verifyApiKey,  GetPriceCripto);
//router.get('/GetCriptoData/:apikey', verifyApiKey,  GetPriceCripto);

//router.get('/GetGold/:apikey', verifyApiKey,  GetPriceCripto);
//router.get('/GetGoldData/:apikey', verifyApiKey,  GetPriceCriptoData);

//router.get('/GetGas/:apikey', verifyApiKey,  GetPriceCripto);
//router.get('/GetGasData/:apikey', verifyApiKey,  GetPriceCriptoData);


export default router;