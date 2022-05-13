const { SCRAPED_DATA_DIR } = require("./config.json");

async function scrape(browserInstance, resultsFileName, URL, scraper) {
    let browser;
    try {
        browser = await browserInstance;
        await scraper.scrape(browser, resultsFileName, URL);
        console.log(`INFO: Scraping Complete. Please refer ${`${SCRAPED_DATA_DIR}/${resultsFileName.replace(/\s/g, "_")}.json`} For The Scraped Data`)
    }
    catch (e) {
        console.log(`ERROR: Network Error. Please Check Your Internet Connection And Run Again...`);
        process.exit();
    }
    try {
        await browser.close();
    } catch (error) {
        process.exit();
    }

};

module.exports = {
    scrape
}