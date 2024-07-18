import axios from 'axios';
import CryptoData from '../models/model_services/cryptoData.model.js';
import cron from 'node-cron';
import 'dotenv/config';

const schedules = [
	'0 8 * * *' // 8:00 AM
];

async function criptoprice() {
	try {
		const url = process.env.URLCOINMARKET;
		const apiKey = process.env.COINMARKETAPIKEY;

		const response = await axios.get(url, {
			headers: {
				'X-CMC_PRO_API_KEY': apiKey
			}
		});


		const data = response.data.data;
		const status = response.data.status;

		// Create a new CryptoData document
		const cryptoData = new CryptoData({
			fecha: new Date(),
			data: data,
			status: status
		});
    
		await cryptoData.save();

		console.log('Criptomonedas actualizadas en la base de datos');
	} catch (error) {
		console.error('Error al obtener datos de la API:', error);
	}
}

schedules.forEach((schedule) => {
	cron.schedule(schedule, async () => {
		await criptoprice();
	});
});

export { criptoprice };
