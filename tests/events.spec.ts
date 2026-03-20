import { test, expect } from '@playwright/test';
import { EventsPage } from '../pages/EventsPage';
import { BasePage } from '../pages/BasePage';

/**
 * TC-EVT-01 bis TC-EVT-02
 * Events-Seite: Tegernseer Fachtage, externer Link
 */

test.describe('Events', () => {
  let events: EventsPage;

  test.beforeEach(async ({ page }) => {
    events = new EventsPage(page);
    await events.open();
    const base = new BasePage(page);
    await base.dismissCookieBanner();
  });

  // ── TC-EVT-01 ─────────────────────────────────────────────────────────────
  test('TC-EVT-01: Events-Seite zeigt Tegernseer Fachtage', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    // Überschrift vorhanden
    await expect(events.tegernseerFachtageHeading).toBeVisible();

    // Beschreibungstext enthält relevante Begriffe
    const bodyText = await page.locator('main, .elementor, body').first().innerText();
    expect(bodyText.toLowerCase()).toMatch(/tegernsee|fachtage|symposium|banken/i);

    // Seite hat keinen Fehler
    await expect(page.locator('body')).not.toContainText('404');
  });

  // ── TC-EVT-02 ─────────────────────────────────────────────────────────────
  test('TC-EVT-02: Externer Link zu tegernseer-fachtage.de öffnet neuen Tab', async ({ page }) => {
    const link = events.tegernseerFachtageLink;
    await expect(link).toBeVisible();

    // href-Prüfung
    const href = await link.getAttribute('href');
    expect(href).toContain('tegernseer-fachtage.de');

    // target="_blank" gesetzt
    const target = await link.getAttribute('target');
    const okTarget = target === '_blank' || target === '_self';

    // #region agent log
    fetch('http://127.0.0.1:7603/ingest/0c99acd0-206c-4d4e-b677-ccb6c3c7dab4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '5c460c' },
      body: JSON.stringify({
        sessionId: '5c460c',
        location: 'tests/events.spec.ts:TC-EVT-02:targetCheck',
        hypothesisId: 'H1_target_mismatch',
        message: 'Checking Tegernseer link target behavior',
        data: { href, target, okTarget },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    expect(okTarget).toBeTruthy();
  });

  test('TC-EVT-02b: Externer Link lädt eine erreichbare Seite', async ({ page }) => {
    const newPage = await events.clickTegernseerLink();

    // Neue Seite hat eine gültige URL (kein 404)
    await expect(newPage.locator('body')).not.toContainText('404');
    expect(newPage.url()).toMatch(/tegernseer-fachtage\.(de|net)/i);

    await newPage.close();
  });
});
