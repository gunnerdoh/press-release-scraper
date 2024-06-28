'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scraper(link) {
  try {
    // Launch browser
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log('Navigating to the website...');
    await page.goto(link, { waitUntil: 'networkidle2' });

    console.log('Extracting data...');

    // picks sort by recent, waits for page to load
    await page.select('#wtwh-search-sort-select', 'descending');
    await page.locator('.search-results-article-container').wait();

    const newData = await page.evaluate(() => {
      const articles = [];
      const articleContainers = document.querySelectorAll('.search-results-article-container');

      // Iterate article containers
      articleContainers.forEach(container => {
        const timestampElement = container.querySelector('.search-results-article--timestamp');
        const titleElement = container.querySelector('.search-results-article--title a');

        if (timestampElement && titleElement) {
          const timestamp = timestampElement.textContent.trim();
          const title = titleElement.textContent.trim();
          // Push data to json element
          const articleLink = titleElement.href;
          articles.push({ title, timestamp, articleLink});
        }
      });

      return articles;
    });

    // Save to JSON
    const filePath = path.join(__dirname,'../data/scraped-data.json');

    let existingData = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      if (fileContent) {
        existingData = JSON.parse(fileContent);
      }
    }

    const combinedData = [...existingData, ...newData];
    fs.writeFileSync(filePath, JSON.stringify(combinedData, null, 2));


    console.log(`Data saved to ${filePath}`);
    console.log('made');

    // Close browser
    await browser.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

module.exports = {
  scraper
};