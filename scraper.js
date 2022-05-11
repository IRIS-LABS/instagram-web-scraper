const fs = require("fs");
const SCRAPED_DATA_DIR = "Scraped Data";
const SCREENSHOTS_DIR = "Screenshots";
const COOKIES_PATH = "./cookies.json";
const CREDENTIALS_PATH = "./credentials.json";
const INSTAGRAM_LOGIN_URL = "https://www.instagram.com/accounts/login/";

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

}
const waitForPageLoad = async (page, resultsFileName) => {
    console.log("INFO: Waiting For Instagram Post To Load")
    try {
        await page.waitForSelector(".qF0y9.Igw0E.IwRSH.YBx95.ybXk5._4EzTm", { timeout: 5000 });
    } catch (error) {
        console.log("ERROR: Instagram post load failed...")
        await takeScreenshot(page, resultsFileName)
        console.log(`INFO: Please Refer The Screenshot In ${SCREENSHOTS_DIR}/${resultsFileName.replace(/\s/g, "_")}.png`)
        process.exit()
    }
};

const writeCookies = (cookies) => {
    try {
        fs.writeFileSync(COOKIES_PATH, JSON.stringify(cookies), null, 4);
        // file written successfully
    } catch (err) {
        console.log("ERROR: Writing Cookies To File Failed...");
        process.exit()
    }
};

const getCredentials = () => {
    try {
        const credentials = fs.readFileSync(CREDENTIALS_PATH);
        return JSON.parse(credentials)
    } catch (err) {
        console.log("ERROR: Retrieving Credentials Failed...Please Create A 'credentials.json' In Root Directory...");
        process.exit();
    }
};

const getWrittenCookies = () => {
    try {
        const cookies = fs.readFileSync(COOKIES_PATH);
        return JSON.parse(cookies)
    } catch (err) {
        console.log("ERROR: Retrieving Cookies Failed...Please Delete cookies.json And Try Again...");
        process.exit();
    }
};

const getNumberOfComments = async (page) => {
    try {
        console.log("INFO: Started Scraping Number Of Comments...");
        const buttonSelector = ".qF0y9.Igw0E.IwRSH.YBx95.acqo5._4EzTm.NUiEW > button";
        let moreButton = await page.$(buttonSelector);
        while (moreButton) {
            console.log("INFO: Requesting More Comments From Server...")
            await page.click(buttonSelector);
            try {
                await page.waitForSelector(buttonSelector, { timeout: 5000 });
            } catch (error) {
                console.log("INFO: All The Comments Were Retrieved From Server...")
                break
            }
        }
        const commentsSelector = ".XQXOT.pXf-y > ul"
        const numberOfComments = await page.$$eval(commentsSelector, (elements) => {
            return elements.length;
        });
        if (numberOfComments) return numberOfComments.toString()
        console.log("INFO: No Comments Found...")
        return null
    } catch (error) {
        console.log("ERROR: Scraping Number Of Comments Failed...");
        return null;
    }


}

const login = async (page) => {

    const { username, password } = getCredentials();
    try {
        await page.goto(INSTAGRAM_LOGIN_URL);
        await page.waitForSelector("#loginForm");
        await page.$$eval("input", elements => {
            for (let element of elements) {
                element.setAttribute("autocomplete", "current-password");
            }
        });
        await page.type('input[name="username"]', username);
        await page.type('input[name="password"]', password);
        await page.click("button[type='submit']")
        await page.waitForSelector("svg[aria-label='Home']", { timeout: 5000 })
    } catch (error) {
        console.log("ERROR: Login Failed. Please Check Your Username And Password...");
        console.log("ERROR: Web Scraping Failed...");
        process.exit();
    }

}

async function scrape(browser, resultsFileName, postURL) {
    let page = await browser.newPage();
    // page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));


    let isLoggedIn = false;
    try {
        if (fs.existsSync(COOKIES_PATH)) isLoggedIn = true;
    } catch (err) {
        isLoggedIn = false;
    }

    if (!isLoggedIn) {
        await login(page);
        const cookies = await page.cookies();
        writeCookies(cookies)
    } else {
        const retrievedCookies = getWrittenCookies();
        await page.setCookie(...retrievedCookies);
    }
    console.log(`INFO: Navigating to ${postURL}...`);
    await page.goto(postURL);

    // Wait for the required DOM to be rendered
    await waitForPageLoad(page, resultsFileName);
    console.log("INFO: Scraping Started...");


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
    writeToFile(scrapedData, resultsFileName);
    console.log("INFO: Scraped Data: ", scrapedData);
    console.log(`INFO: Scraping Profile Image, Post Image, Profile Username, Number of Likes Is Successful. Please refer ${`${SCRAPED_DATA_DIR}/${resultsFileName.replace(/\s/g, "_")}.json`} For The Scraped Data`)
    const numberOfComments = await getNumberOfComments(page);
    if (numberOfComments) {
        scrapedData["numberOfComments"] = numberOfComments;
        writeToFile(scrapedData, resultsFileName);
    }

    console.log(`INFO: Scraping Complete. Please refer ${`${SCRAPED_DATA_DIR}/${resultsFileName.replace(/\s/g, "_")}.json`} For The Scraped Data`)
}


module.exports = {
    scrape
};