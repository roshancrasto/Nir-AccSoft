const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to http://localhost:4200');
  await page.goto('http://localhost:4200');

  if (page.url().includes('login')) {
    console.log('Logging in...');
    await page.fill('input[formControlName="loginId"]', 'admin'); 
    await page.fill('input[formControlName="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
  }

  console.log('Navigating to Payments...');
  await page.goto('http://localhost:4200/transactions/payments');
  
  console.log('Opening Payment Dialog...');
  await page.click('button:has-text("New Voucher")'); 
  await page.waitForSelector('app-payment-dialog');

  console.log('Opening Event Expense Dialog...');
  await page.click('button:has-text("Add Event Expense")');
  await page.waitForSelector('app-event-expense-selection-dialog');
  await page.waitForTimeout(1000);

  console.log('Typing in search box: ad26-08');
  await page.fill('input[placeholder="Search by Event Group, Expense Code or Details"]', 'ad26-08');
  await page.waitForTimeout(1000);

  console.log('Extracting text after search...');
  const text = await page.evaluate(() => document.querySelector('app-event-expense-selection-dialog').innerText);
  console.log('Popup text after search:');
  console.log(text);

  await browser.close();
})();
