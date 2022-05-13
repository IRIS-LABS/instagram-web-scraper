const puppeteer = require("puppeteer")

async function start() {
    let browser;
    try {
        console.log("INFO: Opening the browser......");
        browser = await puppeteer.launch({
            headless: true,
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true,
            timeout: 10000
        });
    } catch (error) {
        console.log("ERROR: Couldn't Open The Browser...");
        process.exit();
    }
    return browser;
}

module.exports = { start };