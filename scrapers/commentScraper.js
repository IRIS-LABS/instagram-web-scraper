const { setupSession } = require("../auth");
const { writeToFile, waitForPageLoad } = require("../utils");
const { scrapeCommentCount } = require("./common/scrapeCommentCount");

async function scrape(browser, resultsFileName, postURL) {
    let page = await browser.newPage();
    // page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));


    // const postURLS = new Set();
    await setupSession(page);
    console.log(`INFO: Navigating to ${postURL}...`);
    await page.goto(postURL);

    // Wait for the required DOM to be rendered
    const postLoaded = await waitForPageLoad(page, resultsFileName, "Post");
    if (!postLoaded) {
        console.log(`INFO: ${postURL} Load Failed...`)
        return
    };
    const count = await scrapeCommentCount(page);
    if (count) writeToFile({ count }, resultsFileName);

};


module.exports = {
    scrape
};