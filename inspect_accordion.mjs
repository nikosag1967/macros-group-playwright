import { chromium } from '@playwright/test';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('https://macros-group.net/karriere24/');
await page.waitForLoadState('networkidle');
const cookieBtn = page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll').first();
await cookieBtn.waitFor({ state: 'visible', timeout: 6000 }).catch(() => {});
await cookieBtn.click().catch(() => {});
await page.waitForTimeout(500);

// Find the accordion header
const accordionHeaders = await page.evaluate(() => {
  const els = Array.from(document.querySelectorAll('.qodef-e-title, [class*="accordion"] h3, [class*="accordion"] h4, [class*="accordion-title"], .ui-accordion-header'));
  return els.map(e => ({ tag: e.tagName, classes: e.className, text: e.textContent?.trim().slice(0, 80) }));
});
console.log('Accordion headers:');
accordionHeaders.forEach(h => console.log(JSON.stringify(h)));
await browser.close();
