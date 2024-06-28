'use strict';

let PAGE_NUM = 1;
let COMPANY = 'Stryker';
const scrape = require('../scripts/scrape');
const scrapeLinks = require('../scripts/scrape-links');


async function scrapePage(COMPANY, PAGE_NUM) {
  try {
    if (PAGE_NUM <= 3) {
      let link = `https://www.massdevice.com/?s=${COMPANY}&page=${PAGE_NUM}`;
      console.log(PAGE_NUM);
      await scrape.scraper(link);
      await scrapePage(COMPANY, PAGE_NUM + 1);
    } else {
      scrapeLinks.pushArticleContent();
      console.log('Content extraction complete');
    }
  } catch (error) {
    console.error('Error in index:', error);
  }
}

(async () => {
  try {
    await scrapePage(COMPANY, PAGE_NUM);
  } catch (error) {
    console.error('Error in main execution:', error);
  }
})();