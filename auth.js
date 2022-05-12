const fs = require("fs");
const { COOKIES_PATH, CREDENTIALS_PATH, INSTAGRAM_LOGIN_URL } = require("./config.json");

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

};


const setupSession = async (page) => {
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
        try {
            await page.setCookie(...retrievedCookies);
        } catch (error) {
            console.log("ERROR: Setting Cookies Failed. Couldn't Restore Session. Please Delete cookies.json And Try Again...");
        }

    }
};

module.exports = {
    writeCookies,
    getCredentials,
    getWrittenCookies,
    setupSession
};