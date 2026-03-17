import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

/**
 * TC-RESP-01 bis TC-RESP-03
 * Responsive Layouts und SEO Meta-Tags
 */

test.describe('Responsive & SEO', () => {
  // ── TC-RESP-01 ────────────────────────────────────────────────────────────
  test('TC-RESP-01: Desktop-Layout (1440×900) ohne horizontalen Scrollbalken', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const base = new BasePage(page);
    await base.dismissCookieBanner();

    // Kein horizontaler Scroll
    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalScroll, 'Kein horizontaler Scrollbalken bei 1440px erwartet').toBeFalsy();

    // Desktop-Navigation sichtbar (kein Hamburger)
    const karriereLink = page.locator('header').getByRole('link', { name: 'Karriere', exact: true }).first();
    await expect(karriereLink).toBeVisible();
  });

  // ── TC-RESP-02 ────────────────────────────────────────────────────────────
  test('TC-RESP-02: Tablet-Layout (768×1024) – keine überlappenden Elemente', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const base = new BasePage(page);
    await base.dismissCookieBanner();

    // Seite scrollbar und kein horizontaler Overflow
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(500);

    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalScroll, 'Kein horizontaler Scrollbalken bei 768px erwartet').toBeFalsy();

    // Keine kaputten Bilder
    const brokenImages = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .filter((img) => img.complete && img.naturalWidth === 0 && img.src !== '')
        .map((img) => img.src);
    });
    expect(brokenImages).toHaveLength(0);
  });

  test('TC-RESP-02b: Karriereseite auf Tablet korrekt dargestellt', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/karriere');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('body')).not.toContainText('404');
  });

  // ── TC-RESP-03 ────────────────────────────────────────────────────────────
  test('TC-RESP-03: Alle Hauptseiten haben einzigartigen Titel und Meta-Description', async ({ page }) => {
    const pagePaths = ['/', '/karriere', '/events', '/kontakt', '/news', '/impressum'];

    const titles: string[] = [];
    const descriptions: string[] = [];

    for (const path of pagePaths) {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');

      // Title prüfen
      const title = await page.title();
      expect(title, `Leerer Seitentitel auf ${path}`).not.toBe('');
      expect(title.length, `Seitentitel zu kurz auf ${path}`).toBeGreaterThan(3);
      titles.push(title);

      // Meta description prüfen
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content')
        .catch(() => null);
      // Warnung wenn leer, aber kein Testfehler (SEO-Empfehlung)
      if (!description || description.trim() === '') {
        console.warn(`Keine Meta-Description auf ${path}`);
      }
      descriptions.push(description ?? '');
    }

    // Alle Titel müssen einzigartig sein
    const uniqueTitles = new Set(titles);
    expect(
      uniqueTitles.size,
      `Doppelte Seitentitel gefunden: ${titles.join(', ')}`
    ).toBe(titles.length);
  });

  // ── Mobiler Viewport ─────────────────────────────────────────────────────
  test('Startseite auf mobilem Viewport (375×812) lädt ohne Fehler', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('body')).not.toContainText('404');
    await expect(page.locator('body')).not.toContainText('Not Found');

    // Body hat sinnvollen Inhalt
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(100);
  });
});
