'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {

  // browser launch
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://www.massdevice.com/?s=stryker&page=1');


  const data = await page.evaluate(() => {
    const articles = [];

    const articleContainers = document.querySelectorAll('.search-results-article-container');

    // iterate article containers
    articleContainers.forEach(container => {
      const timestamp = container.querySelector('.search-results-article--timestamp').textContent.trim();
      const title = container.querySelector('.search-results-article--title a').textContent.trim();

      // push data to json element
      articles.push({ title, timestamp });
    });

    return articles;
  });

  // save to JSON
  const filePath = path.join(__dirname, '../data/scraped-data.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  // close
  await browser.close();
})();