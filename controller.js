const scraper = require('./scraper');

async function scrape(browserInstance, resultsFileName, postURL) {
    let browser;
    try {
        browser = await browserInstance;
        await scraper.scrape(browser, resultsFileName, postURL);
    }
    catch (e) {
        console.log(`ERROR: Scraping Failed. Please Check Your Internet Connection...`);
        process.exit();
    }
    await browser.close()
}

module.exports = {
    scrape
}