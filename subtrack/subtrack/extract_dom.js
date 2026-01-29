const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('file:///Users/abhinav/Desktop/subtrack-web/vexly-clone(only frontend)/mirror_dashboard/demo.html');
  
  // Wait for React to hydrate  
  await page.waitForTimeout(10000);
  
  // Extract the rendered HTML
  const html = await page.evaluate(() => document.documentElement.outerHTML);
  
  console.log(html);
  
  await browser.close();
})();
