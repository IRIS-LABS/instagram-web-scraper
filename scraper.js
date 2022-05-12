const fs = require("fs");
const { SCRAPED_DATA_DIR, COOKIES_PATH } = require("./config.json");
const { setupSession, writeCookies, getWrittenCookies } = require("./auth");
const { writeToFile, waitForPageLoad } = require("./utils");


async function scrape(browser, resultsFileName, profileURL) {
    let page = await browser.newPage();
    // page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));


    // const postURLS = new Set();
    await setupSession(page);

    const [postLoaded, postData] = await scrapePost(page, profileURL, resultsFileName)
    console.log("Post Data:", postData)


    console.log(`INFO: Scraping Complete. Please refer ${`${SCRAPED_DATA_DIR}/${resultsFileName.replace(/\s/g, "_")}.json`} For The Scraped Data`)
}


module.exports = {
    scrape
};