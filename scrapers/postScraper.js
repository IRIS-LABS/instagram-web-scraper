const { setupSession } = require("../auth");
const { scrapePost } = require("./common/scrapePost");
const { SCRAPED_DATA_DIR } = require("./../config.json");

async function scrape(browser, resultsFileName, postURL) {
    let page = await browser.newPage();
    // page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));


    // const postURLS = new Set();
    await setupSession(page);

    const [postLoaded, postData] = await scrapePost(page, postURL, resultsFileName);
    if (!postLoaded) {
        console.log("ERROR: Post Load Failed. Please Check The Post URL...");
        process.exit();
    }
    console.log("INFO: Post Data:", postData);
};


module.exports = {
    scrape
};