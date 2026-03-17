import { test, expect } from '@playwright/test';
import { NavigationComponent } from '../pages/NavigationComponent';
import { BasePage } from '../pages/BasePage';

/**
 * TC-UNT-01 bis TC-UNT-04
 * Unternehmen-Unterseiten: Profil, Leitbild, Management, Branchen, Referenzen, Nachhaltigkeit
 */

test.describe('Unternehmen', () => {
  test.beforeEach(async ({ page }) => {
    const base = new BasePage(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await base.dismissCookieBanner();
  });

  // ── TC-UNT-01 ─────────────────────────────────────────────────────────────
  test('TC-UNT-01: Profil-Seite zeigt Unternehmenstimeline', async ({ page }) => {
    await page.goto('/profil');
    await page.waitForLoadState('domcontentloaded');

    // Seite lädt ohne Fehler
    await expect(page.locator('body')).not.toContainText('404');

    // Timeline-Inhalt: Jahreszahlen 1998 oder 2023 vorhanden
    const bodyText = await page.locator('body').innerText();
    const hasTimeline = bodyText.includes('1998') || bodyText.includes('2023');
    expect(hasTimeline, 'Timeline mit Jahreszahlen 1998 oder 2023 erwartet').toBeTruthy();
  });

  // ── TC-UNT-02 ─────────────────────────────────────────────────────────────
  test('TC-UNT-02: Alle sechs Unternehmen-Unterseiten sind erreichbar', async ({ page }) => {
    const subPages = [
      { path: '/profil',          titlePattern: /profil/i          },
      { path: '/leitbild',        titlePattern: /leitbild/i        },
      { path: '/management',      titlePattern: /management/i      },
      { path: '/branchen',        titlePattern: /branchen/i        },
      { path: '/referenzen',      titlePattern: /referenzen/i      },
      { path: '/nachhaltigkeit',  titlePattern: /nachhaltigkeit/i  },
    ];

    for (const sp of subPages) {
      const response = await page.goto(sp.path);

      // HTTP 200 erwartet
      expect(
        response?.status(),
        `${sp.path} sollte HTTP 200 zurückgeben`
      ).toBe(200);

      // Kein "Not Found" im Body
      await expect(page.locator('body')).not.toContainText('404');

      // H1 vorhanden
      await expect(page.locator('h1').first()).toBeVisible();
    }
  });

  // ── TC-UNT-03 ─────────────────────────────────────────────────────────────
  test('TC-UNT-03: Management-Seite nennt die Geschäftsführer', async ({ page }) => {
    const response = await page.goto('/management');
    expect(response?.status()).toBe(200);

    const bodyText = await page.locator('body').innerText();

    // Mindestens zwei der drei Geschäftsführernamen müssen vorhanden sein
    const names = ['Botschatzke', 'Oetken', 'Lutz'];
    const foundNames = names.filter((name) => bodyText.includes(name));

    expect(
      foundNames.length,
      `Erwartet mindestens 2 Geschäftsführernamen, gefunden: ${foundNames.join(', ')}`
    ).toBeGreaterThanOrEqual(2);
  });

  // ── TC-UNT-04 ─────────────────────────────────────────────────────────────
  test('TC-UNT-04: Nachhaltigkeit-Seite lädt mit relevantem Inhalt', async ({ page }) => {
    const response = await page.goto('/nachhaltigkeit');
    expect(response?.status()).toBe(200);

    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('h1').first()).toBeVisible();

    // Inhalt hat genug Text
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(200);
  });

  // ── Bonus: Navigation via Dropdown ────────────────────────────────────────
  test('Dropdown-Navigation zu Profil funktioniert', async ({ page }) => {
    const nav = new NavigationComponent(page);

    await nav.hoverUnternehmen();
    await nav.profilLink.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL(/profil/i);
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
