import { launch } from 'puppeteer';
import cron from 'node-cron';
import Dolar from '../models/model_services/usd.model.js'; 
import 'dotenv/config';

const schedules = [
    '0 9 * * *', // 9:00 AM
    '0 13 * * *', // 1:00 PM
    '0 16 * * *', // 4:00 PM
];

async function usdScrapeDivContent() {
    const url = process.env.URLUSD;
    const divSelector = process.env.DIVUSD;

    try {
        const browser = await launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        await page.waitForSelector(divSelector);

        const divContent = await page.$eval(divSelector, (element) => element.textContent);
        await browser.close();

        
        const regex = /\s+/g;
        const cleanText = divContent.replace(regex, ' ');


        // Guardar el precio en la base de datos
        const dolar = new Dolar({
            fecha: new Date(),
            precio: cleanText , // Guardar como string
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

export {usdScrapeDivContent};
