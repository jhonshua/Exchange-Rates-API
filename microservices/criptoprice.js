import axios from 'axios';
import CryptoData from '../models/model_services/cryptoData.model.js';
import cron from 'node-cron';
import 'dotenv/config';

const schedules = [
	'0 8 * * *' // 8:00 AM
];

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const formattedYesterday = yesterday.toLocaleDateString('en-CA');

const today = new Date();
const formattedtoday = new Date(today.getTime() - 4 * 60 * 60 * 1000);

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const formattedtomorrow = tomorrow.toLocaleDateString('en-CA');

const start = `${formattedYesterday}T18:00:00.000Z`;
const end = formattedtoday;
const next = `${formattedtomorrow}T18:00:00.000Z`;

async function schedulesCripto() {
    try {
        const precio1 = await CryptoData.find({
            created: {
                $gte: start,
                $lt: end
            }
        });
    
        const precio2 = await CryptoData.find({
            created: {
                $gte: end,
                $lt: next
            }
        });
    
        // Comprobar datos guardados y accionar
            if (precio1.length === 0) {
                await criptoprice();
            } else if(precio2.length === 0){
                await criptoprice();
            }else {
                console.log('Ya se guardaron registros criptos hoy.');
            }
        } catch (error) {
            console.error('Error:', error);
            // Manejar el error de manera adecuada (por ejemplo, registrarlo o notificar)
        }
}

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
			status: status,
            created: formattedtoday
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

export { schedulesCripto };
