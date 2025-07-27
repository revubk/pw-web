const { chromium, firefox, webkit } = require('playwright');
const { loadConfig } = require('./LoadResources.js');
const { getPage } = require('./context.js');


async function launchApp() {

  const browserName = await loadConfig('BrowserConfigs.browser');

  let browserType;

  switch (browserName) {
    case 'chrome':
      browserType = chromium;
      break;
    case 'firefox':
      browserType = firefox;
      break;
    case 'webkit':
      browserType = webkit;
      break;
    default:
      throw new Error(`Unsupported browser specified: ${browserName}`);
  }

  const browser = await browserType.launch({ headless: await loadConfig('BrowserConfigs.headless') });
  const context = await browser.newContext();
  const page = await context.newPage();

  return page;
}

async function navigateTo(url) {
  const page = await getPage();
  console.log("Loaded URL from config -", `PageUrls.${url}`+ ": " + await loadConfig(`PageUrls.${url}`));

  await page.goto(await loadConfig(`PageUrls.${url}`));
  await page.waitForLoadState('domcontentloaded');
  console.log('✅ Page loaded successfully');

}

async function closeApp() {
  const page = await getPage();
  await page.close();

}

module.exports = {
  launchApp,
  navigateTo,
  closeApp
};
