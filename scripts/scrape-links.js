'use strict';
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, '../data/scraped-data.json');
const outputFilePath = path.join(__dirname, '../data/scraped-articles-content.txt');

async function scrapeArticleContent(url) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const content = await page.evaluate(() => {
      const entryContent = document.querySelector('.entry-content');

      if (entryContent) {
        // Extracting all text content under .entry-content
        Array.from(entryContent.querySelectorAll('.wtwh-hover-ticker')).forEach(el => el.remove());

        const textContent = entryContent.textContent.trim()
        const trimmedText = textContent.replace(/\n/g, "").replace(/FacebookXLinkedInShare/g, "");
        return { content: trimmedText };
      } else {
        throw new Error('.entry-content not found on the page');
      }
    });

    await browser.close();
    return content;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

async function pushArticleContent() {
  try {
    // Read the article links from the JSON file
    const articles = require(inputFilePath);

    // Array to store all scraped contents
    const scrapedContents = [];

    // Iterate over each article and scrape content
    for (let article of articles) {
      console.log(`Scraping content for article: ${article.title}`);
      const content = await scrapeArticleContent(article.articleLink);

      if (content) {
        // Add the scraped content along with other article details
        scrapedContents.push({
          title: article.title,
          timestamp: article.timestamp,
          content: content.content
        });
      } else {
        console.log(`Failed to fetch content for article: ${article.title}`);
      }
    }

    console.log('made');
    // Save all scraped content to a JSON file
    fs.writeFileSync(outputFilePath, JSON.stringify(scrapedContents, null, 2));
    console.log(`All content saved to ${outputFilePath}`);
  } catch (error) {
    console.error('Error:', error);
  }
};

module.exports = {
  scrapeArticleContent,
  pushArticleContent
};