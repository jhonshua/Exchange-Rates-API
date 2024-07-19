import { launch } from 'puppeteer';
import cron from 'node-cron';
import Euro from '../models/model_services/eur.model.js'; 
import 'dotenv/config';

const schedules = [
    '0 18 * * *' // 6:00 PM
];

async function schedulesEur() {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const formattedYesterday = yesterday.toLocaleDateString('en-CA');
    
        const today = new Date();
        const formattedtoday = today.toLocaleDateString('en-CA');
    
        const tomorrow = new Date(today)
        tomorrow.setDate(today.getDate() + 1);
        const formattedtomorrow = tomorrow.toLocaleDateString('en-CA');
    
        const start = `${formattedYesterday}T17:00:00.000Z`;
        const end = `${formattedtoday}T18:00:00.000Z`;
        const next = `${formattedtomorrow}T18:00:00.000Z`;
    
        const precio1 = await Euro.find({
            createdAt: {
                $gte: start,
                $lt: end
            }
        });
    
        const precio2 = await Euro.find({
            createdAt: {
                $gte: end,
                $lt: next
            }
        });
    
        // Comprobar datos guardados y accionar
            if (precio1.length === 0) {
                await eurScrapeDivContent();
            } else if(precio2.length === 0){
                await eurScrapeDivContent();
            }else {
                console.log('Ya se guardaron registros euros hoy.');
            }
        } catch (error) {
            console.error('Error:', error);
            // Manejar el error de manera adecuada (por ejemplo, registrarlo o notificar)
        }
}

async function eurScrapeDivContent() {
    const url = process.env.URLEUR;
    const divSelector = process.env.DIVEUR;

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
        const euro = new Euro({
            fecha: new Date(),
            precio: cleanText , // Guardar como string
        });

        await euro.save();
       console.log(`Precio del euro guardado: ${cleanText}`);

        return cleanText;
    } catch (error) {
        console.error('Error al realizar scraping:', error);
        return null;
    }
}

schedules.forEach((schedule) => {
    cron.schedule(schedule, async () => {
        await schedulesEur();
    });
});

export {schedulesEur};
