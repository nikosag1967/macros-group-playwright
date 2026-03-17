import { test, expect } from '@playwright/test';
import { FooterComponent } from '../pages/FooterComponent';
import { BasePage } from '../pages/BasePage';

/**
 * TC-FOOT-01 bis TC-FOOT-04
 * Footer: Impressum, Datenschutz, LinkedIn, Xing
 */

test.describe('Footer', () => {
  let footer: FooterComponent;

  test.beforeEach(async ({ page }) => {
    footer = new FooterComponent(page);
    const base = new BasePage(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await base.dismissCookieBanner();
    // Zum Footer scrollen
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(300);
  });

  // ── TC-FOOT-01 ────────────────────────────────────────────────────────────
  test('TC-FOOT-01: Impressum-Link öffnet Impressumsseite mit Pflichtangaben', async ({ page }) => {
    await footer.clickImpressum();

    await expect(page).toHaveURL(/impressum/i);
    await expect(page.locator('body')).not.toContainText('404');

    const bodyText = await page.locator('body').innerText();

    // Unternehmensname
    expect(bodyText).toContain('macros');

    // Adresse
    expect(bodyText).toContain('Haidgraben');
    expect(bodyText).toContain('Ottobrunn');

    // Mindestens ein Geschäftsführername
    const hasName =
      bodyText.includes('Botschatzke') || bodyText.includes('Oetken') || bodyText.includes('Lutz');
    expect(hasName, 'Mindestens ein Geschäftsführername erwartet').toBeTruthy();
  });

  // ── TC-FOOT-02 ────────────────────────────────────────────────────────────
  test('TC-FOOT-02: Datenschutz-Link öffnet DSGVO-konforme Datenschutzseite', async ({ page }) => {
    await footer.clickDatenschutz();

    await expect(page).toHaveURL(/datenschutz/i);
    await expect(page.locator('body')).not.toContainText('404');

    const bodyText = await page.locator('body').innerText();

    // DSGVO-Pflichtabschnitte
    expect(bodyText.toLowerCase()).toMatch(/betroffenenrechte|ihre rechte/i);
    expect(bodyText.toLowerCase()).toMatch(/verantwortliche|verantwortlicher/i);
  });

  // ── TC-FOOT-03 ────────────────────────────────────────────────────────────
  test('TC-FOOT-03: LinkedIn-Link verweist auf macros-Unternehmensprofil', async ({ page }) => {
    const linkedInHref = await footer.getLinkedInHref();

    expect(linkedInHref, 'LinkedIn-Link im Footer erwartet').toBeTruthy();
    expect(linkedInHref).toContain('linkedin.com');
    expect(linkedInHref).toContain('7529345');

    // Sicherheitsattribute
    //const target = await footer.linkedInLink.getAttribute('target');
    //expect(target).toBe('_blank');
  });

  // ── TC-FOOT-04 ────────────────────────────────────────────────────────────
  test('TC-FOOT-04: Xing-Link verweist auf macros-Unternehmensprofil', async ({ page }) => {
    const xingHref = await footer.getXingHref();

    expect(xingHref, 'Xing-Link im Footer erwartet').toBeTruthy();
    expect(xingHref).toContain('xing.com');

    //const target = await footer.xingLink.getAttribute('target');
    //expect(target).toBe('_blank');
  });

  // ── Bonus: Footer auf Unterseiten vorhanden ───────────────────────────────
  test('Footer ist auf allen Hauptseiten vorhanden', async ({ page }) => {
    const pages = ['/karriere', '/events', '/kontakt', '/news', '/impressum'];

    for (const path of pages) {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
      await page.waitForTimeout(200);

      const impressumVisible = await footer.impressumLink.isVisible({ timeout: 3_000 }).catch(() => false);
      expect(impressumVisible, `Impressum-Link im Footer auf ${path} erwartet`).toBeTruthy();
    }
  });
});
