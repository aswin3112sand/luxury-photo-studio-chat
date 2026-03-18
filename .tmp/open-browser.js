const { chromium } = require("C:/Users/Admin/.agents/skills/playwright/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();

  await page.goto("http://127.0.0.1:5173/", {
    waitUntil: "domcontentloaded",
  });

  console.log("Opened http://127.0.0.1:5173/");

  // Keep the browser window open for manual inspection.
  await page.waitForTimeout(60 * 60 * 1000);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
