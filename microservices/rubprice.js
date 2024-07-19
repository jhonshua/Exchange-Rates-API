import { launch } from 'puppeteer';
import cron from 'node-cron';
import Ruble from '../models/model_services/rub.model.js';
import 'dotenv/config';

const schedules = [
	'0 18 * * *' // 6:00 PM
];

async function schedulesRub() {
	try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const formattedYesterday = yesterday.toLocaleDateString('en-CA');
    
        const today = new Date();
        const formattedtoday = today.toLocaleDateString('en-CA');
    
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1);
        const formattedtomorrow = tomorrow.toLocaleDateString('en-CA');
    
        const start = `${formattedYesterday}T17:00:00.000Z`;
        const end = `${formattedtoday}T18:00:00.000Z`;
        const next = `${formattedtomorrow}T18:00:00.000Z`;
    
        const precio1 = await Ruble.find({
            createdAt: {
                $gte: start,
                $lt: end
            }
        });
    
        const precio2 = await Ruble.find({
            createdAt: {
                $gte: end,
                $lt: next
            }
        });
    
        // Comprobar datos guardados y accionar
        if (precio1.length === 0) {
           await rubScrapeDivContent();
        } else if(precio2.length === 0){
           await rubScrapeDivContent();
        }else {
            console.log('Ya se guardaron registros rublos hoy.');
        }
    } catch (error) {
        console.error('Error:', error);
        // Manejar el error de manera adecuada (por ejemplo, registrarlo o notificar)
    }
}
  

async function rubScrapeDivContent() {
	const url = process.env.URLRUB;
	const divSelector = process.env.DIVRUB;


	try {
		const browser = await launch({ headless: true });
		const page = await browser.newPage();

		await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
		await page.waitForSelector(divSelector);

		const divContent = await page.$eval(
			divSelector,
			(element) => element.textContent
		);
		await browser.close();

		const regex = /\s+/g;
		const cleanText = divContent.replace(regex, ' ');

		// Guardar el precio en la base de datos
		const ruble = new Ruble({
			fecha: new Date(),
			precio: cleanText // Guardar como string
		});

		await ruble.save();
		console.log(`Precio del ruble guardado: ${cleanText}`);

		return cleanText;
	} catch (error) {
		console.error('Error al realizar scraping:', error);
		return null;
	}
}

schedules.forEach((schedule) => {
	cron.schedule(schedule, async () => {
		await schedulesRub();
	});
});

export { schedulesRub };
