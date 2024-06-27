import { launch } from 'puppeteer';
import cron from 'node-cron';
import sitemaNationalPrice from '../models/sitemaNationalPrice.model.js'; 
import 'dotenv/config';

// Definición de horarios de ejecución
const schedules = [
  '0 9 * * *', // 9:00 AM
  '0 13 * * *', // 1:00 PM
];

// Función para extraer datos del sistema nacional de divisas
async function usdScrapeDivSistemaNacional() {
  // Obtención de URL y selector del div desde variables de entorno
  const url = process.env.URLSITEM; // URL del sitio web a scrapear
  const divSelector = process.env.DIVSISTEM; // Selector CSS del div que contiene los datos

  try {
    // Lanzamiento de un navegador Chrome sin interfaz gráfica
    const browser = await launch({ headless: true });
    const page = await browser.newPage();

    // Navegación a la URL especificada y espera por el elemento objetivo
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForSelector(divSelector);

    // Extracción de datos mediante JavaScript dentro del contexto del navegador
    const tableData = await page.evaluate(() => {
      // Selección de filas de la tabla
      const rows = document.querySelectorAll('.views-table tr');
      const extractedData = [];

      // Iteración sobre cada fila de la tabla
      for (const row of rows) {
        // Omitir la fila del encabezado
        if (row.classList.contains('views-row-first')) continue;

        // Extracción de datos utilizando nombres de clase
        const bankCell = row.querySelector('.views-field.views-field-views-conditional');
        const buyRateCell = row.querySelector('.views-field.views-field-field-tasa-compra');
        const sellRateCell = row.querySelector('.views-field.views-field-field-tasa-venta');

        // Verificación de la existencia de las células y extracción de valores
        if (bankCell && buyRateCell && sellRateCell) {
          const bankName = bankCell.textContent.trim();
          const buyRate = parseFloat(buyRateCell.textContent.trim().replace(',', ''));
          const sellRate = parseFloat(sellRateCell.textContent.trim().replace(',', ''));

          // Almacenamiento de datos extraídos en un objeto
          extractedData.push({
            banco: bankName,
            compra: buyRate,
            venta: sellRate
          });
        }
      }

      // Retorno del array de objetos con datos extraídos
      return extractedData;
    });

    // Cierre del navegador
    await browser.close();

    // Eliminación de la primera línea del array (encabezado)
    const Data = tableData.slice(1);
    //llamamos a la funcion que guarda en la base datos 
    await saveData(Data);

    // Retorno del array de datos procesados
    return Data;

  } catch (error) {
    // Manejo de errores durante el scraping
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
  // Recorrer el array de datos
  for (const item of data) {
    // Crear un nuevo documento con los datos del elemento actual
    const newData = new sitemaNationalPrice(item);

    try {
      // Guardar el documento en la base de datos
      await newData.save();
      console.log(`Dato guardado: ${item.banco}`);
    } catch (error) {
      console.error(`Error al guardar dato: ${item.banco}`, error);
    }
  }
}

// Exportación de la función para su uso en otras partes del proyecto
export { usdScrapeDivSistemaNacional };
