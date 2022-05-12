const scrapeCommentCount = async (page) => {
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
        if (numberOfComments) return numberOfComments;
        console.log("INFO: No Comments Found...")
        return null
    } catch (error) {
        console.log("ERROR: Scraping Number Of Comments Failed...");
        return null;
    }
};

module.exports = {
    scrapeCommentCount
};
