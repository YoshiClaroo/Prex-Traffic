const express = require('express');
const { chromium } = require('playwright');
const app = express();
const PORT = 3000;

app.get('/render', async (req, res) => {
    const url = req.query.url;
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.goto(url, { waitUntil: 'networkidle' });

    const html = await page.content();
    await browser.close();
    res.send(html);
});

app.listen(PORT, () => console.log(`Proxy corriendo en http://localhost:${PORT}`));
