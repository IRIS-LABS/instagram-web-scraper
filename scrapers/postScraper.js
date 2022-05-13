const { setupSession } = require("../auth");
const { scrapePost } = require("./common/scrapePost");

async function scrape(browser, resultsFileName, postURL) {
    let page = await browser.newPage();
    // page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

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