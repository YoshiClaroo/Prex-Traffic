const express = require('express');
const { chromium } = require('playwright');

const app = express();
const PORT = process.env.PORT || 3000;

// Configura CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// Ruta principal
app.get('/render', async (req, res) => {
  const url = req.query.url;
  
  if (!url) {
    return res.status(400).send('Falta el parámetro URL');
  }

  let browser;
  try {
    browser = await chromium.launch({
      executablePath: '/opt/render/.cache/ms-playwright/chromium-*/chrome-linux/chrome',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    const html = await page.content();
    res.send(html);

  } catch (error) {
    console.error('Error en el proxy:', error);
    res.status(500).send(`Error al cargar la página: ${error.message}`);
  } finally {
    if (browser) await browser.close();
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Proxy activo en http://localhost:${PORT}`);
});
