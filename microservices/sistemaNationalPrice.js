import chromium from 'chrome-aws-lambda'; 
import cron from 'node-cron';
import sitemaNationalPrice from '../models/model_services/sitemaNationalPrice.model.js';
import 'dotenv/config';

// Definición de horarios de ejecución
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

async function scheduleSistemaNacional() {
	try {
        const precio1 = await sitemaNationalPrice.find({
            created: {
                $gte: start,
                $lt: end
            }
        });
    
        const precio2 = await sitemaNationalPrice.find({
            created: {
                $gte: end,
                $lt: next
            }
        });

        if (precio1.length === 0) {
           await usdScrapeDivSistemaNacional();
        } else if(precio2.length === 0){
           await usdScrapeDivSistemaNacional();
        }else {
            console.log('Ya se guardaron registros del Sistema Nacional hoy.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


async function usdScrapeDivSistemaNacional() {
  const url = process.env.URLSITEM; // URL del sitio web a scrapear
  const divSelector = process.env.DIVSISTEM; // Selector CSS del div que contiene los datos

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
  const page = await browser.newPage();

    // Navegación a la URL especificada y espera por el elemento objetivo
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForSelector(divSelector);

    // Extracción de datos mediante JavaScript dentro del contexto del navegador
    const tableData = await page.evaluate(() => {

      const rows = document.querySelectorAll('.views-table tr');
      const extractedData = [];
      for (const row of rows) {
        if (row.classList.contains('views-row-first')) continue;


        const bankCell = row.querySelector('.views-field.views-field-views-conditional');
        const buyRateCell = row.querySelector('.views-field.views-field-field-tasa-compra');
        const sellRateCell = row.querySelector('.views-field.views-field-field-tasa-venta');

        if (bankCell && buyRateCell && sellRateCell) {
          const bankName = bankCell.textContent.trim();
          const buyRate = parseFloat(buyRateCell.textContent.trim().replace(',', ''));
          const sellRate = parseFloat(sellRateCell.textContent.trim().replace(',', ''));
          extractedData.push({
            banco: bankName,
            compra: buyRate,
            venta: sellRate
          });
        }
      }
      return extractedData;
    });

    await browser.close();
    const Data = tableData.slice(1);
    await saveData(Data);
    return Data;

  } catch (error) {
    console.error('Error al realizar scraping:', error);
    return null;
  }
}

// Programación de la ejecución de la función en los horarios definidos
schedules.forEach((schedule) => {
  cron.schedule(schedule, async () => {
    await usdScrapeDivSistemaNacional();
  });
});

async function saveData(data) {
  for (const item of data) {
    const newData = new sitemaNationalPrice({
      banco: item.banco,
      compra: item.compra,
      venta: item.venta,
      created: formattedtoday
  });

    try {
      await newData.save();
      console.log(`Dato guardado: ${item.banco}`);
    } catch (error) {
      console.error(`Error al guardar dato: ${item.banco}`, error);
    }
  }
}


export { scheduleSistemaNacional };
