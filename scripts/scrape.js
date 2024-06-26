// scripts/scrape.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Go to the website
  await page.goto('https://example.com');

  // Perform scraping
  const data = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll('div').forEach(item => {
      items.push({
        title: item.querySelector('h1').innerText,
        description: item.querySelector('p').innerText
      });
    });
    return items;
  });

  // Save data to a file
  const filePath = path.join(__dirname, '../data/scraped-data.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  // Close the browser
  await browser.close();
})();
