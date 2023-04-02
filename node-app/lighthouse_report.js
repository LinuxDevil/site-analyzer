const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

const url = process.argv[2];

(async () => {
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = { logLevel: 'info', output: 'json', onlyCategories: ['performance', 'best-practices'], port: chrome.port };
    const runnerResult = await lighthouse(url, options);

    const report = JSON.stringify(runnerResult.lhr, null, 2);
    fs.writeFileSync('report.json', report);

    await chrome.kill();
})();
