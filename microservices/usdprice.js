import { launch } from 'puppeteer';
import puppeteer from 'puppeteer'; 
import cron from 'node-cron';
import Dolar from '../models/model_services/usd.model.js';
import 'dotenv/config';

const schedules = [
	'0 18 * * *' // 6:00 PM
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

async function schedulesUsd() {
	try {
		const precio1 = await Dolar.find({
			created: {
				$gte: start,
				$lt: end
			}
		});

		const precio2 = await Dolar.find({
			created: {
				$gte: end,
				$lt: next
			}
		});

		//Comprobar datos guardados y accionar
		if (precio1.length === 0) {
			await usdScrapeDivContent();
		} else if (precio2.length === 0) {
			await usdScrapeDivContent();
		} else {
			console.log('Ya se guardaron registros dolar hoy.');
		}
	} catch (error) {
		console.error('Error:', error);
		//	Manejar el error de manera adecuada (por ejemplo, registrarlo o notificar)
	}
}

async function usdScrapeDivContent() {
	const url = process.env.URLUSD;
	const divSelector = process.env.DIVUSD;

	try {
		const browser = await puppeteer.launch({ headless: true });
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
		const dolar = new Dolar({
			fecha: new Date(),
			precio: cleanText,
			created: formattedtoday
		});

		await dolar.save();
		console.log(`Precio del dólar guardado: ${cleanText}`);

		return cleanText;
	} catch (error) {
		console.error('Error al realizar scraping:', error);
		return null;
	}
}

schedules.forEach((schedule) => {
	cron.schedule(schedule, async () => {
		await usdScrapeDivContent();
	});
});

export { schedulesUsd };
