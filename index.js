const {chromium} = require('playwright')

const f = async ({ entrepreneurId }) => {
    const baseUrl = 'https://youcontrol.com.ua'

    let browser = null;

    try {
        browser = await chromium.launch();

        const page = await browser.newPage();
        await page.goto(baseUrl);

        await page.evaluate(({ entrepreneurId }) => {
            const input = document.querySelector('#q-l');
            input.value = entrepreneurId;

            const searchBtn = document.querySelector('#wrapper > div.b-bg-l > div.contain > div.head-b-l.wow.fadeInUp.animated > div.search-head > form > button');
            searchBtn.click();
        }, { entrepreneurId });

        await page.waitForSelector('#express-universal-file > div.compliance-top-content')

        const reportImage = await (await page.$('#express-universal-file > div.compliance-top-content')).screenshot();
        const fullReportLink = await page.$eval('#btn-download', e => e.getAttribute('href'));

        return { reportImage, fullReportLink: baseUrl + fullReportLink }
    }
    catch (error) {
        throw error;
    }
    finally {
        if (browser) {
            await browser.close();
        }
    }
}


const app = require('express')();
const { v4 } = require('uuid');

app.get('/api', async (req, res) => {
    const data = await f({entrepreneurId: "14312364"})
    console.log(data)
    res.end(data);
});

module.exports = app;
