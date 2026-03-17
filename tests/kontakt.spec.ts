import { test, expect } from '@playwright/test';
import { KontaktPage } from '../pages/KontaktPage';
import { BasePage } from '../pages/BasePage';

/**
 * TC-KON-01 bis TC-KON-02
 * Kontaktseite: Kontaktdaten, mailto- und tel-Links
 */

test.describe('Kontakt', () => {
  let kontakt: KontaktPage;

  test.beforeEach(async ({ page }) => {
    kontakt = new KontaktPage(page);
    await kontakt.open();
    const base = new BasePage(page);
    await base.dismissCookieBanner();
  });

  // ── TC-KON-01 ─────────────────────────────────────────────────────────────
  test('TC-KON-01: Kontaktseite zeigt vollständige Kontaktdaten', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    // Adresse sichtbar
    await expect(kontakt.address).toBeVisible();
    await expect(kontakt.city).toBeVisible();

    // Telefonnummer sichtbar
    await expect(kontakt.phoneText).toBeVisible();

    // E-Mail als mailto-Link
    await expect(kontakt.emailLink).toBeVisible();
    const emailHref = await kontakt.getEmailHref();
    expect(emailHref).toBe('mailto:info@macros-group.com');

    // Keine Fehler-Seite
    await expect(page.locator('body')).not.toContainText('404');
  });

  // ── TC-KON-02 ─────────────────────────────────────────────────────────────
  test('TC-KON-02: Telefonnummer ist als tel:-Link implementiert', async ({ page }) => {
    const phoneHref = await kontakt.getPhoneHref();

    expect(phoneHref, 'Telefonlink (href="tel:...") erwartet').toBeTruthy();
    expect(phoneHref!.startsWith('tel:')).toBeTruthy();

    // Nummer enthält +49896603 oder Variante davon
    const normalised = phoneHref!.replace(/[\s\-()]/g, '');
    expect(normalised).toMatch(/tel:\+?498966039560/i);
  });

  test('Kontaktseite ist HTTP 200', async ({ page }) => {
    const response = await page.goto('/kontakt');
    expect(response?.status()).toBe(200);
  });
});
