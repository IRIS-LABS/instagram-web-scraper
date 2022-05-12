const fs = require("fs");
const { SCRAPED_DATA_DIR, SCREENSHOTS_DIR } = require("./config.json");

const writeToFile = (writeObject, resultsFileName) => {
    if (!fs.existsSync(SCRAPED_DATA_DIR)) {
        fs.mkdirSync(SCRAPED_DATA_DIR, { recursive: true });
    }


    fs.writeFile(`${SCRAPED_DATA_DIR}/${resultsFileName.replace(/\s/g, "_")}.json`, JSON.stringify(writeObject, null, 2), err => {
        if (err) {
            console.log("ERROR: Writing To File...");
            process.exit()
        }
    })
};

const takeScreenshot = async (page, resultsFileName) => {
    if (!fs.existsSync(SCREENSHOTS_DIR)) {
        fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    }
    try {
        await page.screenshot({
            path: `${SCREENSHOTS_DIR}/${resultsFileName.replace(/\s/g, "_")}.png`,                   // Save the screenshot in current directory
            fullPage: true

        });
    } catch (error) {
        console.log("ERROR: Occured When Taking The Screenshot");
        process.exit();
    }

};

const waitForPageLoad = async (page, resultsFileName, pageName) => {
    console.log(`INFO: Waiting For ${pageName} To Load`);
    try {
        await page.waitForSelector(".qF0y9.Igw0E.IwRSH.YBx95.ybXk5._4EzTm", { timeout: 5000 });
        return true;
    } catch (error) {
        console.log(`ERROR: ${pageName} Load Failed...`);
        await takeScreenshot(page, resultsFileName)
        console.log(`INFO: Please Refer The Screenshot In ${SCREENSHOTS_DIR}/${resultsFileName.replace(/\s/g, "_")}.png`)
        return false;
    }
};

module.exports = {
    writeToFile,
    takeScreenshot,
    waitForPageLoad
};

