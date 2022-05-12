const { waitForPageLoad } = require("../../utils");


const scrapePost = async (page, postURL, resultsFileName) => {
    console.log(`INFO: Navigating to ${postURL}...`);
    await page.goto(postURL);

    // Wait for the required DOM to be rendered
    const postLoaded = await waitForPageLoad(page, resultsFileName, "Post");
    if (!postLoaded) {
        console.log(`INFO: ${postURL} Load Failed...`)
        return [postLoaded, null]
    };
    console.log("INFO: Post Scraping Started...");


    const postImageURL = await page.$eval("img[class='FFVAD']", el => el['src']);
    const profileImageURL = await page.$eval("img[class='_6q-tv']", el => el['src']);
    const profileUsername = await page.$eval(".sqdOP.yWX7d._8A5w5.ZIAjV", el => el.innerText);
    let numberOfLikes = null;
    try {
        numberOfLikes = await page.$eval("div[class='_7UhW9   xLCgt        qyrsm KV-D4               fDxYl    T0kll '] > span", el => el.innerText);
    } catch (e) {
        console.log("ERROR: Number Of Likes Not Found...")
    }

    const scrapedData = {
        postImageURL,
        profileImageURL,
        username: profileUsername,
    };

    if (numberOfLikes) scrapedData["numberOfLikes"] = numberOfLikes;
    return [postLoaded, scrapedData];
};

module.exports = {
    scrapePost
}