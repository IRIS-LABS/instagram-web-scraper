function printUsage() {
    console.log("=== USAGE ===");
    console.log("<results_file_name> <profile_url>");
}

if (process.argv.length !== 4) {
    printUsage()
    process.exit()
}

const RESULT_FILE_NAME = process.argv[2];
const PROFILE_URL = process.argv[3]
console.log("INFO: Output File: ", RESULT_FILE_NAME);
console.log("INFO: Profile URL:", PROFILE_URL);

const browser = require('./browser');
const controller = require('./controller');
const scraper = require("./scrapers/profileScraper");

//Start the browser and create a browser instance
let browserInstance = browser.start();

//Start scraping
controller.scrape(browserInstance, RESULT_FILE_NAME, PROFILE_URL, scraper);