const puppeteer = require("puppeteer")

async function start() {
    let browser;
    try {
        console.log("INFO: Opening the browser......");
        browser = await puppeteer.launch({
            headless: true,
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true
        });
    } catch (error) {
        console.log("ERROR: Could not create a browser instance => : ", error);
        process.exit()
    }
    return browser;
}

module.exports = { start };