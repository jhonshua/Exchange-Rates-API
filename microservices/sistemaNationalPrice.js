import { launch } from 'puppeteer';
import cron from 'node-cron';
import sistemNational from '../models/sistemNational.model.js'; 
import 'dotenv/config';

const schedules = [
    '0 9 * * *', // 9:00 AM
    '0 13 * * *', // 1:00 PM
];

async function usdScrapeDivSistemaNacional() {
    const url = process.env.URLSITEM;
    const divSelector = process.env.DIVSISTEM;

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
        const sitemPrice = new sistemNational({
            fecha: new Date(),
            precio: cleanText , // Guardar como string
        });

        await sitemPrice.save();
       console.log(`Precio del dólar sitema nacional bancarip guardado: ${cleanText}`);

        return cleanText;
    } catch (error) {
        console.error('Error al realizar scraping:', error);
        return null;
    }
}

schedules.forEach((schedule) => {
    cron.schedule(schedule, async () => {
        await usdScrapeDivSistemaNacional();
    });
});

export { usdScrapeDivSistemaNacional};
