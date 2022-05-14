const { setupSession } = require("../auth");
const { waitForPageLoad, writeToFile } = require("../utils");
const { scrapePost } = require("./common/scrapePost");
const { scrollPageToBottom } = require('puppeteer-autoscroll-down')

async function scrape(browser, resultsFileName, profileURL) {
    let page = await browser.newPage();
    console.log("INFO: Starting Scraping Profile...")
    // page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
    await setupSession(page);
    console.log(`INFO: Navigating to ${profileURL}...`);
    await page.goto(profileURL);

    // Wait for the required DOM to be rendered
    const profileLoaded = await waitForPageLoad(page, resultsFileName, "Profile");
    if (!profileLoaded) {
        console.log(`INFO: ${profileURL} Wasn't Loaded...`)
        return
    };
    const postURLS = new Set();
    await page.setViewport({
        width: 1200,
        height: 800
    });

    let reachedEnd = false;
    const postLinkSelector = ".v1Nh3.kIKUG._bz0w > a";
    const loaderSelector = "article[class='ySN3v'] > div[class='_4emnV'] > div > svg";
    while (!reachedEnd) {
        await scrollPageToBottom(page, { stepsLimit: 1 })
        try {
            await page.waitForSelector(loaderSelector, { visible: false, timeout: 1000 })
        } catch (error) {
            reachedEnd = true
        }
        const urls = await page.$$eval(postLinkSelector, elements => elements.map(el => el["href"]));
        urls.forEach(url => postURLS.add(url));
    };
    console.log("INFO: Retrieved All Post URLS...")
    console.log("INFO: Post URLS: ", postURLS);

    const profileData = [];

    postURLSList = Array.from(postURLS);
    for (let postURL of postURLSList) {
        const [postLoaded, postData] = await scrapePost(page, postURL, resultsFileName);
        if (!postLoaded) {
            console.log(`INFO: Post ${postURL} Load Failed. Please Check The Post URL...`);
        } else {
            profileData.push({ url: postURL, ...postData });
        }
    }


    const writeData = {
        media: profileData
    };

    writeToFile(writeData, resultsFileName);
};


module.exports = {
    scrape
};