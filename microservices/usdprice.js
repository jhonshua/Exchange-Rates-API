import { launch } from 'puppeteer';
import cron from 'node-cron';
import Dolar from '../models/usd.model.js'; // Importa el modelo Dolar

const schedules = [
    '0 9 * * *', // 9:00 AM
    '0 13 * * *', // 1:00 PM
    '0 16 * * *', // 4:00 PM
];

async function scrapeDivContent() {
    const url = 'https://www.bcv.org.ve';
    const divSelector = '#dolar';

    try {
        const browser = await launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        await page.waitForSelector(divSelector);

        const divContent = await page.$eval(divSelector, (element) => element.textContent);
        await browser.close();

        // Extracción y limpieza del precio
        const precioString = divContent.replace(/,/g, ''); // Elimina comas

        // Guardar el precio en la base de datos
        const dolar = new Dolar({
            fecha: new Date(),
            precio: precioString, // Guardar como string
        });

        await dolar.save();
        console.log(`Precio del dólar guardado: ${precioString}`);

        return precioString;
    } catch (error) {
        console.error('Error al realizar scraping:', error);
        return null;
    }
}

schedules.forEach((schedule) => {
    cron.schedule(schedule, async () => {
        await scrapeDivContent();
    });
});

export { scrapeDivContent };
