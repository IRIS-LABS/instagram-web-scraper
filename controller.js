const scraper = require('./scraper');

async function scrape(browserInstance, resultsFileName, postURL) {
    let browser;
    try {
        browser = await browserInstance;
        await scraper.scrape(browser, resultsFileName, postURL);
    }
    catch (e) {
        console.log(e)
        console.log(`ERROR: Scraping Finished With An Error`);
        process.exit();
    }
    await browser.close()
}

module.exports = {
    scrape
}