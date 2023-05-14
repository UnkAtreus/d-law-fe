import dayjs from 'dayjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer-extra';
require('puppeteer-extra-plugin-stealth/evasions/chrome.app');
// require('puppeteer-extra-plugin-stealth/evasions/chrome.csi');
// require('puppeteer-extra-plugin-stealth/evasions/chrome.loadTimes');
// require('puppeteer-extra-plugin-stealth/evasions/chrome.runtime');
// require('puppeteer-extra-plugin-stealth/evasions/defaultArgs'); // pkg warned me this one was missing
// require('puppeteer-extra-plugin-stealth/evasions/iframe.contentWindow');
// require('puppeteer-extra-plugin-stealth/evasions/media.codecs');
// require('puppeteer-extra-plugin-stealth/evasions/navigator.hardwareConcurrency');
// require('puppeteer-extra-plugin-stealth/evasions/navigator.languages');
// require('puppeteer-extra-plugin-stealth/evasions/navigator.permissions');
// require('puppeteer-extra-plugin-stealth/evasions/navigator.plugins');
// require('puppeteer-extra-plugin-stealth/evasions/navigator.vendor');
// require('puppeteer-extra-plugin-stealth/evasions/navigator.webdriver');
// require('puppeteer-extra-plugin-stealth/evasions/sourceurl');
// require('puppeteer-extra-plugin-stealth/evasions/user-agent-override');
// require('puppeteer-extra-plugin-stealth/evasions/webgl.vendor');
// require('puppeteer-extra-plugin-stealth/evasions/window.outerdimensions');
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

type Data = {
    data: any;
    status: 'success' | 'error';
    message?: any;
};

export default async function searchCase(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let browser = null;
    try {
        if (req.method === 'POST') {
            const body = req.body;

            // const browser = await puppeteer.launch({
            //     headless: true,
            //     executablePath: executablePath(),
            // });
            browser = await puppeteer.connect({
                browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BLESS_TOKEN}`,
            });

            const page = await browser.newPage();
            console.log('started');

            await page.setViewport({ width: 1080, height: 1024 });
            await page.goto('https://aryasearch.coj.go.th/search200.php');

            console.log('selected search');

            if (body.blackTitle)
                await page.select('#black_title', body.blackTitle);
            if (body.blackId) await page.type('#black_id', body.blackId);
            if (body.blackYear) await page.type('#black_yy', body.blackYear);

            if (body.redTitle) await page.select('#red_title', body.redTitle);
            if (body.redId) await page.type('#red_id', body.redId);
            if (body.redYear) await page.type('#red_yy', body.redYear);

            await page.click('.btn.btn-primary');
            await page.click(
                '#resultTable > div > div > div.panel-body.table-responsive > table > tbody > tr:nth-child(1) > td:nth-child(1) > a'
            );

            const searchResultSelector =
                '#page-wrapper > div > div:nth-child(2) > div > div > div.panel-body > table > tbody > tr:nth-child(1)';
            const selectTitle =
                '#page-wrapper > div > div:nth-child(2) > div > div > div.panel-body > table > tbody > tr:nth-child(2) > td:nth-child(2)';
            ('#page-wrapper > div > div:nth-child(2) > div > div > div.panel-body > table > tbody > tr:nth-child(1)');
            const selectJudgement =
                '#tab3 > table > tbody > tr:nth-child(2) > td > div';
            const selectAppointment = '#tab4 > table > tbody';

            const appointmentLength = await page.$$eval(
                `${selectAppointment} > tr`,
                (el: string | any[]) => el.length
            );
            console.log('🚀 ~ appointmentLength:', appointmentLength);

            const textSelector = await page.waitForSelector(
                searchResultSelector
            );
            const titleSelector = await page.waitForSelector(selectTitle);
            const judgementSelector = await page.waitForSelector(
                selectJudgement
            );

            const title = await titleSelector?.evaluate(
                (el: { textContent: any }) => el.textContent
            );
            const judgement = await judgementSelector?.evaluate(
                (el: { textContent: any }) => el.textContent
            );

            const appointments = [];

            for (let i = 1; i < appointmentLength + 1; i++) {
                const id = i;
                const date = await page.evaluate(
                    (el) => el?.innerText,
                    await page.$(
                        `${selectAppointment} > tr:nth-child(${i}) > td:nth-child(2)`
                    )
                );
                const time = await page.evaluate(
                    (el) => el?.innerText,
                    await page.$(
                        `${selectAppointment} > tr:nth-child(${i}) > td:nth-child(3)`
                    )
                );
                const room = await page.evaluate(
                    (el) => el?.innerText,
                    await page.$(
                        `${selectAppointment} > tr:nth-child(${i}) > td:nth-child(4)`
                    )
                );
                const title = await page.evaluate(
                    (el) => el?.innerText,
                    await page.$(
                        `${selectAppointment} > tr:nth-child(${i}) > td:nth-child(5)`
                    )
                );
                const detail = await page.evaluate(
                    (el) => el?.innerText,
                    await page.$(
                        `${selectAppointment} > tr:nth-child(${i}) > td:nth-child(6)`
                    )
                );

                appointments.push({ id, room, title, detail, date, time });
            }

            const currentDateTime = dayjs().add(543, 'year');

            // Initialize the minimum difference to a large value
            let minDiff = Infinity;
            let closestAppointment = null;

            // Loop through each appointment and calculate the time difference
            for (const appointment of appointments) {
                const appointmentDateTime = dayjs(
                    `${appointment.date} ${appointment.time}`,
                    'DD/MM/YYYY HH.mm'
                );

                const diff = appointmentDateTime.diff(
                    currentDateTime,
                    'millisecond'
                );

                // If the time difference is smaller than the minimum difference, update the closest appointment
                if (diff > 0 && diff < minDiff) {
                    minDiff = diff;
                    closestAppointment = appointment;
                }
            }

            if (textSelector !== null) {
                const fullTitle = await textSelector.evaluate(
                    (el: { textContent: any }) => el.textContent
                );
                const fullList = fullTitle
                    ?.replaceAll('\t', '')
                    .replaceAll('\n', ':')
                    .replaceAll(' ', '')
                    .split(':')
                    .map((item: string) => item.trim())
                    .filter((item: string) => item.trim() !== '');

                if (fullList) {
                    const caseDateList = fullList?.filter((item: string) =>
                        item
                            .trim()
                            .match(
                                '^([0-2][0-9]|3[0-1])/(0[1-9]|1[0-2])/[0-9]{4}$'
                            )
                    );

                    const caseList = fullList?.filter((item: string) =>
                        item.trim().match('^[ก-ฮ]{1,3}.?[0-9]{1,4}/[0-9]{1,4}$')
                    );
                    res.status(200).json({
                        data: {
                            caseTitle: title?.trim() || null,
                            blackCaseNumber: caseList[0] || null,
                            blackCaseDate: caseDateList[0] || null,
                            RedCaseNumber: caseList[1] || null,
                            redCaseDate: caseDateList[1] || null,
                            judgement: judgement?.trim() || null,
                            appointments: appointments || null,
                            closestAppointment: closestAppointment || null,
                        },
                        status: 'success',
                    });
                }
            }
        }
    } catch (error: any) {
        if (error.message.includes('No element found for selector')) {
            res.status(200).json({
                data: {},
                status: 'success',
            });
        }
        res.status(502).json({
            data: {},
            status: 'error',
            message: error,
        });
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
}
