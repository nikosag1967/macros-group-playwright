import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { BasePage } from '../pages/BasePage';

/**
 * TC-HOME-01 bis TC-HOME-04
 * Startseite: Slider, CTAs, Lazy-Loading
 */

test.describe('Homepage', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.open();
    const base = new BasePage(page);
    await base.dismissCookieBanner();
  });

  // ── TC-HOME-01 ────────────────────────────────────────────────────────────
  test('TC-HOME-01: Startseite lädt vollständig und zeigt Hero-Slider', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.waitForLoadState('networkidle');

    // URL korrekt
    await expect(page).toHaveURL(/macros-group\.net\/?$/);

    // Hero-Slider sichtbar
    await expect(homePage.heroSlider).toBeVisible();

    // Kein kritischer 404 oder "Not Found"
    const body = page.locator('body');
    await expect(body).not.toContainText('404');
    await expect(body).not.toContainText('Not Found');

    // Keine JS-Fehler (Filter für bekannte Drittanbieter-Warnungen)
    const criticalErrors = consoleErrors.filter(
      (e) => !e.includes('gtag') && !e.includes('analytics') && !e.includes('recaptcha')
    );
    expect(criticalErrors, `Kritische JS-Fehler: ${criticalErrors.join('\n')}`).toHaveLength(0);
  });

  // ── TC-HOME-02 ────────────────────────────────────────────────────────────
  test('TC-HOME-02: CTA "Zum Karrierecenter" navigiert zur Karriereseite', async ({ page }) => {
    await homePage.ctaKarriere.scrollIntoViewIfNeeded();
    await expect(homePage.ctaKarriere).toBeVisible();

    await homePage.ctaKarriere.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL(/karriere/i);
    await expect(page).toHaveTitle(/karriere/i);
  });

  // ── TC-HOME-03 ────────────────────────────────────────────────────────────
  test('TC-HOME-03: CTA "Ihr direkter Kontakt" navigiert zur Kontaktseite', async ({ page }) => {
    await homePage.ctaKontakt.scrollIntoViewIfNeeded();
    await expect(homePage.ctaKontakt).toBeVisible();

    await homePage.ctaKontakt.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL(/kontakt/i);
  });

  // ── TC-HOME-04 ────────────────────────────────────────────────────────────
  test('TC-HOME-04: Lazy-Loading – keine Broken Images nach vollständigem Scroll', async ({ page }) => {
    await homePage.scrollToBottom();
    await page.waitForLoadState('networkidle');

    // Prüfe alle img-Elemente auf Broken Image (naturalWidth > 0)
    const brokenImages = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images
        .filter((img) => img.complete && img.naturalWidth === 0 && img.src !== '')
        .map((img) => img.src);
    });

    expect(brokenImages, `Kaputte Bilder gefunden: ${brokenImages.join(', ')}`).toHaveLength(0);
  });
});
