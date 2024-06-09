import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { connectDB } from './db.js';
import { usdScrapeDivContent } from './microservices/usdprice.js';
import { rubScrapeDivContent } from './microservices/rubprice.js';
import { eurScrapeDivContent } from './microservices/eurprice.js';
import { criptoprice } from './microservices/criptoprice.js';
import 'dotenv/config';

import user from './routes/user.routes.js';
import auth from './routes/auth.routes.js';
import apiKey from './routes/apiKey.routes.js';
import services from './routes/services.routes.js';

const app = express();
const port = process.env.PORT || 3000;
const front_url = process.env.FRONTEND_URL;

app.use(
	cors({
		credentials: true,
		origin: front_url
	})
);

connectDB();
criptoprice();
usdScrapeDivContent();
eurScrapeDivContent();
rubScrapeDivContent();

app.use(express.json({ strict: false }));
app.use(morgan('dev'));
app.use(apiKey);
app.use(services);
app.use(auth);
app.use(user);
// Iniciar la aplicación
app.listen(port, () =>
	console.log(`Servidor API Express escuchando en el puerto ${port}`)
);
